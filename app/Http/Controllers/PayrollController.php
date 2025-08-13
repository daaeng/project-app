<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Kasbon;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    // Menampilkan halaman utama payroll (riwayat gaji)
    public function index(Request $request)
    {
        $payrolls = Payroll::with('employee')->latest()->paginate(10);

        return Inertia::render('Payroll/Index', [
            'payrolls' => $payrolls
        ]);
    }

    // Menampilkan halaman untuk membuat/generate payroll baru
    public function create()
    {
        $employees = Employee::all();
        return Inertia::render('Payroll/Create', [
            'employees' => $employees
        ]);
    }

    // Logika untuk menghitung dan menyimpan payroll
    public function store(Request $request)
    {
        $request->validate([
            'period_month' => 'required|integer|between:1,12',
            'period_year' => 'required|integer',
        ]);

        $period = $request->period_year . '-' . str_pad($request->period_month, 2, '0', STR_PAD_LEFT);
        $employees = Employee::all();

        foreach ($employees as $employee) {
            $baseSalary = $employee->salary;
            // Sesuaikan logika pengambilan kasbon dengan sistem Anda
            $totalDeduction = Kasbon::where('employee_id', $employee->id)->sum('kasbon');
            $netSalary = $baseSalary - $totalDeduction;

            Payroll::updateOrCreate(
                ['employee_id' => $employee->id, 'payroll_period' => $period],
                [
                    'base_salary' => $baseSalary,
                    'total_deduction' => $totalDeduction,
                    'net_salary' => $netSalary,
                    'status' => 'unpaid',
                ]
            );
        }

        return redirect()->route('payroll.index')->with('message', 'Penggajian untuk periode ' . $period . ' berhasil digenerate.');
    }

    // Menampilkan detail slip gaji
    public function show(Payroll $payroll)
    {
        $payroll->load('employee');
        return Inertia::render('Payroll/Show', [
            'payroll' => $payroll
        ]);
    }

    // Menampilkan halaman edit payroll
    public function edit(Payroll $payroll)
    {
        $payroll->load('employee');
        return Inertia::render('Payroll/Edit', [
            'payroll' => $payroll
        ]);
    }

    // Mengupdate data payroll
    public function update(Request $request, Payroll $payroll)
    {
        $request->validate([
            'status' => 'required|in:unpaid,paid',
        ]);

        $payroll->update($request->only('status'));

        return redirect()->route('payroll.index')->with('message', 'Status pembayaran berhasil diperbarui.');
    }
}
