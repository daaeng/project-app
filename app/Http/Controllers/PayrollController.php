<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\PayrollSetting;
use App\Models\SalaryHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    // ... (fungsi index, create, generate, store, show tidak berubah) ...
    public function index()
    {
        $payrolls = Payroll::with('employee')
            ->orderBy('payroll_period', 'desc')
            ->orderBy('id', 'asc') 
            ->paginate(15);

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
            return redirect()->route('payroll.create')->with('error', 'Penggajian untuk periode ini sudah pernah dibuat.');
        }
        $employees = Employee::where('status', 'active')->get();
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
                'hari_hadir' => 22,
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
            'payrolls.*.employee_id' => 'required|exists:employees,id',
            'period_string' => 'required|date_format:Y-m',
            'uang_makan_harian' => 'required|numeric|min:0',
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
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
        return redirect()->route('payroll.index')->with('message', 'Penggajian periode ' . $request->period_string . ' berhasil disimpan.');
    }
    public function show(Payroll $payroll)
    {
        $payroll->load(['employee', 'items']);
        return Inertia::render('Payroll/Show', ['payroll' => $payroll]);
    }


    /**
     * --- FUNGSI EDIT DIPERBARUI ---
     * Mengambil semua rincian gaji untuk dikirim ke halaman edit.
     */
    public function edit(Payroll $payroll)
    {
        $payroll->load('items'); // Memuat relasi items

        // Mengambil nilai default dari item-item yang ada
        $gajiPokok = $payroll->items->where('deskripsi', 'Gaji Pokok')->first()->jumlah ?? 0;
        $insentif = $payroll->items->where('deskripsi', 'Insentif')->first()->jumlah ?? 0;
        $potonganKasbon = $payroll->items->where('deskripsi', 'Potongan Kasbon')->first()->jumlah ?? 0;
        
        $uangMakanItem = $payroll->items->where('deskripsi', 'like', 'Uang Makan%')->first();
        $hariHadir = 0;
        if ($uangMakanItem) {
            // Mengekstrak jumlah hari dari deskripsi, contoh: "Uang Makan (22 hari)"
            preg_match('/\((\d+)\s*hari\)/', $uangMakanItem->deskripsi, $matches);
            $hariHadir = $matches[1] ?? 0;
        }

        // Ambil pengaturan uang makan harian
        $uangMakanHarian = PayrollSetting::where('setting_key', 'uang_makan_harian')->first()->setting_value ?? 20000;

        return Inertia::render('Payroll/Edit', [
            'payroll' => [
                'id' => $payroll->id,
                'status' => $payroll->status,
                'payroll_period' => $payroll->payroll_period,
                'employee' => $payroll->employee,
                // Data komponen gaji
                'gaji_pokok' => $gajiPokok,
                'hari_hadir' => (int)$hariHadir,
                'insentif' => $insentif,
                'potongan_kasbon' => $potonganKasbon,
            ],
            'uang_makan_harian' => (int)$uangMakanHarian
        ]);
    }

    /**
     * --- FUNGSI UPDATE DIPERBARUI ---
     * Menghitung ulang dan menyimpan semua komponen gaji.
     */
    public function update(Request $request, Payroll $payroll)
    {
        $request->validate([
            'status' => ['required', Rule::in(['draft', 'final', 'paid'])],
            'gaji_pokok' => 'required|numeric|min:0',
            'hari_hadir' => 'required|integer|min:0',
            'insentif' => 'required|numeric|min:0',
            'potongan_kasbon' => 'required|numeric|min:0',
            'uang_makan_harian' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Hitung ulang total
            $gajiPokok = $request->gaji_pokok;
            $insentif = $request->insentif;
            $uangMakan = $request->hari_hadir * $request->uang_makan_harian;
            $potonganKasbon = $request->potongan_kasbon;

            $totalPendapatan = $gajiPokok + $insentif + $uangMakan;
            $totalPotongan = $potonganKasbon;
            $gajiBersih = $totalPendapatan - $totalPotongan;

            // Update tabel payroll utama
            $payroll->update([
                'total_pendapatan' => $totalPendapatan,
                'total_potongan' => $totalPotongan,
                'gaji_bersih' => $gajiBersih,
                'status' => $request->status,
                'tanggal_pembayaran' => $request->status === 'paid' ? now() : null,
            ]);

            // Update atau buat rincian di payroll_items
            PayrollItem::updateOrCreate(
                ['payroll_id' => $payroll->id, 'deskripsi' => 'Gaji Pokok'],
                ['tipe' => 'pendapatan', 'jumlah' => $gajiPokok]
            );
            PayrollItem::updateOrCreate(
                ['payroll_id' => $payroll->id, 'deskripsi' => 'like', 'Uang Makan%'],
                ['deskripsi' => "Uang Makan ({$request->hari_hadir} hari)", 'tipe' => 'pendapatan', 'jumlah' => $uangMakan]
            );
            PayrollItem::updateOrCreate(
                ['payroll_id' => $payroll->id, 'deskripsi' => 'Insentif'],
                ['tipe' => 'pendapatan', 'jumlah' => $insentif]
            );
            PayrollItem::updateOrCreate(
                ['payroll_id' => $payroll->id, 'deskripsi' => 'Potongan Kasbon'],
                ['tipe' => 'potongan', 'jumlah' => $potonganKasbon]
            );

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }

        return redirect()->route('payroll.index')->with('message', 'Data penggajian berhasil diperbarui.');
    }
}
