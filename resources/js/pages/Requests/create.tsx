import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, ArrowLeft, UploadCloud, X } from 'lucide-react';
import React, { useState, useRef } from 'react';

// Breadcrumbs untuk navigasi halaman
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '/requests',
    },
    {
        title: 'Create Request',
        href: '/requests/create',
    },
];

export default function CreateRequest() {
    // State untuk mengelola pratinjau file yang diunggah
    const [filePreview, setFilePreview] = useState<string | null>(null);
    // Ref untuk elemen input file agar bisa di-trigger secara programatik
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hook useForm dari Inertia untuk menangani form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        date: '',
        devisi: '',
        j_pengajuan: '',
        mengetahui: '',
        desk: '',
        dana: '',
        file: null as File | null, // Inisialisasi file sebagai null untuk menangani objek File
    });

    // Menangani perubahan pada input file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            // Buat URL untuk file agar bisa ditampilkan sebagai pratinjau
            if (file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview(null); // Jangan tampilkan pratinjau jika bukan gambar
            }
        }
    };

    // Menghapus file yang dipilih dan pratinjaunya
    const removeFile = () => {
        setData('file', null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input file
        }
    };

    // Menangani pengiriman form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Kirim data form ke route 'requests.surat'
        post(route('requests.surat'), {
            onSuccess: () => {
                reset();
                removeFile();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Request" />

            {/* Kontainer utama dengan layout kartu modern */}
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <Heading title='Formulir Pengajuan Dana' description='Isi detail pengajuan dengan lengkap dan benar.' />
                            <Link href={route('requests.index')}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Kembali
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Tampilkan error validasi jika ada */}
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" className="mb-6">
                                <CircleAlert className='h-4 w-4' />
                                <AlertTitle>
                                    Terjadi Kesalahan!
                                </AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside">
                                        {Object.values(errors).map((message, index) => (
                                            <li key={index}>{message}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {/* Kolom form dengan layout grid yang responsif */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Kolom kiri untuk input form utama */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor='name'>Nama Pengaju</Label>
                                        <Input id="name" placeholder='cth: John Doe' value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor='devisi'>Divisi</Label>
                                        <Input id="devisi" placeholder='cth: Marketing' value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor='j_pengajuan'>Jenis Pengajuan</Label>
                                    <Input id="j_pengajuan" placeholder='cth: Pembelian Aset' value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)} className="mt-1" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor='date'>Tanggal</Label>
                                        <Input id="date" type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor='mengetahui'>Diketahui oleh</Label>
                                        <Input id="mengetahui" placeholder='cth: Manajer Keuangan' value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} className="mt-1" />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor='desk'>Deskripsi Keperluan</Label>
                                    <Textarea id="desk" placeholder='Jelaskan secara rinci tujuan dari pengajuan dana ini...' value={data.desk} onChange={(e) => setData('desk', e.target.value)} className="mt-1" rows={4} />
                                </div>

                                <div>
                                    <Label htmlFor='dana'>Total Dana Diajukan</Label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">Rp</span>
                                        </div>
                                        <Input id="dana" type="number" placeholder='500000' value={data.dana} onChange={(e) => setData('dana', e.target.value)} className="pl-10" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Kolom kanan untuk upload file */}
                            <div className="md:col-span-1 space-y-2">
                                <Label htmlFor='file'>Bukti / Lampiran</Label>
                                {filePreview ? (
                                    // Tampilan ketika file gambar sudah dipilih
                                    <div className="relative">
                                        <img src={filePreview} alt="Preview" className="w-full h-auto rounded-lg object-cover aspect-video" />
                                        <Button type="button" variant="destructive" size="icon" onClick={removeFile} className="absolute top-2 right-2 h-8 w-8 rounded-full">
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    // Tampilan ketika tidak ada file yang dipilih atau file bukan gambar
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-1 flex justify-center items-center flex-col w-full h-64 px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="space-y-1 text-center">
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">Klik untuk mengunggah</span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, dll (maks. 2MB)</p>
                                            {data.file && <p className="text-xs text-green-600 mt-2 font-semibold">{data.file.name}</p>}
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="file"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={processing}
                                />
                            </div>
                        </div>

                        {/* Tombol submit form */}
                        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button type='submit' disabled={processing} size="lg" className="bg-green-600 hover:bg-green-700">
                                {processing ? 'Menyimpan...' : 'Simpan Pengajuan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
