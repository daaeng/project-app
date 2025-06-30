import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types'; 
import { Head, Link, usePage } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Detail Kasbon', href: '#' },
];

interface Kasbon {
    id: number;
    incisor_name: string;
    incisor_no_invoice: string; // Menambahkan ini untuk kode penoreh
    gaji: number;
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'belum ACC' | 'ditolak' | 'diterima';
    reason: string | null;
    total_toreh_bulan_ini_raw: number; // Nama properti yang diubah sesuai backend
    created_at: string;
    updated_at: string;
}

interface PageProps {
    kasbon: Kasbon;
}

const formatCurrency = (value: number) => {
    // Pastikan nilai adalah angka sebelum diformat
    if (isNaN(value) || value === null || value === undefined) { // Menambahkan undefined check
        return "Rp0"; 
    }
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
        { title: `Detail Kasbon (Kode Penoreh: ${kasbon.incisor_no_invoice})`, href: route('kasbons.show', kasbon.id) },
    ];

    return (
        <AppLayout breadcrumbs={dynamicBreadcrumbs}>
            <Head title={`Detail Kasbon - ${kasbon.incisor_no_invoice}`} />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title={`Detail Kasbon (Kode Penoreh: ${kasbon.incisor_no_invoice})`} />
                <div className="mb-4">
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Undo2 className="h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                </div>

                {/* Card sekarang mengambil lebar yang lebih besar dan berpusat */}
                <Card className="w-full md:max-w-3xl mx-auto shadow-md">
                    <CardHeader>
                        <CardTitle>Detail Kasbon</CardTitle>
                    </CardHeader>
                    {/* Content diatur dalam grid 2 kolom untuk tampilan landscape */}
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Kolom 1 */}
                        <div>
                            <div>
                                <Label className="block text-sm font-medium text-gray-700">Kode Penoreh</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.incisor_no_invoice}</p>
                            </div>
                            <div className="mt-4"> {/* Menambahkan margin atas untuk pemisah */}
                                <Label className="block text-sm font-medium text-gray-700">Nama Penoreh</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.incisor_name}</p>
                            </div>
                            
                            <div className="mt-4">
                                <Label className="block text-sm font-medium text-gray-700">Total Toreh Bulan Ini</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.total_toreh_bulan_ini_raw)}</p>
                            </div>
                            <div className="mt-4">
                                <Label className="block text-sm font-medium text-gray-700">Gaji (50% dari Total Toreh Bulan Ini)</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.gaji)}</p>
                            </div>
                        </div>

                        {/* Kolom 2 */}
                        <div>
                            <div>
                                <Label className="block text-sm font-medium text-gray-700">Jumlah Kasbon</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(kasbon.kasbon)}</p>
                            </div>
                            <div className="mt-4">
                                <Label className="block text-sm font-medium text-gray-700">Status</Label>
                                {/* Menggunakan komponen Tag */}
                                <Tag status={kasbon.status === 'Pending' ? 'belum ACC' : (kasbon.status === 'Approved' ? 'diterima' : 'ditolak')} />
                            </div>
                            {kasbon.reason && (
                                <div className="mt-4">
                                    <Label className="block text-sm font-medium text-gray-700">Alasan</Label>
                                    <p className="mt-1 text-gray-900">{kasbon.reason}</p>
                                </div>
                            )}
                            <div className="mt-4">
                                <Label className="block text-sm font-medium text-gray-700">Dibuat Pada</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.created_at}</p>
                            </div>
                            <div className="mt-4">
                                <Label className="block text-sm font-medium text-gray-700">Diperbarui Pada</Label>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{kasbon.updated_at}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
