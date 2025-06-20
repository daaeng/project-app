import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incisor',
        href: '/incisors',
    },
];

interface Incisor {
    id: number;
    name: string;
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
    dailyData: DailyData[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function index({ incisor, totalQtyKg, totalQtyKgThisMonth, dailyData }: Props) {
    const { data, setData, errors } = useForm({
        name: incisor.name,
        ttl: incisor.ttl,
        gender: incisor.gender,
        address: incisor.address,
        agama: incisor.agama,
        status: incisor.status,
        no_invoice: incisor.no_invoice,
        lok_toreh: incisor.lok_toreh,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incisor" />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title="Informasi Data Penoreh" />

                <div className="w-full h-auto">
                    <Link href={route('incisors.index')}>
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

                    <form className="space-y-3 gap-2">
                        <div className="space-y-2 w-5xl gap-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                            <div>
                                <div className="gap-2">
                                    <Label htmlFor="Name">Nama</Label>
                                    <Input
                                        placeholder="Nama"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="TTL">Tempat, Tanggal Lahir</Label>
                                    <Input
                                        type="date"
                                        placeholder="TTL"
                                        value={data.ttl}
                                        onChange={(e) => setData('ttl', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Jenis Kelamin">Jenis Kelamin</Label>
                                    <Input
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Alamat">Alamat</Label>
                                    <Textarea
                                        placeholder="Alamat"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="gap-2">
                                    <Label htmlFor="Password">Agama</Label>
                                    <Input
                                        placeholder="Password"
                                        value={data.agama}
                                        onChange={(e) => setData('agama', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Status">Status</Label>
                                    <Input
                                        placeholder="Status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Kode Penoreh">Kode Penoreh</Label>
                                    <Input
                                        placeholder="Kode Penoreh, ex: B.P0001"
                                        value={data.no_invoice}
                                        onChange={(e) => setData('no_invoice', e.target.value)}
                                        readOnly
                                    />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Lokasi">Lokasi</Label>
                                    <Input
                                        placeholder="Lokasi"
                                        value={data.lok_toreh}
                                        onChange={(e) => setData('lok_toreh', e.target.value)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="gap-2">
                                    <Label htmlFor="Password">Saldo Kasbon</Label>
                                    <Input placeholder="Saldo" readOnly />
                                </div>
                                <div className="gap-2">
                                    <Label htmlFor="Status">Total Toreh</Label>
                                    <Input placeholder="Total Quantity" value={totalQtyKg + ' kg'} readOnly />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="w-full mb-2 justify-end h-auto flex gap-2">
                    <div className="gap-2">
                        <Label htmlFor="Status">Total Toreh Bulan Ini</Label>
                        <Input
                            placeholder="Total Quantity"
                            className="w-33"
                            value={totalQtyKgThisMonth ? totalQtyKgThisMonth + ' kg' : '0 kg'}
                            readOnly
                        />
                    </div>
                </div>

                <div>
                    <CardContent className="border rounded-lg">
                        <div className="rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Kode/Penoreh</TableHead>
                                        <TableHead>Kebun</TableHead>
                                        <TableHead>Jenis Barang</TableHead>
                                        <TableHead>Qty (kg)</TableHead>
                                        <TableHead>Total Harga</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dailyData.map((item) => (
                                        <TableRow key={item.kode_penoreh + item.tanggal}>
                                            <TableCell>{item.product}</TableCell>
                                            <TableCell>{new Date(item.tanggal).toLocaleDateString()}</TableCell>
                                            <TableCell>{item.kode_penoreh}</TableCell>
                                            <TableCell>{item.kebun}</TableCell>
                                            <TableCell>{item.jenis_barang}</TableCell>
                                            <TableCell>{item.qty_kg}</TableCell>
                                            <TableCell>{formatCurrency(item.total_harga)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}