import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'; // Tambahkan usePage dan router
import { Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';


// Breadcrumbs untuk halaman edit
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Edit Kasbon', href: '#' }, // Default, akan diupdate dinamis
];

// Interface untuk data penoreh yang diterima dari backend
interface IncisorOption {
    id: number;
    label: string; // no_invoice - name
}

// Interface untuk data bulan dan tahun yang diterima dari backend
interface MonthYearOption {
    year: number;
    month: number;
    label: string; // Nama Bulan Tahun
}

// Interface untuk data kasbon yang akan diedit (dari props)
interface KasbonData {
    id: number;
    incisor_id: number;
    incised_id: number; // mungkin tidak digunakan langsung di form, tapi ada di data db
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string | null;
    gaji: number; // 50% dari total toreh, ini yang disimpan di DB
    month: string; // Bulan dari incised terkait
    year: string; // Tahun dari incised terkait
}

// Interface untuk props halaman
interface PageProps {
    kasbon: KasbonData; // Data kasbon yang akan diedit
    incisors: IncisorOption[];
    monthsYears: MonthYearOption[];
    statuses: string[];
    flash: {
        message?: string;
        error?: string;
    };
    errors: {
        incisor_id?: string;
        month?: string;
        year?: string;
        kasbon?: string;
        status?: string;
        reason?: string;
    };
}

// Fungsi untuk memformat mata uang Rupiah
const formatCurrency = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) {
        return "Rp0";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function EditKasbon() { // Nama komponen diubah menjadi EditKasbon
    const { kasbon, incisors, monthsYears, statuses, flash, errors: pageErrors } = usePage().props as PageProps;

    // State untuk form data, diinisialisasi dengan data kasbon yang diterima
    const { data, setData, put, processing, errors, reset } = useForm({
        incisor_id: String(kasbon.incisor_id), // Pastikan format string untuk Select
        month: kasbon.month,
        year: kasbon.year,
        kasbon: kasbon.kasbon,
        status: kasbon.status,
        reason: kasbon.reason || '',
    });

    // State untuk data penoreh yang diambil secara otomatis (untuk informasi di panel kanan)
    const [incisorDetails, setIncisorDetails] = useState({
        name: '',
        address: '',
        no_invoice: '',
        total_toreh_bulan_ini: 0,
        gaji_bulan_ini: 0, // Ini adalah 50% dari total toreh, yang bisa jadi jumlah kasbon maksimal
        max_kasbon_amount: 0,
    });

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataFetchError, setDataFetchError] = useState<string | null>(null);

    // Dynamic breadcrumbs based on kasbon ID
    const dynamicBreadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasbon', href: '/kasbons' },
        { title: `Edit Kasbon (ID: ${kasbon.id})`, href: route('kasbons.edit', kasbon.id) },
    ];

    // Effect untuk mengambil data penoreh saat komponen dimuat atau incisor_id/month/year berubah
    useEffect(() => {
        const fetchIncisorInfo = async () => {
            // Hanya lakukan fetch jika incisor_id, month, dan year sudah terpilih
            if (data.incisor_id && data.month && data.year) {
                setIsLoadingData(true);
                setDataFetchError(null);

                try {
                    const response = await fetch(route('kasbons.getIncisorData'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content
                        },
                        body: JSON.stringify({
                            incisor_id: data.incisor_id,
                            month: data.month,
                            year: data.year,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Gagal mengambil data penoreh.');
                    }

                    const responseData = await response.json();
                    if (responseData && responseData.incisor) {
                        setIncisorDetails({
                            name: responseData.incisor.name,
                            address: responseData.incisor.address,
                            no_invoice: responseData.incisor.no_invoice,
                            total_toreh_bulan_ini: responseData.total_toreh_bulan_ini,
                            gaji_bulan_ini: responseData.gaji_bulan_ini,
                            max_kasbon_amount: responseData.max_kasbon_amount,
                        });
                        // Tidak mengubah nilai kasbon yang sudah ada di form edit
                    } else {
                        setDataFetchError('Data penoreh tidak ditemukan untuk periode ini.');
                        setIncisorDetails({
                            name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                        });
                    }
                } catch (error: any) {
                    console.error("Error fetching incisor data:", error);
                    setDataFetchError(error.message || 'Gagal mengambil data penoreh.');
                    setIncisorDetails({
                        name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                    });
                } finally {
                    setIsLoadingData(false);
                }
            } else {
                setIncisorDetails({
                    name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                });
                setDataFetchError(null);
            }
        };

        fetchIncisorInfo();
    }, [data.incisor_id, data.month, data.year]);

    // Untuk memastikan data incisorDetails terisi saat halaman pertama kali dimuat
    // dan kasbon.gaji sudah tersedia di props
    useEffect(() => {
        if (kasbon && kasbon.gaji !== undefined) {
             // Ini adalah total toreh bulan ini (gaji sebelum dipotong)
            const calculatedTotalToreh = kasbon.gaji * 2; 

            setIncisorDetails(prevDetails => ({
                ...prevDetails,
                name: kasbon.incisor_name || '', // Asumsi incisor_name ada di kasbon prop
                no_invoice: (kasbon as any).incisor_no_invoice || '', // Asumsi incisor_no_invoice ada di kasbon prop
                total_toreh_bulan_ini: calculatedTotalToreh,
                gaji_bulan_ini: kasbon.gaji,
                max_kasbon_amount: kasbon.gaji,
            }));
        }
    }, [kasbon]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi tambahan di frontend sebelum submit
        if (data.kasbon > incisorDetails.max_kasbon_amount) {
            setDataFetchError(`Jumlah kasbon tidak boleh melebihi ${formatCurrency(incisorDetails.max_kasbon_amount)}.`);
            return;
        }

        put(route('kasbons.update', kasbon.id), { // Menggunakan put untuk update
            onSuccess: () => {
                // Tidak reset form setelah sukses, biarkan data tetap di layar
                router.visit(route('kasbons.index'), {
                    onFinish: () => {
                        // Ini akan memicu tampilan flash message di halaman index
                    }
                });
            },
            onError: (formErrors) => {
                console.error("Error submitting form:", formErrors);
                // Errors secara otomatis ditangani oleh useForm dan ditampilkan
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={dynamicBreadcrumbs}>
            <Head title={`Edit Kasbon - ${kasbon.id}`} />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title={`Edit Kasbon (ID: ${kasbon.id})`} />
                <div className="mb-4">
                    <Link href={route('kasbons.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Flash Messages */}
                {flash.message && (
                    <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                        <Megaphone className='h-4 w-4 text-green-600' />
                        <AlertTitle className='text-green-700 font-semibold'>Notifikasi</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
                {flash.error && (
                    <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                        <Megaphone className='h-4 w-4 text-red-600' />
                        <AlertTitle className='text-red-700 font-semibold'>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}
                {dataFetchError && (
                    <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                        <Megaphone className='h-4 w-4 text-yellow-600' />
                        <AlertTitle className='text-yellow-700 font-semibold'>Peringatan</AlertTitle>
                        <AlertDescription>{dataFetchError}</AlertDescription>
                    </Alert>
                )}


                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> {/* Menggunakan grid responsive */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Form Edit Kasbon</CardTitle>
                            <CardDescription>Perbarui detail kasbon di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Incisor Select */}
                                <div>
                                    <Label htmlFor="incisor_id">Pilih Penoreh</Label>
                                    <Select
                                        onValueChange={(value) => setData('incisor_id', value)}
                                        value={data.incisor_id}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Penoreh" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {incisors.map((incisor) => (
                                                <SelectItem key={incisor.id} value={String(incisor.id)}>
                                                    {incisor.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.incisor_id && <p className="text-red-500 text-sm mt-1">{errors.incisor_id}</p>}
                                </div>

                                {/* Month and Year Select */}
                                <div>
                                    <Label htmlFor="month_year">Pilih Bulan dan Tahun Toreh</Label>
                                    <Select
                                        onValueChange={(value) => {
                                            const [month, year] = value.split('-');
                                            setData((prevData) => ({ ...prevData, month: month, year: year }));
                                        }}
                                        value={data.month && data.year ? `${data.month}-${data.year}` : ''}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Bulan & Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthsYears.map((item, index) => (
                                                <SelectItem key={index} value={`${item.month}-${item.year}`}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {(errors.month || errors.year) && <p className="text-red-500 text-sm mt-1">{errors.month || errors.year}</p>}
                                </div>

                                {/* Max Kasbon Amount */}
                                <div>
                                    <Label htmlFor="max_kasbon">Jumlah Maksimal Kasbon (IDR)</Label>
                                    <Input
                                        id="max_kasbon"
                                        placeholder="Jumlah maksimal kasbon"
                                        value={isLoadingData ? 'Memuat...' : formatCurrency(incisorDetails.max_kasbon_amount)}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Jumlah Kasbon */}
                                <div>
                                    <Label htmlFor="kasbon">Jumlah Kasbon (IDR)</Label>
                                    <Input
                                        id="kasbon"
                                        type="number"
                                        placeholder="Masukkan jumlah kasbon"
                                        value={data.kasbon}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setData('kasbon', isNaN(value) ? 0 : value);
                                        }}
                                        className=""
                                    />
                                    {errors.kasbon && <p className="text-red-500 text-sm mt-1">{errors.kasbon}</p>}
                                    {data.kasbon > incisorDetails.max_kasbon_amount && (
                                        <p className="text-red-500 text-sm mt-1">Jumlah kasbon melebihi batas maksimal.</p>
                                    )}
                                </div>

                                {/* Status Select - Sekarang terlihat dan dapat diedit */}
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => setData('status', value as 'Pending' | 'Approved' | 'Rejected')}
                                        value={data.status}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status === 'Approved' ? 'Disetujui' : status === 'Rejected' ? 'Ditolak' : status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>

                                {/* Reason Textarea */}
                                <div>
                                    <Label htmlFor="reason">Alasan (Opsional)</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Masukkan alasan jika diperlukan..."
                                        value={data.reason || ''}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        className=""
                                    />
                                    {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                                </div>

                                <Button type="submit" disabled={processing || isLoadingData} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
                                    {processing ? 'Memperbarui...' : 'Perbarui Kasbon'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Informasi Penoreh</CardTitle>
                            <CardDescription>Data terisi secara otomatis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Nama Penoreh */}
                                <div>
                                    <Label htmlFor="Nama">Nama Penoreh</Label>
                                    <Input
                                        id="Nama"
                                        placeholder="Nama Penoreh"
                                        value={isLoadingData ? 'Memuat...' : incisorDetails.name}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Alamat */}
                                <div>
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        placeholder="Alamat"
                                        value={isLoadingData ? 'Memuat...' : incisorDetails.address}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Kode Penoreh */}
                                <div>
                                    <Label htmlFor="kode">Kode Penoreh</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Kode Penoreh"
                                        value={isLoadingData ? 'Memuat...' : incisorDetails.no_invoice}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Jumlah Maksimal Kasbon (sebelumnya Pendapatan Bulan Ini) */}
                                <div>
                                    <Label htmlFor="jumlah_maksimal_kasbon_info">Jumlah Maksimal Kasbon</Label>
                                    <Input
                                        id="jumlah_maksimal_kasbon_info"
                                        placeholder="Jumlah maksimal kasbon"
                                        value={isLoadingData ? 'Memuat...' : formatCurrency(incisorDetails.max_kasbon_amount)}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Total Toreh Bulan Ini */}
                                <div>
                                    <Label htmlFor="toreh">Total Toreh Bulan Ini</Label>
                                    <Input
                                        id="toreh"
                                        placeholder="Total Toreh Bulan Ini"
                                        value={isLoadingData ? 'Memuat...' : formatCurrency(incisorDetails.total_toreh_bulan_ini)}
                                        readOnly
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
