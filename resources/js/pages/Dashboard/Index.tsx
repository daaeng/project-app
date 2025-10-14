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
    filter?: { search?: string; time_period?: string; month?: string; year?: string };
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

    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [selectedMonth, setSelectedMonth] = useState(filter?.month || '');
    const [selectedYear, setSelectedYear] = useState(filter?.year || '');
    
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'this-month');
        setSelectedMonth(filter?.month || '');
        setSelectedYear(filter?.year || '');
    }, [filter?.search, filter?.time_period, filter?.month, filter?.year]);


    const handleFilterChange = (newFilters: { [key: string]: string | number | null }) => {
        const filters = {
            search: searchValue,
            time_period: timePeriod,
            month: selectedMonth,
            year: selectedYear,
            ...newFilters,
        };
        
        router.get(route('dashboard'), filters as any, {
            preserveState: true,
            replace: true,
            only: ['products', 'filter', 'monthlyData', 'monthlyRevenueData', 'qualityDistribution', 'topIncisorRevenue', 'totalRevenueAmount', 'totalRevenueKg', 'totalAmountOutKaret', 'hsl_tsa', 'hsl_beli', 'totalPendingRequests', 'stok_gka', 'jml_penoreh', 'jml_pegawai', 'totalPendingNota'],
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const renderPagination = (pagination: PageProps['products']) => {
        const filterString = `&search=${searchValue || ''}&time_period=${timePeriod || ''}&month=${selectedMonth || ''}&year=${selectedYear || ''}`;
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
                            href={link.url + filterString}
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
        if (value === 'custom') {
             // Do nothing here, let the month/year selects handle the filtering
             // Or set default month/year if needed
        } else {
            // Reset month and year filters
            handleFilterChange({ time_period: value, month: null, year: null });
        }
    };
    
    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        handleFilterChange({ time_period: 'custom', month: value, year: selectedYear });
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        handleFilterChange({ time_period: 'custom', month: selectedMonth, year: value });
    };
    
    const performSearch = () => {
        handleFilterChange({});
    };

    // Fungsi untuk menghasilkan opsi bulan
    const getMonthOptions = () => {
        return [
            { value: '01', label: 'Januari' },
            { value: '02', label: 'Februari' },
            { value: '03', label: 'Maret' },
            { value: '04', label: 'April' },
            { value: '05', label: 'Mei' },
            { value: '06', label: 'Juni' },
            { value: '07', label: 'Juli' },
            { value: '08', label: 'Agustus' },
            { value: '09', label: 'September' },
            { value: '10', label: 'Oktober' },
            { value: '11', label: 'November' },
            { value: '12', label: 'Desember' },
        ];
    };

    // Fungsi untuk menghasilkan opsi tahun
    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 2020; i--) { // Anda bisa menyesuaikan tahun mulai
            years.push({ value: i.toString(), label: i.toString() });
        }
        return years;
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

                {/* Filter dropdowns untuk semua chart */}
                <div className="mb-6 flex flex-wrap gap-2 justify-end items-center">
                    <div className="flex items-center gap-2 p-1">
                        <span className="text-black dark:text-white text-sm">Filter Waktu:</span>
                        <div className='bg-accent dark:bg-white text-black rounded-xl'>
                            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih periode waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-time">Semua Waktu</SelectItem>
                                    <SelectItem value="all-years">Semua Tahun</SelectItem>
                                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                                    <SelectItem value="last-month">Bulan Lalu</SelectItem>
                                    <SelectItem value="this-week">Minggu Ini</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="custom">Pilih Bulan & Tahun</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {timePeriod === 'custom' && (
                        <>
                            <div className='bg-accent dark:bg-white text-black rounded-xl'>
                                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getMonthOptions().map(month => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='bg-accent dark:bg-white text-black rounded-xl'>
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getYearOptions().map(year => (
                                            <SelectItem key={year.value} value={year.value}>
                                                {year.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <StatCard
                        icon={FaMoneyBill}
                        title="Total Penjualan Karet"
                        value={formatCurrency(totalRevenueAmount || 0)}
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
                        title="Total Kirim Karet"
                        value={stok_gka + ''}
                        subtitle="PT. GKA ke Buyer"
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
                        value={formatCurrency(hsl_beli || 0)}
                        subtitle="Pembelian Karet" // Ini masih hardcoded
                        gradient="from-pink-400 to-pink-600"
                    />

                    <StatCard
                        icon={FaMoneyBill}
                        title="Kwitansi/Nota Pending"
                        value={formatCurrency(totalPendingNota || 0)}
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
                                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tick={{ fontSize: 10 }} />
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

                                <Bar yAxisId="left" dataKey="sebayar" fill="#CC0000" name="Sebayar" radius={[8, 8, 0, 0]} />
                                <Bar yAxisId="left" dataKey="temadu" fill="#0000FF" name="Temadu" radius={[8, 8, 0, 0]} />
                                <Bar yAxisId="right" dataKey="penjualan" fill="#00CC00"  radius={[8, 8, 0, 0]} />
                            
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
                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 5 }} />
                                <Tooltip contentStyle={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={2}
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
                                <YAxis yAxisId="left" orientation="left" stroke="#6366F1" tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 8 }}/>
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
                                    yAxisId="left" 
                                    dataKey="value"
                                    fill="#6366F1"
                                    name="Pendapatan" 
                                    radius={[10, 10, 0, 0]}
                                    animationDuration={800}
                                />
                                <Bar
                                    yAxisId="right" 
                                    dataKey="qty_karet" 
                                    fill="#10B981" 
                                    name="Jumlah Karet" 
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

                    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center justify-between">
                        <input
                            type="text"
                            placeholder="🔍 Cari nama produk..."
                            value={searchValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all sm:w-1/3"
                        />
                        {/* <div className="flex items-center gap-2">
                             <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih periode waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-time">Semua Waktu</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="this-week">Minggu Ini</SelectItem>
                                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                                    <SelectItem value="custom">Pilih Bulan & Tahun</SelectItem>
                                </SelectContent>
                            </Select>

                             {timePeriod === 'custom' && (
                                <>
                                    <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getMonthOptions().map(month => (
                                                <SelectItem key={month.value} value={month.value}>
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedYear} onValueChange={handleYearChange}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getYearOptions().map(year => (
                                                <SelectItem key={year.value} value={year.value}>
                                                    {year.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </div> */}
                    </div>

                    <div className="overflow-x-auto text-black">

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
}
