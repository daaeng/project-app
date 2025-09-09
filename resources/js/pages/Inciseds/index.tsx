import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Search, Trash, XCircle } from 'lucide-react';
import { can } from '@/lib/can';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaSeedling, FaUserFriends } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: route('inciseds.index'),
    },
];

interface Incised {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    lok_kebun: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    incisor_name: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash?: { 
        message?: string;
        error?: string;
    };
    inciseds: {
        data: Incised[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string; time_period?: string; month?: string; year?: string; per_page?: string; };
    totalKebunA: number;
    totalKebunB: number;
    mostProductiveIncisor?: { // Jadikan opsional
        name: string;
        total_qty_kg: number;
    };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    subtitle: string;
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div className={`p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${gradient} text-white`}>
        <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Icon className="text-blue-500 text-xl" />
            </div>
            <div>
                <h4 className="text-sm font-medium">{title}</h4>
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-xs opacity-90">{subtitle}</p>
            </div>
        </div>
    </div>
);


export default function Admin({ inciseds, flash, filter, totalKebunA, totalKebunB, mostProductiveIncisor } : PageProps) {
    const { processing, delete: destroy } = useForm();

    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');
    
    const currentYear = new Date().getFullYear();
    const [specificMonth, setSpecificMonth] = useState(filter?.month || (new Date().getMonth() + 1).toString());
    const [specificYear, setSpecificYear] = useState(filter?.year || currentYear.toString());
    const [perPage, setPerPage] = useState(filter?.per_page || '10');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'this-month');
        setSpecificMonth(filter?.month || (new Date().getMonth() + 1).toString());
        setSpecificYear(filter?.year || currentYear.toString());
        setPerPage(filter?.per_page || '10');
    }, [filter]);

    useEffect(() => {
        if (flash?.message) {
            setShowSuccessAlert(true);
            const timer = setTimeout(() => setShowSuccessAlert(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setShowErrorAlert(true);
            const timer = setTimeout(() => setShowErrorAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const applyFilters = (params: { search: string; time_period: string; month?: string; year?: string; per_page: string }) => {
        const queryParams: any = {
            search: params.search,
            time_period: params.time_period,
            per_page: params.per_page,
        };

        if (params.time_period === 'specific-month' && params.month && params.year) {
            queryParams.month = params.month;
            queryParams.year = params.year;
        }

        router.get(route('inciseds.index'), queryParams, {
            preserveState: true,
            replace: true,
            only: ['inciseds', 'filter', 'totalKebunA', 'totalKebunB', 'mostProductiveIncisor'],
        });
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        if (value !== 'specific-month') {
            applyFilters({ search: searchValue, time_period: value, per_page: perPage });
        }
    };

    const handlePerPageChange = (value: string) => {
        setPerPage(value);
        applyFilters({ search: searchValue, time_period: timePeriod, month: specificMonth, year: specificYear, per_page: value });
    };
    
    const performSearch = () => {
        applyFilters({ search: searchValue, time_period: timePeriod, month: specificMonth, year: specificYear, per_page: perPage });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data: ${product}?`)) {
            destroy(route('inciseds.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    performSearch();
                },
            });
        }
    };
    
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));
    const yearOptions = Array.from({ length: 10 }, (_, i) => ({ value: (currentYear - i).toString(), label: (currentYear - i).toString() }));


    const renderPagination = (pagination: PageProps['inciseds']) => {
        if (perPage === 'all' || !pagination || !pagination.meta || pagination.meta.last_page <= 1) {
            return null; // Jangan render apa-apa jika tidak perlu paginasi
        }
    
        return (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Menampilkan {pagination.meta.from} - {pagination.meta.to} dari {pagination.meta.total} data
                </span>
                <div className="flex items-center gap-2">
                    {pagination.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveState 
                            replace
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                                ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                            `}
                        >
                           <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Penorehan" />

            {can('incised.view') && (
                <>
                    <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                        <Heading title="Data Harian Penoreh" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <StatCard
                                icon={FaSeedling}
                                title="Total Karet Temadu"
                                value={`${totalKebunA} kg`}
                                subtitle="Total Kuantitas Karet"
                                gradient="from-green-400 to-green-600"
                            />
                            <StatCard
                                icon={FaSeedling}
                                title="Total Karet Sebayar"
                                value={`${totalKebunB} kg`}
                                subtitle="Total Kuantitas Karet"
                                gradient="from-blue-400 to-blue-600"
                            />
                            <StatCard
                                icon={FaUserFriends}
                                title="Penoreh Paling Produktif"
                                value={mostProductiveIncisor?.name || 'N/A'}
                                subtitle={`Total ${(mostProductiveIncisor?.total_qty_kg || 0).toFixed(2)} kg`}
                                gradient="from-purple-400 to-purple-600"
                            />
                        </div>

                        <div className="border h-auto p-3 rounded-lg">
                            <div className="w-full mb-2 justify-end h-auto flex gap-2">
                                {can('incised.create') && (
                                    <Link href={route('inciseds.create')}>
                                        <Button className="bg-blue-600 w-auto hover:bg-blue-500 text-white">
                                            <CirclePlus className="w-4 h-4 mr-2" />
                                            Tambah Data
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <div>
                                { (showSuccessAlert && flash?.message) && (
                                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                                        <Megaphone className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                                        <AlertDescription>{flash.message}</AlertDescription>
                                    </Alert>
                                )}
                                { (showErrorAlert && flash?.error) && (
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertTitle className="font-semibold">Gagal!</AlertTitle>
                                        <AlertDescription>{flash.error}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:flex-wrap'>
                                <div className='relative flex-1 min-w-[250px]'>
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Cari Produk, Invoice, Kebun..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-10"
                                    />
                                </div>
                                
                                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Pilih Periode Waktu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-time">Sepanjang Waktu</SelectItem>
                                        <SelectItem value="today">Hari Ini</SelectItem>
                                        <SelectItem value="this-week">Minggu Ini</SelectItem>
                                        <SelectItem value="this-month">Bulan Ini</SelectItem>
                                        <SelectItem value="last-month">Bulan Lalu</SelectItem>
                                        <SelectItem value="this-year">Tahun Ini</SelectItem>
                                        <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                                    </SelectContent>
                                </Select>

                                {timePeriod === 'specific-month' && (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Select value={specificMonth} onValueChange={setSpecificMonth}>
                                            <SelectTrigger className="w-full sm:w-[150px]">
                                                <SelectValue placeholder="Pilih Bulan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select value={specificYear} onValueChange={setSpecificYear}>
                                            <SelectTrigger className="w-full sm:w-[120px]">
                                                <SelectValue placeholder="Pilih Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {yearOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <Button onClick={performSearch}>
                                    <Search className="h-4 w-4 mr-2" /> Terapkan
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-gray-700">Tampilkan:</span>
                                <Select value={perPage} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                        <SelectItem value="all">Semua</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-gray-700">data per halaman</span>
                            </div>

                            <CardContent className="border rounded-lg mt-4 p-0">
                                <div className="rounded-md overflow-x-auto">
                                    {inciseds && inciseds.data.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Tanggal</TableHead>
                                                    <TableHead>Kode/Penoreh</TableHead>
                                                    <TableHead>Kebun</TableHead>
                                                    <TableHead>Keping</TableHead>
                                                    <TableHead>Qty (kg)</TableHead>
                                                    <TableHead>Total Harga</TableHead>
                                                    <TableHead className="text-center">ACTION</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {inciseds.data.map((incised) => (
                                                    <TableRow key={incised.id}>
                                                        <TableCell>{incised.product}</TableCell>
                                                        <TableCell>{new Date(incised.date).toLocaleDateString('id-ID')}</TableCell>
                                                        <TableCell>
                                                            {incised.no_invoice} - {incised.incisor_name || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{incised.lok_kebun}</TableCell>
                                                        <TableCell>{incised.keping}</TableCell>
                                                        <TableCell>{incised.qty_kg}</TableCell>
                                                        <TableCell>{formatCurrency(incised.amount)}</TableCell>
                                                        <TableCell className="text-center space-x-2">
                                                            {can('incised.view') && (
                                                                <Link href={route('inciseds.show', incised.id)}>
                                                                    <Button size="icon" variant="ghost"><Eye className="h-4 w-4 text-gray-500" /></Button>
                                                                </Link>
                                                            )}
                                                            {can('incised.edit') && (
                                                                <Link href={route('inciseds.edit', incised.id)}>
                                                                    <Button size="icon" variant="ghost"><Pencil className="h-4 w-4 text-blue-500" /></Button>
                                                                </Link>
                                                            )}
                                                            {can('incised.delete') && (
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    disabled={processing}
                                                                    onClick={() => handleDelete(incised.id, incised.product)}
                                                                >
                                                                    <Trash className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Tidak ada data yang ditemukan untuk periode yang dipilih.
                                        </div>
                                    )}
                                </div>
                                {inciseds && inciseds.data.length > 0 && renderPagination(inciseds)}
                            </CardContent>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}

