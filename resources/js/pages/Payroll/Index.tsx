import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Wallet, Eye, PlusCircle, Pencil } from 'lucide-react'; // <-- Tambahkan ikon Pencil

// ... (Interface dan konstanta lainnya tidak berubah) ...
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface Payroll {
    id: number;
    payroll_period: string;
    status: 'draft' | 'final' | 'paid';
    created_at: string;
    gaji_bersih: number;
    employee: {
        name: string;
    };
}
interface PaginatedPayrolls {
    data: Payroll[];
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Penggajian', href: route('payroll.index') },
];
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const Pagination = ({ links }: { links: PaginationLink[] }) => (
    <nav className="flex items-center justify-center mt-6">
        {links.map((link, index) => (
            <Link
                key={`pagination-${index}`}
                href={link.url || '#'}
                className={`pagination-link-light ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
                as="button"
                disabled={!link.url}
            />
        ))}
    </nav>
);
// ...

export default function Index({ payrolls }: { payrolls: PaginatedPayrolls }) {
    const formatPeriod = (period: string) => {
        const [year, month] = period.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="status-badge-light paid">Dibayar</Badge>;
            case 'final':
                return <Badge className="status-badge-light final">Final</Badge>;
            case 'draft':
                return <Badge className="status-badge-light draft">Draft</Badge>;
            default:
                return <Badge className="status-badge-light unknown">Unknown</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Penggajian" />

            <div className="payroll-container-light space-y-6 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Riwayat Penggajian" description={`Menampilkan ${payrolls.from}-${payrolls.to} dari ${payrolls.total} data penggajian.`} />
                    <Link href={route('payroll.create')}>
                        <Button>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Generate Gaji Baru
                        </Button>
                    </Link>
                </div>

                {payrolls.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {payrolls.data.map((payroll) => (
                                <div key={payroll.id} className="payroll-card-light group bg-gray-300 rounded-xl">
                                    <div className="p-5 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center text-xs text-gray-500 font-medium">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{formatPeriod(payroll.payroll_period)}</span>
                                            </div>
                                            {getStatusBadge(payroll.status)}
                                        </div>

                                        <div className="mb-4 flex-grow">
                                            <p className="text-lg font-semibold text-gray-800 mb-2">{payroll.employee.name}</p>
                                            <div className="flex items-end">
                                                <p className="text-2xl font-bold text-indigo-600 tracking-tight">{formatCurrency(payroll.gaji_bersih)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t pt-4 mt-auto flex justify-between items-center">
                                           <span className="text-xs text-gray-400">
                                                Dibuat: {new Date(payroll.created_at).toLocaleDateString('id-ID')}
                                           </span>
                                           {/* --- PERBAIKAN: Tambahkan Tombol Edit --- */}
                                           <div className="flex items-center gap-2">
                                                <Link href={route('payroll.edit', payroll.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Pencil className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('payroll.show', payroll.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Lihat Slip
                                                    </Button>
                                                </Link>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {payrolls.links.length > 3 && (
                            <Pagination links={payrolls.links} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-lg border shadow-sm">
                        <p className="font-medium">Tidak ada data penggajian untuk ditampilkan.</p>
                        <p className="text-sm mt-1">Silakan generate gaji baru untuk memulai.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
