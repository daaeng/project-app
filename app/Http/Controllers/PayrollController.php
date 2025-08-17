<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Kasbon;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use App\Models\SalaryHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    public function index()
    {
        $payrolls = Payroll::with('employee')
            ->orderBy('payroll_period', 'desc')
            ->paginate(10);

        return Inertia::render('Payroll/Index', [
            'payrolls' => $payrolls
        ]);
    }

    public function create()
    {
        return Inertia::render('Payroll/Create');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'period_month' => 'required|integer|between:1,12',
            'period_year' => 'required|integer',
        ]);

        $period = Carbon::create($request->period_year, $request->period_month, 1);
        $periodString = $period->format('Y-m');

        if (Payroll::where('payroll_period', $periodString)->exists()) {
            return redirect()->route('payroll.index')->with('error', 'Penggajian untuk periode ini sudah pernah dibuat.');
        }

        $employees = Employee::all();
        $payrollData = [];

        foreach ($employees as $employee) {
            $salary = SalaryHistory::where('employee_id', $employee->id)
                ->where('tanggal_mulai', '<=', $period->endOfMonth())
                ->where(function ($query) use ($period) {
                    $query->where('tanggal_selesai', '>=', $period->startOfMonth())
                          ->orWhereNull('tanggal_selesai');
                })
                ->orderBy('tanggal_mulai', 'desc')
                ->first();

            $payrollData[] = [
                'employee_id' => $employee->id,
                'name' => $employee->name,
                'gaji_pokok' => $salary->gaji_pokok ?? 0,
                'hari_hadir' => 0, // <-- PERUBAHAN DI SINI
                'insentif' => 0,
                'potongan_kasbon' => 0,
            ];
        }
        
        $uangMakanHarian = PayrollSetting::where('setting_key', 'uang_makan_harian')->first()->setting_value ?? 20000;

        return Inertia::render('Payroll/Generate', [
            'payrollData' => $payrollData,
            'period' => $period->translatedFormat('F Y'),
            'period_string' => $periodString,
            'uang_makan_harian' => (int)$uangMakanHarian,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'payrolls' => 'required|array',
            'period_string' => 'required|string',
            'uang_makan_harian' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->payrolls as $empPayroll) {
                $gajiPokok = $empPayroll['gaji_pokok'];
                $insentif = $empPayroll['insentif'];
                $uangMakan = $empPayroll['hari_hadir'] * $request->uang_makan_harian;
                $potonganKasbon = $empPayroll['potongan_kasbon'];

                $totalPendapatan = $gajiPokok + $insentif + $uangMakan;
                $totalPotongan = $potonganKasbon;
                $gajiBersih = $totalPendapatan - $totalPotongan;

                $payroll = Payroll::create([
                    'employee_id' => $empPayroll['employee_id'],
                    'payroll_period' => $request->period_string,
                    'total_pendapatan' => $totalPendapatan,
                    'total_potongan' => $totalPotongan,
                    'gaji_bersih' => $gajiBersih,
                    'status' => 'final',
                ]);

                PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Gaji Pokok', 'tipe' => 'pendapatan', 'jumlah' => $gajiPokok]);
                if ($uangMakan > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => "Uang Makan ({$empPayroll['hari_hadir']} hari)", 'tipe' => 'pendapatan', 'jumlah' => $uangMakan]);
                }
                if ($insentif > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Insentif', 'tipe' => 'pendapatan', 'jumlah' => $insentif]);
                }
                if ($potonganKasbon > 0) {
                    PayrollItem::create(['payroll_id' => $payroll->id, 'deskripsi' => 'Potongan Kasbon', 'tipe' => 'potongan', 'jumlah' => $potonganKasbon]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data penggajian: ' . $e->getMessage());
        }

        return redirect()->route('payroll.index')->with('message', 'Penggajian berhasil disimpan.');
    }

    public function show(Payroll $payroll)
    {
        $payroll->load(['employee', 'items']);
        return Inertia::render('Payroll/Show', ['payroll' => $payroll]);
    }
}
