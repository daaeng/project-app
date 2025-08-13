// resources/js/Pages/Pegawai/Index.tsx

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Sesuaikan path jika perlu
import Heading from '@/components/heading'; // Sesuaikan path jika perlu
import { type BreadcrumbItem } from '@/types';

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'), // Asumsi Anda punya route 'dashboard'
    },
    {
        title: 'Pegawai',
        href: route('pegawai.index'), // Asumsi Anda punya route 'pegawai.index'
    },
];

// Contoh tipe data untuk pegawai
interface Pegawai {
    id: number;
    nama: string;
    avatar: string;
    jabatan: string;
    email: string;
    tanggal_bergabung: string;
}

// Contoh data pegawai (nantinya ini akan datang dari controller Laravel)
const contohPegawai: Pegawai[] = [
    {
        id: 1,
        nama: 'Andi Saputra',
        avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AS',
        jabatan: 'Software Engineer',
        email: 'andi.saputra@example.com',
        tanggal_bergabung: '15 Jan 2023',
    },
    {
        id: 2,
        nama: 'Bunga Wulandari',
        avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=BW',
        jabatan: 'UI/UX Designer',
        email: 'bunga.w@example.com',
        tanggal_bergabung: '20 Feb 2023',
    },
    {
        id: 3,
        nama: 'Candra Darmawan',
        avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=CD',
        jabatan: 'Project Manager',
        email: 'candra.darmawan@example.com',
        tanggal_bergabung: '05 Mar 2023',
    },
];


// Komponen utama untuk halaman index pegawai
export default function Index({ pegawai = contohPegawai }: { pegawai?: Pegawai[] }) {
    // `pegawai = contohPegawai` digunakan agar komponen tetap bisa dirender
    // sebelum data asli dari controller di-passing.

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pegawai" />

            <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
                
                {/* Header Halaman */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-6">
                    <div>
                        <Heading title="Data Pegawai" />
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Kelola semua data pegawai yang terdaftar.
                        </p>
                    </div>
                    {/* Tombol Aksi */}
                    <Link
                        href={route('pegawai.create')} // Asumsi route untuk halaman tambah
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        Tambah Pegawai
                    </Link>
                </div>

                {/* Kontainer Tabel */}
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jabatan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal Bergabung</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {pegawai.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={item.avatar} alt={`Avatar ${item.nama}`} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.nama}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.jabatan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.tanggal_bergabung}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/pegawai/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</Link>
                                                <Link href={`/pegawai/${item.id}`} method="delete" as="button" className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Hapus</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
