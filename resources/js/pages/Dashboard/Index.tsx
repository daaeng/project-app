import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect

// --- START REVERT: Re-adding original AppLayout and Head imports ---
import AppLayout from '@/layouts/app-layout'; // Dikembalikan seperti semula
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; // Dikembalikan seperti semula
// --- END REVERT ---

// Import UI components from shadcn/ui
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
import { Archive, ChevronDown, FileText, MoreHorizontal, Package2, Receipt, Search, UserCheck, UserCog, Users, TrendingUp, DollarSign, Factory, Leaf } from 'lucide-react';

// Import Recharts components
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Helper function to format currency to IDR
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// Main Dashboard Component
const Dashboard = () => {
    // State for chart filter (weekly, monthly, yearly)
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');

    // Dummy data for analytics cards
    const analyticsData = {
        totalProducts: 254, // Total produk karet (stok)
        totalUsers: 1823, // Total pengguna sistem
        totalIncisors: 150, // Total penoreh
        totalIncisedAmount: 75000000, // Total pendapatan toreh (dari penoreh)
        totalRubberProductionTSA: 125000, // Total produksi karet dari TSA (kg)
        totalRubberSalesPTGKA: 980000000, // Total penjualan karet oleh PT. GKA (IDR)
        pendingRequestLetters: 5, // Pengajuan surat tertunda
        pendingInvoices: 12, // Faktur belum dibayar
        totalCashReceipts: 35000000, // Total penerimaan kas (non-penjualan)
        totalRoles: 7, // Total peran pengguna
    };

    // Dummy data for charts - will be dynamically generated based on filter
    const [productionSalesData, setProductionSalesData] = useState([]);
    const [revenueTrendData, setRevenueTrendData] = useState([]);
    const [stockQualityData, setStockQualityData] = useState([]);
    const [topIncisorsData, setTopIncisorsData] = useState([]);

    // Function to generate dummy chart data based on selected period
    const generateChartData = (period: string) => {
        let prodSales = [];
        let revenueTrend = [];
        let stockQuality = [
            { name: 'Kualitas A', value: 400 },
            { name: 'Kualitas B', value: 300 },
            { name: 'Kualitas C', value: 200 },
            { name: 'Kualitas D', value: 100 },
        ];
        let topIncisors = [
            { name: 'Budi Santoso', earnings: 15000000 },
            { name: 'Siti Aminah', earnings: 12000000 },
            { name: 'Joko Susanto', earnings: 10000000 },
            { name: 'Dewi Lestari', earnings: 9000000 },
            { name: 'Agus Salim', earnings: 8500000 },
        ];

        if (period === 'weekly') {
            // Dummy weekly data for the last 4 weeks
            for (let i = 0; i < 4; i++) {
                const week = `Minggu ${4 - i}`;
                prodSales.push({
                    name: week,
                    'Produksi Temadu (kg)': Math.floor(Math.random() * 5000) + 1000,
                    'Produksi Sebayar (kg)': Math.floor(Math.random() * 4000) + 800,
                    'Penjualan PT. GKA (kg)': Math.floor(Math.random() * 8000) + 2000,
                });
                revenueTrend.push({
                    name: week,
                    'Pendapatan (IDR)': (Math.floor(Math.random() * 500) + 100) * 1000000,
                });
            }
        } else if (period === 'monthly') {
            // Dummy monthly data for the last 6 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
            for (let i = 0; i < months.length; i++) {
                prodSales.push({
                    name: months[i],
                    'Produksi Temadu (kg)': Math.floor(Math.random() * 20000) + 5000,
                    'Produksi Sebayar (kg)': Math.floor(Math.random() * 15000) + 4000,
                    'Penjualan PT. GKA (kg)': Math.floor(Math.random() * 30000) + 8000,
                });
                revenueTrend.push({
                    name: months[i],
                    'Pendapatan (IDR)': (Math.floor(Math.random() * 2000) + 500) * 1000000,
                });
            }
        } else if (period === 'yearly') {
            // Dummy yearly data for the last 5 years
            for (let i = 0; i < 5; i++) {
                const year = 2025 - i;
                prodSales.push({
                    name: year.toString(),
                    'Produksi Temadu (kg)': Math.floor(Math.random() * 200000) + 50000,
                    'Produksi Sebayar (kg)': Math.floor(Math.random() * 150000) + 40000,
                    'Penjualan PT. GKA (kg)': Math.floor(Math.random() * 300000) + 80000,
                });
                revenueTrend.push({
                    name: year.toString(),
                    'Pendapatan (IDR)': (Math.floor(Math.random() * 20000) + 5000) * 1000000,
                });
            }
        }

        setProductionSalesData(prodSales);
        setRevenueTrendData(revenueTrend);
        setStockQualityData(stockQuality);
        setTopIncisorsData(topIncisors);
    };

    // Effect to generate data when the period changes
    useEffect(() => {
        generateChartData(selectedPeriod);
    }, [selectedPeriod]);

    // Colors for the Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Dummy data for tables
    const recentProducts = [
        { id: 1, name: 'Karet Mentah (Temadu)', category: 'Karet', origin: 'Temadu', qty_kg: 500, quality: 'A', status: 'In Stock', image: 'https://placehold.co/60x60/4CAF50/ffffff?text=TM' },
        { id: 2, name: 'Karet Mentah (Sebayar)', category: 'Karet', origin: 'Sebayar', qty_kg: 450, quality: 'B', status: 'In Stock', image: 'https://placehold.co/60x60/8BC34A/ffffff?text=SB' },
        { id: 3, name: 'Karet Olahan (Sheet)', category: 'Karet Olahan', origin: 'PT. GKA', qty_kg: 300, quality: 'A', status: 'In Stock', image: 'https://placehold.co/60x60/2196F3/ffffff?text=SH' },
        { id: 4, name: 'Karet Olahan (SIR 20)', category: 'Karet Olahan', origin: 'PT. GKA', qty_kg: 250, quality: 'B', status: 'Low Stock', image: 'https://placehold.co/60x60/03A9F4/ffffff?text=S20' },
        { id: 5, name: 'Karet Mentah (Temadu)', category: 'Karet', origin: 'Temadu', qty_kg: 600, quality: 'A', status: 'In Stock', image: 'https://placehold.co/60x60/4CAF50/ffffff?text=TM' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" /> {/* Dikembalikan seperti semula */}
            <div className="min-h-screen p-6 sm:p-8  font-inter">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-extrabold text-gray-800">Dashboard Analitik Bisnis Karet</h1>
                    <p className="text-gray-600">Selamat datang kembali! Berikut adalah gambaran singkat performa PT. GKA, TSA, dan GK Agro.</p>
                </div>

                {/* Kartu Analitik Kinerja Utama */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Total Penjualan Karet PT. GKA */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Penjualan Karet</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 shadow-sm">
                                <DollarSign size={20} className="text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRubberSalesPTGKA)}</div>
                            <p className="text-xs text-gray-500 mt-1">oleh PT. GKA</p>
                        </CardContent>
                    </Card>

                    {/* Total Produksi Karet TSA */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Produksi Karet</CardTitle>
                            <div className="rounded-full bg-green-100 p-2 shadow-sm">
                                <Factory size={20} className="text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalRubberProductionTSA} kg</div>
                            <p className="text-xs text-gray-500 mt-1">dari TSA (Temadu & Sebayar)</p>
                        </CardContent>
                    </Card>

                    {/* Total Stok Karet Tersedia */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Stok Karet</CardTitle>
                            <div className="rounded-full bg-purple-100 p-2 shadow-sm">
                                <Package2 size={20} className="text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalProducts} unit</div>
                            <p className="text-xs text-gray-500 mt-1">di gudang PT. GKA</p>
                        </CardContent>
                    </Card>

                    {/* Total Penoreh Aktif */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Penoreh Aktif</CardTitle>
                            <div className="rounded-full bg-orange-100 p-2 shadow-sm">
                                <UserCog size={20} className="text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalIncisors}</div>
                            <p className="text-xs text-gray-500 mt-1">terdaftar</p>
                        </CardContent>
                    </Card>

                    {/* Pengajuan Surat Tertunda */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Pengajuan Tertunda</CardTitle>
                            <div className="rounded-full bg-red-100 p-2 shadow-sm">
                                <FileText size={20} className="text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingRequestLetters}</div>
                            <p className="text-xs text-gray-500 mt-1">menunggu persetujuan</p>
                        </CardContent>
                    </Card>

                    {/* Faktur Belum Dibayar */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Faktur Belum Dibayar</CardTitle>
                            <div className="rounded-full bg-yellow-100 p-2 shadow-sm">
                                <Receipt size={20} className="text-yellow-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingInvoices}</div>
                            <p className="text-xs text-gray-500 mt-1">faktur</p>
                        </CardContent>
                    </Card>

                    {/* Total Kasbon Pending */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Kasbon Pending</CardTitle>
                            <div className="rounded-full bg-pink-100 p-2 shadow-sm">
                                <Archive size={20} className="text-pink-600" /> {/* Reusing Archive for Kasbon */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalIncisedAmount)}</div> {/* Assuming this is total pending kasbon amount */}
                            <p className="text-xs text-gray-500 mt-1">menunggu persetujuan</p>
                        </CardContent>
                    </Card>

                     {/* Total Peran */}
                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-700">Total Peran Pengguna</CardTitle>
                            <div className="rounded-full bg-cyan-100 p-2 shadow-sm">
                                <UserCheck size={20} className="text-cyan-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{analyticsData.totalRoles}</div>
                            <p className="text-xs text-gray-500 mt-1">peran terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bagian Chart Analitik */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart Produksi & Penjualan Karet */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xl font-bold text-gray-800">Produksi TSA & Penjualan PT. GKA</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                        {selectedPeriod === 'weekly' ? 'Mingguan' : selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('weekly')}>Mingguan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('monthly')}>Bulanan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('yearly')}>Tahunan</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 h-80 md:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={productionSalesData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#555" />
                                    <YAxis stroke="#555" label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft', fill: '#555' }} />
                                    <Tooltip formatter={(value: number) => `${value} kg`} />
                                    <Legend />
                                    <Bar dataKey="Produksi Temadu (kg)" fill="#8884d8" name="Produksi Temadu" />
                                    <Bar dataKey="Produksi Sebayar (kg)" fill="#82ca9d" name="Produksi Sebayar" />
                                    <Bar dataKey="Penjualan PT. GKA (kg)" fill="#ffc658" name="Penjualan PT. GKA" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Chart Tren Pendapatan Tahunan */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xl font-bold text-gray-800">Tren Pendapatan Penjualan Karet</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                        {selectedPeriod === 'weekly' ? 'Mingguan' : selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('weekly')}>Mingguan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('monthly')}>Bulanan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('yearly')}>Tahunan</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 h-80 md:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={revenueTrendData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#555" />
                                    <YAxis stroke="#555" tickFormatter={formatCurrency} label={{ value: 'Pendapatan (IDR)', angle: -90, position: 'insideLeft', fill: '#555' }} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="Pendapatan (IDR)" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Chart Distribusi Kualitas Stok Karet */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xl font-bold text-gray-800">Distribusi Stok Karet Berdasarkan Kualitas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 h-80 md:h-96 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stockQualityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {stockQualityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value} unit`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Chart Pendapatan Penoreh Teratas */}
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xl font-bold text-gray-800">Pendapatan Penoreh Teratas</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                                        {selectedPeriod === 'weekly' ? 'Mingguan' : selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('weekly')}>Mingguan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('monthly')}>Bulanan</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedPeriod('yearly')}>Tahunan</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 h-80 md:h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={topIncisorsData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis type="number" tickFormatter={formatCurrency} stroke="#555" />
                                    <YAxis type="category" dataKey="name" stroke="#555" width={100} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="earnings" fill="#FF5733" name="Pendapatan" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Produk Terbaru */}
                <div className="mb-8">
                    <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
                            <CardTitle className="text-xl font-bold text-gray-800">Produk Karet Terbaru (Stok Masuk)</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                    <Input placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 shadow-md">Tambah Produk Masuk</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="text-gray-600">
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Produk</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Asal Kebun</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kualitas</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Qty (kg)</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-100">{recentProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm" />
                                                    <span className="font-medium text-gray-900">{product.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.origin}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.quality}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.qty_kg}</TableCell>
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
                                    ))
                                    }</TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 dari {analyticsData.totalProducts} produk karet</div>
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

// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//     },
// ];

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Archive, FileText, MoreHorizontal, Package2, Receipt, Search, UserCheck, UserCog, Users } from 'lucide-react';


// const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0,
//     }).format(value);
// };


// const Dashboard = () => {
//     // Dummy data yang disesuaikan dengan modul Anda, dipindahkan ke dalam komponen
//     const analyticsData = {
//         totalProducts: 254, // Dari Product
//         totalUsers: 1823, // Dari User Management
//         totalIncisors: 150, // Dari Incisor
//         totalIncisedAmount: 75000000, // Dari Incised Data (total pendapatan toreh)
//         pendingRequestLetters: 5, // Dari Request Letter
//         pendingInvoices: 12, // Dari Invoice
//         totalCashReceipts: 35000000, // Dari Cash Receipt
//         totalRoles: 7, // Dari Role Management
//     };

//     // Dummy data untuk tabel baru, dipindahkan ke dalam komponen
//     const recentProducts = [
//         { id: 1, name: 'Ergonomic Chair', category: 'Furniture', price: 199.99, stock: 24, status: 'In Stock', image: 'https://placehold.co/60x60/A0D911/ffffff?text=EC' },
//         { id: 2, name: 'MacBook Pro M3', category: 'Electronics', price: 1999.99, stock: 12, status: 'Low Stock', image: 'https://placehold.co/60x60/2874A6/ffffff?text=MB' },
//         { id: 3, name: 'Wireless Earbuds', category: 'Audio', price: 129.99, stock: 45, status: 'In Stock', image: 'https://placehold.co/60x60/FFC300/ffffff?text=WE' },
//         { id: 4, name: 'Office Desk', category: 'Furniture', price: 349.99, stock: 8, status: 'Low Stock', image: 'https://placehold.co/60x60/5C2D91/ffffff?text=OD' },
//         { id: 5, name: 'Smart Watch Series 8', category: 'Wearables', price: 399.99, stock: 0, status: 'Out of Stock', image: 'https://placehold.co/60x60/C70039/ffffff?text=SW' },
//     ];

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Dashboard" />
//             <div className="min-h-screen p-6 sm:p-8">
//                 <div className="mb-8">
//                     <h1 className="mb-2 text-3xl font-extrabold text-gray-800">Dashboard Analitik</h1>
//                     <p className="text-gray-600">Selamat datang kembali! Berikut adalah gambaran singkat performa Anda.</p>
//                 </div>

//                 {/* Kartu Analitik */}
//                 <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {/* Kartu Total Produk */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Produk</CardTitle>
//                             <div className="rounded-full bg-blue-100 p-2 shadow-sm">
//                                 <Package2 size={20} className="text-blue-600" />
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.totalProducts}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Total Pengguna */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Pengguna</CardTitle>
//                             <div className="rounded-full bg-green-100 p-2 shadow-sm">
//                                 <Users size={20} className="text-green-600" />
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.totalUsers}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Total Penoreh */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Penoreh</CardTitle>
//                             <div className="rounded-full bg-purple-100 p-2 shadow-sm">
//                                 <UserCog size={20} className="text-purple-600" /> {/* Ikon baru */}
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.totalIncisors}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Total Hasil Toreh */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Hasil Toreh</CardTitle>
//                             <div className="rounded-full bg-orange-100 p-2 shadow-sm">
//                                 <Archive size={20} className="text-orange-600" /> {/* Ikon baru */}
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalIncisedAmount)}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Pengajuan Tertunda */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Pengajuan Tertunda</CardTitle>
//                             <div className="rounded-full bg-red-100 p-2 shadow-sm">
//                                 <FileText size={20} className="text-red-600" /> {/* Ikon baru */}
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingRequestLetters}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Faktur Belum Dibayar */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Faktur Belum Dibayar</CardTitle>
//                             <div className="rounded-full bg-yellow-100 p-2 shadow-sm">
//                                 <Receipt size={20} className="text-yellow-600" />
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.pendingInvoices}</div>
//                         </CardContent>
//                     </Card>

//                     {/* Kartu Total Penerimaan Kas */}
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Penerimaan Kas</CardTitle>
//                             <div className="rounded-full bg-teal-100 p-2 shadow-sm">
//                                 <Receipt size={20} className="text-teal-600" />
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalCashReceipts)}</div>
//                         </CardContent>
//                     </Card>

//                      {/* Kartu Total Peran */}
//                      <Card className="rounded-xl border border-gray-200 bg-white shadow-lg transition-transform transform hover:scale-103 duration-300">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                             <CardTitle className="text-base font-semibold text-gray-700">Total Peran</CardTitle>
//                             <div className="rounded-full bg-cyan-100 p-2 shadow-sm">
//                                 <UserCheck size={20} className="text-cyan-600" />
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-3xl font-bold text-gray-900">{analyticsData.totalRoles}</div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Tabel Produk Terbaru */}
//                 <div className="mb-8">
//                     <Card className="rounded-xl border border-gray-200 bg-white shadow-lg">
//                         <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 space-y-2 md:space-y-0">
//                             <CardTitle className="text-xl font-bold text-gray-800">Produk Terbaru</CardTitle>
//                             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                                 <div className="relative w-full sm:w-64">
//                                     <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                                     <Input placeholder="Cari produk..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
//                                 </div>
//                                 <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 shadow-md">Tambah Produk</Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent className="p-0 overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <Table className="min-w-full divide-y divide-gray-200">
//                                     <TableHeader className="bg-gray-50">
//                                         <TableRow className="text-gray-600">
//                                             <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Produk</TableHead>
//                                             <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kategori</TableHead>
//                                             <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Harga</TableHead>
//                                             <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stok</TableHead>
//                                             <TableHead className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</TableHead>
//                                             <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider"></TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody className="bg-white divide-y divide-gray-100">
//                                         {recentProducts.map((product) => (
//                                             <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center gap-3">
//                                                         <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm" />
//                                                         <span className="font-medium text-gray-900">{product.name}</span>
//                                                     </div>
//                                                 </TableCell>
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</TableCell>
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(product.price)}</TableCell>
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</TableCell>
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap">
//                                                     <Badge
//                                                         className={
//                                                             product.status === 'In Stock'
//                                                                 ? 'bg-green-100 text-green-800 hover:bg-green-100'
//                                                                 : product.status === 'Low Stock'
//                                                                   ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
//                                                                   : 'bg-red-100 text-red-800 hover:bg-red-100'
//                                                         }
//                                                     >
//                                                         {product.status}
//                                                     </Badge>
//                                                 </TableCell>
//                                                 <TableCell className="px-6 py-4 whitespace-nowrap text-right">
//                                                     <DropdownMenu>
//                                                         <DropdownMenuTrigger asChild>
//                                                             <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
//                                                                 <MoreHorizontal className="h-4 w-4" />
//                                                             </Button>
//                                                         </DropdownMenuTrigger>
//                                                         <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200">
//                                                             <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-700">Aksi</DropdownMenuLabel>
//                                                             <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Edit</DropdownMenuItem>
//                                                             <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Lihat Detail</DropdownMenuItem>
//                                                             <DropdownMenuSeparator className="bg-gray-200 my-1" />
//                                                             <DropdownMenuItem className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">Hapus</DropdownMenuItem>
//                                                         </DropdownMenuContent>
//                                                     </DropdownMenu>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         </CardContent>
//                         <CardFooter className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
//                             <div className="text-sm text-gray-600 mb-2 sm:mb-0">Menampilkan 5 dari {analyticsData.totalProducts} produk</div>
//                             <div className="flex gap-2">
//                                 <Button variant="outline" size="sm" disabled className="px-4 py-2 rounded-md border border-gray-300 text-gray-500 cursor-not-allowed">
//                                     Sebelumnya
//                                 </Button>
//                                 <Button variant="outline" size="sm" className="px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50">
//                                     Berikutnya
//                                 </Button>
//                             </div>
//                         </CardFooter>
//                     </Card>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default Dashboard;