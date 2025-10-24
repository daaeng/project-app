import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // Menghapus useForm karena tidak lagi diperlukan
import {
    CircleAlert,
    Undo2,
    Banknote,
    Wallet,
    Scale,
    CalendarCheck,
} from 'lucide-react'; // Menambahkan ikon
import React from 'react'; // Impor React

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penoreh',
        href: route('incisors.index'),
    },
    {
        title: 'Informasi Penoreh',
        href: '#', // Halaman saat ini
    },
];

interface Incisor {
    id: number;
    name: string;
    nik: string; // <-- NIK DITAMBAHKAN
    ttl: string;
    gender: string;
    address: string;
    agama: string;
    status: string;
    no_invoice: string;
    lok_toreh: string;
}

interface DailyData {
    product: string;
    tanggal: string;
    kode_penoreh: string;
    kebun: string;
    jenis_barang: string;
    qty_kg: number;
    total_harga: number;
}

interface Props {
    incisor: Incisor;
    totalQtyKg: number;
    totalQtyKgThisMonth: number;
    pendapatanBulanIni: number;
    sisaKasbon: number;
    dailyData: DailyData[];
    errors?: Record<string, string>; // Opsional jika ada error passing
}

// Helper untuk format Rupiah
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { // Menggunakan 'id-ID' untuk format Rupiah
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Menghilangkan ,00
    }).format(value);
};

// Helper untuk format Tanggal
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch (e) {
        return dateString; // Fallback jika format tidak valid
    }
};

// Komponen kecil untuk Kartu Statistik
const StatCard = ({
    title,
    value,
    icon: Icon,
    className = '',
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    className?: string;
}) => (
    <Card className={`shadow-md dark:bg-gray-800 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
            </CardTitle>
            <Icon className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        </CardContent>
    </Card>
);

// Komponen kecil untuk item data profil
const ProfileDataItem = ({
    label,
    value,
}: {
    label: string;
    value: string | undefined | null;
}) => (
    <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-900 dark:text-gray-100 text-right">{value || '-'}</dd>
    </div>
);

export default function ShowIncisor({ // Mengganti nama 'index' menjadi 'ShowIncisor' agar lebih jelas
    incisor,
    totalQtyKg,
    totalQtyKgThisMonth,
    pendapatanBulanIni,
    sisaKasbon,
    dailyData,
    errors,
}: Props) {
    
    // Fallback jika incisor null/undefined
    if (!incisor) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                 <Head title="Error" />
                 <div className="p-4 text-red-500">Data penoreh tidak ditemukan.</div>
            </AppLayout>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Info Penoreh: ${incisor.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                {/* Header Halaman */}
                <div className="flex justify-between items-center mb-6">
                    <Heading
                        title="Informasi Data Penoreh"
                        className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
                    />
                    <Link href={route('incisors.index')}>
                        <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200 rounded-lg shadow-sm flex items-center">
                            <Undo2 className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Kartu Statistik */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <StatCard
                        title="Pendapatan Bulan Ini"
                        value={formatCurrency(pendapatanBulanIni || 0)}
                        icon={Banknote}
                        className="border-l-4 border-green-500"
                    />
                    <StatCard
                        title="Jumlah Kasbon"
                        value={formatCurrency(sisaKasbon || 0)}
                        icon={Wallet}
                        className="border-l-4 border-red-500"
                    />
                    <StatCard
                        title="Toreh Bulan Ini"
                        value={`${totalQtyKgThisMonth || 0} kg`}
                        icon={CalendarCheck}
                        className="border-l-4 border-blue-500"
                    />
                    <StatCard
                        title="Total Toreh (Semua)"
                        value={`${totalQtyKg || 0} kg`}
                        icon={Scale}
                        className="border-l-4 border-gray-500"
                    />
                </div>

                {/* Konten Utama (Profil & Tabel Riwayat) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Informasi Profil */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <ProfileDataItem label="Nama Lengkap" value={incisor.name} />
                                    <ProfileDataItem label="NIK" value={incisor.nik} /> {/* <-- NIK DITAMPILKAN */}
                                    <ProfileDataItem label="Tanggal Lahir" value={formatDate(incisor.ttl)} />
                                    <ProfileDataItem label="Jenis Kelamin" value={incisor.gender} />
                                    <ProfileDataItem label="Agama" value={incisor.agama} />
                                    <ProfileDataItem label="Status" value={incisor.status} />
                                    <ProfileDataItem label="Alamat" value={incisor.address} />
                                </dl>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Informasi Administrasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <ProfileDataItem label="Kode Penoreh" value={incisor.no_invoice} />
                                    <ProfileDataItem label="Lokasi Kerja" value={incisor.lok_toreh} />
                                </dl>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Tabel Riwayat */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Riwayat Toreh Harian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border dark:border-gray-700">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="dark:border-gray-700">
                                                <TableHead className="dark:text-gray-300">Product</TableHead>
                                                <TableHead className="dark:text-gray-300">Tanggal</TableHead>
                                                <TableHead className="dark:text-gray-300">Kode/Penoreh</TableHead>
                                                <TableHead className="dark:text-gray-300">Kebun</TableHead>
                                                <TableHead className="dark:text-gray-300">Qty (kg)</TableHead>
                                                <TableHead className="dark:text-gray-300 text-right">Total Harga</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dailyData.length > 0 ? (
                                                dailyData.map((item, index) => (
                                                    <TableRow key={index} className="dark:border-gray-700">
                                                        <TableCell className="dark:text-gray-200">{item.product}</TableCell>
                                                        <TableCell className="dark:text-gray-200">{formatDate(item.tanggal)}</TableCell>
                                                        <TableCell className="dark:text-gray-200">{item.kode_penoreh}</TableCell>
                                                        <TableCell className="dark:text-gray-200">{item.kebun}</TableCell>
                                                        <TableCell className="dark:text-gray-200">{item.qty_kg}</TableCell>
                                                        <TableCell className="dark:text-gray-200 text-right">
                                                            {formatCurrency(item.total_harga)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="text-center text-gray-500 dark:text-gray-400"
                                                    >
                                                        Tidak ada data riwayat bulan ini.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
