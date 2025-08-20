import React, { useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// Layout & Tipe Data
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Komponen UI dari ShadCN
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Ikon dari Lucide React
import { Calendar, PlusCircle, Pencil, MoreHorizontal, Eye } from 'lucide-react';

// --- INTERFACES & TIPE DATA ---
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
    links: { url: string | null; label: string; active: boolean; }[];
    from: number;
    to: number;
    total: number;
}

interface Period {
    value: string; // e.g., "2025-08"
    label: string; // e.g., "Agustus 2025"
}

interface PageProps {
    payrolls: PaginatedPayrolls;
    availablePeriods: Period[];
    filters: {
        period?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Penggajian', href: route('payroll.index') },
];

// --- FUNGSI BANTUAN & KOMPONEN KECIL ---
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const Pagination: React.FC<{ links: PageProps['payrolls']['links'] }> = ({ links }) => (
    <div className="flex items-center justify-center px-6 py-3">
        <nav className="flex items-center space-x-1">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={cn(
                        'px-3 py-1.5 text-sm rounded-md transition-colors',
                        link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                        !link.url && 'text-muted-foreground cursor-not-allowed'
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    as="button"
                    disabled={!link.url}
                />
            ))}
        </nav>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap = {
        paid: { text: 'Dibayar', className: 'bg-green-100 text-green-800' },
        final: { text: 'Final', className: 'bg-blue-100 text-blue-800' },
        draft: { text: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
    };
    const current = statusMap[status as keyof typeof statusMap] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    return <Badge className={cn('font-medium', current.className)}>{current.text}</Badge>;
};

// --- KOMPONEN UTAMA ---
export default function Index({ payrolls, availablePeriods, filters }: PageProps) {
    const { data, setData } = useForm({
        period: filters.period || 'all',
    });

    useEffect(() => {
        router.get(route('payroll.index'), { period: data.period === 'all' ? undefined : data.period }, {
            preserveState: true,
            replace: true,
        });
    }, [data.period]);

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

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Riwayat Penggajian" description={`Menampilkan ${payrolls.from || 0}-${payrolls.to || 0} dari ${payrolls.total} data penggajian.`} />
                    
                    <div className="flex items-center gap-4">
                        <Select value={data.period} onValueChange={(value) => setData('period', value)}>
                            <SelectTrigger className="w-[200px] bg-white dark:bg-transparent">
                                <SelectValue placeholder="Filter Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Periode</SelectItem>
                                {availablePeriods.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Link href={route('payroll.create')}>
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Generate Gaji Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-transparent hover:bg-slate-100">
                                    <TableHead className="pl-6">Nama Karyawan</TableHead>
                                    <TableHead>Periode Gaji</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Gaji Bersih</TableHead>
                                    <TableHead className="text-center pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls.data.length > 0 ? (
                                    payrolls.data.map((payroll) => (
                                        <TableRow key={payroll.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-6 font-medium text-gray-800 dark:text-white">{payroll.employee.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{formatPeriod(payroll.payroll_period)}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={payroll.status} />
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-indigo-600 tracking-tight">{formatCurrency(payroll.gaji_bersih)}</TableCell>
                                            <TableCell className="text-center pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => router.get(route('payroll.show', payroll.id))}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            <span>Lihat Slip</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => router.get(route('payroll.edit', payroll.id))}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                            <p className="font-medium">Tidak ada data penggajian untuk ditampilkan.</p>
                                            <p className="text-sm mt-1">Coba pilih periode lain atau generate gaji baru.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {payrolls.links.length > 3 && (
                        <Pagination links={payrolls.links} />
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
