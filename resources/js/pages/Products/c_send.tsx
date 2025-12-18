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

// Komponen UI Helper
const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</Label>
        <div className="mt-1.5">{children}</div>
    </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
);

const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
);

const StyledTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <Textarea {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
);

const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
            <ChevronRight className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {children}
        </div>
    </div>
);

export default function SendProduct() {
    const { data, setData, post, processing, errors } = useForm({
        product: '', 
        date: '', 
        no_invoice: '', 
        nm_supplier: 'GKA', // Default
        j_brg: '', 
        desk: '',
        qty_out: '', 
        price_out: '', 
        amount_out: '', 
        keping_out: '', 
        kualitas_out: '', 
        status: 'Buyer', // Default status penjualan
        tgl_kirim: '',
        
        // --- Field Tambahan ---
        customer_name: '',
        shipping_method: '',
        pph_value: '',
        ob_cost: '',
        extra_cost: '',
        due_date: '',
        person_in_charge: '',
    });

    // Kalkulasi Otomatis (Saat Create, PPH berbasis Qty Out karena Qty Sampai belum ada)
    useEffect(() => {
        const qty = parseFloat(data.qty_out) || 0;
        const price = parseFloat(data.price_out) || 0;
        const grossAmount = qty * price;
        
        // PPH 0.25%
        const pph = grossAmount * 0.0025;
        
        // Biaya Lain
        const ob = parseFloat(data.ob_cost) || 0;
        const extra = parseFloat(data.extra_cost) || 0;
        
        // Total Bersih = Bruto - PPH - Biaya Lain
        const netAmount = grossAmount - pph - ob - extra;

        // Update state jika nilai berubah (cegah infinite loop)
        if (data.pph_value !== pph.toFixed(2) && grossAmount > 0) {
             setData(prev => ({...prev, pph_value: pph.toFixed(2)}));
        }

        if (data.amount_out !== netAmount.toFixed(2) && grossAmount > 0) {
             setData(prev => ({...prev, amount_out: netAmount.toFixed(2)}));
        }
        
    }, [data.qty_out, data.price_out, data.ob_cost, data.extra_cost]); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Product" />
             <div className="bg-gray-50 dark:bg-black py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     
                     <div className="flex justify-between items-center mb-8">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">Input Penjualan (Kirim Barang)</h1>
                             <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Buat data pengiriman baru ke customer.</p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="outline" className='flex items-center gap-2'>
                                <Undo2 size={16} /> Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-8">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Terjadi Kesalahan Validasi</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5">
                                    {Object.values(errors).map((message, i) => <li key={i}>{message}</li>)}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
                        
                        <FormSection title="Informasi Dasar">
                            <FormField label="Jenis Produk">
                                <StyledSelect value={data.product} onChange={(e) => setData('product', e.target.value)} required>
                                    <option value="" disabled>Pilih Produk...</option>
                                    <option value="Karet">Karet</option>
                                    <option value="Kelapa">Kelapa</option>
                                    <option value="Pupuk">Pupuk</option>
                                </StyledSelect>
                            </FormField>
                            <FormField label="Tanggal Nota">
                                <StyledInput type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} />
                            </FormField>
                            <FormField label="No. Invoice">
                                <StyledInput placeholder='INV-XXXX' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </FormField>
                            <FormField label="Nama Customer / Pembeli">
                                <StyledInput placeholder='PT. Contoh Customer' value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} />
                            </FormField>
                            <FormField label="Jenis Barang (Detail)">
                                <StyledInput placeholder='Contoh: Lateks / Lump' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Logistik & Pengiriman">
                            <FormField label="Via Pengiriman">
                                <StyledInput placeholder='Darat / Laut / Udara' value={data.shipping_method} onChange={(e) => setData('shipping_method', e.target.value)} />
                            </FormField>
                            <FormField label="Tanggal Kirim">
                                <StyledInput type='date' value={data.tgl_kirim} onChange={(e) => setData('tgl_kirim', e.target.value)} />
                            </FormField>
                            <FormField label="Estimasi Jatuh Tempo">
                                <StyledInput type='date' value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                            </FormField>
                             <FormField label="Penanggung Jawab (PIC)">
                                <StyledInput placeholder='Nama PIC' value={data.person_in_charge} onChange={(e) => setData('person_in_charge', e.target.value)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Kuantitas & Harga">
                             <FormField label="Berat Kirim (Qty Out)">
                                <div className="relative">
                                    <StyledInput type='number' placeholder='0' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} className="pr-10" />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">Kg</span>
                                </div>
                             </FormField>
                             <FormField label="Harga Satuan (Rp)">
                                <StyledInput type='number' placeholder='0' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)} />
                             </FormField>
                             <FormField label="Keping / Colly">
                                <StyledInput type='number' placeholder='0' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} />
                             </FormField>
                             <FormField label="Kualitas (%)">
                                <StyledInput placeholder='Kering / Basah' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} />
                             </FormField>
                        </FormSection>

                        <FormSection title="Biaya & Total">
                             <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                 <FormField label="PPH 0.25% (Otomatis)">
                                    <StyledInput type='number' value={data.pph_value} readOnly className="bg-white dark:bg-gray-800 font-mono text-right" />
                                    <p className="text-[10px] text-gray-500 mt-1 italic">*Dihitung dari Total Bruto</p>
                                 </FormField>
                             </div>
                             <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                 <FormField label="Biaya OB">
                                    <StyledInput type='number' placeholder='0' value={data.ob_cost} onChange={(e) => setData('ob_cost', e.target.value)} className="text-right" />
                                 </FormField>
                             </div>
                             <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                 <FormField label="Biaya Tambahan">
                                    <StyledInput type='number' placeholder='0' value={data.extra_cost} onChange={(e) => setData('extra_cost', e.target.value)} className="text-right" />
                                 </FormField>
                             </div>

                             <div className="md:col-span-3 mt-2">
                                 <FormField label="Total Akhir (Net Amount)">
                                    <StyledInput type="number" value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 font-bold text-xl text-right h-12" />
                                 </FormField>
                             </div>
                        </FormSection>

                        <FormSection title="Keterangan">
                            <div className="md:col-span-3">
                                <FormField label="Catatan Tambahan">
                                    <StyledTextarea placeholder='Tulis keterangan tambahan di sini...' value={data.desk} onChange={(e) => setData('desk', e.target.value)} rows={3} />
                                </FormField>
                            </div>
                        </FormSection>

                        <div className='flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700'>
                            <Button type='submit' disabled={processing} className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all'>
                                <Send size={18} />
                                {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}