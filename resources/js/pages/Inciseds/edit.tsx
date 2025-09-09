import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';

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
    }; // Tambahkan untuk relasi incisor
}

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
        amount: incised.amount,
        keping: incised.keping,
        kualitas: incised.kualitas || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('inciseds.update', incised.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Incised" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <Heading title="Edit Data Harian Penoreh" />

                <div className="w-full h-auto">
                    <Link href={route('inciseds.index')}>
                        <Button className="bg-auto w-25 hover:bg-accent hover:text-black">
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="w-full p-4">
                    <div className="p-4">
                        {Object.keys(errors).length > 0 && (
                            <Alert>
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle className="text-red-600">Errors...!</AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message as string}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <div>
                                <div className="gap-2">
                                    <Label htmlFor="Product Name">Product</Label>
                                    <select
                                        value={data.product}
                                        onChange={(e) => setData('product', e.target.value)}
                                        className="w-full border p-1 rounded-md text-destructive-foreground"
                                        required
                                    >
                                        <option value="" disabled>Pilih Jenis Product</option>
                                        <option value="Karet" selected={incised.product === 'Karet'}>Karet</option>
                                        <option value="Kelapa" selected={incised.product === 'Kelapa'}>Kelapa</option>
                                        <option value="Pupuk" selected={incised.product === 'Pupuk'}>Pupuk</option>
                                    </select>
                                    {errors.product && <p className="text-red-600 text-sm">{errors.product}</p>}
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Tanggal">Tanggal</Label>
                                    <Input
                                        type="date"
                                        placeholder="Tanggal"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                    {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Kode Penoreh">Kode Penoreh</Label>
                                    <select
                                        value={data.no_invoice}
                                        onChange={(e) => setData('no_invoice', e.target.value)}
                                        className="w-full border p-1 rounded-md"
                                        required
                                    >
                                        <option value="" disabled>Pilih Kode Penoreh</option>
                                        {noInvoicesWithNames.length > 0 ? (
                                            noInvoicesWithNames.map((item, index) => (
                                                <option key={index} value={item.no_invoice} selected={item.no_invoice === incised.no_invoice}>
                                                    {`${item.no_invoice} - ${item.name}`}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>Tidak ada data</option>
                                        )}
                                    </select>
                                    {errors.no_invoice && <p className="text-red-600 text-sm">{errors.no_invoice}</p>}
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Lokasi">Lokasi Kebun</Label>
                                    <select
                                        value={data.lok_kebun}
                                        onChange={(e) => setData('lok_kebun', e.target.value)}
                                        className="w-full border p-1 rounded-md text-destructive-foreground"
                                        required
                                    >
                                        <option value="" disabled>Pilih Lokasi</option>
                                        <option value="Temadu" selected={incised.lok_kebun === 'Temadu'}>Temadu</option>
                                        <option value="Sebayar" selected={incised.lok_kebun === 'Sebayar'}>Sebayar</option>
                                    </select>
                                    {errors.lok_kebun && <p className="text-red-600 text-sm">{errors.lok_kebun}</p>}
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Jenis Barang">Jenis Barang</Label>
                                    <Input
                                        placeholder="Jenis Barang"
                                        value={data.j_brg}
                                        onChange={(e) => setData('j_brg', e.target.value)}
                                    />
                                    {errors.j_brg && <p className="text-red-600 text-sm">{errors.j_brg}</p>}
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Description">Description</Label>
                                    <Textarea
                                        placeholder="Description"
                                        value={data.desk}
                                        onChange={(e) => setData('desk', e.target.value)}
                                    />
                                </div>
                                {incised.incisor && (
                                    <div className="gap-2">
                                        <Label htmlFor="Nama Penoreh">Nama Penoreh</Label>
                                        <Input
                                            placeholder="Nama Penoreh"
                                            value={incised.incisor.name || 'N/A'}
                                            readOnly
                                        />
                                    </div>
                                )}
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
                                            value={data.qty_kg}
                                            onChange={(e) => setData('qty_kg', e.target.value)}
                                        />
                                        {errors.qty_kg && <p className="text-red-600 text-sm">{errors.qty_kg}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Price">Price /Qty</Label>
                                        <Input
                                            placeholder="Price"
                                            value={data.price_qty}
                                            onChange={(e) => setData('price_qty', e.target.value)}
                                        />
                                        {errors.price_qty && <p className="text-red-600 text-sm">{errors.price_qty}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Amount">Amount</Label>
                                        <Input
                                            placeholder="Amount"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                        />
                                        {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Keping">Keping</Label>
                                        <Input
                                            placeholder="Keping"
                                            value={data.keping}
                                            onChange={(e) => setData('keping', e.target.value)}
                                        />
                                        {errors.keping && <p className="text-red-600 text-sm">{errors.keping}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Kualitas">Kualitas</Label>
                                        <Input
                                            placeholder="Kualitas"
                                            value={data.kualitas}
                                            onChange={(e) => setData('kualitas', e.target.value)}
                                        />
                                        {errors.kualitas && <p className="text-red-600 text-sm">{errors.kualitas}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-400">
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}