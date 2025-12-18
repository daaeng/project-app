import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save, ChevronRight } from 'lucide-react';
import React, { useEffect } from 'react';

// Interface Data lengkap
interface Product{
    id: number,
    product: string,
    date: string,
    no_invoice: string,
    nm_supplier: string,
    j_brg: string,
    desk: string,
    qty_kg: string,
    price_qty: string,
    amount: string,
    keping: string,
    kualitas: string,
    qty_out: string,
    price_out: string,
    amount_out: string,
    keping_out: string,
    kualitas_out: string,
    status: string,
    // Field Tambahan
    tgl_kirim: string,
    tgl_sampai: string,
    qty_sampai: string,
    customer_name?: string,
    shipping_method?: string,
    pph_value?: string,
    ob_cost?: string,
    extra_cost?: string,
    due_date?: string,
    person_in_charge?: string,
}

interface props{
    product : Product
}

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</Label>
        <div className="mt-1.5">{children}</div>
    </div>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input {...props} className="w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" />
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

export default function EditOut({product} : props) {

    const {data, setData, put, processing, errors } = useForm({
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
        
        // Load data existing atau default kosong
        tgl_kirim: product.tgl_kirim || '',
        tgl_sampai: product.tgl_sampai || '',
        qty_sampai: product.qty_sampai || '',
        customer_name: product.customer_name || '',
        shipping_method: product.shipping_method || '',
        pph_value: product.pph_value || '',
        ob_cost: product.ob_cost || '',
        extra_cost: product.extra_cost || '',
        due_date: product.due_date || '',
        person_in_charge: product.person_in_charge || '',
    })

    // [RUMUS 1] Hitung PPh 0.25% Otomatis
    // Trigger: Saat Qty Sampai atau Harga berubah
    useEffect(() => {
        const qtySampai = parseFloat(data.qty_sampai) || 0;
        const price = parseFloat(data.price_out) || 0;
        
        // Default PPH 0
        let pph = 0;
        
        if (qtySampai > 0 && price > 0) {
            // Rumus: Qty Sampai * Harga * 0.25%
            const totalBruto = qtySampai * price;
            pph = totalBruto * 0.0025; 
        }

        // Update state jika berbeda (format 2 desimal)
        if ((parseFloat(data.pph_value) || 0) !== parseFloat(pph.toFixed(2))) {
            setData(prev => ({...prev, pph_value: pph.toFixed(2)}));
        }
    }, [data.qty_sampai, data.price_out]); 

    // [RUMUS 2] Hitung Total Akhir (Net Amount) Otomatis
    // Trigger: Saat ada perubahan di Qty Sampai, Harga, PPh, OB, atau Extra Cost
    // Rumus: (Qty Sampai * Price) - PPh - OB - Extra Cost
    useEffect(() => {
         const qtySampai = parseFloat(data.qty_sampai) || 0;
         const price = parseFloat(data.price_out) || 0;
         
         const pph = parseFloat(data.pph_value) || 0;
         const ob = parseFloat(data.ob_cost) || 0;
         const extra = parseFloat(data.extra_cost) || 0;
         
         // Hitung Bruto berdasarkan Qty Sampai
         const gross = qtySampai * price;
         
         // Hitung Net
         const net = gross - pph - ob - extra;
         
         // Update Amount Out otomatis
         // Note: Kita cek perbedaan value untuk mencegah infinite loop render
         if (parseFloat(data.amount_out) !== parseFloat(net.toFixed(2))) {
             setData(prev => ({...prev, amount_out: net.toFixed(2)}));
         }
    }, [data.qty_sampai, data.price_out, data.pph_value, data.ob_cost, data.extra_cost]);

    const handleUpdate = (e: React.FormEvent) =>{
        e.preventDefault();
        put(route('products.update', product.id));
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Product Information', href: '/products' },
        { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
        // { title: 'Send Product', href: '/products/c_send' },
        { title: 'Edit Data Product', href:`/products/edit/${product.id}` }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengeluaran" />

            <div className="bg-gray-50 dark:bg-black py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-3xl">Edit Data Pengeluaran</h1>
                             <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Invoice: {product.no_invoice}</p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="outline" className='flex items-center gap-2'>
                                <Undo2 size={16} /> Kembali
                            </Button>
                        </Link>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <CircleAlert className='h-4 w-4'/>
                            <AlertTitle>Terjadi Kesalahan Validasi</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5">
                                    {Object.values(errors).map((message, i) => <li key={i}>{message}</li>)}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleUpdate} className='space-y-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700'>
                        
                        <FormSection title="Informasi Transaksi">
                            <FormField label="Tanggal Nota">
                                <StyledInput type='date' value={data.date} onChange={(e) => setData('date', e.target.value)} />
                            </FormField>
                            <FormField label="No. Invoice">
                                <StyledInput value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </FormField>
                            <FormField label="Customer Name">
                                <StyledInput value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} />
                            </FormField>
                             <FormField label="Jenis Barang">
                                <StyledInput value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Logistik & Pengiriman">
                            <FormField label="Via Pengiriman">
                                <StyledInput value={data.shipping_method} onChange={(e) => setData('shipping_method', e.target.value)} />
                            </FormField>
                            <FormField label="Tanggal Kirim">
                                <StyledInput type='date' value={data.tgl_kirim} onChange={(e) => setData('tgl_kirim', e.target.value)} />
                            </FormField>
                            <FormField label="Tanggal Sampai">
                                <StyledInput type='date' value={data.tgl_sampai} onChange={(e) => setData('tgl_sampai', e.target.value)} />
                            </FormField>
                            <FormField label="Jatuh Tempo">
                                <StyledInput type='date' value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                            </FormField>
                            <FormField label="Penanggung Jawab (PIC)">
                                <StyledInput value={data.person_in_charge} onChange={(e) => setData('person_in_charge', e.target.value)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Kuantitas & Harga">
                            <FormField label="Quantity Out (Kirim)">
                                <div className="relative">
                                    <StyledInput value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} className="pr-10" />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">Kg</span>
                                </div>
                            </FormField>
                            
                            {/* Qty Sampai Penting untuk PPH */}
                            <FormField label="Qty Sampai (Pabrik)">
                                <div className="relative">
                                    <StyledInput type='number' placeholder='Isi untuk hitung PPH & Total' value={data.qty_sampai} onChange={(e) => setData('qty_sampai', e.target.value)} className="pr-10 border-blue-300 focus:border-blue-500 font-medium" />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">Kg</span>
                                </div>
                            </FormField>

                            <FormField label="Price / Qty (Rp)">
                                <StyledInput value={data.price_out} onChange={(e) => setData('price_out', e.target.value)} />
                            </FormField>
                            
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <FormField label="PPH 0.25% (Auto)">
                                    <StyledInput value={data.pph_value} readOnly className="bg-white dark:bg-gray-800 text-right font-mono text-gray-600" />
                                    <p className="text-[10px] text-gray-500 mt-1 italic">*Basis: Qty Sampai x Harga</p>
                                </FormField>
                            </div>
                            
                            <FormField label="Keping / Buah">
                                <StyledInput value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} />
                            </FormField>
                            <FormField label="Kualitas">
                                <StyledInput value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Biaya Lain & Total">
                            <FormField label="Biaya OB">
                                <StyledInput value={data.ob_cost} onChange={(e) => setData('ob_cost', e.target.value)} className="text-right" />
                            </FormField>
                            <FormField label="Biaya Tambahan">
                                <StyledInput value={data.extra_cost} onChange={(e) => setData('extra_cost', e.target.value)} className="text-right" />
                            </FormField>
                            
                            <div className="md:col-span-1 lg:col-span-1">
                                <FormField label="Total Akhir (Net)">
                                    <StyledInput value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)} className="bg-green-50 dark:bg-green-900/20 border-green-200 text-green-700 font-bold text-lg text-right" />
                                    <p className="text-[10px] text-gray-500 mt-1 italic text-right">* (Qty Sampai x Harga) - PPH - OB - Biaya Lain</p>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Catatan">
                            <div className="md:col-span-3">
                                <FormField label="Keterangan">
                                    <StyledTextarea value={data.desk} onChange={(e) => setData('desk', e.target.value)} rows={3} />
                                </FormField>
                            </div>
                        </FormSection>

                        <div className='flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700'>
                            <Button type='submit' disabled={processing} className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all'>
                                <Save size={18} /> Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}