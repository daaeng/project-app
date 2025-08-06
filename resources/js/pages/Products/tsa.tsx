import { useState, useEffect } from 'react';

// Diasumsikan komponen-komponen ini ada di direktori yang sesuai
// dan diekspor sebagai default atau named export.
// Path diubah dari alias '@/' menjadi path relatif.
import Heading from '../../components/heading';
import AppLayout from '../../layouts/app-layout';
import { can } from '../../lib/can';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { CirclePlus, Eye, Megaphone, Package, Pencil, PencilLine, Search, Send, Sprout, Trash, Undo2 } from 'lucide-react';

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

                <Card>
                    <CardContent className="pt-6">
                        {flash?.message && (
                            <Alert className="mb-4">
                                <Megaphone className="h-4 w-4" />
                                <AlertTitle className="text-green-600">Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by supplier, invoice, item..."
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={performSearch}><Search className="h-4 w-4 mr-2" />Search</Button> {/* Added search button for consistency */}
                            <div className="flex items-center gap-2">
                                {/* Select filter by time period */}
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
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Pilih Bulan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedYear} onValueChange={handleYearChange}>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Pilih Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem key={year.value} value={year.value}>
                                                        {year.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}

                                <Link href={route('products.s_gka')}>
                                    <Button className='bg-green-600 hover:bg-green-400'>
                                        <Send />
                                        Kirim ke GKA
                                    </Button>
                                </Link>
                                {can('products.create') && (
                                    <Link href={route('products.create')}>
                                        <Button className="bg-yellow-600 hover:bg-yellow-500">
                                            <CirclePlus className="w-4 h-4 mr-2" /> Product
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border p-4 rounded-lg">
                                <div className="font-bold text-xl mb-4">Data Pembelian Karet</div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Keping</TableHead>
                                                <TableHead>Qty (IN)</TableHead>
                                                <TableHead>Outcome</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.data.length > 0 ? (
                                                products.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell key={`${product.id}-date`}>{product.date}</TableCell>
                                                        <TableCell key={`${product.id}-supplier`}>{product.nm_supplier}</TableCell>
                                                        <TableCell key={`${product.id}-keping`}>{product.keping}</TableCell>
                                                        <TableCell key={`${product.id}-qty-in`}>{product.qty_kg}</TableCell>
                                                        <TableCell key={`${product.id}-amount`}>{formatCurrency(product.amount)}</TableCell>
                                                        <TableCell key={`${product.id}-actions`} className="text-center space-x-1">
                                                            {can('products.view') && <Link href={route('products.show', product.id)}><Button size="icon" variant="ghost"><Eye className="h-4 w-4 text-gray-500" /></Button></Link>}
                                                            {can('products.edit') && <Link href={route('products.edit', product.id)}><Button size="icon" variant="ghost"><PencilLine className="h-4 w-4 text-blue-500" /></Button></Link>}
                                                            {can('roles.delete') && <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id, product.product)}><Trash className="h-4 w-4 text-red-500" /></Button>}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No results found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products.data.length > 0 && renderPagination(products, 'page')}
                            </div>

                            <div className="border p-4 rounded-lg">
                                <div className="font-bold text-xl mb-4">Data Penjualan Karet</div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Supplier</TableHead>
                                                <TableHead>Keping</TableHead>
                                                <TableHead>Qty (OUT)</TableHead>
                                                <TableHead>Income</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products2.data.length > 0 ? (
                                                products2.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell key={`${product.id}-date-out`}>{product.date}</TableCell>
                                                        <TableCell key={`${product.id}-supplier-out`}>{product.nm_supplier}</TableCell>
                                                        <TableCell key={`${product.id}-keping-out`}>{product.keping_out}</TableCell>
                                                        <TableCell key={`${product.id}-qty-out`}>{product.qty_out}</TableCell>
                                                        <TableCell key={`${product.id}-amount-out`}>{formatCurrency(product.amount_out)}</TableCell>
                                                        <TableCell key={`${product.id}-actions-out`} className="text-center space-x-1">
                                                            {can('products.view') && <Link href={route('products.show', product.id)}><Button size="icon" variant="ghost"><Eye className="h-4 w-4 text-gray-500" /></Button></Link>}
                                                            {can('products.edit') && <Link href={route('products.edit_out', product.id)}><Button size="icon" variant="ghost"><Pencil className="h-4 w-4 text-blue-500" /></Button></Link>}
                                                            {/* {can('products.delete') && <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id, product.product)}><Trash className="h-4 w-4 text-red-500" /></Button>} */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No results found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {products2.data.length > 0 && renderPagination(products2, 'page2')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
