import Heading from '../../components/heading';
import { Button } from '../../components/ui/button';
import AppLayout from '../../layouts/app-layout';
import { type BreadcrumbItem } from '../../types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import React from 'react';

// Tipe data harus sesuai dengan data dari controller
interface PpbItem {
    id: number;
    nama_barang: string;
    jumlah: number;
    satuan: string;
    harga_satuan: number;
    harga_total: number;
    keterangan: string;
}

interface PpbHeader {
    id: number;
    tanggal: string; // Controller akan kirim string (ISO date)
    nomor: string;
    lampiran: string;
    perihal: string;
    kepada_yth_jabatan: string;
    kepada_yth_nama: string;
    kepada_yth_lokasi: string;
    paragraf_pembuka: string;
    dibuat_oleh_nama: string;
    dibuat_oleh_jabatan: string;
    menyetujui_1_nama: string;
    menyetujui_1_jabatan: string;
    menyetujui_2_nama: string;
    menyetujui_2_jabatan: string;
    grand_total: number;
    status: string;
    items: PpbItem[];
}

interface Props {
    ppb: PpbHeader;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PPB', href: route('ppb.index') },
    { title: 'Detail PPB' },
];

// Komponen untuk format tanda tangan
const SignatureColumn: React.FC<{ title: string; name: string; role: string }> = ({ title, name, role }) => (
    <div className="text-center">
        <p>{title}</p>
        <div className="h-20" /> {/* Spasi untuk TTD */}
        <p className="font-bold underline">{name}</p>
        <p>{role}</p>
    </div>
);

export default function ShowPpb({ ppb }: Props) {
    
    // Format tanggal ke format Indonesia (Contoh: 13 November 2025)
    const formattedDate = new Date(ppb.tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Format mata uang
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Fungsi print (sederhana, bisa dikembangkan dengan CSS print)
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail PPB ${ppb.nomor}`} />
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <Heading title="Detail Pengajuan Barang" description={`Melihat surat dengan nomor ${ppb.nomor}`} />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint} className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                        <Link href={route('ppb.index')}>
                            <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Wrapper untuk surat, dibuat mirip kertas A4.
                  Style 'print:*' akan aktif saat di-print.
                */}
                <div className="max-w-4xl mx-auto bg-white text-black p-12 shadow-2xl rounded-lg print:shadow-none print:p-0 print:m-0 print:bg-transparent">
                    {/* Header Tanggal */}
                    <div className="flex justify-end mb-8">
                        <p>Ranai, {formattedDate}</p>
                    </div>

                    {/* Info Surat */}
                    <div className="grid grid-cols-[max-content,1fr] gap-x-4 mb-8">
                        <span className="font-bold">Nomor</span>
                        <span>: {ppb.nomor}</span>
                        
                        <span className="font-bold">Lampiran</span>
                        <span>: {ppb.lampiran}</span>
                        
                        <span className="font-bold">Perihal</span>
                        <span>: {ppb.perihal}</span>
                    </div>

                    {/* Tujuan Surat */}
                    <div className="mb-8 space-y-1">
                        <p>Kepada Yth.</p>
                        <p className="font-bold">{ppb.kepada_yth_jabatan}</p>
                        <p className="font-bold">{ppb.kepada_yth_nama}</p>
                        <p>{ppb.kepada_yth_lokasi}</p>
                    </div>

                    {/* Isi Surat */}
                    <div className="space-y-6">
                        <p>Dengan Hormat,</p>
                        {/* whitespace-pre-line agar format paragraf (jika ada enter) tetap rapi */}
                        <p className="whitespace-pre-line">{ppb.paragraf_pembuka}</p>
                    </div>

                    {/* Tabel Item */}
                    <div className="my-8">
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-black p-2">No.</th>
                                    <th className="border border-black p-2">Nama Barang</th>
                                    <th className="border border-black p-2">Jumlah</th>
                                    <th className="border border-black p-2">Satuan</th>
                                    <th className="border border-black p-2">Estimasi Harga Satuan</th>
                                    <th className="border border-black p-2">Harga Total</th>
                                    <th className="border border-black p-2">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ppb.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border border-black p-2 text-center">{index + 1}</td>
                                        <td className="border border-black p-2">{item.nama_barang}</td>
                                        <td className="border border-black p-2 text-center">{item.jumlah}</td>
                                        <td className="border border-black p-2 text-center">{item.satuan}</td>
                                        <td className="border border-black p-2 text-right">{formatCurrency(item.harga_satuan)}</td>
                                        <td className="border border-black p-2 text-right">{formatCurrency(item.harga_total)}</td>
                                        <td className="border border-black p-2">{item.keterangan}</td>
                                    </tr>
                                ))}
                                {/* Grand Total */}
                                <tr>
                                    <td colSpan={5} className="border border-black p-2 text-center font-bold">
                                        Grand Total
                                    </td>
                                    <td className="border border-black p-2 text-right font-bold">
                                        {formatCurrency(ppb.grand_total)}
                                    </td>
                                    <td className="border border-black p-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Penutup */}
                    <p className="mb-12">
                        Demikian surat permohonan ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
                    </p>

                    {/* Tanda Tangan */}
                    <div className="grid grid-cols-3 gap-4">
                        <SignatureColumn
                            title="Dibuat Oleh,"
                            name={ppb.dibuat_oleh_nama}
                            role={ppb.dibuat_oleh_jabatan}
                        />
                        <SignatureColumn
                            title="Menyetujui,"
                            name={ppb.menyetujui_1_nama}
                            role={ppb.menyetujui_1_jabatan}
                        />
                        <SignatureColumn
                            title="" // Kolom ketiga di gambar tidak ada title "Menyetujui"
                            name={ppb.menyetujui_2_nama}
                            role={ppb.menyetujui_2_jabatan}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}