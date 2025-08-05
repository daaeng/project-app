import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaChartBar,
  FaUserTie,
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaFileInvoice,
  FaMoneyBill,
  FaChartPie,
  FaUserFriends,
} from 'react-icons/fa';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Tag_Karet from '@/components/ui/tag_karet';

// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const pieColors = ['#22C55E', '#3B82F6', '#FACC15', '#EF4444'];

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

interface PageProps {
    totalAmountOutKaret : number;
    hsl_tsa : number;
    hsl_beli : number;
    totalPendingRequests : number;
    stok_gka: number;
    jml_penoreh : number;
    jml_pegawai : number;
    totalPendingNota : number;
    totalRevenueAmount: number;
    totalRevenueKg: number;
    filter?: { search?: string; time_period?: string };
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
    monthlyData: { name: string; temadu: number; sebayar: number; penjualan: number }[];
    monthlyRevenueData: { name: string; value: number }[];
    // Updated topIncisorRevenue interface to include 'qty_karet'
    topIncisorRevenue: { name: string; value: number; qty_karet: number }[];
    qualityDistribution: { name: string; value: number }[];
}

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function Dashboard({ totalAmountOutKaret, hsl_tsa, hsl_beli, totalPendingRequests, stok_gka, jml_penoreh, jml_pegawai, totalPendingNota, totalRevenueAmount, totalRevenueKg, filter, products, monthlyData, monthlyRevenueData, qualityDistribution, topIncisorRevenue }: PageProps) {

    const displayValue = formatCurrency(totalAmountOutKaret || 0);
    const nota = formatCurrency(totalPendingNota || 0);
    const beli_karet = formatCurrency(hsl_beli || 0);
    // const formattedTotalRevenueAmount = formatCurrency(totalRevenueAmount || 0);
    // const formattedTotalRevenueKg = `${totalRevenueKg || 0} kg`;


    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time');

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'all-time');
    }, [filter?.search, filter?.time_period]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const renderPagination = (pagination: PageProps['products']) => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => (

                    link.url === null ? (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (

                        <Link
                            key={`link-${index}`}
                            href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '')}
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
                    )
                ))}
            </div>
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        router.get(route('dashboard'),
            { search: searchValue, time_period: value },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'monthlyData', 'monthlyRevenueData', 'qualityDistribution', 'topIncisorRevenue', 'totalRevenueAmount', 'totalRevenueKg'],
            }
        );
    };

    const performSearch = () => {
        router.get(route('dashboard'),
            { search: searchValue, time_period: timePeriod },
            {
                preserveState: true,
                replace: true,
                only: ['products', 'filter', 'monthlyData', 'monthlyRevenueData', 'qualityDistribution', 'topIncisorRevenue', 'totalRevenueAmount', 'totalRevenueKg'],
            }
        );
    };

    // Check if there's any actual data in qualityDistribution to display
    const hasQualityData = qualityDistribution.some(item => item.value > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen p-6 sm:p-8 bg-gray-50 dark:bg-black font-inter">

                <div className="bg-[#2b75c4] rounded-xl p-5 shadow-md mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Dashboard Analitik Bisnis Karet
                    </h2>
                    <p className="text-sm text-gray-200 mt-1">
                        Selamat datang kembali 👋 Berikut adalah gambaran performa PT GKA, TSA, dan GK Agro.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <StatCard
                        icon={FaMoneyBill}
                        title="Total Penjualan Karet"
                        value={displayValue}
                        subtitle="oleh PT GKA"
                        gradient="from-green-400 to-green-600"
                    />

                    <StatCard
                        icon={FaBoxOpen}
                        title="Total Produksi Karet"
                        value={hsl_tsa + ' kg'}
                        subtitle="oleh TSA"
                        gradient="from-blue-400 to-blue-600"
                    />

                    <StatCard
                        icon={FaClipboardList}
                        title="Pengajuan Tertunda"
                        value={totalPendingRequests + ''}
                        subtitle="Menunggu Persetujuan"
                        gradient="from-red-400 to-red-600"
                    />

                    <StatCard
                        icon={FaBoxOpen}
                        title="Total Stok Karet"
                        value={stok_gka + ''}
                        subtitle="di Gudang PT GKA"
                        gradient="from-yellow-400 to-yellow-600"
                    />

                    <StatCard
                        icon={FaUsers}
                        title="Total Penoreh"
                        value={jml_penoreh + ''}
                        subtitle="Terdaftar"
                        gradient="from-purple-400 to-purple-600"
                    />

                    <StatCard
                        icon={FaFileInvoice}
                        title="Pengeluaran TSA"
                        value={beli_karet} 
                        subtitle="Pembelian Karet" // Ini masih hardcoded
                        gradient="from-pink-400 to-pink-600"
                    />

                    <StatCard
                        icon={FaMoneyBill}
                        title="Kwitansi/Nota Pending"
                        value={nota}
                        subtitle="Menunggu Persetujuan"
                        gradient="from-orange-400 to-orange-600"
                    />

                    <StatCard
                        icon={FaUserTie}
                        title="Total Peran Pengguna"
                        value={jml_pegawai + ''}
                        subtitle="Peran Terdaftar"
                        gradient="from-indigo-400 to-indigo-600"
                    />

                </div>

                {/* Dropdown filter for all charts */}
                <div className="mb-6 flex justify-end">
                    <div className="flex items-center gap-2 p-1 ">
                        <span className="text-black dark:text-white text-sm">Filter Waktu:</span>
                        <div className='bg-accent dark:bg-white text-black rounded-xl'>
                            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih periode waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-time">Semua Waktu</SelectItem> {/* Total Kumulatif */}
                                    <SelectItem value="all-years">Semua Tahun</SelectItem> {/* Agregasi per Tahun */}
                                    <SelectItem value="this-year">Tahun Ini</SelectItem> {/* Agregasi per Bulan (Tahun Ini) */}
                                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                                    <SelectItem value="this-week">Minggu Ini</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Bar Chart: Produksi & Penjualan */}
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <FaChartBar className="text-blue-600 text-xl" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                            Produksi Karet TSA (Temadu & Sebayar)
                        </h4>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={monthlyData}
                                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" />
                                {/* YAxis pertama untuk Produksi (kg) - ditambahkan tick={{ fontSize: 10 }} */}
                                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{ fontSize: 10 }} />
                                
                                {/* YAxis kedua untuk Penjualan (Rupiah) - ditambahkan tick={{ fontSize: 10 }} */}
                                <YAxis yAxisId="right" orientation="right" stroke="#22C55E" tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8 }}
                                    formatter={(value: number, name: string) => {
                                        if (name === 'temadu') return [`${value} kg`, 'Temadu'];
                                        if (name === 'sebayar') return [`${value} kg`, 'Sebayar'];
                                        if (name === 'penjualan') return [formatCurrency(value), name];
                                        return [value, name];
                                    }}
                                />
                                <Legend />

                                <Bar yAxisId="left" dataKey="sebayar" fill="#FFC107" name="Sebayar" radius={[8, 8, 0, 0]} />
                                <Bar yAxisId="left" dataKey="temadu" fill="#3B82F6" name="Temadu" radius={[8, 8, 0, 0]} />
                                <Bar yAxisId="right" dataKey="penjualan" fill="#22C55E"  radius={[8, 8, 0, 0]} />

                                {/* <Line yAxisId="right" type="monotone" dataKey="penjualan" stroke="#16A34A" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} /> */}
                            
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                    {/* Line Chart: Tren Pendapatan */}
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                        <div className="bg-green-100 p-2 rounded-full">
                            <FaMoneyBill className="text-green-600 text-xl" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Tren Pendapatan Penjualan Karet</h4>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={monthlyRevenueData}
                                margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 5 }}/>
                                <Tooltip contentStyle={{ borderRadius: 8 }} formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ r: 5, fill: '#10B981' }}
                                activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* PIE CHART: Distribusi Kualitas Stok */}
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-rose-100 p-2 rounded-full">
                                <FaChartPie className="text-rose-600 text-xl" />
                            </div>
                        <h4 className="text-lg font-semibold text-gray-800">Distribusi Stok Karet Berdasarkan Kualitas</h4>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            {hasQualityData ? (
                                <PieChart>
                                    <Pie
                                        data={qualityDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={50}
                                        paddingAngle={5}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {qualityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                        formatter={(value: number, name: string) => [`${value} kg`, name]}
                                    />
                                </PieChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Tidak ada data kualitas karet yang tersedia.</p>
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {/* BAR CHART: Pendapatan Penoreh */}
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <FaUserFriends className="text-indigo-600 text-xl" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Pendapatan & Kuantitas Karet Penoreh Teratas</h4> {/* Updated title */}
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={topIncisorRevenue}
                                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" />
                                {/* YAxis pertama untuk Pendapatan (kiri) */}
                                <YAxis yAxisId="left" orientation="left" stroke="#6366F1" tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 8 }}/>
                                {/* YAxis kedua untuk Kuantitas Karet (kanan) */}
                                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tickFormatter={(value) => `${value} kg`} tick={{ fontSize: 8 }}/>
                                <Tooltip
                                contentStyle={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                formatter={(value: number, name: string) => {
                                    if (name === 'Pendapatan') return [formatCurrency(value), name];
                                    if (name === 'Jumlah Karet') return [`${value} kg`, name];
                                    return [value, name];
                                }}
                                />
                                <Legend />
                                <Bar
                                    yAxisId="left" // Bar ini menggunakan Y-axis kiri
                                    dataKey="value"
                                    fill="#6366F1"
                                    name="Pendapatan" // Nama untuk legend dan tooltip
                                    radius={[10, 10, 0, 0]}
                                    animationDuration={800}
                                />
                                <Bar
                                    yAxisId="right" // Bar ini menggunakan Y-axis kanan
                                    dataKey="qty_karet" // Data key baru untuk jumlah karet
                                    fill="#10B981" // Warna berbeda untuk jumlah karet
                                    name="Jumlah Karet" // Nama untuk legend dan tooltip
                                    radius={[10, 10, 0, 0]}
                                    animationDuration={800}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white text-accent p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-blue-100 p-2 rounded-full">
                        <FaBoxOpen className="text-blue-600 text-lg" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                        Produksi Karet <span className="text-sm text-gray-400">(Proses Stok)</span>
                        </h4>
                    </div>

                    <input
                        type="text"
                        placeholder="🔍 Cari nama produk..."
                        value={searchValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />

                    <div className="overflow-x-auto text-black">

                        {/* <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">

                            <div className="flex items-center gap-2">
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

                            </div>
                        </div> */}

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className='bg-accent'>
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
                        {products.data.length > 0 && renderPagination(products)}
                    </div>
                </div>


            </div>
        </AppLayout>
    );
};

