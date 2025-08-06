import React, { useState, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, FileText, Receipt, Clock, DollarSign, Banknote, FileCheck2, Edit, PlusCircle, Trash2, Info, Warehouse, HandCoins, Handshake, Landmark } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasi',
        href: '/administrasis',
    },
];

// Interface for Request Letter data
interface RequestData {
    id: number;
    date: string; // Submission Date
    devisi: string;
    j_pengajuan: string; // Submission Type / Subject
    dana: string;
    status: string;
    created_at: string;
    updated_at?: string; // Add for Update Date
}

// Interface for Invoice/Receipt data
interface NotaData {
    id: number;
    name: string; // Applicant/Party Name
    date: string; // Transaction Date
    devisi: string;
    desk: string; // Invoice Description / Subject
    dana: string;
    status: string;
    created_at: string;
    updated_at?: string; // Add for Update Date
}

// Interface for Expense data
interface PengeluaranData {
    id: number;
    kategori: string;
    deskripsi: string | null;
    jumlah: number;
    tanggal_pengeluaran: string;
    created_at: string;
    updated_at?: string;
}

// Interface for paginated data
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

// Interface for combined data on the frontend
interface CombinedAdminItem {
    id: number;
    originalId: number; // Original ID from Request or Nota
    type: 'request' | 'nota'; // Document Type: 'request' or 'nota'
    transactionDate: string; // Submission/Transaction Date
    requesterOrParty: string; // Applicant/Related Party
    subjectOrDescription: string; // Subject/Brief Description
    devisi: string;
    dana: string;
    status: string;
    createdAt: string; // For sorting
    updatedAt?: string; // Update Date (optional)
}

// Interface for summary/statistics data (updated)
interface SummaryData {
    totalRequests: number;
    totalNotas: number;
    totalPendingRequests: number;
    totalApprovedDana: number;
    hargaSahamKaret: number;
    hargaDollar: number;
    totalPengeluaran: number;
    labaRugi: number;
    totalPenjualanKaret: number;
    s_karet: number;
    h_karet: number;
    tb_karet: number;
    tj_karet: number;
}

// Interface for page props (updated)
interface PageProps {
    requests: PaginatedData<RequestData>;
    notas: PaginatedData<NotaData>;
    summary: SummaryData; 
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

export default function AdminPage({ requests, notas, summary, filter, currentMonth, currentYear }: PageProps) {
    const [isHargaModalOpen, setIsHargaModalOpen] = useState(false);
    const [isPengeluaranAddModalOpen, setIsPengeluaranAddModalOpen] = useState(false);
    const [isPengeluaranEditModalOpen, setIsPengeluaranEditModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [isLabaRugiInfoModalOpen, setIsLabaRugiInfoModalOpen] = useState(false);
    const [isPengeluaranListModalOpen, setIsPengeluaranListModalOpen] = useState(false); // State baru untuk modal daftar pengeluaran

    const [pengeluaranToDelete, setPengeluaranToDelete] = useState<number | null>(null);
    const [currentHargaType, setCurrentHargaType] = useState<'harga_saham_karet' | 'harga_dollar' | null>(null);
    const [selectedPengeluaran, setSelectedPengeluaran] = useState<PengeluaranData | null>(null);

    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'this-month');
    const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    // State untuk data pengeluaran di dalam modal
    const [modalPengeluarans, setModalPengeluarans] = useState<PaginatedData<PengeluaranData>>({
        data: [],
        links: [],
        meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    });
    const [modalPengeluaranMonth, setModalPengeluaranMonth] = useState<string>(String(currentMonth));
    const [modalPengeluaranYear, setModalPengeluaranYear] = useState<string>(String(currentYear));
    const [modalPengeluaranPage, setModalPengeluaranPage] = useState<number>(1);
    const [isLoadingPengeluarans, setIsLoadingPengeluaran] = useState(false);


    useEffect(() => {
        setTimePeriod(filter?.time_period || 'this-month');
        setSelectedMonth(String(filter?.month || currentMonth));
        setSelectedYear(String(filter?.year || currentYear));
    }, [filter?.time_period, filter?.month, filter?.year, currentMonth, currentYear]);

    // Effect untuk memuat data pengeluaran saat modal dibuka atau filter diubah
    useEffect(() => {
        if (isPengeluaranListModalOpen) {
            fetchPengeluarans();
        }
    }, [isPengeluaranListModalOpen, modalPengeluaranMonth, modalPengeluaranYear, modalPengeluaranPage]);

    // Fungsi untuk mengambil data pengeluaran dari backend
    const fetchPengeluarans = async () => {
        setIsLoadingPengeluaran(true);
        setModalPengeluarans({ // Clear data while loading
            data: [],
            links: [],
            meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
        });
        try {
            const response = await fetch(route('administrasis.getPengeluarans', {
                month: modalPengeluaranMonth,
                year: modalPengeluaranYear,
                page: modalPengeluaranPage,
            }));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setModalPengeluarans(data);
        } catch (error) {
            console.error("Error fetching pengeluarans:", error);
        } finally {
            setIsLoadingPengeluaran(false);
        }
    };

    // Form for price update
    const hargaForm = useForm({
        nilai: '',
        tanggal_berlaku: new Date().toISOString().split('T')[0],
        jenis: '',
    });

    // Form for adding/editing expenses
    const pengeluaranForm = useForm({
        id: null as number | null,
        kategori: '',
        deskripsi: '',
        jumlah: '',
        tanggal_pengeluaran: new Date().toISOString().split('T')[0],
    });

    const combinedData: CombinedAdminItem[] = [
        ...(requests.data || []).map(item => ({ // Tambahkan cek null/undefined
            id: item.id,
            originalId: item.id,
            type: 'request',
            transactionDate: item.date,
            requesterOrParty: item.devisi,
            subjectOrDescription: item.j_pengajuan,
            devisi: item.devisi,
            dana: item.dana,
            status: item.status,
            createdAt: item.created_at || item.date,
            updatedAt: item.updated_at || undefined, 
        })),
        ...(notas.data || []).map(item => ({ // Tambahkan cek null/undefined
            id: item.id,
            originalId: item.id,
            type: 'nota',
            transactionDate: item.date,
            requesterOrParty: item.name,
            subjectOrDescription: item.desk,
            devisi: item.devisi,
            dana: item.dana,
            status: item.status,
            createdAt: item.created_at || item.date,
            updatedAt: item.updated_at || undefined,
        }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const renderPagination = (pagination: PaginatedData<any>, typeLabel: string, pageName: string = 'page', isModalPagination: boolean = false) => {
        // Tambahkan cek keamanan untuk pagination dan links
        if (!pagination || !pagination.links || pagination.links.length === 0) {
            return null; // Jangan render paginasi jika tidak ada data atau link
        }

        const currentParams = new URLSearchParams(window.location.search);
        const paramsToKeep: { [key: string]: string } = {};

        // Keep main page filters for non-modal pagination
        if (!isModalPagination) {
            if (currentParams.has('time_period')) paramsToKeep['time_period'] = currentParams.get('time_period')!;
            if (currentParams.has('month')) paramsToKeep['month'] = currentParams.get('month')!;
            if (currentParams.has('year')) paramsToKeep['year'] = currentParams.get('year')!;
        }

        return (
            <div className="flex justify-center mt-4 mb-2">
                <span className="text-sm text-gray-600 mr-2">{typeLabel}:</span>
                {pagination.links.map((link: any, index: number) => {
                    // Pastikan link.url ada sebelum membuat objek URL
                    const linkUrl = link.url ? new URL(link.url) : null;
                    
                    if (isModalPagination) {
                        const pageNum = parseInt(link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));
                        return (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                onClick={() => {
                                    if (!isNaN(pageNum)) {
                                        setModalPengeluaranPage(pageNum);
                                    }
                                }}
                                disabled={!link.url} // Disable jika tidak ada URL (misalnya, halaman pertama/terakhir)
                                className="mx-1 px-3 py-1 text-sm rounded-md"
                            >
                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                            </Button>
                        );
                    } else {
                        // Untuk paginasi halaman utama, gunakan router.get Inertia
                        const newParams = linkUrl ? new URLSearchParams(linkUrl.search) : new URLSearchParams();

                        // Gabungkan parameter halaman utama yang ada
                        for (const key in paramsToKeep) {
                            newParams.set(key, paramsToKeep[key]);
                        }
                        // Pastikan parameter halaman yang benar diatur untuk paginasi utama
                        if (linkUrl) {
                            newParams.set(pageName, linkUrl.searchParams.get(pageName) || link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));
                        }

                        return (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                onClick={() => {
                                    if (linkUrl) { // Hanya navigasi jika ada URL yang valid
                                        router.get(`${linkUrl.origin}${linkUrl.pathname}?${newParams.toString()}`, {}, { preserveScroll: true, preserveState: true, replace: true });
                                    }
                                }}
                                disabled={!link.url}
                                className="mx-1 px-3 py-1 text-sm rounded-md"
                            >
                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                            </Button>
                        );
                    }
                })}
            </div>
        );
    };


    const openHargaModal = (type: 'harga_saham_karet' | 'harga_dollar', currentValue: number) => {
        setCurrentHargaType(type);
        hargaForm.setData({
            ...hargaForm.data,
            jenis: type,
            nilai: currentValue.toString(),
        });
        setIsHargaModalOpen(true);
    };

    const submitHarga = (e: React.FormEvent) => {
        e.preventDefault();
        hargaForm.post(route('administrasis.updateHarga'), {
            onSuccess: () => {
                setIsHargaModalOpen(false);
                hargaForm.reset();
                router.reload({ only: ['summary', 'filter', 'currentMonth', 'currentYear'] }); // Diperbarui
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const openPengeluaranAddModal = () => {
        pengeluaranForm.reset();
        pengeluaranForm.setData('id', null);
        setIsPengeluaranAddModalOpen(true);
    };

    const openPengeluaranEditModal = (pengeluaran: PengeluaranData) => {
        setSelectedPengeluaran(pengeluaran);
        pengeluaranForm.setData({
            id: pengeluaran.id,
            kategori: pengeluaran.kategori,
            deskripsi: pengeluaran.deskripsi || '',
            jumlah: pengeluaran.jumlah.toString(),
            tanggal_pengeluaran: pengeluaran.tanggal_pengeluaran,
        });
        setIsPengeluaranEditModalOpen(true);
    };

    const submitPengeluaran = (e: React.FormEvent) => {
        e.preventDefault();
        if (pengeluaranForm.data.id) {
            router.put(route('administrasis.updatePengeluaran', pengeluaranForm.data.id), {
                onSuccess: () => {
                    setIsPengeluaranEditModalOpen(false);
                    pengeluaranForm.reset();
                    fetchPengeluarans(); // Refresh data in modal after edit
                    router.reload({ only: ['summary', 'filter', 'currentMonth', 'currentYear'] }); // Diperbarui
                },
                onError: (errors) => {
                    console.error(errors);
                }
            });
        } else {
            router.post(route('administrasis.storePengeluaran'), {
                onSuccess: () => {
                    setIsPengeluaranAddModalOpen(false);
                    pengeluaranForm.reset();
                    fetchPengeluarans(); // Refresh data in modal after add
                    router.reload({ only: ['summary', 'filter', 'currentMonth', 'currentYear'] }); // Diperbarui
                },
                onError: (errors) => {
                    console.error(errors);
                }
            });
        }
    };

    const handleDeletePengeluaran = (id: number) => {
        setPengeluaranToDelete(id);
        setIsDeleteConfirmModalOpen(true);
    };

    const confirmDeletePengeluaran = () => {
        if (pengeluaranToDelete !== null) {
            router.delete(route('administrasis.destroyPengeluaran', pengeluaranToDelete), {
                onSuccess: () => {
                    setIsDeleteConfirmModalOpen(false);
                    setPengeluaranToDelete(null);
                    fetchPengeluarans(); // Refresh data in modal after delete
                    router.reload({ only: ['summary', 'filter', 'currentMonth', 'currentYear'] }); // Diperbarui
                },
                onError: (errors) => {
                    console.error(errors);
                    setIsDeleteConfirmModalOpen(false);
                    setPengeluaranToDelete(null);
                }
            });
        }
    };

    // Handler untuk perubahan filter waktu pada kartu summary
    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        const params: { time_period: string; month?: string; year?: string } = { time_period: value };

        if (value === 'specific-month') {
            const current = new Date();
            params.month = String(current.getMonth() + 1);
            params.year = String(current.getFullYear());
            setSelectedMonth(params.month);
            setSelectedYear(params.year);
        } else {
            // Clear month and year if not 'specific-month'
            // Set to current month/year for other filters
            const current = new Date();
            setSelectedMonth(String(current.getMonth() + 1));
            setSelectedYear(String(current.getFullYear()));
            // If switching from specific-month to another, ensure month/year params are cleared
            if (params.month) delete params.month;
            if (params.year) delete params.year;
        }

        router.get(route('administrasis.index'),
            params,
            {
                preserveState: true,
                replace: true,
                only: ['summary', 'requests', 'notas', 'filter', 'currentMonth', 'currentYear'], // Diperbarui
            }
        );
    };

    // Handler untuk perubahan filter bulan di modal pengeluaran
    const handleMonthChange = (value: string) => { // Fungsi ini sudah ada
        setSelectedMonth(value);
        router.get(route('administrasis.index'),
            { time_period: timePeriod, month: value, year: selectedYear },
            {
                preserveState: true,
                replace: true,
                only: ['summary', 'requests', 'notas', 'filter', 'currentMonth', 'currentYear'], // Diperbarui
            }
        );
    };

    // Handler untuk perubahan filter tahun di modal pengeluaran
    const handleYearChange = (value: string) => { // Fungsi ini sudah ada
        setSelectedYear(value);
        router.get(route('administrasis.index'),
            { time_period: timePeriod, month: selectedMonth, year: value },
            {
                preserveState: true,
                replace: true,
                only: ['summary', 'requests', 'notas', 'filter', 'currentMonth', 'currentYear'], // Diperbarui
            }
        );
    };

    // Handler untuk perubahan filter bulan di modal pengeluaran
    const handleModalPengeluaranMonthChange = (value: string) => {
        setModalPengeluaranMonth(value);
        setModalPengeluaranPage(1); // Reset page to 1 on month change
    };

    // Handler untuk perubahan filter tahun di modal pengeluaran
    const handleModalPengeluaranYearChange = (value: string) => {
        setModalPengeluaranYear(value);
        setModalPengeluaranPage(1); // Reset page to 1 on year change
    };

    // Untuk membuka modal informasi laba/rugi
    const openLabaRugiInfoModal = () => {
        setIsLabaRugiInfoModalOpen(true);
    };

    // Untuk membuka modal daftar pengeluaran
    const openPengeluaranListModal = () => {
        setIsPengeluaranListModalOpen(true);
        // Set default filter di modal ke bulan/tahun saat ini saat pertama kali dibuka
        const today = new Date();
        setModalPengeluaranMonth(String(today.getMonth() + 1));
        setModalPengeluaranYear(String(today.getFullYear()));
        setModalPengeluaranPage(1); // Pastikan mulai dari halaman 1
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
            <Head title="Administrasi" />

            <div className="h-full flex-col rounded-xl p-4 shadow-md bg-gray-50 dark:bg-black">
                <div className="flex justify-between items-center mb-4">
                    <Heading title="Administrasi Dokumen" />
                </div>

                {/* Dropdown filter for summary cards */}
                <div className="mb-6 flex justify-end items-center gap-4">
                    <div className="flex items-center gap-2 p-1 ">
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
                                    <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {timePeriod === 'specific-month' && (
                        <>
                            <div className="flex items-center gap-2 p-1">
                                <span className="text-black dark:text-white text-sm">Bulan:</span>
                                <div className='bg-accent dark:bg-white text-black rounded-xl'>
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
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-1">
                                <span className="text-black dark:text-white text-sm">Tahun:</span>
                                <div className='bg-accent dark:bg-white text-black rounded-xl'>
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
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Card 1: Harga Saham Karet */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                        <div>
                            <div className="text-sm font-medium opacity-90">Harga Saham Karet</div>
                            <div className="text-3xl font-bold mt-1">{summary.hargaSahamKaret}</div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={() => openHargaModal('harga_saham_karet', summary.hargaSahamKaret)}
                        >
                            <Edit size={20} />
                        </Button>
                        <FileText size={40} className="opacity-70" />
                    </div>

                    {/* Card 2: Harga Dollar */}
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                        <div>
                            <div className="text-sm font-medium opacity-90">Harga Dollar</div>
                            <div className="text-3xl font-bold mt-1">{formatCurrency(summary.hargaDollar)}</div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={() => openHargaModal('harga_dollar', summary.hargaDollar)}
                        >
                            <DollarSign size={20} />
                        </Button>
                        <DollarSign size={40} className="opacity-70" />
                    </div>

                    {/* Card 3: Pengeluaran */}
                    <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                        <div>
                            <div className="text-sm font-medium opacity-90">Pengeluaran</div>
                            <div className="text-3xl font-bold mt-1">{formatCurrency(summary.totalPengeluaran)}</div>
                        </div>
                        {/* Tombol untuk menambahkan pengeluaran */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-10 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={openPengeluaranAddModal}
                        >
                            <PlusCircle size={20} />
                        </Button>
                        {/* Tombol untuk membuka modal daftar pengeluaran */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={openPengeluaranListModal}
                        >
                            <Info size={20} />
                        </Button>
                        <Receipt size={40} className="opacity-70" />
                    </div>

                    {/* Card 4: Laba / Rugi */}
                    <div
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative cursor-pointer"
                        onClick={openLabaRugiInfoModal}
                    >
                        <div>
                            <div className="text-sm font-medium opacity-90">Laba / Rugi</div>
                            <div className="text-3xl font-bold mt-1">{formatCurrency(summary.labaRugi)}</div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20"
                            onClick={(e) => { e.stopPropagation(); openLabaRugiInfoModal(); }}
                        >
                            <Info size={20} />
                        </Button>
                        <Banknote size={40} className="opacity-70" />
                    </div>
                </div>
                {/* End Cards Section */}
                
                {/* Cards Section */}
                <div className='border rounded-xl p-2 mb-6'>
                    <div className='flex justify-center mb-2 font-semibold'>
                        Beli & Jual
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                            <div>
                                <div className="text-sm font-medium opacity-90">Stok Pengiriman Karet</div>
                                <div className="text-3xl font-bold mt-1">{summary.s_karet} Kg</div>
                            </div>
                            <Warehouse size={40} className="opacity-70" />
                        </div>

                        <div
                            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative cursor-pointer"
                            onClick={openLabaRugiInfoModal}
                        >
                            <div>
                                <div className="text-sm font-medium opacity-90">Harga Jual Karet</div>
                                <div className="text-3xl font-bold mt-1">{formatCurrency(summary.h_karet)}</div>
                            </div>
                            
                            <Landmark size={40} className="opacity-70" />
                        </div>

                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                            <div>
                                <div className="text-sm font-medium opacity-90">Pembelian Karet</div>
                                <div className="text-3xl font-bold mt-1">{formatCurrency(summary.tb_karet)}</div>
                            </div>
                            <Handshake size={40} className="opacity-70" />
                        </div>

                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between relative">
                            <div>
                                <div className="text-sm font-medium opacity-90">Penjualan Karet</div>
                                <div className="text-3xl font-bold mt-1">{formatCurrency(summary.tj_karet)}</div>
                            </div>
                            <HandCoins size={40} className="opacity-70" />
                        </div>

                    </div>
                </div>
                {/* End Cards Section */}
                
                {/* Cards Section (Original) */}
                <div className='border-t'>
                    <div className='p-2'>
                        Validasi
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Card 1: Total Request Letters */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium opacity-90">Total Request Letters</div>
                                <div className="text-3xl font-bold mt-1">{summary.totalRequests}</div>
                            </div>
                            <FileText size={40} className="opacity-70" />
                        </div>

                        {/* Card 2: Total Nota/Kwitansi */}
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium opacity-90">Total Nota/Kwitansi</div>
                                <div className="text-3xl font-bold mt-1">{summary.totalNotas}</div>
                            </div>
                            <Receipt size={40} className="opacity-70" />
                        </div>

                        {/* Card 3: Request Pending */}
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium opacity-90">Request Pending</div>
                                <div className="text-3xl font-bold mt-1">{summary.totalPendingRequests}</div>
                            </div>
                            <Clock size={40} className="opacity-70" />
                        </div>

                        {/* Card 4: Total Dana Disetujui (Contoh) */}
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium opacity-90">Total Kwitansi/Nota Dana Disetujui</div>
                                <div className="text-3xl font-bold mt-1">{formatCurrency(summary.totalApprovedDana)}</div>
                            </div>
                            <FileCheck2 size={40} className="opacity-70" />
                        </div>
                    </div>
                </div>
                {/* End Cards Section (Original) */}

                {/* Table for Administration Documents */}
                <div className="w-full border rounded-xl p-4 mt-4 overflow-x-auto">
                    <div className="font-bold text-xl mb-4 text-gray-800">Daftar Dokumen Administrasi</div>
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Tanggal</TableHead>
                                <TableHead className="w-[150px]">Tipe Dokumen</TableHead>
                                <TableHead className="w-[150px]">Pengaju/Pihak</TableHead>
                                <TableHead>Perihal/Deskripsi</TableHead>
                                <TableHead className="w-[100px]">Devisi</TableHead>
                                <TableHead className="text-right w-[120px]">Dana</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[120px]">Tgl. Update</TableHead> 
                                <TableHead className="text-center w-[120px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {combinedData.length > 0 ? (
                                combinedData.map((item) => (
                                    <TableRow key={`${item.type}-${item.id}`}>
                                        <TableCell>{item.transactionDate}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {item.type === 'request' ? 'Request Letter' : 'Nota/Kwitansi'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.requesterOrParty}</TableCell>
                                        <TableCell>{item.subjectOrDescription}</TableCell>
                                        <TableCell>{item.devisi}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(parseFloat(item.dana))}</TableCell>
                                        <TableCell>
                                            <Tag status={item.status} />
                                        </TableCell>
                                        <TableCell>{item.updatedAt || '-'}</TableCell> 
                                        <TableCell className="text-center space-x-2">
                                            {/* Actions for Request Letter */}
                                            {item.type === 'request' && (
                                                <>
                                                    {can('administrasis.view') && (
                                                        <Link href={route('requests.showAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Eye color="gray" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('administrasis.edit') && (
                                                        <Link href={route('requests.editAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Pencil color="blue" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                            {/* Actions for Invoice/Receipt */}
                                            {item.type === 'nota' && (
                                                <>
                                                    {can('administrasis.view') && (
                                                        <Link href={route('notas.showAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Eye color="gray" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('administrasis.edit') && (
                                                        <Link href={route('notas.editAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Pencil color="blue" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                                        Tidak ada data administrasi yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl shadow-sm">
                        {requests.data.length > 0 && renderPagination(requests, 'Paginasi Request')}
                        {notas.data.length > 0 && renderPagination(notas, 'Paginasi Nota')}
                    </div>
                </div>
            </div>

            {/* Modal for Price Update (Stock/Dollar) */}
            <Dialog open={isHargaModalOpen} onOpenChange={setIsHargaModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update {currentHargaType === 'harga_saham_karet' ? 'Harga Saham' : 'Harga Dollar'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHarga} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nilai" className="text-right">
                                Nilai
                            </Label>
                            <Input
                                id="nilai"
                                type="number"
                                step="0.01"
                                value={hargaForm.data.nilai}
                                onChange={(e) => hargaForm.setData('nilai', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tanggal_berlaku" className="text-right">
                                Tanggal Berlaku
                            </Label>
                            <Input
                                id="tanggal_berlaku"
                                type="date"
                                value={hargaForm.data.tanggal_berlaku}
                                onChange={(e) => hargaForm.setData('tanggal_berlaku', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={hargaForm.processing}>
                                {hargaForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal for Add New Expense */}
            <Dialog open={isPengeluaranAddModalOpen} onOpenChange={setIsPengeluaranAddModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPengeluaran} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kategori" className="text-right">
                                Kategori
                            </Label>
                            <Input
                                id="kategori"
                                value={pengeluaranForm.data.kategori}
                                onChange={(e) => pengeluaranForm.setData('kategori', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="deskripsi" className="text-right">
                                Deskripsi
                            </Label>
                            <Input
                                id="deskripsi"
                                value={pengeluaranForm.data.deskripsi || ''}
                                onChange={(e) => pengeluaranForm.setData('deskripsi', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jumlah" className="text-right">
                                Jumlah (Rp)
                            </Label>
                            <Input
                                id="jumlah"
                                type="number"
                                step="any"
                                value={pengeluaranForm.data.jumlah}
                                onChange={(e) => pengeluaranForm.setData('jumlah', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tanggal_pengeluaran" className="text-right">
                                Tanggal
                            </Label>
                            <Input
                                id="tanggal_pengeluaran"
                                type="date"
                                value={pengeluaranForm.data.tanggal_pengeluaran}
                                onChange={(e) => pengeluaranForm.setData('tanggal_pengeluaran', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={pengeluaranForm.processing}>
                                {pengeluaranForm.processing ? 'Menyimpan...' : 'Tambah Pengeluaran'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal for Edit Expense */}
            <Dialog open={isPengeluaranEditModalOpen} onOpenChange={setIsPengeluaranEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Pengeluaran</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitPengeluaran} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-kategori" className="text-right">
                                Kategori
                            </Label>
                            <Input
                                id="edit-kategori"
                                value={pengeluaranForm.data.kategori}
                                onChange={(e) => pengeluaranForm.setData('kategori', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-deskripsi" className="text-right">
                                Deskripsi
                            </Label>
                            <Input
                                id="edit-deskripsi"
                                value={pengeluaranForm.data.deskripsi || ''}
                                onChange={(e) => pengeluaranForm.setData('deskripsi', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-jumlah" className="text-right">
                                Jumlah (Rp)
                            </Label>
                            <Input
                                id="edit-jumlah"
                                type="number"
                                step="any"
                                value={pengeluaranForm.data.jumlah}
                                onChange={(e) => pengeluaranForm.setData('jumlah', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-tanggal_pengeluaran" className="text-right">
                                Tanggal
                            </Label>
                            <Input
                                id="edit-tanggal_pengeluaran"
                                type="date"
                                value={pengeluaranForm.data.tanggal_pengeluaran}
                                onChange={(e) => pengeluaranForm.setData('tanggal_pengeluaran', e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={pengeluaranForm.processing}>
                                {pengeluaranForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Apakah Anda yakin ingin menghapus catatan pengeluaran ini? Tindakan ini tidak dapat dibatalkan.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmModalOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDeletePengeluaran}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Laba/Rugi Information Modal */}
            <Dialog open={isLabaRugiInfoModalOpen} onOpenChange={setIsLabaRugiInfoModalOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Informasi Laba / Rugi</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-3 text-gray-700">
                        <p>Berikut adalah rincian perhitungan Laba / Rugi untuk periode yang dipilih:</p>
                        
                        <div className="grid grid-cols-2 gap-2 font-medium">
                            <div className="text-gray-600">Total Penjualan Karet:</div>
                            <div className="text-right">{formatCurrency(summary.totalPenjualanKaret || 0)}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 font-medium">
                            <div className="text-gray-600">Total Pengeluaran:</div>
                            <div className="text-right">{formatCurrency(summary.totalPengeluaran || 0)}</div>
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                            <div className="grid grid-cols-2 gap-2 font-bold text-lg">
                                <div className="text-gray-800">Laba / Rugi:</div>
                                <div className={`text-right ${summary.labaRugi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(summary.labaRugi || 0)}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            Perhitungan: Laba / Rugi = Total Penjualan Karet - Total Pengeluaran.
                            Nilai-nilai ini disesuaikan berdasarkan "Filter Waktu" yang Anda pilih di atas.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsLabaRugiInfoModalOpen(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Daftar Pengeluaran */}
            <Dialog open={isPengeluaranListModalOpen} onOpenChange={setIsPengeluaranListModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Daftar Pengeluaran</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-end items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white text-sm">Bulan:</span>
                            <div className='bg-accent dark:bg-white text-black rounded-xl'>
                                <Select value={modalPengeluaranMonth} onValueChange={handleModalPengeluaranMonthChange}>
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
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white text-sm">Tahun:</span>
                            <div className='bg-accent dark:bg-white text-black rounded-xl'>
                                <Select value={modalPengeluaranYear} onValueChange={handleModalPengeluaranYearChange}>
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
                            </div>
                        </div>
                    </div>

                    {isLoadingPengeluarans ? (
                        <div className="text-center py-8">Memuat data pengeluaran...</div>
                    ) : (
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[120px]">Tanggal</TableHead> */}
                                    <TableHead className="w-[150px]">Kategori</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead className="text-right w-[120px]">Jumlah (Rp)</TableHead>
                                    {/* <TableHead className="w-[120px]">Tgl. Update</TableHead> */}
                                    <TableHead className="text-center w-[100px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalPengeluarans.data.length > 0 ? (
                                    modalPengeluarans.data.map((item) => (
                                        <TableRow key={item.id}>
                                            {/* <TableCell>{item.tanggal_pengeluaran}</TableCell> */}
                                            <TableCell>{item.kategori}</TableCell>
                                            <TableCell>{item.deskripsi || '-'}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                                            {/* <TableCell>{item.updated_at || '-'}</TableCell> */}
                                            <TableCell className="text-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openPengeluaranEditModal(item)}
                                                >
                                                    <Pencil color="blue" size={18} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeletePengeluaran(item.id)}
                                                >
                                                    <Trash2 color="red" size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            Tidak ada data pengeluaran untuk periode ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                    {modalPengeluarans.data.length > 0 && renderPagination(modalPengeluarans, 'Paginasi Pengeluaran', 'page', true)}
                    <DialogFooter>
                        <Button onClick={() => setIsPengeluaranListModalOpen(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
