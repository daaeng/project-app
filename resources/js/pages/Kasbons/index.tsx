import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { CirclePlus, Search, Clock, CheckCircle2, Wallet, MoreHorizontal, Megaphone, XCircle, User } from 'lucide-react';
import { can } from '@/lib/can';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kasbon',
        href: route('kasbons.index'),
    },
];

// --- INTERFACES ---
interface Kasbon {
    id: number;
    incisor_id: number;
    incisor_name: string;
    incised_id: number;
    incised_no_invoice: string;
    incisor_no_invoice: string;
    gaji: number;
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'belum ACC' | 'ditolak' | 'diterima';
    reason: string | null;
    created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
    flash: {
        message?: string;
        error?: string;
    };
    kasbons: {
        data: Kasbon[];
        links: PaginationLink[];
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string, status?: string };
    totalPendingKasbon: number;
    totalApprovedKasbon: number;
    sumApprovedKasbonAmount: number;
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// --- STYLED COMPONENTS ---
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
    description: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, description, className }) => (
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


interface TagProps {
    status: 'belum ACC' | 'diterima' | 'ditolak';
}

const StatusTag: React.FC<TagProps> = ({ status }) => {
    const statusMap = {
        'diterima': { text: 'Disetujui', className: 'bg-green-100 text-green-800' },
        'belum ACC': { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
        'ditolak': { text: 'Ditolak', className: 'bg-red-100 text-red-800' },
    };
    const currentStatus = statusMap[status] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    return (
        <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center', currentStatus.className)}>
            {currentStatus.text}
        </span>
    );
};


// --- MAIN COMPONENT ---
export default function KasbonIndex({ kasbons, flash, filter, totalPendingKasbon, totalApprovedKasbon, sumApprovedKasbonAmount }: PageProps) {
    const { delete: destroy, processing } = useForm();
    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [activeTab, setActiveTab] = useState(filter?.status || 'all');

    // --- PERUBAHAN: State untuk mengontrol visibilitas alert ---
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setActiveTab(filter?.status || 'all');
    }, [filter]);

    useEffect(() => {
        if (flash.message) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 1500); // Alert akan hilang setelah 5 detik
            return () => clearTimeout(timer); // Membersihkan timer jika komponen unmount
        }
        if (flash.error) {
            setShowErrorAlert(true);
            const timer = setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000); // Alert akan hilang setelah 5 detik
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.get(route('kasbons.index'), { search: searchValue, status: tab }, {
            preserveState: true,
            replace: true,
            only: ['kasbons', 'filter', 'totalPendingKasbon', 'totalApprovedKasbon', 'sumApprovedKasbonAmount', 'flash'],
        });
    }

    const performSearch = () => {
        handleTabChange(activeTab);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };


    const handleDelete = (id: number, incisorName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus Kasbon untuk ${incisorName}?`)) {
            destroy(route('kasbons.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const renderPagination = (pagination: PageProps['kasbons']) => (
        <div className="flex justify-between items-center px-6 py-3">
             <span className="text-sm text-muted-foreground">
                Total {pagination.meta?.total || 0} Data
            </span>
            <div className="flex items-center space-x-1">
                {pagination.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ? `${link.url}&status=${activeTab}` : '#'}
                        className={cn(
                            'px-3 py-1.5 text-sm rounded-md transition-colors',
                            link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                            !link.url && 'text-muted-foreground cursor-not-allowed'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveState
                        preserveScroll
                    />
                ))}
            </div>
        </div>
    );

    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Pending' },
        { key: 'approved', label: 'Disetujui' },
        { key: 'rejected', label: 'Ditolak' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Data Kasbon" />
                <div className="space-y-6 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Heading title="Dashboard Kasbon" description="Analitik dan manajemen data kasbon." />
                         <div className="flex items-center gap-3">
                            {can('kasbons.create') && (
                                // kasbon penoreh
                                <Link href={route('kasbons.create')}>
                                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow">
                                        <CirclePlus className="w-4 h-4 mr-2" /> Buat Kasbon Penoreh
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

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard icon={Clock} title="Kasbon Pending" value={totalPendingKasbon} description="Menunggu persetujuan" className="bg-gradient-to-br from-yellow-400 to-orange-500"/>
                        <StatCard icon={CheckCircle2} title="Kasbon Disetujui" value={totalApprovedKasbon} description="Telah diproses" className="bg-gradient-to-br from-green-400 to-cyan-500"/>
                        <StatCard icon={Wallet} title="Total Dana" value={formatCurrency(sumApprovedKasbonAmount)} description="Jumlah dana disetujui" className="bg-gradient-to-br from-sky-400 to-blue-500"/>
                    </div>

                    <div className="px-6 py-4 space-y-2">
                        {showSuccessAlert && flash.message && (
                            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                                <Megaphone className="h-4 w-4 text-green-600" />
                                <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}
                        {showErrorAlert && flash.error && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Gagal!</AlertTitle>
                                <AlertDescription>{flash.error}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Main Content Card */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Tabs */}
                                <div className="flex items-center border-b">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => handleTabChange(tab.key)}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium transition-colors -mb-px",
                                                activeTab === tab.key
                                                    ? "border-b-2 border-primary text-primary"
                                                    : "text-muted-foreground hover:text-primary border-b-2 border-transparent"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                {/* Search */}
                                <div className='relative sm:w-1/3'>
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Cari berdasarkan nama atau kode..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* --- Blok untuk menampilkan Alert --- */}
                            
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-100 dark:bg-gray-600 hover:bg-slate-100">
                                            <TableHead className="pl-6">Penoreh</TableHead>
                                            <TableHead>Tanggal Pengajuan</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Jumlah</TableHead>
                                            <TableHead className="text-center pr-6">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kasbons.data.length > 0 ? (
                                            kasbons.data.map((kasbon) => (
                                                <TableRow key={kasbon.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="pl-6 font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                                {kasbon.incisor_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <span>{kasbon.incisor_name}</span>
                                                                <p className="text-xs text-muted-foreground">{kasbon.incisor_no_invoice}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">{new Date(kasbon.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                                                    <TableCell>
                                                        <StatusTag status={kasbon.status === 'Pending' ? 'belum ACC' : (kasbon.status === 'Approved' ? 'diterima' : 'ditolak')} />
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">{formatCurrency(kasbon.kasbon)}</TableCell>
                                                    <TableCell className="text-center pr-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {can('kasbons.view') && <DropdownMenuItem onSelect={() => router.get(route('kasbons.show', kasbon.id))}>Lihat Detail</DropdownMenuItem>}
                                                                {can('kasbons.edit') && <DropdownMenuItem onSelect={() => router.get(route('kasbons.edit', kasbon.id))}>Edit</DropdownMenuItem>}
                                                                {can('kasbons.delete') && <DropdownMenuItem onSelect={() => handleDelete(kasbon.id, kasbon.incisor_name)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Hapus</DropdownMenuItem>}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                                    <p className="font-semibold">Data Tidak Ditemukan</p>
                                                    <p className="text-sm">Tidak ada data kasbon yang cocok dengan filter Anda.</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        {kasbons.data.length > 0 && kasbons.meta && renderPagination(kasbons)}
                    </Card>
                </div>
            </AppLayout>
        </div>
    );
}
