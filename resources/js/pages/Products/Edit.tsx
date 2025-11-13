import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Tag_Karet from '@/components/ui/tag_karet';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save } from 'lucide-react';
import React, { useEffect } from 'react';

interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_kg: string;
    price_qty: string;
    amount: string;
    keping: string;
    kualitas: string;
    qty_out: string;
    price_out: string;
    amount_out: string;
    keping_out: string;
    kualitas_out: string;
    status: string;
}

interface Props {
    product: Product;
}

// Komponen FormField untuk konsistensi
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
        <div className="mt-1">{children}</div>
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

export default function Edit({ product }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        product: product.product,
        date: product.date,
        no_invoice: product.no_invoice,
        nm_supplier: product.nm_supplier,
        j_brg: product.j_brg,
        desk: product.desk,
        qty_kg: product.qty_kg,
        price_qty: product.price_qty,
        amount: product.amount,
        keping: product.keping,
        kualitas: product.kualitas,
        qty_out: product.qty_out,
        price_out: product.price_out,
        amount_out: product.amount_out,
        keping_out: product.keping_out,
        kualitas_out: product.kualitas_out,
        status: product.status,
    });

    // --- Logika Perhitungan Otomatis ---
    useEffect(() => {
        const qty = parseFloat(data.qty_kg) || 0;
        const price = parseFloat(data.price_qty) || 0;
        // Pertimbangkan untuk menamai konstanta 0.40 agar lebih jelas, misal: const FAKTOR_PAJAK = 0.40;
        const calculatedAmount = qty * price * 0.4;
        setData('amount', calculatedAmount.toFixed(2));
    }, [data.qty_kg, data.price_qty]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Data Product', href: `/product/${product.id}/edit` }]}>
            <Head title="Edit Pemasukan" />

            <div className="bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl">
                                Edit Data Pemasukan
                            </h1>
                            <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
                                Perbarui informasi untuk No. Invoice: {product.no_invoice}
                            </p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Undo2 size={16} />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.values(errors).map((message, i) => (
                                        <li key={i}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 mb-6">
                                    Detail Utama
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField label="Product">
                                        <StyledInput
                                            value={data.product}
                                            readOnly
                                            className="cursor-not-allowed bg-gray-200 dark:bg-gray-600"
                                        />
                                    </FormField>
                                    <FormField label="Tanggal">
                                        {/* --- PERBAIKAN DI SINI --- */}
                                        {/* 1. Menambahkan `onChange` handler */}
                                        {/* 2. Menghapus className `bg-gray-200` agar terlihat aktif */}
                                        <StyledInput
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="No. Invoice">
                                        <StyledInput
                                            placeholder="Invoice"
                                            value={data.no_invoice}
                                            onChange={(e) => setData('no_invoice', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Supplier">
                                        <StyledSelect
                                            value={data.nm_supplier}
                                            onChange={(e) => setData('nm_supplier', e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>
                                                Pilih Supplier
                                            </option>
                                            <option value="Sebayar">Sebayar</option>
                                            <option value="Temadu">Temadu</option>
                                            <option value="Agro">GK Agro</option>
                                            <option value="GKA">GKA</option>
                                        </StyledSelect>
                                    </FormField>
                                    <FormField label="Jenis Barang">
                                        <StyledInput
                                            value={data.j_brg}
                                            readOnly
                                            className="cursor-not-allowed bg-gray-200 dark:bg-gray-600"
                                        />
                                    </FormField>
                                    <FormField label="Status">
                                        <div className="mt-1 pt-1">
                                            <Tag_Karet status={product.status} />
                                        </div>
                                    </FormField>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <FormField label="Description">
                                            <StyledTextarea
                                                placeholder="Deskripsi..."
                                                value={data.desk}
                                                onChange={(e) => setData('desk', e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 mb-6">
                                    Data Pemasukan (Inbound)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField label="Quantity (Kg)">
                                        <StyledInput
                                            type="number"
                                            placeholder="Quantity"
                                            value={data.qty_kg}
                                            onChange={(e) => setData('qty_kg', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Price / Qty">
                                        <StyledInput
                                            type="number"
                                            placeholder="Price"
                                            value={data.price_qty}
                                            onChange={(e) => setData('price_qty', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Amount">
                                        <StyledInput
                                            placeholder="Amount"
                                            value={data.amount}
                                            // readOnly
                                            className="cursor-not-allowed bg-gray-200 dark:bg-gray-600"
                                        />
                                    </FormField>
                                    <FormField label="Keping / Buah">
                                        <StyledInput
                                            type="number"
                                            placeholder="Keping"
                                            value={data.keping}
                                            onChange={(e) => setData('keping', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Kualitas">
                                        <StyledInput
                                            placeholder="Kualitas"
                                            value={data.kualitas}
                                            onChange={(e) => setData('kualitas', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
