// ./resources/js/Pages/Pegawai/Index.tsx

import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Banknote, Briefcase, CheckCircle2, CirclePlus, CreditCard, Hash, LayoutList, Pencil, Search, Trash2, User, Users } from 'lucide-react';
import React, { useState, useMemo } from 'react';

// Tipe data untuk pegawai
interface Pegawai {
    id: number;
    employee_id: string;
    name: string;
    position: string;
    salary: number;
    avatar: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pegawai', href: route('pegawai.index') },
];

// Helper format mata uang
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Helper warna avatar berdasarkan nama (agar konsisten)
const getAvatarColor = (name: string) => {
    const colors = [
        'bg-blue-100 text-blue-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-cyan-100 text-cyan-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

// Helper inisial nama
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

export default function Index({ pegawai }: { pegawai: Pegawai[] }) {
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [currentPegawai, setCurrentPegawai] = useState<Pegawai | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        employee_id: '',
        name: '',
        position: '',
        salary: 0,
    });

    const flashMessage = props.flash?.message as string | undefined;

    // Filter Logic
    const filteredPegawai = useMemo(() => {
        return pegawai.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pegawai, searchQuery]);

    // Kalkulasi Statistik
    const totalSalary = useMemo(() => filteredPegawai.reduce((acc, curr) => acc + curr.salary, 0), [filteredPegawai]);
    const averageSalary = useMemo(() => filteredPegawai.length > 0 ? totalSalary / filteredPegawai.length : 0, [totalSalary, filteredPegawai]);

    const handleAdd = () => {
        reset();
        clearErrors();
        setCurrentPegawai(null);
        setIsModalOpen(true);
    };

    const handleEdit = (pegawai: Pegawai) => {
        clearErrors();
        setCurrentPegawai(pegawai);
        setData({ 
            employee_id: pegawai.employee_id, 
            name: pegawai.name, 
            position: pegawai.position, 
            salary: pegawai.salary 
        });
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = (pegawai: Pegawai) => {
        setCurrentPegawai(pegawai);
        setIsDeleteConfirmOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteConfirmOpen(false);
        setCurrentPegawai(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => closeModal() };
        if (currentPegawai) {
            put(route('pegawai.update', currentPegawai.id), options);
        } else {
            post(route('pegawai.store'), options);
        }
    };

    const executeDelete = () => {
        if (currentPegawai) {
            router.delete(route('pegawai.destroy', currentPegawai.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pegawai" />

            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-50 dark:bg-black min-h-screen font-sans">
                
                {/* 1. Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                        <Heading 
                            title="Data Kepegawaian" 
                            description="Pantau kinerja tim dan kelola database pegawai."
                        />
                    </div>
                    <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Tambah Pegawai
                    </Button>
                </div>

                {/* 2. Stats Cards (Mirip Referensi) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pegawai</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredPegawai.length} <span className="text-sm font-normal text-gray-400">Orang</span></p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Payroll (Bulanan)</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalSalary)}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                            <Banknote className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rata-rata Gaji</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(averageSalary)}</p>
                        </div>
                    </div>
                </div>

                {/* Flash Message */}
                {flashMessage && (
                    <Alert className="bg-white dark:bg-gray-800 border-l-4 border-emerald-500 shadow-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <div className="ml-2">
                            <AlertTitle className="text-gray-900 dark:text-gray-100">Berhasil</AlertTitle>
                            <AlertDescription className="text-gray-500">{flashMessage}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* 3. Search Bar & Result Count */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari berdasarkan nama, ID, atau jabatan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-none shadow-none focus-visible:ring-0 bg-transparent"
                        />
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-500 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 w-full sm:w-auto text-center sm:text-right">
                        Menampilkan {filteredPegawai.length} hasil
                    </div>
                </div>

                {/* 4. Employee List (SaaS Row Style) */}
                <div className="space-y-4">
                    {filteredPegawai.length > 0 ? (
                        filteredPegawai.map((item) => (
                            <div 
                                key={item.id} 
                                className="group flex flex-col md:flex-row items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
                            >
                                {/* Left: Avatar & Name */}
                                <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${item.avatar ? '' : getAvatarColor(item.name)}`}>
                                        {item.avatar ? (
                                            <img src={item.avatar} alt={item.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(item.name)
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {item.position}
                                        </div>
                                    </div>
                                </div>

                                {/* Middle: ID & Salary Columns */}
                                <div className="flex w-full md:w-1/3 justify-between md:justify-start md:gap-16 mb-4 md:mb-0">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">ID Pegawai</span>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded w-fit border border-gray-200 dark:border-gray-600">
                                            {item.employee_id}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">Gaji Pokok</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.salary)}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex items-center justify-end w-full md:w-auto gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 px-4 text-xs font-medium border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Pencil className="w-3.5 h-3.5 mr-2" />
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDeleteConfirm(item)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full mb-3">
                                <LayoutList className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Data pegawai tidak ditemukan</p>
                            <p className="text-sm text-gray-400 mt-1">Silakan tambah data baru atau ubah pencarian.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={closeModal}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {currentPegawai ? 'Edit Data Pegawai' : 'Registrasi Pegawai Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi formulir di bawah ini untuk memperbarui database.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id" className="text-xs font-bold uppercase text-gray-500">ID Pegawai</Label>
                                <Input id="employee_id" placeholder="Ex: GKA-001" value={data.employee_id} onChange={(e) => setData('employee_id', e.target.value)} />
                                {errors.employee_id && <p className="text-xs text-red-500">{errors.employee_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary" className="text-xs font-bold uppercase text-gray-500">Gaji Pokok</Label>
                                <Input id="salary" type="number" placeholder="0" value={data.salary} onChange={(e) => setData('salary', parseInt(e.target.value) || 0)} />
                                {errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-500">Nama Lengkap</Label>
                            <Input id="name" placeholder="Nama Pegawai" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-xs font-bold uppercase text-gray-500">Jabatan / Posisi</Label>
                            <Input id="position" placeholder="Contoh: Site Manager" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                            {errors.position && <p className="text-xs text-red-500">{errors.position}</p>}
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={closeModal}>Batal</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                                {processing ? '...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Hapus */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Hapus Data?
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Anda akan menghapus data <strong>{currentPegawai?.name}</strong>. Tindakan ini permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={executeDelete}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}