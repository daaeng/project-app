import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Detail Kasbon', href: '#' },
];

interface Kasbon {
    id: number;
    incisor_name: string;
    incised_no_invoice: string;
    gaji: number;
    kasbon: number;
    status: string;
    reason: string | null;
    incised_amount: number; // Added to display related Incised amount
    created_at: string;
    updated_at: string;
}

interface PageProps {
    kasbon: Kasbon;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function ShowKasbon() {
    const { kasbon } = usePage().props as PageProps;

    // Update breadcrumbs dynamically
    const dynamicBreadcrumbs = [
        ...breadcrumbs.slice(0, 1),
        { title: `Detail Kasbon (ID: ${kasbon.id})`, href: route('kasbons.show', kasbon.id) },
    ];

    return (
        <AppLayout breadcrumbs={dynamicBreadcrumbs}>
            <Head title={`Detail Kasbon - ${kasbon.id}`} />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title={`Detail Kasbon (ID: ${kasbon.id})`} />
                <div className="mb-4">
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Undo2 className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                <Card className="max-w-xl mx-auto shadow-md">
                    <CardHeader>
                        <CardTitle>Detail Kasbon</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">ID Kasbon</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.id}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Nama Penoreh</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.incisor_name}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">No. Invoice Incised</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.incised_no_invoice}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Jumlah Incised</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.incised_amount)}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Gaji (50% dari Jumlah Incised)</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.gaji)}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Jumlah Kasbon</Label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.kasbon)}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Status</Label>
                            <span className={`mt-1 inline-flex text-lg leading-5 font-semibold rounded-full px-3 py-1 ${
                                kasbon.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                kasbon.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {kasbon.status}
                            </span>
                        </div>
                        {kasbon.reason && (
                            <div>
                                <Label className="block text-sm font-medium text-gray-700">Alasan</Label>
                                <p className="mt-1 text-gray-900">{kasbon.reason}</p>
                            </div>
                        )}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Dibuat Pada</Label>
                            <p className="mt-1 text-gray-900">{kasbon.created_at}</p>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium text-gray-700">Diperbarui Pada</Label>
                            <p className="mt-1 text-gray-900">{kasbon.updated_at}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
