import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Box, Calendar, CircleAlert, DollarSign, Leaf, Rss, Tag, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: '/inciseds',
    },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};
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
    }; // Relasi incisor
    incisor_name?: string | null; // Tambahkan untuk kompatibilitas
}

export default function ShowIncised({ incised }: { incised: Incised }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Incised" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <Heading title="Detail Data Harian Penoreh" />

                <div className="w-full h-auto">
                    <Link href={route('inciseds.index')}>
                        <Button className="bg-auto w-25 hover:bg-accent hover:text-black">
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="w-full p-4">
                    {incised.incisor === undefined && incised.incisor_name === null && (
                        <Alert className="mb-4">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle className="text-red-600">Warning</AlertTitle>
                            <AlertDescription>Data penoreh tidak ditemukan.</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <div>
                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="incisor_name" className="text-sm font-medium flex items-center gap-1">
                                        <Leaf className="w-4 h-4 text-green-500" /> Nama Penoreh
                                    </Label>
                                    <Input value={incised.incisor?.name || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>

                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="product" className="text-sm font-medium flex items-center gap-1">
                                        <Box className="w-4 h-4 text-blue-500" /> Produk
                                    </Label>
                                    <Input value={incised.product || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>
                                
                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="date" className="text-sm font-medium flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-red-500" /> Tanggal
                                    </Label>
                                    <Input value={incised.date || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>

                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="no_invoice" className="text-sm font-medium flex items-center gap-1">
                                        <Rss className="w-4 h-4 text-gray-500" /> No. Invoice
                                    </Label>
                                    <Input value={incised.no_invoice || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>

                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="lok_kebun" className="text-sm font-medium flex items-center gap-1">
                                        <Leaf className="w-4 h-4 text-teal-500" /> Lokasi Kebun
                                    </Label>
                                    <Input value={incised.lok_kebun || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>

                                <div className="space-y-2 mb-2">
                                    <Label htmlFor="j_brg" className="text-sm font-medium flex items-center gap-1">
                                        <Tag className="w-4 h-4 text-orange-500" /> Jenis Barang
                                    </Label>
                                    <Input value={incised.j_brg || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>
                                
                                <div className="mt-6">
                                    <Label htmlFor="desk" className="text-sm font-medium mb-2 block items-center gap-1">
                                        <Box className="w-4 h-4 text-gray-500" /> Deskripsi
                                    </Label>
                                    <Textarea value={incised.desk || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 min-h-[100px] border-gray-300 dark:border-gray-600 rounded-md" />
                                </div>
                                
                            </div>
                        </div>

                        <div>
                            <div className="p-2 mt-3 col-span-3 border-2 rounded-md h-fit">
                                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2">
                                    <div className="gap-2 sm:col-span-3">
                                        <Label htmlFor="In">MASUK</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="qty_kg" className="text-sm font-medium flex items-center gap-1">
                                            <Box className="w-4 h-4 text-purple-500" /> QTY (Kg)
                                        </Label>
                                        <Input value={incised.qty_kg !== undefined ? incised.qty_kg.toString() : 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price_qty" className="text-sm font-medium flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-yellow-500" /> Harga per Kg
                                        </Label>
                                        <Input value={incised.price_qty !== undefined ? formatCurrency(incised.price_qty) : 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-lime-500" /> Total Jumlah
                                        </Label>
                                        <Input value={incised.amount !== undefined ? formatCurrency(incised.amount) : 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="keping" className="text-sm font-medium flex items-center gap-1">
                                            <Tag className="w-4 h-4 text-cyan-500" /> Keping
                                        </Label>
                                        <Input value={incised.keping !== undefined ? incised.keping.toString() : 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kualitas" className="text-sm font-medium flex items-center gap-1">
                                            <Leaf className="w-4 h-4 text-emerald-500" /> Kualitas
                                        </Label>
                                        <Input value={incised.kualitas || 'N/A'} readOnly className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}