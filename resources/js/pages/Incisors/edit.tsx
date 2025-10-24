import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';
import React from 'react'; // Pastikan React diimpor

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penoreh',
        href: route('incisors.index'), // Gunakan route() helper
    },
    {
        title: 'Ubah Penoreh',
        href: '#', // Halaman saat ini tidak perlu link
    },
];

// Definisikan interface untuk prop Incisor
interface Incisor {
    id: number;
    name: string;
    nik: string;
    ttl: string;
    gender: string;
    address: string;
    agama: string;
    status: string;
    no_invoice: string;
    lok_toreh: string;
}

// Definisikan interface untuk props komponen
interface EditProps {
    incisor: Incisor;
}

export default function IncisorEdit({ incisor }: EditProps) { // Beri nama komponen yang jelas

    const { data, setData, put, processing, errors } = useForm({
        name: incisor.name || '',
        nik: incisor.nik || '',
        ttl: incisor.ttl || '',
        gender: incisor.gender || '',
        address: incisor.address || '',
        agama: incisor.agama || '',
        status: incisor.status || '',
        no_invoice: incisor.no_invoice || '',
        lok_toreh: incisor.lok_toreh || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('incisors.update', incisor.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Data Penoreh" />

            <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                        <Heading title='Ubah Data Penoreh' className="text-2xl font-semibold text-gray-800 dark:text-gray-100" />
                        <Link href={route('incisors.index')}>
                            <Button className='bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200 rounded-lg shadow-sm'>
                                <Undo2 className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200">
                            <CircleAlert className='h-4 w-4 text-red-500 dark:text-red-300'/>
                            <AlertTitle className='font-bold text-red-700 dark:text-red-100'>
                                Ada Kesalahan!
                            </AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside mt-1 text-sm">
                                    {Object.entries(errors).map(([key, message]) =>
                                        <li key={key} className="text-red-600 dark:text-red-300">
                                            {message as string}
                                        </li>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <p className='text-red-600 dark:text-red-400 text-sm mb-6'>
                        *Mohon data diisi sesuai KTP untuk kelengkapan administrasi.
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-8'>

                        {/* Informasi Pribadi */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">Informasi Pribadi</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='name' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Nama Lengkap </Label>
                                        <Input
                                            id='name'
                                            placeholder='Masukkan Nama Lengkap'
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor='nik' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> NIK </Label>
                                        <Input
                                            id='nik'
                                            placeholder='Masukkan NIK (Nomor Induk Kependudukan)'
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.nik && <p className="mt-1 text-xs text-red-500">{errors.nik}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor='ttl' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Tanggal Lahir </Label>
                                        <Input
                                            id='ttl'
                                            type='date'
                                            value={data.ttl}
                                            onChange={(e) => setData('ttl', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.ttl && <p className="mt-1 text-xs text-red-500">{errors.ttl}</p>}
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='gender' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Jenis Kelamin </Label>
                                        <select
                                            id='gender'
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                                            required
                                        >
                                            <option value="" disabled>Pilih Jenis Kelamin</option>
                                            <option value="Laki - laki">Laki - laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor='address' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Alamat Lengkap </Label>
                                        <Textarea
                                            id='address'
                                            placeholder='Masukkan Alamat Lengkap'
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Pekerjaan & Admin */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">Informasi Pekerjaan & Administrasi</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='agama' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Agama </Label>
                                        <Input
                                            id='agama'
                                            placeholder='Masukkan Agama'
                                            value={data.agama}
                                            onChange={(e) => setData('agama', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.agama && <p className="mt-1 text-xs text-red-500">{errors.agama}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor='status' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Status </Label>
                                        <Input
                                            id='status'
                                            placeholder='Masukkan Status (Contoh: Menikah, Belum Menikah)'
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div>
                                        <Label htmlFor='no_invoice' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Kode Penoreh </Label>
                                        <Input
                                            id='no_invoice'
                                            placeholder='Contoh: PNT-001'
                                            value={data.no_invoice}
                                            onChange={(e) => setData('no_invoice', e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        {errors.no_invoice && <p className="mt-1 text-xs text-red-500">{errors.no_invoice}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor='lok_toreh' className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"> Lokasi Kerja </Label>
                                        <select
                                            id='lok_toreh'
                                            value={data.lok_toreh}
                                            onChange={(e) => setData('lok_toreh', e.target.value)}
                                            className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-2 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                                            required
                                        >
                                            <option value="" disabled>Pilih Lokasi Kerja</option>
                                            <option value="Temadu">Temadu</option>
                                            <option value="Sebayar">Sebayar</option>
                                        </select>
                                        {errors.lok_toreh && <p className="mt-1 text-xs text-red-500">{errors.lok_toreh}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end'>
                            <Button
                                type='submit'
                                disabled={processing}
                                className='bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all duration-200 rounded-lg py-2 px-6 shadow-md'
                            >
                                {processing ? 'Memperbarui...' : 'Update Data Penoreh'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

