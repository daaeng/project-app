import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Send, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Product Information', href: '/products' },
  { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
  { title: 'Send Product', href: '/products/c_send' },
];

// Komponen FormField untuk konsistensi
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</Label>
        <div className="mt-1.5">
            {children}
        </div>
    </div>
);

// Komponen input/select/textarea dengan gaya minimalis
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
);
const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
);
const StyledTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <Textarea {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
);

// Komponen Section untuk memisahkan bagian form
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center space-x-2">
            <ChevronRight className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="mt-4 pl-7">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {children}
             </div>
        </div>
    </div>
);


export default function SendProduct() {

    const {data, setData, post, processing, errors } = useForm({
        product: '', date: '', no_invoice: '', nm_supplier: '', j_brg: '', desk: '',
        qty_out: '', price_out: '', amount_out: '', keping_out: '', kualitas_out: '', status: '',
    });

    useEffect(() => {
        const qty = parseFloat(data.qty_out) || 0;
        const price = parseFloat(data.price_out) || 0;
        const calculatedAmount = qty * price;
        const calculatedPPH = calculatedAmount * 0.0025;
        const calculatedHSL = calculatedAmount - calculatedPPH;
        setData('amount_out', calculatedHSL.toFixed(2));
    }, [data.qty_out, data.price_out]);

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Product" />
             <div className="bg-gray-50 dark:bg-gray-900/95 py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">Send Product to GKA</h1>
                             <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Buat catatan pengiriman produk baru.</p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="outline" className='flex items-center gap-2'>
                                <Undo2 size={16} />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-8">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Terjadi Kesalahan</AlertTitle>
                            <AlertDescription><ul>{Object.values(errors).map((message, i) => <li key={i}>{message}</li>)}</ul></AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/20'>
                        <FormSection title="Detail Utama Pengiriman">
                            <FormField label="Product">
                                <StyledSelect value={data.product} onChange={(e) => setData('product', e.target.value)} required>
                                    <option value="" disabled>Pilih Jenis Product</option>
                                    <option value="Karet">Karet</option>
                                    <option value="Kelapa">Kelapa</option>
                                    <option value="Pupuk">Pupuk</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Tanggal Kirim">
                                <StyledInput type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} />
                            </FormField>
                            <FormField label="No. Bukti">
                                <StyledInput placeholder='Nomor Bukti' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </FormField>
                            <FormField label="Supplier Asal">
                                <StyledSelect value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} required>
                                    <option value="" disabled>Pilih Supplier</option>
                                    <option value="GKA">GKA</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Status Pengiriman">
                                <StyledSelect value={data.status} onChange={(e) => setData('status', e.target.value)} required>
                                    <option value="" disabled>Pilih Status</option>
                                    <option value="Buyer">GKA - Buyer</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Jenis Barang">
                                <StyledInput placeholder='Contoh: Lateks' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} />
                            </FormField>
                            <div className="md:col-span-2 lg:col-span-3">
                                <FormField label="Informasi Pembeli">
                                    <StyledTextarea placeholder='Jika pembeli adalah perusahaan, tulis nama lengkap' value={data.desk} onChange={(e) => setData('desk', e.target.value)} />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Data Stok Keluar">
                             <FormField label="Quantity (Kg)">
                                <StyledInput type='number' placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} />
                             </FormField>
                             <FormField label="Price / Qty">
                                <StyledInput type='number' placeholder='Price' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)} />
                             </FormField>
                             <FormField label="Amount (Setelah PPh)">
                                <StyledInput value={data.amount_out} readOnly className="cursor-not-allowed bg-gray-100 dark:bg-gray-700" />
                             </FormField>
                             <FormField label="Keping / Buah">
                                <StyledInput type='number' placeholder='Keping Keluar' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} />
                             </FormField>
                             <FormField label="Kualitas">
                                <StyledInput placeholder='Kualitas' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} />
                             </FormField>
                        </FormSection>

                        <div className='flex justify-end pt-4'>
                            <Button type='submit' disabled={processing} className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'>
                                <Send size={16} />
                                {processing ? 'Mengirim...' : 'Kirim Produk'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

