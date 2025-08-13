import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
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
import { toast } from 'sonner';
import { Search } from 'lucide-react';

// Tipe data untuk pegawai
interface Pegawai {
    id: number;
    employee_id: string; // <-- Ditambahkan
    name: string;
    position: string;
    salary: number;
    avatar: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Pegawai', href: route('pegawai.index') },
];

export default function Index({ pegawai }: { pegawai: Pegawai[] }) {
    const { props } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [currentPegawai, setCurrentPegawai] = useState<Pegawai | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        employee_id: '', // <-- Ditambahkan
        name: '',
        position: '',
        salary: 0,
    });

    useEffect(() => {
        if (props.flash?.message) {
            toast.success(props.flash.message as string);
        }
    }, [props.flash]);

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
            employee_id: pegawai.employee_id, // <-- Ditambahkan
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

    const filteredPegawai = pegawai.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pegawai" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div>
                        <Heading title="Manajemen Pegawai" />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Kelola data pegawai yang terdaftar di sistem Anda.
                        </p>
                    </div>
                    <Button onClick={handleAdd}>+ Tambah Pegawai</Button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Cari ID, nama, atau jabatan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Employee Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPegawai.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
                            <div className="p-5 flex flex-col items-center text-center">
                                <img className="h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-800" src={item.avatar} alt={item.name} />
                                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{item.position}</p>
                                <p className="mt-2 text-xs text-gray-500">ID Pegawai: {item.employee_id}</p>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Gaji:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">Rp {item.salary.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-3 flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteConfirm(item)}>Hapus</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tampilan jika data tidak ditemukan */}
                {filteredPegawai.length === 0 && (
                    <div className="text-center py-16 col-span-full bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Tidak ada data pegawai yang cocok dengan pencarian Anda.</p>
                    </div>
                )}
            </div>

            {/* Modal untuk Tambah/Edit Pegawai */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={closeModal}>
                    <DialogHeader>
                        <DialogTitle>{currentPegawai ? 'Edit Pegawai' : 'Tambah Pegawai'}</DialogTitle>
                        <DialogDescription>
                            {currentPegawai ? 'Ubah detail data pegawai di bawah ini.' : 'Isi detail data untuk pegawai baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="employee_id" className="text-right">ID Pegawai</Label>
                                <Input id="employee_id" value={data.employee_id} onChange={(e) => setData('employee_id', e.target.value)} className="col-span-3" />
                                {errors.employee_id && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.employee_id}</p>}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nama</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="col-span-3" />
                                {errors.name && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="position" className="text-right">Jabatan</Label>
                                <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} className="col-span-3" />
                                {errors.position && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.position}</p>}
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="salary" className="text-right">Gaji</Label>
                                <Input id="salary" type="number" value={data.salary} onChange={(e) => setData('salary', parseInt(e.target.value))} className="col-span-3" />
                                {errors.salary && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{errors.salary}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                            <Button type="submit" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog untuk Konfirmasi Hapus */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md" onEscapeKeyDown={closeModal}>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus data pegawai: <strong>{currentPegawai?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={executeDelete}>Ya, Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
