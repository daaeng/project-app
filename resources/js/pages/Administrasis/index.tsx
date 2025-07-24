import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Pencil, FileText, Receipt, Clock, DollarSign } from 'lucide-react'; // Hapus PlusCircle dan Paperclip

// Breadcrumbs untuk navigasi
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasi',
        href: '/administrasis',
    },
];

// Interface untuk data Request Letter
interface RequestData {
    id: number;
    date: string; // Tanggal Pengajuan
    devisi: string;
    j_pengajuan: string; // Jenis Pengajuan / Perihal
    dana: string;
    status: string;
    created_at: string;
    updated_at?: string; // Tambahkan untuk Tgl. Update
}

// Interface untuk data Nota/Kwitansi
interface NotaData {
    id: number;
    name: string; // Nama Pengaju/Pihak
    date: string; // Tanggal Transaksi
    devisi: string;
    desk: string; // Deskripsi Nota / Perihal
    dana: string;
    status: string;
    created_at: string;
    updated_at?: string; // Tambahkan untuk Tgl. Update
}

// Interface untuk data yang digabungkan di frontend
interface CombinedAdminItem {
    id: number;
    originalId: number; // ID asli dari Request atau Nota
    type: 'request' | 'nota'; // Tipe dokumen: 'request' atau 'nota'
    transactionDate: string; // Tanggal Pengajuan/Transaksi
    requesterOrParty: string; // Pengaju/Pihak Terkait
    subjectOrDescription: string; // Perihal/Deskripsi Singkat
    devisi: string;
    dana: string;
    status: string;
    createdAt: string; // Untuk sorting
    updatedAt?: string; // Tgl. Update (opsional)
}

// Interface untuk data ringkasan/statistik
interface SummaryData {
    totalRequests: number;
    totalNotas: number;
    totalPendingRequests: number; // Diperbarui untuk kejelasan
    totalApprovedDana: number; // Diperbarui untuk kejelasan
}

// Interface untuk props halaman (diperbarui)
interface PageProps {
    requests: {
        data: RequestData[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    notas: {
        data: NotaData[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    summary: SummaryData; // Tambahkan properti summary
}

// Fungsi untuk format mata uang Rupiah
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function AdminPage({ requests, notas, summary}: PageProps) {
    // Mengambil data requests, notas, dan summary dari props halaman
    // const { requests, notas, summary } = usePage().props as PageProps;

    // Menggabungkan dan menstandardisasi data dari requests dan notas
    const combinedData: CombinedAdminItem[] = [
        ...requests.data.map(item => ({
            id: item.id,
            originalId: item.id,
            type: 'request',
            transactionDate: item.date,
            requesterOrParty: item.devisi, // Untuk request, devisi bisa jadi pengaju
            subjectOrDescription: item.j_pengajuan,
            devisi: item.devisi,
            dana: item.dana,
            status: item.status,
            createdAt: item.created_at || item.date,
            updatedAt: item.updated_at || undefined, 
        })),
        ...notas.data.map(item => ({
            id: item.id,
            originalId: item.id,
            type: 'nota',
            transactionDate: item.date,
            requesterOrParty: item.name, // Nama pengaju/pihak untuk nota
            subjectOrDescription: item.desk,
            devisi: item.devisi,
            dana: item.dana,
            status: item.status,
            createdAt: item.created_at || item.date,
            updatedAt: item.updated_at || undefined, // Gunakan updated_at
        }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Urutkan berdasarkan tanggal terbaru

    // Fungsi untuk render link paginasi
    const renderPagination = (pagination: any, typeLabel: string) => {
        return (
            <div className="flex justify-center mt-4 mb-2">
                <span className="text-sm text-gray-600 mr-2">{typeLabel}:</span>
                {pagination.links.map((link: any, index: number) => (
                    <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        onClick={() => window.location.href = link.url}
                        disabled={!link.url}
                        className="mx-1 px-3 py-1 text-sm rounded-md"
                    >
                        {/* Menghilangkan karakter HTML entity untuk panah */}
                        {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administrasi" />

            <div className="h-full flex-col rounded-xl p-4 bg-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Heading title="Administrasi Dokumen" />
                    {/* Tombol "Tambah Dokumen Baru" dihapus */}
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Card 1: Total Request Letters */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium opacity-90">Total Request Letters</div>
                            <div className="text-3xl font-bold mt-1">{summary.totalRequests}</div>
                        </div>
                        <FileText size={40} className="opacity-70" />
                    </div>

                    {/* Card 2: Total Nota/Kwitansi */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium opacity-90">Total Nota/Kwitansi</div>
                            <div className="text-3xl font-bold mt-1">{summary.totalNotas}</div>
                        </div>
                        <Receipt size={40} className="opacity-70" />
                    </div>

                    {/* Card 3: Request Pending */}
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium opacity-90">Request Pending</div>
                            <div className="text-3xl font-bold mt-1">{summary.totalPendingRequests}</div> {/* Menggunakan totalPendingRequests */}
                        </div>
                        <Clock size={40} className="opacity-70" />
                    </div>

                    {/* Card 4: Total Dana Disetujui (Contoh) */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium opacity-90">Total Kwitansi/Nota Dana Disetujui</div>
                            <div className="text-3xl font-bold mt-1">{formatCurrency(summary.totalApprovedDana)}</div> {/* Menggunakan totalApprovedDana */}
                        </div>
                        <DollarSign size={40} className="opacity-70" />
                    </div>
                </div>
                {/* End Cards Section */}

                <div className="w-full border rounded-xl p-4 mt-4 overflow-x-auto">
                    <div className="font-bold text-xl mb-4 text-gray-800">Daftar Dokumen Administrasi</div>
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead className="w-[100px]">No. Dokumen</TableHead> Dihapus */}
                                <TableHead className="w-[120px]">Tanggal</TableHead>
                                <TableHead className="w-[150px]">Tipe Dokumen</TableHead>
                                <TableHead className="w-[150px]">Pengaju/Pihak</TableHead>
                                <TableHead>Perihal/Deskripsi</TableHead>
                                <TableHead className="w-[100px]">Devisi</TableHead>
                                <TableHead className="text-right w-[120px]">Dana</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[120px]">Tgl. Update</TableHead> 
                                <TableHead className="text-center w-[120px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {combinedData.length > 0 ? (
                                combinedData.map((item) => (
                                    <TableRow key={`${item.type}-${item.id}`}>
                                        {/* <TableCell>{item.documentNumber}</TableCell> Dihapus */}
                                        <TableCell>{item.transactionDate}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.type === 'request' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {item.type === 'request' ? 'Request Letter' : 'Nota/Kwitansi'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.requesterOrParty}</TableCell>
                                        <TableCell>{item.subjectOrDescription}</TableCell>
                                        <TableCell>{item.devisi}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(parseFloat(item.dana))}</TableCell>
                                        <TableCell>
                                            <Tag status={item.status} />
                                        </TableCell>
                                        <TableCell>{item.updatedAt || '-'}</TableCell> 
                                        <TableCell className="text-center space-x-2">
                                            {/* Aksi untuk Request Letter */}
                                            {item.type === 'request' && (
                                                <>
                                                    {can('administrasis.view') && (
                                                        <Link href={route('requests.showAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Eye color="gray" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('administrasis.edit') && (
                                                        <Link href={route('requests.editAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Pencil color="blue" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                            {/* Aksi untuk Nota/Kwitansi */}
                                            {item.type === 'nota' && (
                                                <>
                                                    {can('administrasis.view') && (
                                                        <Link href={route('notas.showAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Eye color="gray" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('administrasis.edit') && (
                                                        <Link href={route('notas.editAct', item.originalId)}>
                                                            <Button className="bg-transparent hover:bg-gray-200 p-2 rounded-full">
                                                                <Pencil color="blue" size={18} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-4 text-gray-500"> {/* Updated colspan */}
                                        Tidak ada data administrasi yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Bagian Paginasi untuk masing-masing tipe dokumen */}
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl shadow-sm">
                    {requests.data.length > 0 && renderPagination(requests, 'Paginasi Request')}
                    {notas.data.length > 0 && renderPagination(notas, 'Paginasi Nota')}
                </div>
            </div>
        </AppLayout>
    );
}
