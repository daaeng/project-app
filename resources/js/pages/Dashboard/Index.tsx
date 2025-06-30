import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Archive, ChevronDown, FileText, MoreHorizontal, Package2, Receipt, Search, UserCheck, UserCog, Users } from 'lucide-react';


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
};


const Dashboard = () => {
    // Dummy data yang disesuaikan dengan modul Anda, dipindahkan ke dalam komponen
    const analyticsData = {
        totalProducts: 254, // Dari Product
        totalUsers: 1823, // Dari User Management
        totalIncisors: 150, // Dari Incisor
        totalIncisedAmount: 75000000, // Dari Incised Data (total pendapatan toreh)
        pendingRequestLetters: 5, // Dari Request Letter
        pendingInvoices: 12, // Dari Invoice
        totalCashReceipts: 35000000, // Dari Cash Receipt
        totalRoles: 7, // Dari Role Management
    };

    // Dummy data untuk tabel baru, dipindahkan ke dalam komponen
    const recentProducts = [
        { id: 1, name: 'Ergonomic Chair', category: 'Furniture', price: 199.99, stock: 24, status: 'In Stock', image: 'https://placehold.co/60x60/A0D911/ffffff?text=EC' },
        { id: 2, name: 'MacBook Pro M3', category: 'Electronics', price: 1999.99, stock: 12, status: 'Low Stock', image: 'https://placehold.co/60x60/2874A6/ffffff?text=MB' },
        { id: 3, name: 'Wireless Earbuds', category: 'Audio', price: 129.99, stock: 45, status: 'In Stock', image: 'https://placehold.co/60x60/FFC300/ffffff?text=WE' },
        { id: 4, name: 'Office Desk', category: 'Furniture', price: 349.99, stock: 8, status: 'Low Stock', image: 'https://placehold.co/60x60/5C2D91/ffffff?text=OD' },
        { id: 5, name: 'Smart Watch Series 8', category: 'Wearables', price: 399.99, stock: 0, status: 'Out of Stock', image: 'https://placehold.co/60x60/C70039/ffffff?text=SW' },
    ];

    const recentIncisedData = [
        { id: 101, incisorName: 'Budi Santoso', date: '2025-06-28', amount: 120000, type: 'Karet', unit: 'kg' },
        { id: 102, incisorName: 'Siti Aminah', date: '2025-06-27', amount: 95000, type: 'Kopi', unit: 'g' },
        { id: 103, incisorName: 'Joko Susanto', date: '2025-06-27', amount: 150000, type: 'Karet', unit: 'kg' },
        { id: 104, incisorName: 'Dewi Lestari', date: '2025-06-26', amount: 80000, type: 'Kopi', unit: 'g' },
        { id: 105, incisorName: 'Agus Salim', date: '2025-06-25', amount: 110000, type: 'Karet', unit: 'kg' },
    ];

    const recentRequestLetters = [
        { id: 201, requester: 'Administrasi', date: '2025-06-29', type: 'Pengajuan Dana', status: 'Pending' },
        { id: 202, requester: 'Produksi', date: '2025-06-28', type: 'Permintaan Bahan Baku', status: 'Approved' },
        { id: 203, requester: 'Pemasaran', date: '2025-06-27', type: 'Iklan Baru', status: 'Rejected' },
        { id: 204, requester: 'SDM', date: '2025-06-26', type: 'Cuti Karyawan', status: 'Approved' },
        { id: 205, requester: 'Keuangan', date: '2025-06-25', type: 'Laporan Keuangan', status: 'Pending' },
    ];

    const recentInvoices = [
        { id: 301, customer: 'PT Makmur Jaya', email: 'pt.makmur@example.com', product: 'Jasa Konsultasi', date: '2025-06-29', amount: 5000000, status: 'Pending' },
        { id: 302, customer: 'CV Sejahtera', email: 'cv.sejahtera@example.com', product: 'Produk A', date: '2025-06-28', amount: 1250000, status: 'Paid' },
        { id: 303, customer: 'UD Bersama', email: 'ud.bersama@example.com', product: 'Produk B', date: '2025-06-27', amount: 750000, status: 'Paid' },
        { id: 304, customer: 'Individu C', email: 'individu.c@example.com', product: 'Layanan X', date: '2025-06-26', amount: 300000, status: 'Pending' },
        { id: 305, customer: 'PT Abadi Sentosa', email: 'pt.abadi@example.com', product: 'Jasa Instalasi', date: '2025-06-25', amount: 2000000, status: 'Cancelled' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen p-6 sm:p-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-extrabold text-gray-800">Dashboard Analitik</h1>
                    <p className="text-gray-600">Selamat datang kembali! Berikut adalah gambaran singkat performa Anda.</p>
                </div>

                {/* Kartu Analitik */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Kartu Total Produk */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Produk</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 shadow-sm">
                                <Package2 size={20} className="text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalProducts}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Pengguna */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Pengguna</CardTitle>
                            <div className="rounded-full bg-green-100 p-2 shadow-sm">
                                <Users size={20} className="text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalUsers}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Penoreh */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Penoreh</CardTitle>
                            <div className="rounded-full bg-purple-100 p-2 shadow-sm">
                                <UserCog size={20} className="text-purple-600" /> {/* Ikon baru */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalIncisors}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Hasil Toreh */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Hasil Toreh</CardTitle>
                            <div className="rounded-full bg-orange-100 p-2 shadow-sm">
                                <Archive size={20} className="text-orange-600" /> {/* Ikon baru */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalIncisedAmount)}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Pengajuan Tertunda */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Pengajuan Tertunda</CardTitle>
                            <div className="rounded-full bg-red-100 p-2 shadow-sm">
                                <FileText size={20} className="text-red-600" /> {/* Ikon baru */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingRequestLetters}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Faktur Belum Dibayar */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Faktur Belum Dibayar</CardTitle>
                            <div className="rounded-full bg-yellow-100 p-2 shadow-sm">
                                <Receipt size={20} className="text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingInvoices}</div>
                        </CardContent>
                    </Card>

                    {/* Kartu Total Penerimaan Kas */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Penerimaan Kas</CardTitle>
                            <div className="rounded-full bg-teal-100 p-2 shadow-sm">
                                <Receipt size={20} className="text-teal-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalCashReceipts)}</div>
                        </CardContent>
                    </Card>

                     {/* Kartu Total Peran */}
                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Peran</CardTitle>
                            <div className="rounded-full bg-cyan-100 p-2 shadow-sm">
                                <UserCheck size={20} className="text-cyan-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalRoles}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Produk Terbaru */}
                <div className="mb-8">
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
                            <CardTitle className="text-xl font-bold text-gray-800">Produk Terbaru</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 shadow-md">Tambah Produk</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="text-gray-600">
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Produk</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kategori</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Harga</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stok</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-100">
                                        {recentProducts.map((product) => (
                                            <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm" />
                                                        <span className="font-medium text-gray-900">{product.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(product.price)}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <Badge
                                                        className={
                                                            product.status === 'In Stock'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                : product.status === 'Low Stock'
                                                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        }
                                                    >
                                                        {product.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                                            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Edit</DropdownMenuItem>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Lihat Detail</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-200 my-1" />
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">Hapus</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 dari {analyticsData.totalProducts} produk</div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled className="px-4 py-2 rounded-md border border-gray-300 text-gray-500 cursor-not-allowed">
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className="px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
                                    Berikutnya
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tabel Data Torehan Terbaru */}
                <div className="mb-8">
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
                            <CardTitle className="text-xl font-bold text-gray-800">Data Torehan Terbaru</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input placeholder="Cari data torehan..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                    Filter
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="text-gray-600">
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Penoreh</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tanggal</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Jumlah</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tipe</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Unit</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-100">
                                        {recentIncisedData.map((data) => (
                                            <TableRow key={data.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{data.incisorName}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.date}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(data.amount)}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.type}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.unit}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                                            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Lihat Detail</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-200 my-1" />
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">Hapus</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 data torehan terbaru</div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled className="px-4 py-2 rounded-md border border-gray-300 text-gray-500 cursor-not-allowed">
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className="px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
                                    Berikutnya
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tabel Pengajuan Surat Terbaru */}
                <div className="mb-8">
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
                            <CardTitle className="text-xl font-bold text-gray-800">Pengajuan Surat Terbaru</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input placeholder="Cari pengajuan..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                    Filter
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="text-gray-600">
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Pemohon</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tanggal</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tipe</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-100">
                                        {recentRequestLetters.map((request) => (
                                            <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.requester}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.date}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.type}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <Badge
                                                        className={
                                                            request.status === 'Approved'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                : request.status === 'Pending'
                                                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        }
                                                    >
                                                        {request.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                                            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Lihat Detail</DropdownMenuItem>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Edit Status</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-200 my-1" />
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">Batalkan</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 pengajuan surat terbaru</div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled className="px-4 py-2 rounded-md border border-gray-300 text-gray-500 cursor-not-allowed">
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className="px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
                                    Berikutnya
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Tabel Faktur Terbaru (sebelumnya Penjualan Terbaru) */}
                <div>
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
                            <CardTitle className="text-xl font-bold text-gray-800">Faktur Terbaru</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input placeholder="Cari faktur..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                    Filter
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="text-gray-600">
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Pelanggan</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Produk/Layanan</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tanggal</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Jumlah</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-100">
                                        {recentInvoices.map((invoice) => (
                                            <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{invoice.customer}</div>
                                                        <div className="text-sm text-gray-600">{invoice.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.product}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.date}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(invoice.amount)}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <Badge
                                                        className={
                                                            invoice.status === 'Paid'
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                : invoice.status === 'Pending'
                                                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        }
                                                    >
                                                        {invoice.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                                            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Lihat Detail</DropdownMenuItem>
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Kirim Pengingat</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-200 my-1" />
                                                            <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">Batalkan Faktur</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 faktur terbaru</div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled className="px-4 py-2 rounded-md border border-gray-300 text-gray-500 cursor-not-allowed">
                                    Sebelumnya
                                </Button>
                                <Button variant="outline" size="sm" className="px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
                                    Berikutnya
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;