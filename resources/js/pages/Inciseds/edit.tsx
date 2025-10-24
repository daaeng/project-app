import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2, Save } from 'lucide-react'; // Impor Save icon
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'; // Impor Card
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'; // Impor Select modern
import { useEffect, useState } from 'react'; // Impor useEffect dan useState

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: '/inciseds',
    },
];

interface NoInvoiceWithName {
    no_invoice: string;
    name: string;
}

interface Incised {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    lok_kebun: string;
    j_brg: string;
    desk: string | null;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    incisor?: {
        name: string;
    };
}

// Helper untuk Form Item agar lebih rapi
const FormItem = ({
    label,
    children,
    error,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-2">
        <Label htmlFor={label}>{label}</Label>
        {children}
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);

export default function EditIncised({
    incised,
    noInvoicesWithNames,
}: {
    incised: Incised;
    noInvoicesWithNames: NoInvoiceWithName[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        product: incised.product,
        date: incised.date,
        no_invoice: incised.no_invoice,
        lok_kebun: incised.lok_kebun,
        j_brg: incised.j_brg,
        desk: incised.desk || '',
        qty_kg: incised.qty_kg,
        price_qty: incised.price_qty,
        // Pastikan amount di-set sebagai number, bukan string
        amount: incised.amount,
        keping: incised.keping,
        kualitas: incised.kualitas || '',
    });

    // State untuk menyimpan nama penoreh yang dipilih
    const [selectedIncisorName, setSelectedIncisorName] = useState(
        incised.incisor?.name || 'N/A',
    );

    // --- UX MODERN 1: Kalkulasi Otomatis Amount ---
    useEffect(() => {
        // Konversi ke number, jika tidak valid anggap 0
        const qty = Number(data.qty_kg) || 0;
        const price = Number(data.price_qty) || 0;
        const totalAmount = qty * price;
        
        // Update state 'amount' hanya jika berbeda
        if (totalAmount !== data.amount) {
            setData('amount', totalAmount);
        }
    }, [data.qty_kg, data.price_qty]); // Dijalankan saat qty atau price berubah

    // --- UX MODERN 2: Update Nama Penoreh Otomatis ---
    useEffect(() => {
        const selected = noInvoicesWithNames.find(
            (item) => item.no_invoice === data.no_invoice,
        );
        setSelectedIncisorName(selected ? selected.name : 'N/A');
    }, [data.no_invoice, noInvoicesWithNames]); // Dijalankan saat no_invoice berubah

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('inciseds.update', incised.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Incised" />

            <div className="h-full flex-col p-4 bg-gray-50 dark:bg-black">
                <div className="flex justify-between items-center mb-4">
                    <Heading title="Edit Data Harian Penoreh" />
                    <Link href={route('inciseds.index')}>
                        <Button variant="outline"> {/* Style lebih modern */}
                            <Undo2 className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Errors...!</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* === KOLOM KIRI (Info Utama & Detail) === */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* --- Card 1: Informasi Utama --- */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Utama</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Product" error={errors.product}>
                                            <Select
                                                value={data.product}
                                                onValueChange={(value) => setData('product', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Jenis Product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Karet">Karet</SelectItem>
                                                    <SelectItem value="Kelapa">Kelapa</SelectItem>
                                                    <SelectItem value="Pupuk">Pupuk</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                        
                                        <FormItem label="Tanggal" error={errors.date}>
                                            <Input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                            />
                                        </FormItem>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Kode Penoreh" error={errors.no_invoice}>
                                            <Select
                                                value={data.no_invoice}
                                                onValueChange={(value) => setData('no_invoice', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kode Penoreh" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {noInvoicesWithNames.length > 0 ? (
                                                        noInvoicesWithNames.map((item, index) => (
                                                            <SelectItem key={index} value={item.no_invoice}>
                                                                {`${item.no_invoice} - ${item.name}`}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="" disabled>
                                                            Tidak ada data
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                        
                                        <FormItem label="Nama Penoreh">
                                            <Input
                                                value={selectedIncisorName}
                                                readOnly
                                                className="bg-gray-100 dark:bg-gray-800"
                                            />
                                        </FormItem>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* --- Card 2: Detail Tambahan --- */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail Barang & Lokasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormItem label="Lokasi Kebun" error={errors.lok_kebun}>
                                        <Select
                                            value={data.lok_kebun}
                                            onValueChange={(value) => setData('lok_kebun', value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Lokasi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Temadu">Temadu</SelectItem>
                                                <SelectItem value="Sebayar">Sebayar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                    
                                    <FormItem label="Jenis Barang" error={errors.j_brg}>
                                        <Input
                                            placeholder="cth: Karet Mingguan, Kelapa Butir, dll."
                                            value={data.j_brg}
                                            onChange={(e) => setData('j_brg', e.target.value)}
                                        />
                                    </FormItem>
                                    
                                    <FormItem label="Description" error={errors.desk}>
                                        <Textarea
                                            placeholder="Deskripsi tambahan jika ada..."
                                            value={data.desk}
                                            onChange={(e) => setData('desk', e.target.value)}
                                        />
                                    </FormItem>
                                </CardContent>
                            </Card>
                        </div>

                        {/* === KOLOM KANAN (Rincian Pemasukan) === */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rincian Pemasukan (MASUK)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormItem label="Quantity (Kg)" error={errors.qty_kg}>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={data.qty_kg}
                                            onChange={(e) => setData('qty_kg', Number(e.target.value))}
                                        />
                                    </FormItem>
                                    
                                    <FormItem label="Price /Qty" error={errors.price_qty}>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={data.price_qty}
                                            onChange={(e) => setData('price_qty', Number(e.target.value))}
                                        />
                                    </FormItem>
                                    
                                    <FormItem label="Amount" error={errors.amount}>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={data.amount}
                                            readOnly // Dibuat readOnly karena dihitung otomatis
                                            className="bg-gray-100 dark:bg-gray-800"
                                        />
                                    </FormItem>
                                    
                                    <FormItem label="Keping" error={errors.keping}>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={data.keping}
                                            onChange={(e) => setData('keping', Number(e.target.value))}
                                        />
                                    </FormItem>
                                    
                                    <FormItem label="Kualitas" error={errors.kualitas}>
                                        <Input
                                            placeholder="cth: A, B, C, Kering, Basah"
                                            value={data.kualitas}
                                            onChange={(e) => setData('kualitas', e.target.value)}
                                        />
                                    </FormItem>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* --- Tombol Aksi --- */}
                    <div className="flex justify-end pt-4">
                        <Button disabled={processing} type="submit" size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Update Data
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}