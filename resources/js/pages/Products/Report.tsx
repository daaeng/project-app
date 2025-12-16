// import { Head } from '@inertiajs/react'; // Diganti dengan useEffect agar preview berjalan
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';

interface Product {
    id: number;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    product: string;
    j_brg: string;
    qty_out: number;
    amount_out: number;
    qty_sampai: number;
    tgl_sampai: string;
}

interface ReportProps {
    data: Product[];
    filters: {
        period: string;
        month: string;
        year: string;
        type: string;
    };
    totals: {
        qty: number;
        amount: number;
        qty_sampai: number;
    };
}

export default function Report({ data = [], filters = { period: 'all-time', month: '1', year: '2024', type: 'all' }, totals = { qty: 0, amount: 0, qty_sampai: 0 } }: ReportProps) {
    
    // Mengatur judul halaman (Pengganti <Head />)
    useEffect(() => {
        document.title = "Laporan Hasil Penjualan - PT. Garuda Karya Amanat";
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    // Helper untuk format tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    // Helper untuk format rupiah
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };
    
    // Helper untuk judul periode
    const getPeriodTitle = () => {
        if (filters.period === 'specific-month') {
            const date = new Date(parseInt(filters.year), parseInt(filters.month) - 1);
            return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
        } else if (filters.period === 'this-month') {
            return 'Bulan Ini';
        } else if (filters.period === 'today') {
            return 'Hari Ini';
        } else if (filters.period === 'this-year') {
            return 'Tahun ' + new Date().getFullYear();
        }
        return 'Semua Waktu';
    };

    return (
        <div className="min-h-screen bg-white text-black p-8 font-serif">
            
            {/* Tombol Aksi (Hilang saat print) */}
            <div className="print:hidden flex gap-4 mb-6 container mx-auto max-w-5xl">
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" /> Cetak Laporan
                </Button>
            </div>

            {/* KONTEN LAPORAN */}
            <div className="max-w-5xl mx-auto border border-gray-200 p-8 shadow-sm print:shadow-none print:border-none print:p-0 print:max-w-full">
                
                {/* KOP LAPORAN */}
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <img 
                        src="/assets/GKA_no_Tag.png" 
                        className="h-16 w-auto mx-auto mb-2 object-contain" 
                        alt="Logo GKA" 
                    />
                    <h1 className="text-3xl font-bold uppercase tracking-wide">PT. Garuda Karya Amanat</h1>
                    <p className="text-sm mt-1">Jalan Poros Utama No. 123, Kabupaten/Kota, Provinsi</p>
                    <p className="text-sm">Telp: (021) 1234-5678 | Email: admin@gka.com</p>
                </div>

                {/* JUDUL DAN INFO */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-center underline mb-4">LAPORAN HASIL PENJUALAN</h2>
                    <div className="flex justify-between text-sm">
                        <div>
                            <p><span className="font-semibold w-24 inline-block">Periode</span>: {getPeriodTitle()}</p>
                            <p><span className="font-semibold w-24 inline-block">Jenis Produk</span>: {filters.type === 'all' ? 'Semua Produk' : filters.type.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold">Tanggal Cetak</span>: {formatDate(new Date().toISOString())}</p>
                            {/* <p><span className="font-semibold">Oleh</span>: Admin</p> */}
                        </div>
                    </div>
                </div>

                {/* TABEL DATA */}
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black px-2 py-2 text-center w-10">No</th>
                            <th className="border border-black px-2 py-2 text-left">Tanggal</th>
                            <th className="border border-black px-2 py-2 text-left">No. Invoice</th>
                            <th className="border border-black px-2 py-2 text-left">Supplier/Buyer</th>
                            <th className="border border-black px-2 py-2 text-left">Barang</th>
                            <th className="border border-black px-2 py-2 text-right">Qty Kirim (Kg)</th>
                            <th className="border border-black px-2 py-2 text-right">Qty Sampai (Kg)</th>
                            <th className="border border-black px-2 py-2 text-right">Total Pendapatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id} className="text-gray-900">
                                    <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                                    <td className="border border-black px-2 py-1">{formatDate(item.date)}</td>
                                    <td className="border border-black px-2 py-1">{item.no_invoice}</td>
                                    <td className="border border-black px-2 py-1 uppercase">{item.nm_supplier}</td>
                                    <td className="border border-black px-2 py-1 capitalize">{item.product} - {item.j_brg}</td>
                                    <td className="border border-black px-2 py-1 text-right">{new Intl.NumberFormat('id-ID').format(item.qty_out)}</td>
                                    <td className="border border-black px-2 py-1 text-right">{new Intl.NumberFormat('id-ID').format(item.qty_sampai || 0)}</td>
                                    <td className="border border-black px-2 py-1 text-right font-medium">{formatCurrency(item.amount_out)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="border border-black px-4 py-8 text-center italic text-gray-500">
                                    Tidak ada data penjualan untuk periode ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={5} className="border border-black px-2 py-2 text-right">TOTAL KESELURUHAN</td>
                            <td className="border border-black px-2 py-2 text-right">{new Intl.NumberFormat('id-ID').format(totals.qty)}</td>
                            <td className="border border-black px-2 py-2 text-right">{new Intl.NumberFormat('id-ID').format(totals.qty_sampai)}</td>
                            <td className="border border-black px-2 py-2 text-right">{formatCurrency(totals.amount)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* TANDA TANGAN */}
                <div className="mt-16 flex justify-end">
                    <div className="text-center w-48">
                        <p className="mb-20">Mengetahui,</p>
                        {/* <p className="font-bold border-b border-black pb-1">Manager Operasional</p> */}
                        <p className="text-xs mt-1">PT. Garuda Karya Amanat</p>
                    </div>
                </div>

            </div>
            
            <style>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}