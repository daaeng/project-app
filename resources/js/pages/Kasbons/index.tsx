import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { can } from '@/lib/can';
import { cn } from '@/lib/utils';

// Layout & Tipe Data
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Komponen UI dari ShadCN
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

// Ikon dari Lucide React
import { Search, Clock, CheckCircle2, Wallet, MoreHorizontal, Megaphone, XCircle, User, HardHat, Banknote, BadgeCheck, ReceiptText, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Konfigurasi breadcrumb untuk navigasi di atas halaman
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: route('kasbons.index') },
];

// --- INTERFACES: Mendefinisikan tipe data yang diterima dari Controller Laravel ---
interface Kasbon {
    id: number;
    owner_name: string;
    owner_identifier: string;
    kasbon_type: 'Pegawai' | 'Penoreh' | 'Tidak Diketahui';
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    payment_status: 'unpaid' | 'partial' | 'paid';
    created_at: string;
    total_paid: number;
    remaining: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    kasbons: {
        data: Kasbon[];
        links: PaginationLink[];
        meta: any;
    };
    flash: {
        message?: string;
        error?: string;
    };
    filter: {
        search?: string;
        status?: string;
        time_filter?: string;
        month?: string;
        year?: string;
    };
    totalPendingKasbon: number;
    totalApprovedKasbon: number;
    sumApprovedKasbonAmount: number;
}

// --- FUNGSI BANTUAN & KOMPONEN KECIL ---

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; description: string; className?: string; }> = ({ icon: Icon, title, value, description, className }) => (
    <Card className={cn("border-0 shadow-lg text-white overflow-hidden", className)}>
        <CardContent className="p-5 relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs opacity-80 mt-1">{description}</p>
            </div>
        </CardContent>
    </Card>
);

const StatusTag: React.FC<{ status: Kasbon['status']; paymentStatus: Kasbon['payment_status'] }> = ({ status, paymentStatus }) => {
    if (paymentStatus === 'paid') {
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center bg-teal-100 text-teal-800"><BadgeCheck className="w-3.5 h-3.5 mr-1.5" />Lunas</span>;
    }
    if (paymentStatus === 'partial') {
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center bg-sky-100 text-sky-800"><ReceiptText className="w-3.5 h-3.5 mr-1.5" />Dicicil</span>;
    }
    const statusMap = {
        'Approved': { text: 'Disetujui', className: 'bg-green-100 text-green-800' },
        'Pending': { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
        'Rejected': { text: 'Ditolak', className: 'bg-red-100 text-red-800' },
    };
    const current = statusMap[status] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    return <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', current.className)}>{current.text}</span>;
};

const OwnerCell: React.FC<{ kasbon: Kasbon }> = ({ kasbon }) => {
    const isPegawai = kasbon.kasbon_type === 'Pegawai';
    
    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0",
                isPegawai ? 'bg-gradient-to-r from-emerald-500 to-lime-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            )}>
                {isPegawai ? <User size={20} /> : <HardHat size={20} />}
            </div>
            <div>
                <span className="font-medium text-gray-800">{kasbon.owner_name}</span>
                <p className="text-xs text-muted-foreground">{kasbon.owner_identifier}</p>
            </div>
        </div>
    );
};

// --- [KOMPONEN BARU] Komponen Paginasi ---
const Pagination: React.FC<{ links: PaginationLink[] }> = ({ links }) => {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            {links.map((link, index) => {
                // Membersihkan label dari HTML entities
                const cleanLabel = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                // Menentukan ikon untuk "Previous" dan "Next"
                const icon = cleanLabel === 'Previous' ? <ChevronLeft size={18} /> : cleanLabel === 'Next' ? <ChevronRight size={18} /> : null;
                
                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        preserveState // <-- [PERBAIKAN UTAMA] Menambahkan ini untuk menjaga state filter saat paginasi
                        className={cn(
                            "flex items-center justify-center h-9 min-w-[2.25rem] px-3 text-sm font-medium rounded-md transition-colors",
                            link.active ? "bg-primary text-primary-foreground shadow-md" : "bg-background text-foreground hover:bg-accent",
                            !link.url && "text-muted-foreground cursor-not-allowed opacity-50"
                        )}
                        dangerouslySetInnerHTML={!icon ? { __html: cleanLabel } : undefined}
                    >
                        {icon && <span>{icon}</span>}
                    </Link>
                );
            })}
        </div>
    );
};


// --- KOMPONEN UTAMA HALAMAN INDEX ---
export default function KasbonIndex({ kasbons, flash, filter, totalPendingKasbon, totalApprovedKasbon, sumApprovedKasbonAmount }: PageProps) {
    const { delete: destroy } = useForm();
    const { data, setData, post, processing, errors, reset } = useForm({ amount: '', notes: '' });
    const [selectedKasbon, setSelectedKasbon] = useState<Kasbon | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    // [PERBAIKAN] Menyatukan semua state filter ke dalam satu objek
    const [filters, setFilters] = useState({
        search: filter.search || '',
        status: filter.status || 'all',
        time_filter: filter.time_filter || 'this_month',
        month: filter.month || new Date().getMonth() + 1,
        year: filter.year || new Date().getFullYear(),
    });

    useEffect(() => {
        if (flash.message) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash.error) {
            setShowErrorAlert(true);
            const timer = setTimeout(() => setShowErrorAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handlePaySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKasbon) return;
        post(route('kasbons.pay', selectedKasbon.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedKasbon(null);
                reset();
            },
        });
    };
    
    const closeDialog = () => {
        setSelectedKasbon(null);
        reset();
    }

    const tabs = [
        { key: 'all', label: 'Semua' }, { key: 'pending', label: 'Pending' }, { key: 'approved', label: 'Disetujui' },
        { key: 'partial', label: 'Dicicil' }, { key: 'paid', label: 'Lunas' }, { key: 'rejected', label: 'Ditolak' },
    ];

    const handleDelete = (id: number, ownerName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Kasbon untuk ${ownerName}?`)) {
            destroy(route('kasbons.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const timeFilterOptions = [
        { value: 'all_time', label: 'Semua Waktu' },
        { value: 'this_year', label: 'Tahun Ini' },
        { value: 'this_month', label: 'Bulan Ini' },
        { value: 'last_month', label: 'Bulan Lalu' },
        { value: 'this_week', label: 'Minggu Ini' },
        { value: 'today', label: 'Hari Ini' },
        { value: 'custom', label: 'Pilih Bulan & Tahun' },
    ];

    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => ({ value: currentYear - i, label: (currentYear - i).toString() }));

    const applyFilters = () => {
        router.get(route('kasbons.index'), filters as any, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // useEffect ini berfungsi sebagai debouncer, yang akan menjalankan applyFilters
    // setelah pengguna berhenti mengetik atau mengubah filter selama 500ms.
    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters.time_filter !== 'custom' || (filters.month && filters.year)) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [filters]);

    const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Kasbon" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Dashboard Kasbon" description="Analitik dan manajemen data kasbon." />

                    <div className="flex items-center gap-3">
                        <>
                            <Label htmlFor="time_filter" className="text-sm font-medium whitespace-nowrap">Filter Waktu:</Label>
                            <Select value={filters.time_filter} onValueChange={(value) => handleFilterChange('time_filter', value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeFilterOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {filters.time_filter === 'custom' && (
                                <>
                                    <Select value={filters.month.toString()} onValueChange={(value) => handleFilterChange('month', parseInt(value))}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map(month => (
                                                <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filters.year.toString()} onValueChange={(value) => handleFilterChange('year', parseInt(value))}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map(year => (
                                                <SelectItem key={year.value} value={year.value.toString()}>{year.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </>

                        <Link 
                            href={route('kasbons.print')} 
                            data={{ status: filters.status, search: filters.search }}
                            target="_blank"
                        >
                            <Button variant="outline">
                                <Printer className="w-4 h-4 mr-2" />
                                Cetak Laporan
                            </Button>
                        </Link>
                        {can('kasbons.create') && (
                            <Link href={route('kasbons.create')}>
                                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow">
                                    <HardHat className="w-4 h-4 mr-2" /> Buat Kasbon Penoreh
                                </Button>
                            </Link>
                        )}
                        {can('kasbons.create') && (
                            <Link href={route('kasbons.create_pegawai')}>
                                <Button className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-lg hover:shadow-emerald-500/50 transition-shadow">
                                    <User className="w-4 h-4 mr-2" /> Buat Kasbon Pegawai
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={Clock} title="Kasbon Pending" value={totalPendingKasbon} description="Menunggu persetujuan" className="bg-gradient-to-br from-yellow-400 to-orange-500"/>
                    <StatCard icon={CheckCircle2} title="Kasbon Perlu Dibayar" value={totalApprovedKasbon} description="Telah disetujui & belum lunas" className="bg-gradient-to-br from-green-400 to-cyan-500"/>
                    <StatCard icon={Wallet} title="Total Sisa Utang" value={formatCurrency(sumApprovedKasbonAmount)} description="Jumlah dana yang belum lunas" className="bg-gradient-to-br from-sky-400 to-blue-500"/>
                </div>

                { (showSuccessAlert && flash.message) && (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                        <Megaphone className="h-4 w-4 text-green-600" />
                        <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                { (showErrorAlert && flash.error) && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Gagal!</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center border-b">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleFilterChange('status', tab.key)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-colors -mb-px",
                                            filters.status === tab.key
                                                ? "border-b-2 border-primary text-primary"
                                                : "text-muted-foreground hover:text-primary border-b-2 border-transparent"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className='relative sm:w-1/3'>
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Cari nama, NIP, atau No. Invoice..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 hover:bg-slate-100">
                                    <TableHead className="pl-6">Nama</TableHead>
                                    <TableHead>Total Kasbon</TableHead>
                                    <TableHead>Sisa Utang</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kasbons.data.length > 0 ? (
                                    kasbons.data.map((kasbon) => (
                                    <TableRow key={kasbon.id}>
                                        <TableCell className="pl-6">
                                            <OwnerCell kasbon={kasbon} />
                                        </TableCell>
                                        <TableCell>{formatCurrency(kasbon.kasbon)}</TableCell>
                                        <TableCell className={cn("font-semibold", kasbon.remaining > 0 ? "text-red-600" : "text-green-600")}>
                                            {formatCurrency(kasbon.remaining)}
                                        </TableCell>
                                        <TableCell>
                                            <StatusTag status={kasbon.status} paymentStatus={kasbon.payment_status} />
                                        </TableCell>
                                        <TableCell className="text-center pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {can('kasbons.edit') && kasbon.status === 'Approved' && kasbon.payment_status !== 'paid' && (
                                                        <DropdownMenuItem onSelect={() => setSelectedKasbon(kasbon)}>
                                                            <Banknote className="mr-2 h-4 w-4" /> Bayar Cicilan
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onSelect={() => router.get(route('kasbons.show', kasbon.id))}>Lihat Detail</DropdownMenuItem>
                                                    {can('kasbons.edit') && <DropdownMenuItem onSelect={() => router.get(route('kasbons.edit', kasbon.id))}>Edit</DropdownMenuItem>}
                                                    {can('kasbons.delete') && <DropdownMenuItem onSelect={() => handleDelete(kasbon.id, kasbon.owner_name)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Hapus</DropdownMenuItem>}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">Data tidak ditemukan.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* --- Menambahkan komponen Paginasi di sini --- */}
                <Pagination links={kasbons.links} />

                <AlertDialog open={!!selectedKasbon} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <form onSubmit={handlePaySubmit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bayar Cicilan Kasbon</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Untuk: <strong>{selectedKasbon?.owner_name}</strong><br />
                                    Sisa Kasbon: <strong className="text-red-600">{formatCurrency(selectedKasbon?.remaining || 0)}</strong>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <Label htmlFor="amount">Jumlah Pembayaran</Label>
                                    <Input
                                        id="amount" type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        max={selectedKasbon?.remaining}
                                        required placeholder="Contoh: 30000"
                                        className="mt-1"
                                    />
                                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Contoh: Pembayaran via transfer"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <Button type="button" variant="outline" onClick={closeDialog}>Batal</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Simpan Pembayaran'}
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
