import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Tambah Kasbon Baru', href: '/kasbons/create' },
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

// Interface untuk props halaman
interface PageProps {
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
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function CreateKasbonSimple() {
    const { incisors, monthsYears, statuses, flash, errors: pageErrors } = usePage().props as PageProps;

    // State untuk form data
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        incisor_id: '',
        month: '',
        year: '',
        kasbon: 0,
        status: 'Pending', // Default status selalu "Pending" saat pengajuan
        reason: '',
    });

    // State untuk data penoreh yang diambil secara otomatis
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

    // Effect untuk mengambil data penoreh saat incisor_id, month, atau year berubah
    useEffect(() => {
        // Hanya lakukan fetch jika incisor_id, month, dan year sudah terpilih
        if (data.incisor_id && data.month && data.year) {
            setIsLoadingData(true);
            setDataFetchError(null);

            // Menggunakan fetch API standar untuk mengambil data JSON
            fetch(route('kasbons.getIncisorData'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest', // Penting untuk Laravel
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content // Ambil CSRF token
                },
                body: JSON.stringify({
                    incisor_id: data.incisor_id,
                    month: data.month,
                    year: data.year,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    // Jika respons bukan 2xx, throw error dengan detail
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Gagal mengambil data penoreh.');
                    });
                }
                return response.json();
            })
            .then(response => {
                if (response && response.incisor) {
                    setIncisorDetails({
                        name: response.incisor.name,
                        address: response.incisor.address,
                        no_invoice: response.incisor.no_invoice,
                        total_toreh_bulan_ini: response.total_toreh_bulan_ini,
                        gaji_bulan_ini: response.gaji_bulan_ini,
                        max_kasbon_amount: response.max_kasbon_amount,
                    });
                    // Set kasbon default ke gaji bulan ini (max_kasbon_amount)
                    setData('kasbon', response.max_kasbon_amount);
                } else {
                    setDataFetchError('Data penoreh tidak ditemukan untuk periode ini.');
                    setIncisorDetails({ // Reset details if data not found
                        name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                    });
                    setData('kasbon', 0);
                }
            })
            .catch(error => {
                console.error("Error fetching incisor data:", error);
                setDataFetchError(error.message || 'Gagal mengambil data penoreh.');
                setIncisorDetails({ // Reset details on error
                    name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                });
                setData('kasbon', 0);
            })
            .finally(() => {
                setIsLoadingData(false);
            });
        } else {
            // Reset incisor details if not all selections are made
            setIncisorDetails({
                name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
            });
            setData('kasbon', 0);
            setDataFetchError(null);
        }
    }, [data.incisor_id, data.month, data.year]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi tambahan di frontend sebelum submit
        if (data.kasbon > incisorDetails.max_kasbon_amount) {
            setDataFetchError(`Jumlah kasbon tidak boleh melebihi ${formatCurrency(incisorDetails.max_kasbon_amount)}.`);
            return;
        }

        post(route('kasbons.store'), {
            onSuccess: () => {
                reset(); // Reset form setelah sukses
                setIncisorDetails({ // Reset details after successful submission
                    name: '', address: '', no_invoice: '', total_toreh_bulan_ini: 0, gaji_bulan_ini: 0, max_kasbon_amount: 0,
                });
                router.visit(route('kasbons.index'), {
                    onFinish: () => {
                        // This will trigger the flash message display on the index page
                    }
                });
            },
            onError: (formErrors) => {
                console.error("Error submitting form:", formErrors);
                // Errors are automatically handled by useForm and displayed
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kasbon Baru" />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title="Tambah Kasbon Baru" />
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
                            <CardTitle>Form Tambah Kasbon</CardTitle>
                            <CardDescription>Isi detail kasbon baru di bawah ini.</CardDescription>
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

                                {/* Status Select - Disembunyikan Sesuai Permintaan */}
                                {/*
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) => setData('status', value)}
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
                                */}

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
                                    {processing ? 'Menyimpan...' : 'Simpan Kasbon'}
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
                                        placeholder="Jumlah Maksimal Kasbon"
                                        value={isLoadingData ? 'Memuat...' : formatCurrency(incisorDetails.gaji_bulan_ini)}
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
