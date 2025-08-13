import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        period_month: new Date().getMonth() + 1,
        period_year: new Date().getFullYear(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payroll.store'));
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
    }));

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <AppLayout>
            <Head title="Generate Gaji Baru" />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <Heading title="Generate Penggajian" className="mb-2" />
                    <p className="text-gray-500 mb-6">Pilih periode untuk men-generate gaji semua pegawai.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="period_month">Bulan</Label>
                                <Select
                                    value={String(data.period_month)}
                                    onValueChange={(value) => setData('period_month', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map(month => (
                                            <SelectItem key={month.value} value={String(month.value)}>{month.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.period_month && <p className="text-red-500 text-xs mt-1">{errors.period_month}</p>}
                            </div>
                            <div>
                                <Label htmlFor="period_year">Tahun</Label>
                                <Select
                                    value={String(data.period_year)}
                                    onValueChange={(value) => setData('period_year', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map(year => (
                                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.period_year && <p className="text-red-500 text-xs mt-1">{errors.period_year}</p>}
                            </div>
                        </div>
                        
                        <div className="border-t pt-6 flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Memproses...' : 'Generate Gaji'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
