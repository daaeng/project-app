import Heading from '../../components/heading';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import AppLayout from '../../layouts/app-layout';
import Tag from '../../components/ui/tag';
import { type BreadcrumbItem } from '../../types';
import { Head, Link, router, usePage } from '@inertiajs/react'; // (PERBAIKAN) Impor 'router' dan 'usePage'
import { ArrowLeft, Check, Printer, ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react'; // (PERBAIKAN) Impor 'useState'

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
    tanggal: string;
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
    status: 'pending' | 'approved' | 'rejected'; // Status lebih spesifik
    items: PpbItem[];
}

interface Props {
    ppb: PpbHeader;
    flash?: { // Terima flash message
        message?: string;
    };
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

export default function ShowPpb({ ppb, flash }: Props) {
    // (PERBAIKAN) Hapus 'useForm', ganti dengan 'router'
    const [processing, setProcessing] = useState(false);
    // @ts-ignore: Mengambil 'errors' dari 'usePage' yang mungkin tidak memiliki tipe spesifik
    const { errors } = usePage().props; // Ambil error dari props

    const handleApproval = (newStatus: 'approved' | 'rejected') => {
        const confirmationText = newStatus === 'approved' 
            ? 'Apakah Anda yakin ingin MENYETUJUI pengajuan ini?'
            : 'Apakah Anda yakin ingin MENOLAK pengajuan ini?';
        
        if (window.confirm(confirmationText)) {
            // (PERBAIKAN) Gunakan 'router.patch'
            router.patch(route('ppb.updateStatus', ppb.id), {
                status: newStatus, // Kirim data 'status' secara langsung
            }, {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            });
        }
    };
    
    // Format tanggal
    const formattedDate = new Date(ppb.tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const displayDate = `Ranai, ${formattedDate}`;

    // Format mata uang
    const formatCurrency = (value: number | undefined | null) => {
        const num = Number(value);
        if (!num || isNaN(num) || num === 0) {
            return '-';
        }
        // Format: Rp 10.000 (sesuai gambar)
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    // Fungsi print
    const handlePrint = () => {
        window.print();
    };

    // Watermark status untuk di kertas
    const StatusWatermark = () => {
        if (ppb.status === 'pending') return null;

        const text = ppb.status === 'approved' ? 'DISETUJUI' : 'DITOLAK';
        const color = ppb.status === 'approved' ? 'text-green-500' : 'text-red-500';

        // 'print:flex hidden' berarti tersembunyi normal, tapi 'flex' saat print
        return (
            <div className={`absolute inset-0 flex items-center justify-center print:flex hidden print-watermark`}>
                <span className={`text-8xl font-black ${color} opacity-20 rotate-[-30deg] border-4 ${color} border-dashed p-8`}>
                    {text}
                </span>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}> 
            <Head title={`Detail PPB ${ppb.nomor}`}>
                {/* (PERBAIKAN) CSS untuk Print telah diperbarui */}
                <style>{`
                    @media print {
                        /* 1. Sembunyikan semua elemen UI, panel, sidebar, dll. */
                        body * {
                            visibility: hidden;
                        }
                        
                        /* 2. Tampilkan HANYA area surat dan semua isinya. */
                        #surat-ppb, #surat-ppb * {
                            visibility: visible;
                        }

                        /* 3. Atur ulang posisi #surat-ppb agar mengalir normal di halaman cetak */
                        #surat-ppb {
                            position: static !important; /* Menghapus 'relative'/'absolute' */
                            max-width: none !important;  /* Menghapus 'max-w-4xl' */
                            width: 100% !important;
                            margin: 0 !important;        /* Menghapus 'mx-auto' */
                            padding: 0 !important;     /* Menghapus 'p-12' */
                            box-shadow: none !important; /* Menghapus 'shadow-2xl' */
                            border-radius: 0 !important;
                        }

                        /* 4. Atur halaman cetak */
                        @page {
                            size: A4;
                            margin: 2cm 1.5cm; /* Margin standar kertas */
                        }

                        /* 5. Paksa cetak warna background (untuk watermark/grand total) */
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .print-watermark {
                            display: flex !important;
                        }
                    }
                `}</style>
            </Head>

            {/* Layout Halaman */}
            <div className="p-4 md:p-6"> 

                {/* Panel Aksi Approval (Hanya muncul jika status 'pending') */}
                {ppb.status === 'pending' && (
                    <div className="mb-6 p-6 rounded-2xl border border-yellow-500 bg-yellow-900/50 print:hidden">
                        <h3 className="text-xl font-bold text-yellow-300 mb-4">Tindakan Persetujuan</h3>
                        <p className="text-yellow-200 mb-6">
                            Pengajuan ini sedang menunggu persetujuan Anda. Silakan tinjau dokumen di bawah ini
                            sebelum mengambil tindakan.
                        </p>
                        {/* (PERBAIKAN) Ambil 'errors.status' dari 'usePage' */}
                        {/* @ts-ignore: Mengabaikan error tipe 'errors.status' */}
                        {errors.status && <p className="text-red-600 mb-4 font-bold">{errors.status}</p>}
                        <div className="flex gap-4">
                            <Button
                                onClick={() => handleApproval('approved')}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold"
                            >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Setujui (ACC)
                            </Button>
                            <Button
                                onClick={() => handleApproval('rejected')}
                                disabled={processing}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                            >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Tolak
                            </Button>
                        </div>
                    </div>
                )}

                {/* Flash Message jika ada */}
                {flash?.message && (
                    <Alert className="mb-4 bg-green-900/50 border-green-500 text-green-300 print:hidden">
                        <Check className="h-4 w-4" />
                        <AlertTitle>Berhasil!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Panel Tombol Cetak/Kembali */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <div>
                        <Heading title="Detail Pengajuan Barang" description={`Nomor ${ppb.nomor}`} />
                        {/* Tampilkan status saat ini */}
                        <div className="mt-2">
                            <Tag status={ppb.status} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint} className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                        <Link href={route('ppb.index')}>
                            <Button variant="outline" className="bg-transparent border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* --- AREA SURAT --- */}
                {/* (PERBAIKAN) Menghapus kelas 'print:' dari div ini, karena sudah diatur di CSS */}
                <div id="surat-ppb" className="relative max-w-4xl mx-auto bg-white text-black p-12 shadow-2xl rounded-lg">
                    
                    <StatusWatermark />

                    {/* Header Tanggal */}
                    <div className="flex justify-end mb-8">
                        <p>{displayDate}</p>
                    </div>

                    {/* Info Surat */}
                    <div className="mb-8">
                        <div className="flex">
                            <div className="w-24">
                                <p>Nomor</p>
                                <p>Lampiran</p>
                                <p>Perihal</p>
                            </div>
                            <div>
                                <p>: {ppb.nomor}</p>
                                <p>: {ppb.lampiran}</p>
                                <p>: <span className='font-bold'>{ppb.perihal}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Tujuan Surat */}
                    <div className="mb-8 space-y-1">
                        <p>Kepada Yth.</p>
                        <p className="font-bold">{ppb.kepada_yth_jabatan}</p>
                        <p className="font-bold">{ppb.kepada_yth_nama}</p>
                        <p>di -</p>
                        <p>Tempat</p>
                    </div>

                    {/* Isi Surat */}
                    <div className="space-y-6 mb-6">
                        <p>Dengan Hormat,</p>
                        <p className="whitespace-pre-line text-justify">{ppb.paragraf_pembuka}</p>
                    </div>

                    {/* Tabel Item */}
                    <div className="my-8">
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr className="bg-gray-200 font-bold">
                                    <th className="border border-black p-2 w-[5%]">No.</th>
                                    <th className="border border-black p-2 w-[25%]">Nama Barang</th>
                                    <th className="border border-black p-2 w-[8%]">Jumlah</th>
                                    <th className="border border-black p-2 w-[10%]">Satuan</th>
                                    <th className="border border-black p-2 w-[17%]">Estimasi Harga Satuan</th>
                                    <th className="border border-black p-2 w-[17%]">Harga Total</th>
                                    <th className="border border-black p-2 w-[18%]">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* (PERBAIKAN) Tabel dikembalikan ke loop dinamis */}
                                {ppb.items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-black">
                                        <td className="border border-black p-2 text-center">{index + 1}</td>
                                        <td className="border border-black p-2">{item.nama_barang}</td>
                                        <td className="border border-black p-2 text-center">{item.jumlah}</td>
                                        <td className="border border-black p-2 text-center">{item.satuan}</td>
                                        <td className="border border-black p-2 text-right">{formatCurrency(item.harga_satuan)}</td>
                                        <td className="border border-black p-2 text-right">{formatCurrency(item.harga_total)}</td>
                                        <td className="border border-black p-2">{item.keterangan}</td>
                                    </tr>
                                ))}
                                
                                {/* Grand Total (Dibuat abu-abu sesuai image_93666b.png) */}
                                <tr className="bg-gray-200 font-bold">
                                    <td colSpan={5} className="border border-black p-2 text-center">
                                        Grand Total
                                    </td>
                                    <td className="border border-black p-2 text-right">
                                        {formatCurrency(ppb.grand_total)}
                                    </td>
                                    <td className="border border-black p-2"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* (PERBAIKAN) Paragraf penutup ditambahkan kembali */}
                    <p className="mb-12">
                        Demikian surat permohonan ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
                    </p>

                    {/* (PERBAIKAN) Tanda Tangan disesuaikan dengan image_93666b.png */}
                    <div className="grid grid-cols-3 gap-4 pt-8">
                        <SignatureColumn
                            title="Dibuat Oleh,"
                            name={ppb.dibuat_oleh_nama}
                            role={ppb.dibuat_oleh_jabatan}
                        />
                        <SignatureColumn
                            title="Mengetahui,"
                            name={ppb.menyetujui_1_nama}
                            role={ppb.menyetujui_1_jabatan}
                        />
                        <SignatureColumn
                            title="Menyetujui,"
                            name={ppb.menyetujui_2_nama}
                            role={ppb.menyetujui_2_jabatan}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}