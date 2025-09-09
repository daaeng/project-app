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
import { useEffect } from 'react'; // Import useEffect

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

export default function CreateIncised({ noInvoicesWithNames }: { noInvoicesWithNames: NoInvoiceWithName[] }) {
    const { data, setData, post, processing, errors } = useForm({
        product: '',
        date: '',
        no_invoice: '',
        lok_kebun: '',
        j_brg: '',
        desk: '',
        qty_kg: '',
        price_qty: '',
        amount: '',
        keping: '',
        kualitas: '',
    });

    // --- PERUBAHAN: Tambahkan useEffect untuk perhitungan otomatis ---
    useEffect(() => {
        const qty = parseFloat(data.qty_kg);
        const price = parseFloat(data.price_qty);

        // Cek apakah qty dan price adalah angka yang valid
        if (!isNaN(qty) && !isNaN(price)) {
            const calculatedAmount = qty * price * 0.40; // Rumus: qty * price * 40%
            setData('amount', calculatedAmount.toFixed(2)); // Set nilai amount dengan 2 angka desimal
        } else {
            setData('amount', ''); // Kosongkan jika salah satu input tidak valid
        }
    }, [data.qty_kg, data.price_qty]); // Efek ini akan berjalan setiap kali qty_kg atau price_qty berubah

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('inciseds.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incised" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <Heading title="Input Data Harian Penoreh" />

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

                    <form onSubmit={handleSubmit} className="space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-5">
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
                                        <option value="" disabled selected>Pilih Jenis Product</option>
                                        <option value="Karet">Karet</option>
                                        <option value="Kelapa">Kelapa</option>
                                        <option value="Pupuk">Pupuk</option>
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
                                </div>

                                <div className="gap-2">
                                    <Label htmlFor="Kode Penoreh">Kode Penoreh</Label>
                                    <select
                                        value={data.no_invoice}
                                        onChange={(e) => setData('no_invoice', e.target.value)}
                                        className="w-full border p-1 rounded-md"
                                        required
                                    >
                                        <option value="" disabled selected>Pilih Kode Penoreh</option>
                                        {noInvoicesWithNames.length > 0 ? (
                                            noInvoicesWithNames.map((item, index) => (
                                                <option key={index} value={item.no_invoice}>
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
                                        <option value="" disabled selected>Pilih Lokasi</option>
                                        <option value="Temadu">Temadu</option>
                                        <option value="Sebayar">Sebayar</option>
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
                                            type="number"
                                            placeholder="Quantity"
                                            value={data.qty_kg}
                                            onChange={(e) => setData('qty_kg', e.target.value)}
                                        />
                                        {errors.qty_kg && <p className="text-red-600 text-sm">{errors.qty_kg}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Price">Price /Qty</Label>
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={data.price_qty}
                                            onChange={(e) => setData('price_qty', e.target.value)}
                                        />
                                        {errors.price_qty && <p className="text-red-600 text-sm">{errors.price_qty}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Amount">Amount</Label>
                                        {/* --- PERUBAHAN: Jadikan input ini readOnly --- */}
                                        <Input
                                            placeholder="Amount"
                                            value={data.amount}
                                            readOnly
                                            className="bg-gray-100 dark:bg-gray-700"
                                        />
                                        {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
                                    </div>
                                    <div className="gap-2 md:col-span-1 sm:col-span-3">
                                        <Label htmlFor="Keping">Keping</Label>
                                        <Input
                                            type="number"
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
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

