import React, { useState } from 'react'; 
import AppLayout from '@/layouts/app-layout'; 
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react'; 
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


// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const pieData = [
  { name: 'Grade A', value: 400 },
  { name: 'Grade B', value: 300 },
  { name: 'Grade C', value: 300 },
  { name: 'Reject', value: 200 },
];

const pieColors = ['#22C55E', '#3B82F6', '#FACC15', '#EF4444'];

const topPenoreh = [
  { name: 'Budi', value: 120000 },
  { name: 'Agus', value: 95000 },
  { name: 'Sari', value: 86000 },
  { name: 'Dewi', value: 78000 },
  { name: 'Rudi', value: 69000 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const allStockData: StockItem[] = [
  { name: 'Karet Mentah', code: 'KM-01', qty: 500, status: 'in stock' },
  { name: 'Temadu', code: 'TD-02', qty: 120, status: 'low stock' },
  { name: 'Karet Grade A', code: 'GA-03', qty: 0, status: 'out of stock' },
  { name: 'Karet Grade B', code: 'GB-04', qty: 180, status: 'low stock' },
  { name: 'Saponifikasi', code: 'SP-05', qty: 600, status: 'in stock' },
  { name: 'Getah Asli', code: 'GT-06', qty: 0, status: 'out of stock' },
  { name: 'Lateks Premium', code: 'LP-07', qty: 220, status: 'low stock' },
  { name: 'Karet Olahan', code: 'KO-08', qty: 900, status: 'in stock' },
  { name: 'Lump Rubber', code: 'LR-09', qty: 60, status: 'low stock' },
  { name: 'Temadu Super', code: 'TS-10', qty: 480, status: 'in stock' },
  { name: 'Karet Sintetik', code: 'KS-11', qty: 300, status: 'in stock' },
  { name: 'Karet Ekspor', code: 'KE-12', qty: 50, status: 'low stock' },
  { name: 'Karet Dalam Negeri', code: 'KN-13', qty: 0, status: 'out of stock' },
];

interface StockItem {
  name: string;
  code: string;
  qty: number;
  status: 'in stock' | 'low stock' | 'out of stock';
}

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

const StockStatusBadge = ({ status }: { status: StockItem['status'] }) => {
  const colorMap = {
    'in stock': 'bg-green-200 text-green-800',
    'low stock': 'bg-yellow-200 text-yellow-800',
    'out of stock': 'bg-red-200 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${colorMap[status]}`}>
      {status.replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  );
};

interface PageProps {    
    totalAmountOutKaret: number;
}

export default function Dashboard({ totalAmountOutKaret }: PageProps) {

    const [search, setSearch] = useState('');
    const filteredStock = allStockData.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    console.log('Total Amount Out Karet:', totalAmountOutKaret);
    const displayValue = formatCurrency(totalAmountOutKaret || 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" /> {/* Dikembalikan seperti semula */}
            <div className="min-h-screen p-6 sm:p-8  font-inter">

                <div className="bg-[#2b75c4] rounded-xl p-5 shadow-md mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Dashboard Analitik Bisnis Karet
                    </h2>
                    <p className="text-sm text-gray-200 mt-1">
                        Selamat datang kembali 👋 Berikut adalah gambaran performa PT GKA, TSA, dan GK Agro.
                    </p>
                </div>

                {/* <Stat_Card/> */}

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
                        value="250,000 KG" 
                        subtitle="oleh TSA" 
                        gradient="from-blue-400 to-blue-600" 
                    />
                    
                    <StatCard 
                        icon={FaClipboardList} 
                        title="Pengajuan Tertunda" 
                        value="18" 
                        subtitle="Menunggu Persetujuan" 
                        gradient="from-red-400 to-red-600" 
                    />
                    
                    <StatCard 
                        icon={FaBoxOpen} 
                        title="Total Stok Karet" 
                        value="12,000 Unit" 
                        subtitle="di Gudang PT GKA" 
                        gradient="from-yellow-400 to-yellow-600" 
                    />
                    
                    <StatCard 
                        icon={FaUsers} 
                        title="Total Penoreh Aktif" 
                        value="340" 
                        subtitle="Terdaftar" 
                        gradient="from-purple-400 to-purple-600" 
                    />
                    
                    <StatCard 
                        icon={FaFileInvoice} 
                        title="Faktur Belum Dibayar" 
                        value="22" subtitle="Faktur" 
                        gradient="from-pink-400 to-pink-600" 
                    />
                    
                    <StatCard 
                        icon={FaMoneyBill} 
                        title="Total Kasbon Pending" 
                        value="Rp 56 Jt" 
                        subtitle="Menunggu Persetujuan" 
                        gradient="from-orange-400 to-orange-600" 
                    />
                    
                    <StatCard 
                        icon={FaUserTie} 
                        title="Total Peran Pengguna"
                        value="7" 
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
                            Produksi TSA & Penjualan PT GKA
                        </h4>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                            { name: 'Jan', produksi: 4000, penjualan: 2400 },
                            { name: 'Feb', produksi: 3000, penjualan: 1398 },
                            { name: 'Mar', produksi: 2000, penjualan: 9800 },
                            { name: 'Apr', produksi: 2780, penjualan: 3908 },
                            ]}
                            margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ borderRadius: 8 }} />
                            <Legend />

                            {/* Bar chart */}
                            <Bar dataKey="produksi" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="penjualan" fill="#22C55E" radius={[8, 8, 0, 0]} />

                            {/* Line overlay (trend line) */}
                            <Line type="monotone" dataKey="produksi" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="penjualan" stroke="#16A34A" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
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
                            data={[
                            { name: 'Jan', value: 4000 },
                            { name: 'Feb', value: 3000 },
                            { name: 'Mar', value: 5000 },
                            { name: 'Apr', value: 4200 },
                            ]}
                            margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ borderRadius: 8 }} />
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
                        <PieChart>
                            <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={50}
                            paddingAngle={5}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip
                            contentStyle={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value: number, name: string) => [`${value} unit`, name]}
                            />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* BAR CHART: Pendapatan Penoreh */}
                    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <FaUserFriends className="text-indigo-600 text-xl" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">Pendapatan Penoreh Teratas</h4>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={topPenoreh}
                            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                            contentStyle={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            formatter={(value: number, name: string) => [`Rp ${value.toLocaleString()}`, 'Pendapatan']}
                            />
                            <Bar
                            dataKey="value"
                            fill="#6366F1"
                            radius={[10, 10, 0, 0]}
                            animationDuration={800}
                            />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-blue-100 p-2 rounded-full">
                        <FaBoxOpen className="text-blue-600 text-lg" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                        Produksi Karet Terpadu <span className="text-sm text-gray-400">(Stok Masuk)</span>
                        </h4>
                    </div>

                    <input
                        type="text"
                        placeholder="🔍 Cari nama produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                            <th className="py-3 px-4">Nama Produk</th>
                            <th className="py-3 px-4">Kode</th>
                            <th className="py-3 px-4">Jumlah</th>
                            <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStock.map((item, idx) => (
                            <tr
                                key={idx}
                                className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                            >
                                <td className="py-2.5 px-4 font-medium">{item.name}</td>
                                <td className="py-2.5 px-4">{item.code}</td>
                                <td className="py-2.5 px-4">{item.qty}</td>
                                <td className="py-2.5 px-4">
                                <StockStatusBadge status={item.status} />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>

  
            </div>
        </AppLayout>
    );
};
