import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Wallet, Calendar, Utensils, Gift, MinusCircle } from 'lucide-react';

interface EmployeePayrollData {
    employee_id: number;
    name: string;
    gaji_pokok: number;
    hari_hadir: number;
    insentif: number;
    potongan_kasbon: number;
}

interface PageProps {
    payrollData: EmployeePayrollData[];
    period: string;
    period_string: string;
    uang_makan_harian: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export default function Generate({ payrollData, period, period_string, uang_makan_harian }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        payrolls: payrollData, // Langsung inisialisasi dari props
        period_string: period_string,
        uang_makan_harian: uang_makan_harian,
    });

    // Fungsi ini sekarang langsung mengubah state dari useForm
    const handleInputChange = (index: number, field: keyof EmployeePayrollData, value: string) => {
        const numericValue = parseInt(value) || 0;
        
        setData('payrolls', data.payrolls.map((payroll, i) => {
            if (i === index) {
                // Buat objek baru dengan nilai yang diperbarui
                return { ...payroll, [field]: numericValue };
            }
            return payroll;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Langsung post, karena 'data' sudah selalu ter-update
        post(route('payroll.store'));
    };

    return (
        <AppLayout>
            <Head title={`Generate Gaji Periode ${period}`} />
            <div className="container mx-auto p-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Heading title={`Generate Gaji Periode ${period}`} />
                        <p className="mt-1 text-sm text-gray-500">
                            Masukkan detail penggajian untuk setiap pegawai di bawah ini.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Pengaturan Umum</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="max-w-xs">
                                <Label htmlFor="uang_makan_harian">Tarif Uang Makan Harian</Label>
                                <div className="relative mt-1">
                                    <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="uang_makan_harian"
                                        type="number"
                                        value={data.uang_makan_harian}
                                        onChange={(e) => setData('uang_makan_harian', parseInt(e.target.value) || 0)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.payrolls.map((emp, index) => {
                            const totalPendapatan = emp.gaji_pokok + (emp.hari_hadir * data.uang_makan_harian) + emp.insentif;
                            const totalPotongan = emp.potongan_kasbon;
                            const totalGaji = totalPendapatan - totalPotongan;

                            return (
                                <Card key={emp.employee_id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{emp.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-4">
                                        <div className="space-y-2">
                                            <Label>Pendapatan</Label>
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-gray-500"/>
                                                <Input type="number" placeholder="Gaji Pokok" value={emp.gaji_pokok} onChange={(e) => handleInputChange(index, 'gaji_pokok', e.target.value)} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500"/>
                                                <Input type="number" placeholder="Hari Hadir" value={emp.hari_hadir} onChange={(e) => handleInputChange(index, 'hari_hadir', e.target.value)} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Gift className="h-4 w-4 text-gray-500"/>
                                                <Input type="number" placeholder="Insentif" value={emp.insentif} onChange={(e) => handleInputChange(index, 'insentif', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Potongan</Label>
                                             <div className="flex items-center gap-2">
                                                <MinusCircle className="h-4 w-4 text-gray-500"/>
                                                <Input type="number" placeholder="Potongan Kasbon" value={emp.potongan_kasbon} onChange={(e) => handleInputChange(index, 'potongan_kasbon', e.target.value)} />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-gray-50 dark:bg-gray-800 mt-4 p-4">
                                        <div className="w-full">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Total Pendapatan</span>
                                                <span className="font-medium">{formatCurrency(totalPendapatan)}</span>
                                            </div>
                                             <div className="flex justify-between text-sm text-red-600">
                                                <span >Total Potongan</span>
                                                <span className="font-medium">{formatCurrency(totalPotongan)}</span>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total Gaji</span>
                                                <span>{formatCurrency(totalGaji)}</span>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                     <div className="mt-8 flex justify-end gap-4">
                        <Link href={route('payroll.create')}>
                            <Button type="button" variant="outline">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} size="lg">
                            {processing ? 'Menyimpan...' : 'Simpan Semua Penggajian'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
