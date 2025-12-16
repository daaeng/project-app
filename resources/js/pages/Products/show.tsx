import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Undo2, Printer } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import Tag_Karet from '@/components/ui/tag_karet';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products/gka' },
    { title: 'Detail Laporan', href: '#' },
];

// Interface untuk data produk
interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
    status: string;
    // --- [DITAMBAHKAN] Interface untuk field baru ---
    tgl_kirim: string;
    tgl_sampai: string;
    qty_sampai: number;
    // --- [SELESAI DITAMBAHKAN] ---
    customer_name: string;
    pph_value: number;
    ob_cost: number;
    extra_cost: number;
    shipping_method: string;
    person_in_charge: string;
    due_date: string;
}

// Interface untuk props halaman
interface PageProps {
    product: Product;
    susut_value: number; // Tambahkan susut_value
}

// Fungsi helper untuk format tanggal
const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

// Komponen untuk setiap baris detail
const DetailRow = ({ label, value, isCurrency = false, className = '' }: { label: string, value: any, isCurrency?: boolean, className?: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`text-sm text-gray-800 dark:text-gray-100 font-semibold ${className}`}>
            {isCurrency ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value) : value}
        </span>
    </div>
);

export default function ShowReport({ product, susut_value }: PageProps) {
    
    const handlePrint = () => {
        const printUrl = route('products.print', product.id);
        window.open(printUrl, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Laporan Penjualan ${product.no_invoice}`} />

            

            <div className="bg-gray-50 dark:bg-black py-6 sm:py-8 lg:py-12 min-h-full">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Tombol Aksi (tidak akan di-print) */}
                    <div className="flex justify-between items-center mb-6 no-print">
                        <div>
                             <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Detail Laporan Penjualan</h1>
                             <p className="mt-1 text-md text-gray-600 dark:text-gray-400">No. Invoice: {product.no_invoice}</p>
                        </div>
                        <div className="flex gap-2">
                             <Link href={route('products.index')}>
                                <Button variant="outline" className='flex items-center gap-2'>
                                    <Undo2 size={16} />
                                    Kembali
                                </Button>
                            </Link>
                            {/* Tombol Print hanya muncul jika status 'Buyer' */}
                            {product.status === 'Buyer' && (
                                <Button onClick={handlePrint} className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
                                    <Printer size={16} />
                                    Print Laporan
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Area yang akan di-print */}
                    <div id="printable-area" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                        <header className="pb-6 border-b border-gray-200 dark:border-gray-700">
                            <img 
                                src="/assets/GKA_no_Tag.png" 
                                className="h-10 w-auto mx-auto mb-3 object-contain" 
                                alt="Logo GKA" 
                            />
                            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Laporan Penjualan</h2>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">PT. Garuda Karya Amanat</p>
                        </header>
                        
                        <main className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Kolom Kiri */}
                            <div className="space-y-2">
                                <DetailRow label="No. Invoice" value={product.no_invoice} />
                                <DetailRow label="Customer" value={product.customer_name} />
                                {/* <DetailRow label="Tanggal Nota" value={formatDate(product.date)} /> */}
                                <DetailRow label="Jenis Produk" value={product.product} />
                                <DetailRow label="Jenis Barang" value={product.j_brg} />
                                
                                <div className="mt-3">
                                    <h4 className="text-sm font-bold text-gray-500 tracking-wider mb-2">Informasi Pembeli</h4>
                                    <p className=" dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">{product.desk || 'No description log available.'}</p>
                                </div>
                            </div>

                            {/* Kolom Kanan */}
                            <div className="space-y-2">
                                 <DetailRow label="Status" value={<Tag_Karet status={product.status}/>} />
                                 <DetailRow label="Quantity (Kg)" value={`${product.qty_out} Kg`} />
                                 <DetailRow label="Keping / Buah" value={product.keping_out} />
                                 <DetailRow label="Kualitas" value={product.kualitas_out} />
                                 {/* Tampilkan Susut hanya jika ada nilainya */}
                                 {susut_value > 0 && (
                                    <DetailRow label="Susut" value={`${susut_value} Kg`} className="text-yellow-600 font-bold" />
                                 )}
                                 
                                 {/* --- [DITAMBAHKAN] Tampilkan data baru jika ada --- */}
                                 {product.tgl_kirim && (
                                    <DetailRow label="Tanggal Kirim" value={formatDate(product.tgl_kirim)} className="text-blue-600" />
                                 )}
                                 {product.tgl_sampai && (
                                    <DetailRow label="Tanggal Sampai" value={formatDate(product.tgl_sampai)} className="text-green-600" />
                                 )}
                                 {product.qty_sampai > 0 && (
                                    <DetailRow label="Qty Sampai" value={`${product.qty_sampai} Kg`} className="text-green-600 font-bold" />
                                 )}
                                 {/* --- [SELESAI DITAMBAHKAN] --- */}
                            </div>
                        </main>
                        
                        <footer className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Rincian Keuangan</h3>
                            <div className="space-y-2">
                                <DetailRow label="Harga / Kg" value={product.price_out} isCurrency />
                                <DetailRow label="PPH 0.25%" value={product.pph_value} isCurrency />
                                <DetailRow label="Biaya OB" value={product.ob_cost} isCurrency />
                                <DetailRow label="Biaya Tambahan" value={product.extra_cost} isCurrency />
                                <DetailRow label="Total Penjualan (Setelah PPh)" value={product.amount_out} isCurrency className="text-green-600 text-lg" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-3 mb-2">Data Pengantaran</h3>
                            <div className="space-y-2">
                                <DetailRow label="Via Armada" value={product.shipping_method} className="text-lg" />
                                <DetailRow label="Penanggung Jawab" value={product.person_in_charge} className="text-lg" />
                                <DetailRow label="Jatuh Tempo" value={product.due_date} className="text-lg" />
                            </div>
                        </footer>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}