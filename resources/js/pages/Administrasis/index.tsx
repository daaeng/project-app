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
    Eye, Pencil, PlusCircle, Trash2, 
    Wallet, Filter, 
    Building2, Scale, TrendingUp, Banknote, Loader2, Landmark
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administrasi & Keuangan', href: '/administrasis' },
];

// --- Interfaces Data ---

interface FinancialReport {
    bank: {
        in_penjualan: number; 
        in_lainnya: number; 
        out_gaji: number; 
        out_kapal: number; 
        out_truck: number; 
        out_hutang: number; 
        out_penarikan: number; 
        total_in: number; 
        total_out: number; 
        balance: number;
    };
    kas: {
        in_penarikan: number; 
        out_lapangan: number; 
        out_kantor: number; 
        out_bpjs: number; 
        out_belikaret: number; 
        out_kasbon: number; 
        total_in: number; 
        total_out: number; 
        balance: number;
    };
    profit_loss: { 
        revenue: number; 
        cogs: number; 
        gross_profit: number; 
        opex: number; 
        net_profit: number; 
    };
    neraca: { 
        assets: { 
            kas_period: number; 
            bank_period: number; 
            piutang: number; 
            inventory_value: number; 
        }; 
        liabilities: { 
            hutang_dagang: number; 
        } 
    }
}

interface SummaryData {
    totalRequests: number; 
    totalNotas: number; 
    pendingRequests: number; 
    pendingNotas: number; 
    pendingCount: number; 
    hargaSahamKaret: number; 
    hargaDollar: number; 
    totalPengeluaran: number; 
    labaRugi: number; 
    totalPenjualanKaret: number; 
    s_karet: number; 
    tb_karet: number; 
    reports: FinancialReport;
}

interface ChartDataPoint { 
    name: string; 
    Pemasukan: number; 
    Pengeluaran: number; 
}

// Interface Baru untuk Transaksi Manual
interface TransactionData {
    id: number;
    type: 'income' | 'expense';
    source: 'cash' | 'bank';
    category: string;
    description: string | null;
    amount: number;
    transaction_date: string;
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

// --- Helpers ---
const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const formatDate = (dateString: string) => (!dateString ? '-' : new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));

// Helper Component untuk Baris Laporan agar rapi
const ReportRow = ({ label, value, isMinus = false, isBold = false }: { label: string, value: number, isMinus?: boolean, isBold?: boolean }) => (
    <div className={`flex justify-between items-center text-sm py-1 border-b border-dashed border-gray-100 dark:border-zinc-800 last:border-0 ${isBold ? 'font-bold' : ''}`}>
        <span className={`${isBold ? 'text-gray-900 dark:text-gray-100' : 'text-muted-foreground'}`}>{label}</span>
        <span className={`${isMinus ? 'text-rose-600' : (isBold ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300')}`}>
            {isMinus ? '-' : ''} {formatCurrency(value)}
        </span>
    </div>
);

export default function AdminPage({ requests, notas, summary, chartData, filter, currentMonth, currentYear }: PageProps) {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState("reports");
    const [isHargaModalOpen, setIsHargaModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    
    // Filter State
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');
    const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    // Table State (Fetching Client-side untuk transaksi manual)
    const [trxData, setTrxData] = useState<PaginatedData<TransactionData>>({ data: [], links: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } });
    const [isTrxLoading, setIsTrxLoading] = useState(false);
    const [trxPage, setTrxPage] = useState(1);

    // --- Forms ---
    
    // UI Helper: Menentukan mode input (Kas Keluar / Bank Keluar / Bank Masuk)
    const [uiSource, setUiSource] = useState<'bank_out' | 'kas_out' | 'bank_in'>('kas_out');
    
    const trxForm = useForm({ 
        type: '',       // income / expense (diisi otomatis saat submit)
        source: '',     // cash / bank (diisi otomatis saat submit)
        kategori: '', 
        deskripsi: '', 
        jumlah: '', 
        tanggal: new Date().toISOString().split('T')[0] 
    });

    const hargaForm = useForm({ nilai: '', tanggal_berlaku: new Date().toISOString().split('T')[0], jenis: '' });

    // --- Effects ---
    
    // Ambil data transaksi saat tab "expenses" aktif atau filter berubah
    useEffect(() => {
        if (activeTab === 'expenses') fetchTransactions();
    }, [activeTab, trxPage, selectedMonth, selectedYear]);

    const fetchTransactions = async () => {
        setIsTrxLoading(true);
        try {
            // Memanggil API baru: getTransactions
            const response = await fetch(route('administrasis.getTransactions', { month: selectedMonth, year: selectedYear, page: trxPage }));
            const data = await response.json();
            setTrxData(data);
        } catch (error) { console.error("Error fetching transactions:", error); } 
        finally { setIsTrxLoading(false); }
    };

    // --- Handlers ---

    // Filter Handlers
    const handleTimePeriodChange = (value: string) => { setTimePeriod(value); const params: any = { time_period: value }; if (value === 'specific-month') { params.month = String(new Date().getMonth() + 1); params.year = String(new Date().getFullYear()); setSelectedMonth(params.month); setSelectedYear(params.year); } router.get(route('administrasis.index'), params, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData', 'filter'] }); };
    const handleMonthChange = (v: string) => { setSelectedMonth(v); router.get(route('administrasis.index'), { time_period: timePeriod, month: v, year: selectedYear }, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData'] }); };
    const handleYearChange = (v: string) => { setSelectedYear(v); router.get(route('administrasis.index'), { time_period: timePeriod, month: selectedMonth, year: v }, { preserveState: true, replace: true, only: ['summary', 'requests', 'notas', 'chartData'] }); };

    // Modal Handlers
    const openTransactionModal = () => { trxForm.reset(); setUiSource('kas_out'); setIsTransactionModalOpen(true); };
    const openHargaModal = (type: string, val: number) => { hargaForm.setData({ ...hargaForm.data, jenis: type, nilai: val.toString() }); setIsHargaModalOpen(true); };

    // Submit Transaksi Baru
    const submitTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Logika konversi dari Pilihan UI ke Kolom Database
        let type = 'expense';
        let source = 'cash';

        if (uiSource === 'kas_out') { 
            type = 'expense'; 
            source = 'cash'; 
        } else if (uiSource === 'bank_out') { 
            type = 'expense'; 
            source = 'bank'; 
        } else if (uiSource === 'bank_in') { 
            type = 'income'; 
            source = 'bank'; 
        }

        // Transform form data sebelum dikirim
        trxForm.transform((data) => ({ ...data, type, source }))
               .post(route('administrasis.storeTransaction'), {
                   onSuccess: () => {
                       setIsTransactionModalOpen(false);
                       // Refresh data tabel jika sedang di tab buku transaksi
                       if (activeTab === 'expenses') fetchTransactions();
                       // Refresh summary di atas (Laporan Keuangan)
                       router.reload({ only: ['summary', 'chartData'] });
                   }
               });
    };

    const deleteTransaction = (id: number) => { if(confirm('Hapus transaksi ini?')) router.delete(route('administrasis.destroyTransaction', id), { onSuccess: () => { if (activeTab === 'expenses') fetchTransactions(); router.reload({ only: ['summary', 'chartData'] }); } }); };
    const submitHarga = (e: React.FormEvent) => { e.preventDefault(); hargaForm.post(route('administrasis.updateHarga'), { onSuccess: () => setIsHargaModalOpen(false) }); };

    // Opsi Dropdown
    const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }) }));
    const years = Array.from({ length: 7 }, (_, i) => ({ value: String(new Date().getFullYear() - 5 + i), label: String(new Date().getFullYear() - 5 + i) }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keuangan & Administrasi" />
            
            <div className="flex flex-col space-y-6 p-2 md:p-4 bg-gray-50/50 dark:bg-black min-h-screen">
                
                {/* 1. Header & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Heading title="Keuangan & Administrasi" />
                        <p className="text-muted-foreground text-sm">Pusat kontrol arus kas, laporan, dan arsip dokumen.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border shadow-sm">
                        <Filter className="w-4 h-4 text-gray-500 ml-2" />
                        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                            <SelectTrigger className="w-[160px] border-none shadow-none h-8 bg-transparent focus:ring-0"><SelectValue placeholder="Periode" /></SelectTrigger>
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

                {/* 2. Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-emerald-500 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Laba Bersih
                                <Wallet className="w-4 h-4 text-emerald-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.labaRugi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency(summary.labaRugi)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Periode ini</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-blue-500 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Saldo Bank (Mutasi)
                                <Building2 className="w-4 h-4 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(summary.reports.bank.balance)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Surplus/Defisit Periode Ini</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-amber-500 shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                                Saldo Kas (Mutasi)
                                <Banknote className="w-4 h-4 text-amber-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(summary.reports.kas.balance)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Surplus/Defisit Periode Ini</p>
                        </CardContent>
                    </Card>

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
                <Tabs defaultValue="reports" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-4">
                        <TabsList className="bg-white dark:bg-zinc-900 border overflow-x-auto">
                            <TabsTrigger value="reports">Laporan Keuangan</TabsTrigger>
                            <TabsTrigger value="overview">Grafik Analisa</TabsTrigger>
                            <TabsTrigger value="expenses">Buku Transaksi</TabsTrigger>
                            <TabsTrigger value="invoices">Arsip Nota {summary.pendingNotas > 0 && (<Badge variant="destructive" className="ml-2 h-4 px-1 rounded-full text-[10px]">{summary.pendingNotas}</Badge>)}</TabsTrigger>
                            <TabsTrigger value="requests">Permintaan {summary.pendingRequests > 0 && (<Badge variant="destructive" className="ml-2 h-4 px-1 rounded-full text-[10px]">{summary.pendingRequests}</Badge>)}</TabsTrigger>
                        </TabsList>
                        
                        {/* Tombol Utama: Catat Transaksi */}
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white shadow-md" onClick={openTransactionModal}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Catat Transaksi
                        </Button>
                    </div>

                    {/* TAB: LAPORAN KEUANGAN */}
                    <TabsContent value="reports" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Card Laporan Bank */}
                            <Card className="shadow-sm border-t-4 border-t-blue-500">
                                <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                        <Building2 className="w-5 h-5" /> Laporan Bank
                                    </CardTitle>
                                    <CardDescription>Arus kas masuk dan keluar via Rekening Bank</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Pemasukan (Uang Masuk)</p>
                                        <ReportRow label="Penjualan Karet (Buyer)" value={summary.reports.bank.in_penjualan} />
                                        <ReportRow label="Pemasukan Lain (Investasi/Modal)" value={summary.reports.bank.in_lainnya} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 mt-4">Pengeluaran (Uang Keluar)</p>
                                        <ReportRow label="Pembayaran Gaji (Payroll)" value={summary.reports.bank.out_gaji} isMinus />
                                        <ReportRow label="Pembayaran Kapal" value={summary.reports.bank.out_kapal} isMinus />
                                        <ReportRow label="Pembayaran Truck" value={summary.reports.bank.out_truck} isMinus />
                                        <ReportRow label="Bayar Hutang" value={summary.reports.bank.out_hutang} isMinus />
                                        <ReportRow label="Penarikan Tunai (Ke Kas)" value={summary.reports.bank.out_penarikan} isMinus />
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                                        <ReportRow label="Surplus / Defisit Bank" value={summary.reports.bank.balance} isBold />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Laporan Kas */}
                            <Card className="shadow-sm border-t-4 border-t-amber-500">
                                <CardHeader className="bg-amber-50/50 dark:bg-amber-900/10 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                        <Banknote className="w-5 h-5" /> Laporan Kas Tunai
                                    </CardTitle>
                                    <CardDescription>Arus kas operasional fisik/tunai</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Pemasukan (Sumber Kas)</p>
                                        <ReportRow label="Penarikan dari Bank" value={summary.reports.kas.in_penarikan} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 mt-4">Pengeluaran (Operasional)</p>
                                        <ReportRow label="Operasional Lapangan" value={summary.reports.kas.out_lapangan} isMinus />
                                        <ReportRow label="Operasional Kantor" value={summary.reports.kas.out_kantor} isMinus />
                                        <ReportRow label="BPJS Ketenagakerjaan" value={summary.reports.kas.out_bpjs} isMinus />
                                        <ReportRow label="Pembelian Karet (Tunai)" value={summary.reports.kas.out_belikaret} isMinus />
                                        <ReportRow label="Kasbon Pegawai" value={summary.reports.kas.out_kasbon} isMinus />
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                                        <ReportRow label="Sisa Kas Periode Ini" value={summary.reports.kas.balance} isBold />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Neraca */}
                            <Card className="shadow-sm border-t-4 border-t-slate-500">
                                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/10 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-400">
                                        <Scale className="w-5 h-5" /> Neraca (Posisi Keuangan)</CardTitle>
                                    <CardDescription>Estimasi posisi aset saat ini</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Aset (Harta)</p>
                                        <ReportRow label="Mutasi Kas Periode Ini" value={summary.reports.neraca.assets.kas_period} />
                                        <ReportRow label="Mutasi Bank Periode Ini" value={summary.reports.neraca.assets.bank_period} />
                                        <ReportRow label="Total Piutang Pegawai (Belum Lunas)" value={summary.reports.neraca.assets.piutang} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card Rugi Laba */}
                            <Card className="shadow-sm border-t-4 border-t-emerald-600">
                                <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                        <TrendingUp className="w-5 h-5" /> Laporan Rugi Laba
                                    </CardTitle>
                                    <CardDescription>Performa profitabilitas perusahaan</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <ReportRow label="Pendapatan (Penjualan Karet)" value={summary.reports.profit_loss.revenue} />
                                    <ReportRow label="HPP (Pembelian Karet)" value={summary.reports.profit_loss.cogs} isMinus />
                                    <div className="border-t border-dashed my-2"></div>
                                    <ReportRow label="Laba Kotor" value={summary.reports.profit_loss.gross_profit} isBold />
                                    
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Biaya Operasional (OpEx)</p>
                                        <ReportRow label="Total Biaya Operasional" value={summary.reports.profit_loss.opex} isMinus />
                                    </div>
                                    
                                    <div className="pt-4 border-t-2 border-gray-800 dark:border-white mt-2">
                                        <div className="flex justify-between items-center text-lg font-bold">
                                            <span>Laba Bersih</span>
                                            <span className={summary.reports.profit_loss.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                                {formatCurrency(summary.reports.profit_loss.net_profit)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </TabsContent>

                    {/* TAB: GRAFIK ANALISA */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card className="lg:col-span-2 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Grafik Arus Kas</CardTitle>
                                    <CardDescription>Perbandingan Pemasukan vs Pengeluaran.</CardDescription>
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
                        </div>
                    </TabsContent>

                    {/* TAB: BUKU TRANSAKSI (Daftar Manual) */}
                    <TabsContent value="expenses">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div><CardTitle>Buku Transaksi Manual</CardTitle><CardDescription>Daftar semua transaksi manual yang diinput.</CardDescription></div>
                                    {isTrxLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Sumber</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead className="text-right">Jumlah</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trxData.data.length > 0 ? (
                                            trxData.data.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{formatDate(item.transaction_date)}</TableCell>
                                                    <TableCell>
                                                        {item.source === 'bank' ? <Badge variant="default" className="bg-blue-600">Bank</Badge> : <Badge variant="outline" className="border-amber-500 text-amber-600">Kas</Badge>}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={item.type === 'income' ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>{item.type === 'income' ? '(+) ' : '(-) '} {item.category}</span>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px] truncate" title={item.description || ''}>{item.description || '-'}</TableCell>
                                                    <TableCell className={`text-right font-medium ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {formatCurrency(item.amount)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button variant="ghost" size="icon" onClick={() => deleteTransaction(item.id)}>
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (<TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada data transaksi.</TableCell></TableRow>)}
                                    </TableBody>
                                </Table>
                                {/* Paginasi Simple */}
                                <div className="flex justify-center mt-4 gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setTrxPage(p => Math.max(1, p - 1))} disabled={trxData.meta.current_page === 1}>Prev</Button>
                                    <span className="text-sm self-center">Page {trxData.meta.current_page} of {trxData.meta.last_page}</span>
                                    <Button size="sm" variant="outline" onClick={() => setTrxPage(p => Math.min(trxData.meta.last_page, p + 1))} disabled={trxData.meta.current_page === trxData.meta.last_page}>Next</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB INVOICES & REQUESTS */}
                    <TabsContent value="invoices">
                        <Card><CardHeader><CardTitle>Arsip Nota</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Pihak</TableHead><TableHead>Nominal</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>{notas.data.map((item: any) => (<TableRow key={item.id}><TableCell>{formatDate(item.date)}</TableCell><TableCell>{item.name}</TableCell><TableCell>{formatCurrency(parseFloat(item.dana))}</TableCell><TableCell><Tag status={item.status} /></TableCell><TableCell>{can('administrasis.view') && (<Link href={route('notas.showAct', item.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></Link>)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
                    </TabsContent>
                    
                    <TabsContent value="requests">
                         <Card><CardHeader><CardTitle>Permintaan Barang</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Perihal</TableHead><TableHead>Dana</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>{requests.data.map((item: any) => (<TableRow key={item.id}><TableCell>{formatDate(item.tanggal)}</TableCell><TableCell>{item.perihal}</TableCell><TableCell>{formatCurrency(parseFloat(item.grand_total))}</TableCell><TableCell><Tag status={item.status} /></TableCell><TableCell>{can('administrasis.view') && (<Link href={route('ppb.show', item.id)}><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></Link>)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
                    </TabsContent>
                </Tabs>

                {/* MODAL TRANSAKSI PENGELUARAN (REVISED) */}
                <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Catat Transaksi Baru</DialogTitle>
                            <CardDescription>Catat pemasukan atau pengeluaran manual.</CardDescription>
                        </DialogHeader>
                        <form onSubmit={submitTransaction} className="space-y-4 pt-2">
                            
                            {/* Pilihan Sumber Dana */}
                            <div className="grid grid-cols-3 gap-2">
                                <div 
                                    className={`p-2 border rounded-lg cursor-pointer text-center text-xs flex flex-col items-center justify-center gap-1 h-20 hover:bg-gray-50 transition-colors ${uiSource === 'kas_out' ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-sm' : ''}`}
                                    onClick={() => { setUiSource('kas_out'); trxForm.setData('kategori', ''); }}
                                >
                                    <Banknote className="w-5 h-5" />
                                    Kas Tunai (Keluar)
                                </div>
                                <div 
                                    className={`p-2 border rounded-lg cursor-pointer text-center text-xs flex flex-col items-center justify-center gap-1 h-20 hover:bg-gray-50 transition-colors ${uiSource === 'bank_out' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm' : ''}`}
                                    onClick={() => { setUiSource('bank_out'); trxForm.setData('kategori', ''); }}
                                >
                                    <Building2 className="w-5 h-5" />
                                    Bank (Keluar)
                                </div>
                                <div 
                                    className={`p-2 border rounded-lg cursor-pointer text-center text-xs flex flex-col items-center justify-center gap-1 h-20 hover:bg-gray-50 transition-colors ${uiSource === 'bank_in' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-sm' : ''}`}
                                    onClick={() => { setUiSource('bank_in'); trxForm.setData('kategori', ''); }}
                                >
                                    <Landmark className="w-5 h-5" />
                                    Bank (Masuk)
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Kategori Transaksi</Label>
                                <Select 
                                    value={trxForm.data.kategori} 
                                    onValueChange={(val) => trxForm.setData('kategori', val)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uiSource === 'kas_out' && (
                                            <>
                                                <SelectItem value="Operasional Lapangan">Operasional Lapangan (Harian)</SelectItem>
                                                <SelectItem value="Operasional Kantor">Operasional Kantor (ATK/Listrik/Dll)</SelectItem>
                                                <SelectItem value="BPJS Ketenagakerjaan">Bayar BPJS (Cash)</SelectItem>
                                                <SelectItem value="Pembelian Karet">Pembelian Karet (Cash)</SelectItem>
                                            </>
                                        )}
                                        {uiSource === 'bank_out' && (
                                            <>
                                                <SelectItem value="Penarikan Bank">Penarikan Tunai (Pindah ke Kas)</SelectItem>
                                                <SelectItem value="Pembayaran Kapal">Pembayaran Kapal / Logistik</SelectItem>
                                                <SelectItem value="Pembayaran Truck">Pembayaran Truck / Transport</SelectItem>
                                                <SelectItem value="Bayar Hutang">Bayar Hutang Perusahaan</SelectItem>
                                            </>
                                        )}
                                        {uiSource === 'bank_in' && (
                                            <>
                                                <SelectItem value="Setor Modal">Setor Modal / Suntik Dana</SelectItem>
                                                <SelectItem value="Dana Investasi">Pencairan Dana Investasi</SelectItem>
                                                <SelectItem value="Pendapatan Lain (Bank)">Bunga Bank / Pendapatan Lain</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Deskripsi / Keterangan</Label>
                                <Textarea 
                                    value={trxForm.data.deskripsi} 
                                    onChange={e => trxForm.setData('deskripsi', e.target.value)} 
                                    placeholder="Keterangan detail transaksi..." 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jumlah (Rp)</Label>
                                    <Input 
                                        type="number" 
                                        value={trxForm.data.jumlah} 
                                        onChange={e => trxForm.setData('jumlah', e.target.value)} 
                                        placeholder="0" 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal</Label>
                                    <Input 
                                        type="date" 
                                        value={trxForm.data.tanggal} 
                                        onChange={e => trxForm.setData('tanggal', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={trxForm.processing}>
                                    {trxForm.processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* MODAL HARGA (EXISTING) */}
                <Dialog open={isHargaModalOpen} onOpenChange={setIsHargaModalOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Update Harga Pasar</DialogTitle></DialogHeader>
                        <form onSubmit={submitHarga} className="space-y-4 pt-4">
                            <div className="space-y-2"><Label>Nilai Baru</Label><Input type="number" step="0.01" value={hargaForm.data.nilai} onChange={e => hargaForm.setData('nilai', e.target.value)} placeholder="0.00" /></div>
                            <div className="space-y-2"><Label>Tanggal Berlaku</Label><Input type="date" value={hargaForm.data.tanggal_berlaku} onChange={e => hargaForm.setData('tanggal_berlaku', e.target.value)} /></div>
                            <DialogFooter><Button type="submit" disabled={hargaForm.processing}>Simpan Perubahan</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </AppLayout>
    );
}