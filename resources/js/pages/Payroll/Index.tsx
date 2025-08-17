import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Tipe data untuk Payroll
interface Payroll {
    id: number;
    payroll_period: string;
    status: 'unpaid' | 'paid';
    created_at: string;
    employee: {
        name: string;
    };
}

// Tipe data untuk paginasi
interface PaginatedPayrolls {
    data: Payroll[];
    links: { url: string | null; label: string; active: boolean }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Penggajian', href: route('payroll.index') },
];

export default function Index({ payrolls }: { payrolls: PaginatedPayrolls }) {
    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Penggajian" />

            <div className="flex flex-col p-4 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Heading title="Riwayat Penggajian" />
                        <p className="mt-1 text-sm text-gray-500">
                            Lihat semua riwayat penggajian yang telah dibuat.
                        </p>
                    </div>
                    <Link href={route('payroll.create')}>
                        <Button>+ Generate Gaji Baru</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Dibuat</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payrolls.data.map((payroll) => (
                                <tr key={payroll.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{formatPeriod(payroll.payroll_period)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payroll.employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={payroll.status === 'paid' ? 'default' : 'destructive'}>
                                            {payroll.status === 'paid' ? 'Dibayar' : 'Belum Dibayar'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payroll.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={route('payroll.show', payroll.id)}>
                                            <Button variant="outline" size="sm">Lihat Slip</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Tambahkan Paginasi jika perlu */}
            </div>
        </AppLayout>
    );
}
