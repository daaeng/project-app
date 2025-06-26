import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FileDown, Megaphone, Package, Search, TreePalm, Undo2, Wheat } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Tag_Karet from '@/components/ui/tag_karet';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
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
    status: string;
}

// Definisikan tipe untuk link paginasi agar lebih aman
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: { message?: string };
    products: {
        data: Product[];
        links: PaginationLink[]; // Gunakan tipe yang sudah didefinisikan
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    hsl_karet: number;
    saldoin: number;
    saldoout: number;
    hsl_kelapa: number;
    saldoinklp: number;
    saldooutklp: number;
    hsl_pupuk: number;
    saldoinppk: number;
    saldooutppk: number;
    filter?: { search?: string; time_period?: string }; // Added time_period to filter
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { // Menggunakan locale id-ID
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Biasanya Rupiah tidak pakai sen
    }).format(value);
};

export default function AllofPage({ // Ganti nama komponen agar lebih deskriptif
    hsl_karet, saldoin, saldoout, hsl_kelapa, saldoinklp, saldooutklp,
    hsl_pupuk, saldoinppk, saldooutppk, products, flash, filter,
}: PageProps) {
    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time'); // State for time period filter

    // Sinkronisasi state dengan prop dari server
    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'all-time'); // Sync time period from props
    }, [filter?.search, filter?.time_period]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        // Trigger search when time period changes
        router.get(route('products.allof'),
            { search: searchValue, time_period: value }, // Include time_period in the request
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk'], // Hanya minta data yang berubah, termasuk statistik
            }
        );
    };

    const performSearch = () => {
        // Menggunakan router.get untuk navigasi
        router.get(route('products.allof'),
            { search: searchValue, time_period: timePeriod }, // Data yang dikirim sebagai query string
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'hsl_karet', 'saldoin', 'saldoout', 'hsl_kelapa', 'saldoinklp', 'saldooutklp', 'hsl_pupuk', 'saldoinppk', 'saldooutppk'], // Hanya minta data yang berubah, termasuk statistik
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    // Fungsi untuk render link paginasi menggunakan <Link> dari Inertia
    const renderPagination = (pagination: PageProps['products']) => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => (
                    // Jika URL null (misalnya untuk "...") kita render sebagai teks biasa
                    link.url === null ? (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        // Gunakan komponen <Link> dari Inertia
                        <Link
                            key={`link-${index}`}
                            href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '')} // Append search and time_period to pagination links
                            className={`px-4 py-2 text-sm rounded-md transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            // Opsi tambahan untuk efisiensi
                            preserveState
                            preserveScroll
                        >
                            {/* Membersihkan label dari entitas HTML */}
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    )
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Product" />
            <div className="h-full flex-col rounded-xl p-4 space-y-4">
                <Heading title="All Product Data Information" />
                <div className='mb-1'>
                    <Link href={route('products.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                </div>

                {/* Bagian Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                        <CardHeader className="bg-amber-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Kelapa</CardTitle>
                                <div className="rounded-lg bg-amber-100 p-2"><TreePalm size={18} className="text-amber-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-amber-700">
                            <div className="text-2xl font-bold">{hsl_kelapa}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinklp)}</div>
                            <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutklp)}</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                        <CardHeader className="bg-blue-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Karet</CardTitle>
                                <div className="rounded-lg bg-blue-100 p-2"><Package size={18} className="text-blue-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-blue-700">
                            <div className="text-2xl font-bold">{hsl_karet}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoin)} <p>(Bayar Penoreh)</p></div>
                            <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(saldoout)} <p>(Hasil Jual)</p></div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                        <CardHeader className="bg-red-300">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-500">Available Stock Pupuk</CardTitle>
                                <div className="rounded-lg bg-red-100 p-2"><Wheat size={18} className="text-red-600" /></div>
                            </div>
                        </CardHeader>
                        <CardContent className="lg:-mt-4 text-red-700">
                            <div className="text-2xl font-bold">{hsl_pupuk}</div>
                            <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinppk)}</div>
                            <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutppk)}</div>
                        </CardContent>
                    </Card>
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
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by product, supplier, invoice..."
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={performSearch}><Search className="h-4 w-4 mr-2" />Search</Button>
                            <div className="flex items-center gap-2">
                                {/* Select filter by time period */}
                                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-time">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="this-week">This Week</SelectItem>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="this-year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                {/* Tombol Export Excel */}
                                <Button
                                    onClick={() => router.get(route('products.export.excel'), { search: searchValue, time_period: timePeriod })} // Include time_period for export
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Jenis Barang</TableHead>
                                        <TableHead>Qty (IN)</TableHead>
                                        <TableHead>Qty (OUT)</TableHead>
                                        <TableHead>Total Harga (IN)</TableHead>
                                        <TableHead>Total Harga (OUT)</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.product}</TableCell>
                                                <TableCell>{product.date}</TableCell>
                                                <TableCell>{product.nm_supplier}</TableCell>
                                                <TableCell>{product.j_brg}</TableCell>
                                                <TableCell>{product.qty_kg}</TableCell>
                                                <TableCell>{product.qty_out}</TableCell>
                                                <TableCell>{formatCurrency(product.amount)}</TableCell>
                                                <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Tag_Karet status={product.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Memanggil fungsi render paginasi yang sudah diperbaiki */}
                        {products.data.length > 0 && renderPagination(products)}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
