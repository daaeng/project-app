// ./resources/js/Pages/Index.tsx

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Activity,
    Archive,
    Box,
    Calendar,
    CreditCard,
    DollarSign,
    FileClock,
    Filter,
    LayoutDashboard,
    TrendingUp,
    Truck,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- Konfigurasi Awal ---
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

// --- Helper Functions ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatCompactNumber = (number: number) => {
    return Intl.NumberFormat('id-ID', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number);
};

// --- Komponen StatCard Futuristik (Aesthetic Glass) ---
const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => {
    // Definisi tema warna untuk Glow dan Icon
    const themes: any = {
        emerald: {
            bg: "hover:shadow-emerald-500/20 hover:border-emerald-500/50",
            icon: "bg-emerald-500 shadow-emerald-500/40",
            text: "text-emerald-500",
            glow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        },
        blue: {
            bg: "hover:shadow-blue-500/20 hover:border-blue-500/50",
            icon: "bg-blue-500 shadow-blue-500/40",
            text: "text-blue-500",
            glow: "from-blue-500/20 via-blue-500/5 to-transparent",
        },
        rose: {
            bg: "hover:shadow-rose-500/20 hover:border-rose-500/50",
            icon: "bg-rose-500 shadow-rose-500/40",
            text: "text-rose-500",
            glow: "from-rose-500/20 via-rose-500/5 to-transparent",
        },
        amber: {
            bg: "hover:shadow-amber-500/20 hover:border-amber-500/50",
            icon: "bg-amber-500 shadow-amber-500/40",
            text: "text-amber-500",
            glow: "from-amber-500/20 via-amber-500/5 to-transparent",
        },
        violet: {
            bg: "hover:shadow-violet-500/20 hover:border-violet-500/50",
            icon: "bg-violet-500 shadow-violet-500/40",
            text: "text-violet-500",
            glow: "from-violet-500/20 via-violet-500/5 to-transparent",
        },
        indigo: {
            bg: "hover:shadow-indigo-500/20 hover:border-indigo-500/50",
            icon: "bg-indigo-500 shadow-indigo-500/40",
            text: "text-indigo-500",
            glow: "from-indigo-500/20 via-indigo-500/5 to-transparent",
        },
        cyan: {
            bg: "hover:shadow-cyan-500/20 hover:border-cyan-500/50",
            icon: "bg-cyan-500 shadow-cyan-500/40",
            text: "text-cyan-500",
            glow: "from-cyan-500/20 via-cyan-500/5 to-transparent",
        },
        orange: {
            bg: "hover:shadow-orange-500/20 hover:border-orange-500/50",
            icon: "bg-orange-500 shadow-orange-500/40",
            text: "text-orange-500",
            glow: "from-orange-500/20 via-orange-500/5 to-transparent",
        },
        pink: {
            bg: "hover:shadow-pink-500/20 hover:border-pink-500/50",
            icon: "bg-pink-500 shadow-pink-500/40",
            text: "text-pink-500",
            glow: "from-pink-500/20 via-pink-500/5 to-transparent",
        },
    };

    const t = themes[color] || themes.blue;

    return (
        <div className={`relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-300 ${t.bg} hover:-translate-y-1`}>
            {/* Ambient Glow Background */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${t.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${t.icon} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {/* Decorative Chip */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${t.icon}`} />
                        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metric</span>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{subtitle}</p>
                    <Activity className={`w-4 h-4 ${t.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
            </div>
        </div>
    );
};

// --- Tipe Data ---
interface PageProps {
    totalAmountOutKaret: number;
    hsl_tsa: number;
    hsl_beli: number;
    totalPendingRequests: number;
    stok_gka: number;
    jml_penoreh: number;
    jml_pegawai: number;
    totalPendingNota: number;
    totalRevenueAmount: number;
    totalRevenueKg: number;
    filter?: { search?: string; time_period?: string; month?: string; year?: string };
    monthlyData: { name: string; temadu: number; sebayar: number; penjualan: number }[];
    monthlyRevenueData: { name: string; value: number }[];
    topIncisorRevenue: { name: string; value: number; qty_karet: number }[];
    qualityDistribution: { name: string; value: number }[];
}

export default function Dashboard({
    totalAmountOutKaret,
    hsl_tsa,
    hsl_beli,
    totalPendingRequests,
    stok_gka,
    jml_penoreh,
    jml_pegawai,
    totalPendingNota,
    totalRevenueAmount,
    filter,
    monthlyData,
    monthlyRevenueData,
    qualityDistribution,
    topIncisorRevenue,
}: PageProps) {
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');
    const [selectedMonth, setSelectedMonth] = useState(filter?.month || '');
    const [selectedYear, setSelectedYear] = useState(filter?.year || '');

    const currentYear = new Date().getFullYear();
    const months = [
        { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' },
        { value: '03', label: 'Mar' }, { value: '04', label: 'Apr' },
        { value: '05', label: 'Mei' }, { value: '06', label: 'Jun' },
        { value: '07', label: 'Jul' }, { value: '08', label: 'Ags' },
        { value: '09', label: 'Sep' }, { value: '10', label: 'Okt' },
        { value: '11', label: 'Nov' }, { value: '12', label: 'Des' },
    ];
    const years = Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    useEffect(() => {
        setTimePeriod(filter?.time_period || 'this-month');
        setSelectedMonth(filter?.month || '');
        setSelectedYear(filter?.year || '');
    }, [filter]);

    const handleFilterChange = (newFilter: any) => {
        const query = {
            time_period: timePeriod,
            month: selectedMonth,
            year: selectedYear,
            ...newFilter,
        };
        router.get(route('dashboard'), query, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50/30 dark:bg-black p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
                
                {/* 1. Header Section with Glass Effect */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Business Command Center</h1>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pl-11">
                            Real-time analytics and performance monitoring.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                            <Select
                                value={timePeriod}
                                onValueChange={(val) => {
                                    setTimePeriod(val);
                                    if (val !== 'custom') handleFilterChange({ time_period: val, month: null, year: null });
                                }}
                            >
                                <SelectTrigger className="w-[140px] border-0 h-9 bg-transparent focus:ring-0 text-sm font-medium">
                                    <SelectValue placeholder="Periode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                                    <SelectItem value="last-month">Bulan Lalu</SelectItem>
                                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                                    <SelectItem value="all-time">Semua Data</SelectItem>
                                    <SelectItem value="custom">Custom...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {timePeriod === 'custom' && (
                            <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                                <Select
                                    value={selectedMonth}
                                    onValueChange={(val) => { setSelectedMonth(val); handleFilterChange({ month: val, time_period: 'custom' }); }}
                                >
                                    <SelectTrigger className="w-[90px] h-11 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"><SelectValue placeholder="Bulan" /></SelectTrigger>
                                    <SelectContent>{months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select
                                    value={selectedYear}
                                    onValueChange={(val) => { setSelectedYear(val); handleFilterChange({ year: val, time_period: 'custom' }); }}
                                >
                                    <SelectTrigger className="w-[90px] h-11 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"><SelectValue placeholder="Tahun" /></SelectTrigger>
                                    <SelectContent>{years.map((y) => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        )}
                        
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-gray-200 dark:border-gray-700" onClick={() => handleFilterChange({})}>
                            <Filter className="w-4 h-4 text-gray-500" />
                        </Button>
                    </div>
                </div>

                {/* 2. Stat Cards Grid (Aesthetic) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard
                        title="Pendapatan Bersih"
                        value={formatCurrency(totalRevenueAmount || 0)}
                        subtitle="Akumulasi Penjualan GKA"
                        icon={DollarSign}
                        color="emerald"
                    />
                    <StatCard
                        title="Produksi Karet"
                        value={`${formatCompactNumber(hsl_tsa)} Kg`}
                        subtitle="Total Output TSA"
                        icon={Box}
                        color="blue"
                    />
                    <StatCard
                        title="Pengajuan Pending"
                        value={`${totalPendingRequests}`}
                        subtitle="Menunggu Persetujuan"
                        icon={Archive}
                        color="rose"
                    />
                    <StatCard
                        title="Stok Terkirim"
                        value={`${formatCompactNumber(stok_gka)} Kg`}
                        subtitle="Shipment ke Buyer"
                        icon={Truck}
                        color="amber"
                    />
                    
                    <StatCard
                        title="Total Penoreh"
                        value={`${jml_penoreh}`}
                        subtitle="Tenaga Kerja Aktif"
                        icon={Users}
                        color="violet"
                    />
                    <StatCard
                        title="Total Pengeluaran"
                        value={formatCurrency(hsl_beli || 0)}
                        subtitle="Pembelian Karet"
                        icon={Wallet}
                        color="pink"
                    />
                    <StatCard
                        title="Nota Pending"
                        value={formatCurrency(totalPendingNota || 0)}
                        subtitle="Menunggu Konfirmasi"
                        icon={FileClock}
                        color="orange"
                    />
                    <StatCard
                        title="System Users"
                        value={`${jml_pegawai}`}
                        subtitle="Pengguna Terdaftar"
                        icon={CreditCard}
                        color="indigo"
                    />
                </div>

                {/* 3. Main Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* Revenue Trend - Focus Chart (2/3 width) */}
                    <Card className="xl:col-span-2 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-bold">Tren Pertumbuhan Pendapatan</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">Visualisasi performa penjualan finansial.</p>
                                </div>
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#94a3b8' }} 
                                            dy={10} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#94a3b8' }} 
                                            tickFormatter={formatCompactNumber} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                            formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#10b981" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Production Mix - Secondary Chart (1/3 width) */}
                    <Card className="xl:col-span-1 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-bold">Komposisi Produksi</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">Temadu vs Sebayar</p>
                                </div>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[350px] w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={40} tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} iconType="circle"/>
                                        <Bar dataKey="temadu" name="Temadu" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="sebayar" name="Sebayar" stackId="a" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Additional Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Top Penoreh */}
                    <Card className="xl:col-span-2 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-8 py-6">
                            <div className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Top Penoreh Produktif</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">Peringkat berdasarkan volume produksi (Kg).</p>
                                </div>
                                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                                    <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topIncisorRevenue} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} />
                                        <Tooltip 
                                            cursor={{fill: '#f8fafc'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="qty_karet" name="Produksi (Kg)" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={16} background={{ fill: '#f8fafc', radius: [0, 6, 6, 0] }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quality Distribution */}
                    <Card className="xl:col-span-1 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg font-bold">Distribusi Kualitas</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">Breakdown kualitas hasil.</p>
                                </div>
                                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                                    <Box className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[280px] w-full flex items-center justify-center">
                                {qualityDistribution.some(d => d.value > 0) ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={qualityDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={8}
                                                dataKey="value"
                                                cornerRadius={6}
                                            >
                                                {qualityDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                            <Legend verticalAlign="bottom" iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-gray-400 text-sm">
                                        <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        Tidak ada data kualitas tersedia
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}