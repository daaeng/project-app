import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Eye, Pencil, FileText, Receipt, Clock, 
    PlusCircle, Trash2, 
    Wallet, Filter, 
    ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

// Recharts untuk Grafik
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrasi & Keuangan', href: '/administrasis' },
];

// --- Interfaces ---

interface SummaryData {
    totalRequests: number;
    totalNotas: number;
    pendingCount: number;
    hargaSahamKaret: number;
    hargaDollar: number;
    totalPengeluaran: number;
    labaRugi: number;
    totalPenjualanKaret: number; // Revenue
    s_karet: number;
    tb_karet: number;
}

interface ChartDataPoint {
    name: string;
    Pemasukan: number;
    Pengeluaran: number;
}

interface PengeluaranData {
    id: number;
    kategori: string;
    deskripsi: string | null;
    jumlah: number;
    tanggal_pengeluaran: string;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface PageProps {
    requests: PaginatedData<any>;
    notas: PaginatedData<any>;
    summary: SummaryData;
    chartData: ChartDataPoint[];
    filter?: { time_period?: string; month?: string; year?: string };
    currentMonth: number;
    currentYear: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// --- [HELPER BARU] Format Tanggal Indonesia (3 Desember 2025) ---
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export default function AdminPage({ requests, notas, summary, chartData, filter, currentMonth, currentYear }: PageProps) {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState("overview");
    const [isHargaModalOpen, setIsHargaModalOpen] = useState(false);
    const [isPengeluaranAddModalOpen, setIsPengeluaranAddModalOpen] = useState(false);
    const [currentHargaType, setCurrentHargaType] = useState<'harga_saham_karet' | 'harga_dollar' | null>(null);
    
    // Filter State
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');
    const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    // Expense Table State (Client Side Fetching)
    const [expenseData, setExpenseData] = useState<PaginatedData<PengeluaranData>>({
        data: [], links: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 }
    });
    const [isExpensesLoading, setIsExpensesLoading] = useState(false);
    const [expensePage, setExpensePage] = useState(1);

    // Forms
    const hargaForm = useForm({ nilai: '', tanggal_berlaku: new Date().toISOString().split('T')[0], jenis: '' });
    const pengeluaranForm = useForm({ id: null, kategori: '', deskripsi: '', jumlah: '', tanggal_pengeluaran: new Date().toISOString().split('T')[0] });

    // --- Effects ---
    
    // Fetch Data Pengeluaran ketika Tab Expenses aktif atau filter berubah
    useEffect(() => {
        if (activeTab === 'expenses') {
            fetchExpenses();
        }
    }, [activeTab, expensePage, selectedMonth, selectedYear]);

    const fetchExpenses = async () => {
        setIsExpensesLoading(true);
        try {
            // Kita gunakan API yang sudah ada di Controller: getPengeluarans
            const response = await fetch(route('administrasis.getPengeluarans', {
                month: selectedMonth,
                year: selectedYear,
                page: expensePage
            }));
            const data = await response.json();
            setExpenseData(data);
        } catch (error) {
            console.error("Gagal memuat data pengeluaran:", error);
        } finally {
            setIsExpensesLoading(false);
        }
    };

    // --- Handlers ---

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        const params: any = { time_period: value };
        if (value === 'specific-month') {
            params.month = String(new Date().getMonth() + 1);
            params.year = String(new Date().getFullYear());
            setSelectedMonth(params.month); setSelectedYear(params.year);
        }
        router.get(route('administrasis.index'), params, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData', 'filter'] });
    };

    const handleMonthChange = (v: string) => { 
        setSelectedMonth(v); 
        router.get(route('administrasis.index'), { time_period: timePeriod, month: v, year: selectedYear }, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData'] });
    };
    
    const handleYearChange = (v: string) => { 
        setSelectedYear(v); 
        router.get(route('administrasis.index'), { time_period: timePeriod, month: selectedMonth, year: v }, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData'] });
    };

    const openHargaModal = (type: 'harga_saham_karet' | 'harga_dollar', val: number) => { 
        setCurrentHargaType(type); 
        hargaForm.setData({ ...hargaForm.data, jenis: type, nilai: val.toString() }); 
        setIsHargaModalOpen(true); 
    };
    
    const submitHarga = (e: React.FormEvent) => { 
        e.preventDefault(); 
        hargaForm.post(route('administrasis.updateHarga'), { onSuccess: () => setIsHargaModalOpen(false) }); 
    };
    
    const openPengeluaranAdd = () => { pengeluaranForm.reset(); setIsPengeluaranAddModalOpen(true); };
    
    const submitPengeluaran = (e: React.FormEvent) => { 
        e.preventDefault(); 
        pengeluaranForm.post(route('administrasis.storePengeluaran'), { 
            onSuccess: () => {
                setIsPengeluaranAddModalOpen(false);
                if (activeTab === 'expenses') fetchExpenses(); // Refresh tabel jika sedang di tab expenses
                router.reload({ only: ['summary', 'chartData'] }); // Refresh summary di atas
            } 
        }); 
    };

    const handleDeletePengeluaran = (id: number) => {
        if(confirm('Hapus data pengeluaran ini?')) {
            router.delete(route('administrasis.destroyPengeluaran', id), {
                onSuccess: () => {
                    if (activeTab === 'expenses') fetchExpenses();
                    router.reload({ only: ['summary', 'chartData'] });
                }
            });
        }
    };

    // --- Helpers ---
    const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));
    const years = Array.from({ length: 7 }, (_, i) => ({ value: String(new Date().getFullYear() - 5 + i), label: String(new Date().getFullYear() - 5 + i) }));

    const renderPagination = (links: any[], setPage: (p: number) => void) => {
        if (!links || links.length < 3) return null;
        return (
            <div className="flex justify-center gap-1 mt-4">
                {links.map((link, i) => {
                    const label = link.label.replace('&laquo;', '').replace('&raquo;', '');
                    return (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && setPage(parseInt(label) || 1)}
                            className="h-8 w-8 p-0"
                        >
                            <span dangerouslySetInnerHTML={{__html: link.label}} />
                        </Button>
                    );
                })}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keuangan & Administrasi" />
            
            <div className="flex flex-col space-y-6 p-2 md:p-4 bg-gray-50/50 dark:bg-black min-h-screen">
                
                {/* 1. Header & Filter Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Heading title="Keuangan & Administrasi" />
                        <p className="text-muted-foreground text-sm">Pusat kontrol arus kas, pengeluaran, dan arsip dokumen.</p>
                    </div>
                    
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border shadow-sm">
                        <Filter className="w-4 h-4 text-gray-500 ml-2" />
                        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                            <SelectTrigger className="w-[160px] border-none shadow-none h-8 bg-transparent focus:ring-0">
                                <SelectValue placeholder="Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">Bulan Ini</SelectItem>
                                <SelectItem value="last-month">Bulan Lalu</SelectItem>
                                <SelectItem value="this-year">Tahun Ini</SelectItem>
                                <SelectItem value="specific-month">Pilih Spesifik</SelectItem>
                            </SelectContent>
                        </Select>

                        {timePeriod === 'specific-month' && (
                            <>
                                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="w-[120px] border-none shadow-none h-8 bg-transparent"><SelectValue /></SelectTrigger>
                                    <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={selectedYear} onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-[80px] border-none shadow-none h-8 bg-transparent"><SelectValue /></SelectTrigger>
                                    <SelectContent>{years.map(y => <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. Key Financial Metrics (Hero Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Profit Card */}
                    <Card className="border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Laba Bersih (Net Profit)
                                <Wallet className="w-4 h-4 text-emerald-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.labaRugi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(summary.labaRugi)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Pemasukan - Pengeluaran</p>
                        </CardContent>
                    </Card>

                    {/* Revenue Card */}
                    <Card className="border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Total Pemasukan
                                <ArrowUpRight className="w-4 h-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(summary.totalPenjualanKaret)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Dari Penjualan Karet</p>
                        </CardContent>
                    </Card>

                    {/* Expense Card */}
                    <Card className="border-l-4 border-rose-500 shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Total Pengeluaran
                                <ArrowDownRight className="w-4 h-4 text-rose-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(summary.totalPengeluaran)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Operasional & Lainnya</p>
                        </CardContent>
                    </Card>

                    {/* Indicator Card (Market Price) */}
                    <Card className="bg-zinc-900 text-white border-zinc-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-medium text-zinc-400">Indikator Pasar</CardTitle>
                                <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-zinc-800" onClick={() => openHargaModal('harga_saham_karet', summary.hargaSahamKaret)}>
                                    <Pencil className="w-3 h-3 text-zinc-400" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-400">Saham Karet</span>
                                <span className="font-bold text-amber-400">{summary.hargaSahamKaret}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-400">Kurs Dollar</span>
                                <span className="font-bold text-emerald-400">{formatCurrency(summary.hargaDollar)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-4">
                        <TabsList className="bg-white dark:bg-zinc-900 border">
                            <TabsTrigger value="overview">Ringkasan & Grafik</TabsTrigger>
                            <TabsTrigger value="expenses">Buku Pengeluaran</TabsTrigger>
                            <TabsTrigger value="invoices">Arsip Nota</TabsTrigger>
                            <TabsTrigger value="requests">
                                Permintaan 
                                {summary.pendingCount > 0 && <Badge variant="destructive" className="ml-2 h-5 px-1.5 rounded-full text-[10px]">{summary.pendingCount}</Badge>}
                            </TabsTrigger>
                        </TabsList>
                        
                        {/* Action Button based on Tab */}
                        {activeTab === 'expenses' && (
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white shadow-md" onClick={openPengeluaranAdd}>
                                <PlusCircle className="w-4 h-4 mr-2" /> Catat Pengeluaran
                            </Button>
                        )}
                    </div>

                    {/* TAB 1: OVERVIEW (Charts) */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Chart: Arus Kas */}
                            <Card className="lg:col-span-2 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Grafik Arus Kas (Cash Flow)</CardTitle>
                                    <CardDescription>Perbandingan Pemasukan vs Pengeluaran periode ini.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                                <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} tick={{fontSize: 12, fill: '#6b7280'}} />
                                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                                            <Legend />
                                            <Bar dataKey="Pemasukan" fill="url(#gradInc)" radius={[4,4,0,0]} name="Pemasukan" barSize={30} />
                                            <Bar dataKey="Pengeluaran" fill="url(#gradExp)" radius={[4,4,0,0]} name="Pengeluaran" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Summary List */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Ringkasan Aktivitas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-full text-blue-600"><FileText size={18} /></div>
                                            <div>
                                                <p className="text-sm font-medium">Permintaan</p>
                                                <p className="text-xs text-muted-foreground">Total diajukan</p>
                                            </div>
                                        </div>
                                        <span className="font-bold">{summary.totalRequests}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><Receipt size={18} /></div>
                                            <div>
                                                <p className="text-sm font-medium">Nota / Invoice</p>
                                                <p className="text-xs text-muted-foreground">Arsip tersimpan</p>
                                            </div>
                                        </div>
                                        <span className="font-bold">{summary.totalNotas}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-100 rounded-full text-amber-600"><Clock size={18} /></div>
                                            <div>
                                                <p className="text-sm font-medium">Pending</p>
                                                <p className="text-xs text-muted-foreground">Menunggu ACC</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-amber-600">{summary.pendingCount}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TAB 2: EXPENSES (Pengeluaran) */}
                    <TabsContent value="expenses">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Buku Pengeluaran</CardTitle>
                                        <CardDescription>Riwayat pengeluaran operasional perusahaan.</CardDescription>
                                    </div>
                                    {/* Indikator Loading */}
                                    {isExpensesLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead className="text-right">Jumlah</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expenseData.data.length > 0 ? (
                                            expenseData.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    {/* --- [GUNAKAN FORMAT DATE] --- */}
                                                    <TableCell>{formatDate(item.tanggal_pengeluaran)}</TableCell>
                                                    <TableCell><Badge variant="outline">{item.kategori}</Badge></TableCell>
                                                    <TableCell className="max-w-[200px] truncate" title={item.deskripsi || ''}>{item.deskripsi || '-'}</TableCell>
                                                    <TableCell className="text-right font-medium text-rose-600">{formatCurrency(item.jumlah)}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeletePengeluaran(item.id)}>
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    Tidak ada data pengeluaran untuk periode ini.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                {/* Paginasi Khusus Expense (AJAX) */}
                                {expenseData.links.length > 3 && renderPagination(expenseData.links, setExpensePage)}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 3: INVOICES (Arsip Nota) */}
                    <TabsContent value="invoices">
                        <Card>
                            <CardHeader><CardTitle>Arsip Nota & Kwitansi</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Pihak Terkait</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead className="text-right">Nominal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {notas.data.map((item: any) => (
                                            <TableRow key={item.id}>
                                                {/* --- [GUNAKAN FORMAT DATE] --- */}
                                                <TableCell>{formatDate(item.date)}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.desk}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(parseFloat(item.dana))}</TableCell>
                                                <TableCell><Tag status={item.status} /></TableCell>
                                                <TableCell className="text-center">
                                                    {can('administrasis.view') && (
                                                        <Link href={route('notas.showAct', item.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* Paginasi Bawaan Laravel */}
                                {notas.links.length > 3 && (
                                    <div className="flex justify-center gap-1 mt-4">
                                        {notas.links.map((link: any, i: number) => {
                                            const label = link.label.replace('&laquo;', '').replace('&raquo;', '');
                                            return link.url ? (
                                                <Link key={i} href={link.url} preserveState preserveScroll only={['notas']}>
                                                    <Button variant={link.active ? "default" : "outline"} size="sm" className="h-8 w-8 p-0">
                                                        <span dangerouslySetInnerHTML={{__html: link.label}} />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button key={i} variant="outline" size="sm" disabled className="h-8 w-8 p-0"><span dangerouslySetInnerHTML={{__html: link.label}} /></Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 4: REQUESTS (Permintaan) */}
                    <TabsContent value="requests">
                         <Card>
                            <CardHeader><CardTitle>Permintaan Dana / Barang</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>No Surat</TableHead>
                                            <TableHead>Perihal</TableHead>
                                            <TableHead className="text-right">Estimasi Dana</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.data.map((item: any) => (
                                            <TableRow key={item.id}>
                                                {/* --- [GUNAKAN FORMAT DATE] --- */}
                                                <TableCell>{formatDate(item.tanggal)}</TableCell>
                                                <TableCell>{item.nomor}</TableCell>
                                                <TableCell>{item.perihal}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(parseFloat(item.grand_total))}</TableCell>
                                                <TableCell><Tag status={item.status} /></TableCell>
                                                <TableCell className="text-center">
                                                    {can('administrasis.view') && (
                                                        <Link href={route('ppb.show', item.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-500" /></Button></Link>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* Paginasi Bawaan Laravel */}
                                {requests.links.length > 3 && (
                                    <div className="flex justify-center gap-1 mt-4">
                                        {requests.links.map((link: any, i: number) => {
                                            const label = link.label.replace('&laquo;', '').replace('&raquo;', '');
                                            return link.url ? (
                                                <Link key={i} href={link.url} preserveState preserveScroll only={['requests']}>
                                                    <Button variant={link.active ? "default" : "outline"} size="sm" className="h-8 w-8 p-0">
                                                        <span dangerouslySetInnerHTML={{__html: link.label}} />
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button key={i} variant="outline" size="sm" disabled className="h-8 w-8 p-0"><span dangerouslySetInnerHTML={{__html: link.label}} /></Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* --- Modals --- */}
                
                {/* Modal Update Harga */}
                <Dialog open={isHargaModalOpen} onOpenChange={setIsHargaModalOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Update Harga Pasar</DialogTitle></DialogHeader>
                        <form onSubmit={submitHarga} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Nilai Baru</Label>
                                <Input type="number" step="0.01" value={hargaForm.data.nilai} onChange={e => hargaForm.setData('nilai', e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Berlaku</Label>
                                <Input type="date" value={hargaForm.data.tanggal_berlaku} onChange={e => hargaForm.setData('tanggal_berlaku', e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={hargaForm.processing}>Simpan Perubahan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Tambah Pengeluaran */}
                <Dialog open={isPengeluaranAddModalOpen} onOpenChange={setIsPengeluaranAddModalOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Catat Pengeluaran Baru</DialogTitle></DialogHeader>
                        <form onSubmit={submitPengeluaran} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Input value={pengeluaranForm.data.kategori} onChange={e => pengeluaranForm.setData('kategori', e.target.value)} placeholder="Contoh: Operasional, Gaji, Listrik" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Input value={pengeluaranForm.data.deskripsi} onChange={e => pengeluaranForm.setData('deskripsi', e.target.value)} placeholder="Keterangan singkat..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Jumlah (Rp)</Label>
                                <Input type="number" value={pengeluaranForm.data.jumlah} onChange={e => pengeluaranForm.setData('jumlah', e.target.value)} placeholder="0" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal</Label>
                                <Input type="date" value={pengeluaranForm.data.tanggal_pengeluaran} onChange={e => pengeluaranForm.setData('tanggal_pengeluaran', e.target.value)} required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={pengeluaranForm.processing}>Simpan Pengeluaran</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}