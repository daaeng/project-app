import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Definisikan tipe data sesuai dengan yang dikirim dari controller
interface PayrollData {
    id: number;
    payroll_period: string;
    base_salary: number;
    total_deduction: number;
    net_salary: number;
    employee: {
        name: string;
        employee_id: string;
        position: string;
    };
}

export default function Show({ payroll }: { payroll: PayrollData }) {
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout>
            <Head title={`Slip Gaji - ${payroll.employee.name}`} />

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none">
                <div className="text-center border-b pb-4 mb-4">
                    <h1 className="text-2xl font-bold">SLIP GAJI</h1>
                    <p className="text-gray-600">Periode: {payroll.payroll_period}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="font-semibold">{payroll.employee.name}</p>
                        <p className="text-sm text-gray-500">{payroll.employee.position}</p>
                        <p className="text-sm text-gray-500">ID: {payroll.employee.employee_id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tanggal Cetak</p>
                        <p className="font-semibold">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Pendapatan */}
                    <div>
                        <h3 className="font-semibold border-b mb-2 pb-1">Pendapatan</h3>
                        <div className="flex justify-between">
                            <p>Gaji Pokok</p>
                            <p>{formatCurrency(payroll.base_salary)}</p>
                        </div>
                    </div>

                    {/* Potongan */}
                    <div>
                        <h3 className="font-semibold border-b mb-2 pb-1">Potongan</h3>
                        <div className="flex justify-between">
                            <p>Kasbon</p>
                            <p>- {formatCurrency(payroll.total_deduction)}</p>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t-2 pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <p>GAJI BERSIH (Take Home Pay)</p>
                            <p>{formatCurrency(payroll.net_salary)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 text-center print:hidden">
                    <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                        Cetak Slip Gaji
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
