import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Tipe data untuk Payroll yang diedit
interface PayrollData {
    id: number;
    payroll_period: string;
    status: 'unpaid' | 'paid';
    employee: {
        name: string;
    };
}

export default function Edit({ payroll }: { payroll: PayrollData }) {
    const { data, setData, put, processing, errors } = useForm({
        status: payroll.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('payroll.update', payroll.id));
    };
    
    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit Gaji - ${payroll.employee.name}`} />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <Heading title="Edit Status Pembayaran" className="mb-2" />
                    <p className="text-gray-500 mb-6">
                        Ubah status pembayaran untuk <span className="font-semibold">{payroll.employee.name}</span> pada periode <span className="font-semibold">{formatPeriod(payroll.payroll_period)}</span>.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="status">Status Pembayaran</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: 'unpaid' | 'paid') => setData('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                                    <SelectItem value="paid">Sudah Dibayar</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                        </div>
                        
                        <div className="border-t pt-6 flex justify-between items-center">
                            <Link href={route('payroll.index')}>
                                <Button type="button" variant="outline">Kembali</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
