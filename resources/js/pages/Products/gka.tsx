import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    CirclePlus,
    Coins,
    Eye,
    Hand,
    Megaphone,
    Package,
    Pencil,
    Search,
    Sprout,
    Trash,
    Undo2,
    Warehouse,
    CalendarDays,
    Filter,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { can } from '@/lib/can';
import { useState, useEffect, useMemo } from 'react';

// --- [BARU] Import Recharts untuk Grafik ---
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
];

// --- Interface & Tipe Data ---
interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
    susut_value?: number;
    tgl_kirim: string;
    tgl_sampai: string;
    qty_sampai: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// --- [BARU] Interface untuk data chart ---
interface ChartDataPoint {
    name: string;
    Produksi: number;
    Penjualan: number;
}

interface PageProps {
    flash: { message?: string };
    products: {
        data: Product[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    products2: PageProps['products'];
    products3: PageProps['products'];
    products4: PageProps['products'];
    products5: PageProps['products'];
    products6: PageProps['products'];
    keping_in: number;
    keping_out: number;
    saldoin: number;
    saldoout: number;
    tm_slin: number;
    tm_slou: number;
    tm_sin: number;
    tm_sou: number;
    s_ready: number;

    ppk_slin: number;
    ppk_slou: number;
    ppk_sin: number;
    ppk_sou: number;
    p_ready: number;

    klp_slin: number;
    klp_slou: number;
    klp_sin: number;
    klp_sou: number;
    klp_ready: number;

    dataSusut: number;
    tm_sampai: number;

    // --- [BARU] Prop Chart Data ---
    chartData: ChartDataPoint[];

    filter?: {
        search?: string;
        time_period?: string;
        product_type?: string;
        month?: string;
        year?: string;
    };
    currentMonth: number;
    currentYear: number;
    auth?: any;
}

// --- Helper Formatting ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const formatKg = (value: number) => {
    if (!value) return '0 Kg';
    return new Intl.NumberFormat('id-ID').format(value) + ' Kg';
};

const formatShortDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
};

export default function GkaPage({
    flash,
    products,
    products2,
    products3,
    products4,
    products5,
    products6,
    tm_slin,
    tm_slou,
    tm_sin,
    tm_sou,
    filter,
    s_ready,
    keping_in,
    keping_out,
    ppk_slin,
    ppk_slou,
    ppk_sin,
    ppk_sou,
    p_ready,
    dataSusut,
    klp_slin,
    klp_slou,
    klp_sin,
    klp_sou,
    klp_ready,
    currentMonth,
    currentYear,
    tm_sampai,
    chartData, // --- [BARU] Destructure chartData
}: PageProps) {
    const [searchValue, setSearchValue] = useState(filter?.search || '');

    const [timePeriod, setTimePeriod] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('time_period')) {
            return urlParams.get('time_period') || 'all-time';
        }
        return filter?.time_period || 'all-time';
    });

    const [selectedMonth, setSelectedMonth] = useState<string>(
        String(currentMonth),
    );
    const [selectedYear, setSelectedYear] = useState<string>(
        String(currentYear),
    );
    const [productType, setProductType] = useState(
        filter?.product_type || 'all',
    );

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'all-time');
        setSelectedMonth(String(filter?.month || currentMonth));
        setSelectedYear(String(filter?.year || currentYear));
        setProductType(filter?.product_type || 'all');
    }, [
        filter?.search,
        filter?.time_period,
        filter?.month,
        filter?.year,
        currentMonth,
        currentYear,
        filter?.product_type,
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        const params: any = {
            search: searchValue,
            time_period: value,
            product_type: productType,
        };

        if (value === 'specific-month') {
            const current = new Date();
            params.month = String(current.getMonth() + 1);
            params.year = String(current.getFullYear());
            setSelectedMonth(params.month);
            setSelectedYear(params.year);
        } else {
            setSelectedMonth(String(new Date().getMonth() + 1));
            setSelectedYear(String(new Date().getFullYear()));
        }

        router.get(route('products.gka'), params, {
            preserveState: true,
            replace: true,
            only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear', 'tm_sampai', 'chartData'],
        });
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        performSearch(value, selectedYear);
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        performSearch(selectedMonth, value);
    };

    const handleProductTypeChange = (value: string) => {
        setProductType(value);
        router.get(
            route('products.gka'),
            {
                search: searchValue,
                time_period: timePeriod,
                product_type: value,
                month: selectedMonth,
                year: selectedYear,
            },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear', 'tm_sampai', 'chartData'],
            },
        );
    };

    const performSearch = (monthOverride?: string, yearOverride?: string) => {
        router.get(
            route('products.gka'),
            {
                search: searchValue,
                time_period: timePeriod,
                product_type: productType,
                month: monthOverride || selectedMonth,
                year: yearOverride || selectedYear,
            },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear', 'tm_sampai', 'chartData'],
            },
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Apakah Anda ingin menghapus ini - ${id}. ${product}?`)) {
            router.delete(route('products.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => performSearch(),
            });
        }
    };

    const getProductBadge = (type: string) => {
        switch (type) {
            case 'Karet':
                return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Karet</Badge>;
            case 'Pupuk':
                return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Pupuk</Badge>;
            case 'Kelapa':
                return <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-100">Kelapa</Badge>;
            default:
                return <Badge variant="secondary">{type}</Badge>;
        }
    };

    const renderPagination = (pagination: PageProps['products'], pageParamName: string = 'page') => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => {
                     let url: URL | null = null;
                     try { if (link.url) url = new URL(link.url); } catch (e) { return null; }
                     
                     const currentParams = url ? new URLSearchParams(url.search) : new URLSearchParams();
                     currentParams.set(pageParamName, currentParams.get('page') || currentParams.get('page2') || link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));
                     if (searchValue) currentParams.set('search', searchValue);
                     if (timePeriod) currentParams.set('time_period', timePeriod);
                     if (productType) currentParams.set('product_type', productType);
                     if (timePeriod === 'specific-month') {
                         currentParams.set('month', selectedMonth);
                         currentParams.set('year', selectedYear);
                     }

                    return !link.url ? (
                        <div key={index} className="px-4 py-2 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <Link
                            key={`link-${index}`}
                            href={`${url!.origin}${url!.pathname}?${currentParams.toString()}`}
                            className={`px-4 py-2 text-sm rounded-md transition ${link.active ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300'}`}
                            preserveState preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    );
                })}
            </div>
        );
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
    }));

    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => ({
        value: String(currentYearNum - 5 + i),
        label: String(currentYearNum - 5 + i),
    }));

    const filteredProductsIn = useMemo(() => {
        if (productType === 'all') {
            const combined = [
                ...products.data.map((p) => ({ ...p, product_type_display: 'Karet' })),
                ...products3.data.map((p) => ({ ...p, product_type_display: 'Pupuk' })),
                ...products5.data.map((p) => ({ ...p, product_type_display: 'Kelapa' })),
            ];
            return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (productType === 'karet') return products.data.map((p) => ({ ...p, product_type_display: 'Karet' }));
        else if (productType === 'pupuk') return products3.data.map((p) => ({ ...p, product_type_display: 'Pupuk' }));
        else if (productType === 'kelapa') return products5.data.map((p) => ({ ...p, product_type_display: 'Kelapa' }));
        return [];
    }, [productType, products.data, products3.data, products5.data]);

    const filteredProductsOut = useMemo(() => {
        if (productType === 'all') {
            const combined = [
                ...products2.data.map((p) => ({ ...p, product_type_display: 'Karet' })),
                ...products4.data.map((p) => ({ ...p, product_type_display: 'Pupuk' })),
                ...products6.data.map((p) => ({ ...p, product_type_display: 'Kelapa' })),
            ];
            return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (productType === 'karet') return products2.data.map((p) => ({ ...p, product_type_display: 'Karet' }));
        else if (productType === 'pupuk') return products4.data.map((p) => ({ ...p, product_type_display: 'Pupuk' }));
        else if (productType === 'kelapa') return products6.data.map((p) => ({ ...p, product_type_display: 'Kelapa' }));
        return [];
    }, [productType, products2.data, products4.data, products6.data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PT. Garuda Karya Amanat" />
            <div className="h-full flex-col rounded-xl p-4 space-y-6 bg-gray-50 dark:bg-black">
                {/* Header Utama */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <Heading title="PT. Garuda Karya Amanat" />
                        <p className="text-muted-foreground text-sm">Dashboard ringkasan produk dan stok.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('products.index')}><Button variant="outline"><Undo2 className="w-4 h-4 mr-2" /> Kembali</Button></Link>
                        {can('products.create') && <Link href={route('products.c_send')}><Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"><Building2 size={18} className="mr-2" /> Kirim Barang</Button></Link>}
                        <Link href={route('products.create')}><Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg"><CirclePlus size={18} className="mr-2" /> Tambah Produk</Button></Link>
                    </div>
                </div>

                {/* Alert */}
                {flash?.message && (
                    <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200">
                        <Megaphone className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Pemberitahuan</AlertTitle>
                        <AlertDescription className="text-green-600">{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Grid Kartu Statistik Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Pendapatan Karet</CardTitle>
                            <Coins className="w-5 h-5 text-blue-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(tm_slou)}</div>
                            <p className="text-xs text-blue-200">Total hasil penjualan</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">Produksi Karet (Gudang)</CardTitle>
                            <Warehouse className="w-5 h-5 text-orange-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatKg(tm_sin)}</div>
                            <p className="text-xs text-orange-200">Total Karet masuk GKA</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-100">Karet Terjual (Diterima)</CardTitle>
                            <Building2 className="w-5 h-5 text-green-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatKg(tm_sampai)}</div>
                            <p className="text-xs text-green-200">Total Karet diterima buyer</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-100">Total Susut</CardTitle>
                            <Package className="w-5 h-5 text-red-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatKg(dataSusut)}</div>
                            <p className="text-xs text-red-200">(Qty Jual - Qty Sampai)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* === [BAGIAN BARU] CHART VISUALIZATION === */}
                <div className="grid grid-cols-1 gap-4">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Statistik Produksi vs Penjualan Karet ({selectedYear})</CardTitle>
                            <CardDescription>Grafik perbandingan total produksi (masuk) dan penjualan (keluar) per bulan.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                                    <Tooltip 
                                        formatter={(value: number) => [`${new Intl.NumberFormat('id-ID').format(value)} Kg`, '']}
                                        labelStyle={{ color: 'black' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Produksi" fill="#f59e0b" name="Produksi (Masuk)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Penjualan" fill="#10b981" name="Penjualan (Keluar)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                {/* === [SELESAI BAGIAN CHART] === */}

                {/* Grid Saldo Stok */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Stok Karet</CardTitle>
                            <Sprout className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatKg(s_ready)}</div>
                            <p className="text-xs text-muted-foreground">(Produksi - Jual)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Stok Pupuk</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatKg(p_ready)}</div>
                             <p className="text-xs text-muted-foreground">(Beli - Jual)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Stok Kelapa</CardTitle>
                            <Hand className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatKg(klp_ready)}</div>
                             <p className="text-xs text-muted-foreground">(Beli - Jual)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Kartu Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Data</CardTitle>
                        <CardDescription>Cari atau filter data berdasarkan kriteria di bawah ini.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                            <div className="relative flex-grow">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input placeholder="Cari berdasarkan supplier, invoice, item..." value={searchValue} onChange={handleInputChange} onKeyPress={handleKeyPress} className="pl-10" />
                            </div>
                            <Select value={productType} onValueChange={handleProductTypeChange}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className='flex items-center gap-2'><Filter className='w-4 h-4' /><SelectValue placeholder="Pilih Jenis Produk" /></div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Produk</SelectItem>
                                    <SelectItem value="karet">Karet</SelectItem>
                                    <SelectItem value="kelapa">Kelapa</SelectItem>
                                    <SelectItem value="pupuk">Pupuk</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <div className='flex items-center gap-2'><CalendarDays className='w-4 h-4' /><SelectValue placeholder="Pilih Periode Waktu" /></div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-time">Semua Waktu</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="this-week">Minggu Ini</SelectItem>
                                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                                    <SelectItem value="last-month">Bulan Lalu</SelectItem>
                                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                                    <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                                </SelectContent>
                            </Select>

                            {timePeriod === 'specific-month' && (
                                <>
                                    <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                        <SelectTrigger className="w-full md:w-[140px]"><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
                                        <SelectContent>{months.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <Select value={selectedYear} onValueChange={handleYearChange}>
                                        <SelectTrigger className="w-full md:w-[100px]"><SelectValue placeholder="Pilih Tahun" /></SelectTrigger>
                                        <SelectContent>{years.map((y) => (<SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                </>
                            )}
                             <Button onClick={() => performSearch()} className="w-full md:w-auto"><Search className="h-4 w-4 mr-2" /> Cari</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabel (Karet/All) */}
                {(productType === 'all' || productType === 'karet') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Data Pembelian {productType === 'all' ? 'Semua Produk' : 'Karet'}</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                {productType === 'all' && <TableHead>Jenis</TableHead>}
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Keping</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Outcome</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProductsIn.length > 0 ? (
                                                filteredProductsIn.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        {productType === 'all' && <TableCell>{getProductBadge(product.product_type_display)}</TableCell>}
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.keping_out}</TableCell>
                                                        <TableCell>{formatKg(product.qty_out)}</TableCell>
                                                        <TableCell className="font-medium text-red-600">{formatCurrency(product.amount_out)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={productType === 'all' ? 7 : 6} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products.data.length > 0 && renderPagination(products)}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Data Penjualan {productType === 'all' ? 'Semua Produk' : 'Karet'}</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tgl. Nota</TableHead>
                                                {productType === 'all' && <TableHead>Jenis</TableHead>}
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Qty Jual</TableHead>
                                                <TableHead>Income</TableHead>
                                                <TableHead>Tgl. Kirim</TableHead>
                                                <TableHead>Tgl. Sampai</TableHead>
                                                <TableHead>Qty Sampai</TableHead>
                                                <TableHead>Susut</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProductsOut.length > 0 ? (
                                                filteredProductsOut.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        {productType === 'all' && <TableCell>{getProductBadge(product.product_type_display)}</TableCell>}
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{formatKg(product.qty_out)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatCurrency(product.amount_out)}</TableCell>
                                                        <TableCell>{formatShortDate(product.tgl_kirim)}</TableCell>
                                                        <TableCell>{formatShortDate(product.tgl_sampai)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatKg(product.qty_sampai)}</TableCell>
                                                        <TableCell className="font-medium text-orange-600">{formatKg(product.susut_value || 0)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.edit') && (<Link href={route('products.edit_out', product.id)}><Button variant="ghost" size="icon"><Pencil className="w-4 h-4 text-blue-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={productType === 'all' ? 10 : 9} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products2.data.length > 0 && renderPagination(products2)}
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                {/* Tabel Pupuk */}
                {productType === 'pupuk' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Data Pembelian Pupuk</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Outcome</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products3.data.length > 0 ? (
                                                products3.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{formatKg(product.qty_kg)}</TableCell>
                                                        <TableCell className="font-medium text-red-600">{formatCurrency(product.amount)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={6} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products3.data.length > 0 && renderPagination(products3)}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Data Penjualan Pupuk</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tgl. Nota</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty Jual</TableHead>
                                                <TableHead>Income</TableHead>
                                                <TableHead>Tgl. Kirim</TableHead>
                                                <TableHead>Tgl. Sampai</TableHead>
                                                <TableHead>Qty Sampai</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products4.data.length > 0 ? (
                                                products4.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{formatKg(product.qty_out)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatCurrency(product.amount_out)}</TableCell>
                                                        <TableCell>{formatShortDate(product.tgl_kirim)}</TableCell>
                                                        <TableCell>{formatShortDate(product.tgl_sampai)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatKg(product.qty_sampai)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.edit') && (<Link href={route('products.edit_out', product.id)}><Button variant="ghost" size="icon"><Pencil className="w-4 h-4 text-blue-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={9} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products4.data.length > 0 && renderPagination(products4)}
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                {/* Tabel Kelapa */}
                {productType === 'kelapa' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Data Pembelian Kelapa</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Outcome</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products5.data.length > 0 ? (
                                                products5.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{formatKg(product.qty_kg)}</TableCell>
                                                        <TableCell className="font-medium text-red-600">{formatCurrency(product.amount)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={6} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products5.data.length > 0 && renderPagination(products5)}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Data Penjualan Kelapa</CardTitle></CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tgl. Nota</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Barang</TableHead>
                                                <TableHead>Qty Jual</TableHead>
                                                <TableHead>Income</TableHead>
                                                <TableHead>Tgl. Sampai</TableHead>
                                                <TableHead>Qty Sampai</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products6.data.length > 0 ? (
                                                products6.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>{formatShortDate(product.date)}</TableCell>
                                                        <TableCell>{product.nm_supplier}</TableCell>
                                                        <TableCell>{product.j_brg}</TableCell>
                                                        <TableCell>{formatKg(product.qty_out)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatCurrency(product.amount_out)}</TableCell>
                                                        <TableCell>{formatShortDate(product.tgl_sampai)}</TableCell>
                                                        <TableCell className="font-medium text-green-600">{formatKg(product.qty_sampai)}</TableCell>
                                                        <TableCell className="text-center space-x-1">
                                                            {can('products.view') && (<Link href={route('products.show', product.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>)}
                                                            {can('roles.edit') && (<Link href={route('products.edit_out', product.id)}><Button variant="ghost" size="icon"><Pencil className="w-4 h-4 text-blue-500" /></Button></Link>)}
                                                            {can('roles.delete') && (<Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.product)}><Trash className="w-4 h-4 text-red-500" /></Button>)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow><TableCell colSpan={9} className="h-24 text-center">Tidak ada hasil ditemukan.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products6.data.length > 0 && renderPagination(products6)}
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}