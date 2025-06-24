import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { FileDown, Megaphone, Package, Search, TreePalm, Undo2, Wheat } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Tag_Karet from '@/components/ui/tag_karet';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Product Information', href: '/products' },
];

interface Product {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
    status: string;
}

interface PageProps {
    flash: { message?: string };
    products: Product[];
    hsl_karet: number;
    saldoin: number;
    saldoout: number;
    hsl_kelapa: number;
    saldoinklp: number;
    saldooutklp: number;
    hsl_pupuk: number;
    saldoinppk: number;
    saldooutppk: number;
    filter: { search?: string };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function index({
    hsl_karet, saldoin, saldoout, hsl_kelapa, saldoinklp, saldooutklp,
    hsl_pupuk, saldoinppk, saldooutppk, products, flash,
}: PageProps) {
    const { get } = useForm();
    const searchValue = usePage().props.filter?.search || '';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        get(route('products.allof'), {
            data: { search: e.target.value },
            preserveState: true,
            replace: true,
            only: ['products', 'filter'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Product" />
            <div className="h-full flex-col rounded-xl p-4 space-y-4">
                <Heading title="All Product Data Information" />
                <Link href={route('products.index')}>
                    <Button className="bg-auto w-25 hover:bg-accent hover:text-accent-foreground">
                        <Undo2 /> Back
                    </Button>
                </Link>
                <div className="w-full justify-center h-auto flex mb-5 gap-2">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                            <CardHeader className="bg-amber-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-500">Available Stock Kelapa</CardTitle>
                                    <div className="rounded-lg bg-amber-100 p-2"><TreePalm size={18} className="text-amber-600" /></div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-amber-700">
                                <div className="text-2xl font-bold">{hsl_kelapa}</div>
                                <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinklp)}</div>
                                <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutklp)}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                            <CardHeader className="bg-blue-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-500">Available Stock Karet</CardTitle>
                                    <div className="rounded-lg bg-blue-100 p-2"><Package size={18} className="text-blue-600" /></div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-blue-700">
                                <div className="text-2xl font-bold">{hsl_karet}</div>
                                <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoin)} <p>(Bayar Penoreh)</p></div>
                                <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldoout)} <p>(Hasil Jual)</p></div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                            <CardHeader className="bg-red-300">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-500">Available Stock Pupuk</CardTitle>
                                    <div className="rounded-lg bg-red-100 p-2"><Wheat size={18} className="text-red-600" /></div>
                                </div>
                            </CardHeader>
                            <CardContent className="lg:-mt-4 text-red-700">
                                <div className="text-2xl font-bold">{hsl_pupuk}</div>
                                <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoinppk)}</div>
                                <div className="flex gap-2"><p className="text-red-400">Out</p> {formatCurrency(saldooutppk)}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="border p-2 rounded-lg">
                    {flash.message && (
                        <Alert>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle className="text-green-600">Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                    <CardContent className="rounded-lg">
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    placeholder="Search product..."
                                    value={searchValue}
                                    onChange={handleSearch}
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="all-time">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select time period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-time">All Time</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <FileDown className="h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-md">
                            {products.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Jenis Barang</TableHead>
                                            <TableHead>Quantity (IN)</TableHead>
                                            <TableHead>Quantity (OUT)</TableHead>
                                            <TableHead>Total Harga (IN)</TableHead>
                                            <TableHead>Total Harga (OUT)</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.product}</TableCell>
                                                <TableCell>{product.date}</TableCell>
                                                <TableCell>{product.nm_supplier}</TableCell>
                                                <TableCell>{product.j_brg}</TableCell>
                                                <TableCell>{product.qty_kg}</TableCell>
                                                <TableCell>{product.qty_out}</TableCell>
                                                <TableCell>{formatCurrency(product.amount)}</TableCell>
                                                <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Tag_Karet status={product.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}