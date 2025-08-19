import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Wallet, Calendar, Gift, MinusCircle } from 'lucide-react';

// Tipe data untuk Payroll yang diedit
interface PayrollData {
    id: number;
    payroll_period: string;
    status: 'draft' | 'final' | 'paid';
    employee: { name: string };
    gaji_pokok: number;
    hari_hadir: number;
    insentif: number;
    potongan_kasbon: number;
}

interface PageProps {
    payroll: PayrollData;
    uang_makan_harian: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export default function Edit({ payroll, uang_makan_harian }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: payroll.status,
        gaji_pokok: payroll.gaji_pokok,
        hari_hadir: payroll.hari_hadir,
        insentif: payroll.insentif,
        potongan_kasbon: payroll.potongan_kasbon,
        uang_makan_harian: uang_makan_harian,
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

    // Kalkulasi untuk ditampilkan di UI
    const uangMakan = data.hari_hadir * data.uang_makan_harian;
    const totalPendapatan = data.gaji_pokok + uangMakan + data.insentif;
    const totalPotongan = data.potongan_kasbon;
    const gajiBersih = totalPendapatan - totalPotongan;

    return (
        <AppLayout>
            <Head title={`Edit Gaji - ${payroll.employee.name}`} />
            <div className="container mx-auto max-w-2xl p-4">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Rincian Gaji</CardTitle>
                            <CardDescription>
                                {payroll.employee.name} - Periode {formatPeriod(payroll.payroll_period)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Komponen Pendapatan */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="font-semibold">Komponen Pendapatan</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="gaji_pokok">Gaji Pokok</Label>
                                        <div className="relative mt-1">
                                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input id="gaji_pokok" type="number" value={data.gaji_pokok} onChange={(e) => setData('gaji_pokok', parseInt(e.target.value) || 0)} className="pl-10" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="hari_hadir">Hari Hadir</Label>
                                         <div className="relative mt-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input id="hari_hadir" type="number" value={data.hari_hadir} onChange={(e) => setData('hari_hadir', parseInt(e.target.value) || 0)} className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="insentif">Insentif / Bonus</Label>
                                        <div className="relative mt-1">
                                            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input id="insentif" type="number" value={data.insentif} onChange={(e) => setData('insentif', parseInt(e.target.value) || 0)} className="pl-10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Komponen Potongan */}
                             <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="font-semibold">Komponen Potongan</h3>
                                <div>
                                    <Label htmlFor="potongan_kasbon">Potongan Kasbon</Label>
                                    <div className="relative mt-1">
                                        <MinusCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input id="potongan_kasbon" type="number" value={data.potongan_kasbon} onChange={(e) => setData('potongan_kasbon', parseInt(e.target.value) || 0)} className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            {/* Status Pembayaran */}
                             <div>
                                <Label htmlFor="status">Status Pembayaran</Label>
                                <Select value={data.status} onValueChange={(value: 'draft' | 'final' | 'paid') => setData('status', value)}>
                                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="final">Final</SelectItem>
                                        <SelectItem value="paid">Sudah Dibayar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-stretch gap-4 bg-gray-50 p-6">
                            {/* Rincian Kalkulasi */}
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal Gaji Pokok</span><span className="font-medium">{formatCurrency(data.gaji_pokok)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal Uang Makan</span><span className="font-medium">{formatCurrency(uangMakan)}</span></div>
                                <div className="flex justify-between text-sm text-red-600"><span>Total Potongan</span><span className="font-medium">{formatCurrency(totalPotongan)}</span></div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg"><span>Gaji Bersih</span><span>{formatCurrency(gajiBersih)}</span></div>
                            </div>
                            {/* Tombol Aksi */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <Link href={route('payroll.index')}><Button type="button" variant="outline">Batal</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
