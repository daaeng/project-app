import { useState, useEffect } from 'react';
import Heading from '../../components/heading';
import AppLayout from '../../layouts/app-layout';
import { can } from '../../lib/can';
import { type BreadcrumbItem } from '@/types';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Head, Link, router } from '@inertiajs/react';
import { Building2, CirclePlus, Eye, Landmark, Package, Pencil, Search, Sprout, Trash, Trees, TrendingUp, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
    { title: 'Temadu Sebayar Agro', href: '/products/tsa' },
];

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
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
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
    products2: {
        data: Product[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    keping_sbyr: number;
    keping_sbyr2: number;
    keping_tmd: number;
    keping_tmd2: number;
    keping_out: number;
    keping_in: number;
    hsl_karet: number;
    saldoin: number;
    saldoout: number;
    tm_slin: number;
    tm_slou: number;
    tm_sin: number;
    tm_sou: number;
    ts_slin: number;
    ts_slou: number;
    ts_sin: number;
    ts_sou: number;
    hsl_jual: number;
    filter?: { search?: string; time_period?: string; month?: string; year?: string }; // Added month and year
    currentMonth: number; // New prop
    currentYear: number;   // New prop
    auth?: any;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function TsaPage({
    flash, products, products2, hsl_karet, saldoin, saldoout, keping_in, keping_out, keping_sbyr, keping_sbyr2, keping_tmd, keping_tmd2, 
    tm_slin, tm_slou, tm_sin, tm_sou, ts_slin, ts_slou, ts_sin, ts_sou, filter, hsl_jual, currentMonth, currentYear
}: PageProps) {
    // Pastikan searchValue selalu string, bahkan jika filter.search null/undefined
    const [searchValue, setSearchValue] = useState(filter?.search || '');
    
    // Improved useState initialization for timePeriod
    const [timePeriod, setTimePeriod] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Prioritize 'time_period' parameter from URL if present
        if (urlParams.has('time_period')) {
            return urlParams.get('time_period') || 'this-month'; // Fallback if parameter in URL is empty
        }

        // If no 'time_period' parameter in URL,
        // and the filter prop from the backend is 'all-time' (possibly due to Inertia state persistence),
        // then force 'this-month' for the initial display.
        if (filter?.time_period === 'all-time') {
            return 'this-month';
        }
        
        // If no parameter in URL and filter prop is not 'all-time',
        // use the value from the filter prop (which should be 'this-month' from PHP default)
        // or fallback to 'this-month' if filter.time_period is undefined/null.
        return filter?.time_period || 'this-month';
    });

    const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    useEffect(() => {
        setSearchValue(filter?.search || '');
        // This will handle subsequent updates if filter.time_period changes from the server.
        // It's important to maintain synchronization after the initial render.
        setTimePeriod(filter?.time_period || 'this-month'); 
        setSelectedMonth(String(filter?.month || currentMonth)); // Sync month from props
        setSelectedYear(String(filter?.year || currentYear));   // Sync year from props
    }, [filter?.search, filter?.time_period, filter?.month, filter?.year, currentMonth, currentYear]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        const params: { search: string; time_period: string; month?: string; year?: string } = {
            search: searchValue,
            time_period: value
        };

        if (value === 'specific-month') {
            const current = new Date();
            params.month = String(current.getMonth() + 1);
            params.year = String(current.getFullYear());
            setSelectedMonth(params.month);
            setSelectedYear(params.year);
        } else {
            // Clear month and year if not 'specific-month'
            setSelectedMonth(String(new Date().getMonth() + 1));
            setSelectedYear(String(new Date().getFullYear()));
        }

        router.get(route('products.tsa'),
            params,
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'keping_sbyr', 'keping_sbyr2', 'keping_tmd', 'keping_tmd2', 'keping_out', 'keping_in', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou', 'hsl_jual'], // Include all stats
            }
        );
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        router.get(route('products.tsa'),
            { search: searchValue, time_period: timePeriod, month: value, year: selectedYear },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'keping_sbyr', 'keping_sbyr2', 'keping_tmd', 'keping_tmd2', 'keping_out', 'keping_in', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou', 'hsl_jual'],
            }
        );
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        router.get(route('products.tsa'),
            { search: searchValue, time_period: timePeriod, month: selectedMonth, year: value },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'keping_sbyr', 'keping_sbyr2', 'keping_tmd', 'keping_tmd2', 'keping_out', 'keping_in', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou', 'hsl_jual'],
            }
        );
    };

    const performSearch = () => {
        router.get(route('products.tsa'),
            { search: searchValue, time_period: timePeriod, month: selectedMonth, year: selectedYear }, // Include month and year in the search
            {
                preserveState: true,
                replace: true,
                only: ['products', 'products2', 'filter', 'hsl_karet', 'saldoin', 'keping_sbyr', 'keping_sbyr2', 'keping_tmd', 'keping_tmd2', 'keping_out', 'keping_in', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 'ts_slin', 'ts_slou', 'ts_sin', 'ts_sou', 'hsl_jual'], // Include all stats
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Do you want to delete this - ${id}. ${product}`)) {
            router.delete(route('products.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.get(route('products.tsa'), { search: searchValue, time_period: timePeriod, month: selectedMonth, year: selectedYear }, { preserveState: true }); // Preserve time_period, month, year after delete
                },
            });
        }
    };

    const renderPagination = (pagination: PageProps['products'], pageParamName: string = 'page') => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => {
                    // Periksa apakah link.url ada dan valid sebelum membuat objek URL
                    let url: URL | null = null;
                    try {
                        if (link.url) {
                            url = new URL(link.url);
                        }
                    } catch (e) {
                        console.error("Invalid URL encountered:", link.url, e);
                        // Jika URL tidak valid, kita bisa memilih untuk tidak merender link ini atau merender sebagai teks biasa
                        return (
                            <div
                                key={index}
                                className="px-4 py-2 text-sm text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    const currentParams = url ? new URLSearchParams(url.search) : new URLSearchParams();
                    
                    // Set the correct page parameter name
                    currentParams.set(pageParamName, currentParams.get('page') || currentParams.get('page2') || link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));

                    // Append existing filters
                    if (searchValue) currentParams.set('search', searchValue);
                    if (timePeriod !== 'all-time') currentParams.set('time_period', timePeriod);
                    if (timePeriod === 'specific-month' && selectedMonth) currentParams.set('month', selectedMonth);
                    if (timePeriod === 'specific-month' && selectedYear) currentParams.set('year', selectedYear);

                    return link.url === null || !url ? ( // Tambahkan !url check di sini
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={`link-${index}`}
                            href={`${url.origin}${url.pathname}?${currentParams.toString()}`}
                            className={`px-4 py-2 text-sm rounded-md transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveState
                            preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    );
                })}
            </div>
        );
    };

    // Generate options for months (1-12)
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
    }));

    // Generate options for years (e.g., current year - 5 to current year + 1)
    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => ({
        value: String(currentYearNum - 5 + i),
        label: String(currentYearNum - 5 + i),
    }));


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Temadu Sebayar Agro" />
            <div className="h-full flex-col rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-black">
                <Heading title="Temadu Sebayar Agro" />
                <div className="mb-3">
                    <Link href={route('products.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Kartu Uang Masuk (saldoin) */}
                    <Card className="shadow-2xl border-2 border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white transition-all duration-500 rounded-2xl hover:shadow-green-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Sprout className="mr-3 text-white drop-shadow-md" size={32} /> Setor ke PT. GKA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {hsl_jual} Kg
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-green-100">
                                <div className="flex items-center font-medium">
                                    <TrendingUp size={18} className="mr-1" />
                                    <span>Stock Gudang</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total KG (hsl_karet) */}
                    <Card className="shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-400 to-blue-600 text-white transition-all duration-500 rounded-2xl hover:shadow-blue-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Package className="mr-3 text-white drop-shadow-md" size={32} /> Total KG
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {hsl_karet} kg ~ {keping_in} Keping
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-blue-100">
                                <div className="flex items-center font-medium">
                                    <Trees size={18} className="mr-1" />
                                    <span>Temadu : {tm_sin} Kg ~ {keping_tmd} Kpg</span>
                                </div>
                                <div className="flex items-center font-medium">
                                    <Trees size={18} className="mr-1" />
                                    <span>Sebayar : {ts_sin} Kg ~ {keping_sbyr} Kpg</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Keping */}
                    <Card className="shadow-2xl border-2 border-yellow-500 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white transition-all duration-500 rounded-2xl hover:shadow-yellow-500/50 hover:scale-105">
                        <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Landmark className="mr-3 text-white drop-shadow-md" size={32} /> Total Pengeluaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                                {formatCurrency(saldoin)}
                            </p>
                            <div className="flex justify-between text-sm mt-3 text-yellow-100">
                                <div className="flex items-center font-medium">
                                    <span>Temadu: {formatCurrency(tm_slin)}</span>
                                </div>
                                <div className="flex items-center font-medium">
                                    <span>Sebayar: {formatCurrency(ts_slin)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='w-full justify-center h-auto flex mb-5 gap-2'>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                            <CardHeader className="bg-blue-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Available Stock Karet</CardTitle>
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Package size={18} className="text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-blue-700">
                                <div className='grid grid-cols-2 gap-1'>
                                    <div>
                                        <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(saldoin)}</div>
                                        <div className="flex gap-2"><p className="text-green-400">keping</p>{keping_in}</div>
                                        
                                        <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(saldoout)}</div>
                                        <div className="flex gap-2"><p className="text-red-400">keping</p> {keping_out}</div>

                                    </div>
                                    <div className='grid'>
                                        <div className="text-2xl font-bold row-span-2 flex justify-end">{hsl_karet} Kg</div>
                                        <div className="text-2xl font-bold row-span-2 flex justify-end">{hsl_jual} Kg</div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                            <CardHeader className="bg-amber-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Stock Temadu</CardTitle>
                                    <div className="rounded-lg bg-amber-100 p-2">
                                        <Sprout size={18} className="text-amber-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-amber-700">
                                <div className="grid grid-cols-2">
                                    <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(tm_slin)}</div>
                                    <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(tm_slou)}</div>

                                    <div className="text-2xl w-full justify-center flex font-bold">{tm_sin} Kg</div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{tm_sou} Kg</div>
                                    
                                    <div className="text-2xl w-full justify-center flex font-bold">{keping_tmd} <p className='text-sm'>Keping</p> </div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{keping_tmd2} <p className='text-sm'>Keping</p> </div>
                                    
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                            <CardHeader className="bg-red-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Stock Sebayar</CardTitle>
                                    <div className="rounded-lg bg-red-100 p-2">
                                        <Sprout size={18} className="text-red-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-red-700">
                                <div className="grid grid-cols-2">
                                    <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(ts_slin)}</div>
                                    <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(ts_slou)}</div>

                                    <div className="text-2xl w-full justify-center flex font-bold">{ts_sin} Kg</div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{ts_sou} Kg</div>
                                    
                                    <div className="text-2xl w-full justify-center flex font-bold">{keping_sbyr} <p className='text-sm'>Keping</p> </div>
                                    <div className="text-2xl w-full justify-center flex font-bold">{keping_sbyr2} <p className='text-sm'>Keping</p> </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                
                <div className="flex space-x-3 justify-end">
                    <Link href={route('products.create')}>
                        <Button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-3">
                            <CirclePlus size={18} className="mr-2" />
                            Tambah Produk
                        </Button>
                    </Link>
                    {can('products.create') && (
                        <Link href={route('products.gka')}>
                            <Button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-3">
                                <Building2 size={18} className="mr-2" />
                                Kirim ke GKA
                            </Button>
                        </Link>
                    )}
                </div>
                
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-time">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                            <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                        </SelectContent>
                    </Select>

                    {timePeriod === 'specific-month' && (
                        <>
                            <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                <SelectTrigger className="w-full md:w-[140px] bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-700 border-gray-300 shadow-lg">
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-full md:w-[120px] bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-700 border-gray-300 shadow-lg">
                                    {years.map((year) => (
                                        <SelectItem key={year.value} value={year.value}>
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    <div className="relative w-full md:flex-grow">
                        <Input
                            type="text"
                            placeholder="Cari..."
                            value={searchValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Bagian Tabel Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tabel Data Pembelian */}
                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Data Pembelian
                            <span className="text-blue-500 ml-2">Temadu Sebayar Agro</span>
                        </h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50 text-gray-600 rounded-lg">
                                    <TableRow>
                                        <TableHead className="p-4 font-semibold">Tanggal</TableHead>
                                        <TableHead className="p-4 font-semibold">Supplier</TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Qty (kg)
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Keping
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-gray-700">
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <TableCell className="p-4">{product.date}</TableCell>
                                                <TableCell className="p-4">
                                                    {product.nm_supplier}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {product.qty_kg}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {product.keping}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {formatCurrency(product.amount)}
                                                </TableCell>
                                                <TableCell className="p-4 flex justify-center space-x-2">
                                                    <Link href={route('products.show', product.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            className="text-gray-500 hover:bg-gray-200"
                                                        >
                                                            <Eye size={18} />
                                                        </Button>
                                                    </Link>
                                                    {can('products.edit') && (
                                                        <Link href={route('products.edit', product.id)}>
                                                            <Button
                                                                variant="ghost"
                                                                className="text-blue-500 hover:bg-blue-100"
                                                            >
                                                                <Pencil size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('products.delete') && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleDelete(product.id, product.product)
                                                            }
                                                            className="text-red-500 hover:bg-red-100"
                                                        >
                                                            <Trash size={18} />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Tidak ada hasil ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {products.data.length > 0 && renderPagination(products, 'page')}
                    </div>

                    {/* Tabel Data Penjualan */}
                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Data Penjualan
                            <span className="text-blue-500 ml-2">Temadu Sebayar Agro</span>
                        </h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50 text-gray-600 rounded-lg">
                                    <TableRow>
                                        <TableHead className="p-4 font-semibold">Tanggal</TableHead>
                                        <TableHead className="p-4 font-semibold">Supplier</TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Qty (kg)
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Keping
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-right">
                                            Total
                                        </TableHead>
                                        <TableHead className="p-4 font-semibold text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-gray-700">
                                    {products2.data.length > 0 ? (
                                        products2.data.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <TableCell className="p-4">{product.date}</TableCell>
                                                <TableCell className="p-4">
                                                    {product.nm_supplier}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {product.qty_out}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {product.keping_out}
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    {formatCurrency(product.amount_out)}
                                                </TableCell>
                                                <TableCell className="p-4 flex justify-center space-x-2">
                                                    <Link href={route('products.show', product.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            className="text-gray-500 hover:bg-gray-200"
                                                        >
                                                            <Eye size={18} />
                                                        </Button>
                                                    </Link>
                                                    {can('products.edit') && (
                                                        <Link href={route('products.edit_out', product.id)}>
                                                            <Button
                                                                variant="ghost"
                                                                className="text-blue-500 hover:bg-blue-100"
                                                            >
                                                                <Pencil size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('products.delete') && (
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleDelete(product.id, product.product)
                                                            }
                                                            className="text-red-500 hover:bg-red-100"
                                                        >
                                                            <Trash size={18} />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Tidak ada hasil ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {products2.data.length > 0 && renderPagination(products2, 'page2')}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
