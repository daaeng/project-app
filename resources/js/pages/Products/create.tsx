import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save } from 'lucide-react';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: '/products',
    },
    {
        title: 'Create',
        href: '/products/create',
    }
];

// Komponen FormField untuk konsistensi
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
        <div className="mt-1">
            {children}
        </div>
    </div>
);

// Komponen select dengan gaya profesional
const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
);

// Komponen input dengan gaya profesional
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input
        {...props}
        className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
    />
);

// Komponen textarea dengan gaya profesional
const StyledTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <Textarea
        {...props}
        className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
    />
);


export default function Create() {

    const {data, setData, post, processing, errors } = useForm({
        product: '',
        date: '',
        no_invoice: '',
        nm_supplier: '',
        j_brg: '',
        desk: '',
        qty_kg: '',
        price_qty: '',
        amount: '',
        keping: '',
        kualitas: '',
        status: '',
    });

    // --- Logika Perhitungan Otomatis ---
    useEffect(() => {
        const qty = parseFloat(data.qty_kg) || 0;
        const price = parseFloat(data.price_qty) || 0;
        const calculatedAmount = qty * price * 0.40;
        setData('amount', calculatedAmount.toFixed(2));
    }, [data.qty_kg, data.price_qty]);

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl">Buat Produk Baru</h1>
                             <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Isi formulir di bawah untuk menambahkan data produk baru.</p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="outline" className='flex items-center gap-2'>
                                <Undo2 size={16} />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                     {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.values(errors).map((message, i) =>
                                        <li key={i}>{message}</li>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-8'>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 mb-6">Detail Utama</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField label="Product">
                                        <StyledSelect value={data.product} onChange={(e) => setData('product', e.target.value)} required>
                                            <option value="" disabled>Pilih Jenis Product</option>
                                            <option value="Karet">Karet</option>
                                            <option value="Kelapa">Kelapa</option>
                                            <option value="Pupuk">Pupuk</option>
                                        </StyledSelect>
                                    </FormField>
                                    <FormField label="Tanggal">
                                        <StyledInput type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                    </FormField>
                                    <FormField label="No. Bukti">
                                        <StyledInput placeholder='Nomor Bukti' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                                    </FormField>
                                    <FormField label="Lokasi Kebun">
                                        <StyledSelect value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} required>
                                            <option value="" disabled>Pilih Lokasi</option>
                                            <option value="Sebayar">Sebayar</option>
                                            <option value="Temadu">Temadu</option>
                                            <option value="Agro">GK Agro</option>
                                            <option value="GKA">GKA</option>
                                        </StyledSelect>
                                    </FormField>
                                    <FormField label="Status Awal">
                                        <StyledSelect value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                                            <option value="" disabled>Pilih Status</option>
                                            <option value="TSA">TSA</option>
                                            <option value="Agro">GK Agro</option>
                                            <option value="GKA">GKA</option>
                                        </StyledSelect>
                                    </FormField>
                                    <FormField label="Jenis Barang">
                                        <StyledInput placeholder='Contoh: Lateks, Pupuk NPK, dll.' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} />
                                    </FormField>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <FormField label="Description">
                                            <StyledTextarea placeholder='Deskripsi...' value={data.desk} onChange={(e) => setData('desk', e.target.value)} />
                                        </FormField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 mb-6">Data Stok Awal (Inbound)</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    <FormField label="Quantity (Kg)">
                                        <StyledInput type='number' placeholder='Quantity' value={data.qty_kg} onChange={(e) => setData('qty_kg', e.target.value)} />
                                    </FormField>
                                    <FormField label="Price / Qty">
                                        <StyledInput type='number' placeholder='Price' value={data.price_qty} onChange={(e) => setData('price_qty', e.target.value)} />
                                    </FormField>
                                    <FormField label="Amount">
                                        <StyledInput placeholder='Amount' value={data.amount} readOnly className="cursor-not-allowed bg-gray-200 dark:bg-gray-600" />
                                    </FormField>
                                    <FormField label="Keping / Buah">
                                        <StyledInput type='number' placeholder='Keping' value={data.keping} onChange={(e) => setData('keping', e.target.value)} />
                                    </FormField>
                                    <FormField label="Kualitas">
                                        <StyledInput placeholder='Kualitas' value={data.kualitas} onChange={(e) => setData('kualitas', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end pt-4'>
                            <Button type='submit' disabled={processing} className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl'>
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Tambah Produk'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
