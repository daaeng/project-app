import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: '/inciseds',
    },
];

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
                                <div className="gap-2">
                                    <Label htmlFor="Nama Penoreh">Nama Penoreh</Label>
                                    <Input
                                        placeholder="Nama Penoreh"
                                        value={incised.incisor?.name || incised.incisor_name || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Product Name">Product</Label>
                                    <Input
                                        placeholder="Jenis Barang"
                                        value={incised.product || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Tanggal">Tanggal</Label>
                                    <Input
                                        type="date"
                                        placeholder="Tanggal"
                                        value={incised.date || ''}
                                        readOnly
                                    />
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Kode Penoreh">Kode Penoreh</Label>
                                    <Input
                                        placeholder="Kode Penoreh"
                                        value={incised.no_invoice || 'N/A'}
                                        readOnly
                                    />
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Lokasi">Lokasi Kebun</Label>
                                    <Input
                                        placeholder="Lokasi Kebun"
                                        value={incised.lok_kebun || 'N/A'}
                                        readOnly
                                    />
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Jenis Barang">Jenis Barang</Label>
                                    <Input
                                        placeholder="Jenis Barang"
                                        value={incised.j_brg || 'N/A'}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Description">Description</Label>
                                    <Textarea
                                        placeholder="Description"
                                        value={incised.desk || ''}
                                        readOnly
                                    />
                                </div>
                                
                            </div>
                        </div>

                        <div>
                            <div className="p-2 mt-3 col-span-3 border-2 rounded-md h-fit">
                                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2">
                                    <div className="gap-2 sm:col-span-3">
                                        <Label htmlFor="In">MASUK</Label>
                                    </div>

                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Quantity">Quantity (Kg)</Label>
                                        <Input
                                            placeholder="Quantity"
                                            value={incised.qty_kg !== undefined ? incised.qty_kg.toString() : 'N/A'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Price">Price /Qty</Label>
                                        <Input
                                            placeholder="Price"
                                            value={incised.price_qty !== undefined ? incised.price_qty.toString() : 'N/A'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Amount">Amount</Label>
                                        <Input
                                            placeholder="Amount"
                                            value={incised.amount !== undefined ? incised.amount.toString() : 'N/A'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Keping">Keping</Label>
                                        <Input
                                            placeholder="Keping"
                                            value={incised.keping !== undefined ? incised.keping.toString() : 'N/A'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Kualitas">Kualitas</Label>
                                        <Input
                                            placeholder="Kualitas"
                                            value={incised.kualitas || 'N/A'}
                                            readOnly
                                        />
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