import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Trash } from 'lucide-react';
import { can } from '@/lib/can';

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
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    incisor_name: string | null; // Tambahkan field untuk nama penoreh
}

interface PageProps {
    flash: {
        message?: string;
    };
    inciseds: Incised[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function admin() {
    const { inciseds, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Do you want delete this - ${id}. ${product} `)) {
            destroy(route('inciseds.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incised" />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title="Data Harian Penoreh" />

                <div className="border h-auto p-3 rounded-lg">
                    <div className="w-full mb-2 justify-end h-auto flex gap-2">
                        {can('incised.create') &&
                            <Link href={route('inciseds.create')}>
                                <Button className="bg-blue-600 w-25 hover:bg-blue-500 text-white">
                                    <CirclePlus />
                                    Add User
                                </Button>
                            </Link>
                        
                        }
                    </div>

                    <div>
                        {flash.message && (
                            <Alert>
                                <Megaphone className="h-4 w-4" />
                                <AlertTitle className="text-green-600">Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

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
                                        <TableHead className="text-center">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {inciseds.map((incised) => (
                                        <TableRow key={incised.id}>
                                            <TableCell>{incised.product}</TableCell>
                                            <TableCell>{incised.date}</TableCell>
                                            <TableCell>
                                                {incised.no_invoice} - {incised.incisor_name || 'N/A'}
                                            </TableCell>
                                            <TableCell>{incised.lok_kebun}</TableCell>
                                            <TableCell>{incised.j_brg}</TableCell>
                                            <TableCell>{incised.qty_kg}</TableCell>
                                            <TableCell>{formatCurrency(incised.amount)}</TableCell>
                                            <TableCell className="text-center space-x-2">

                                                {can('incised.view') &&
                                                    <Link href={route('inciseds.show', incised.id)}>
                                                        <Button className="bg-transparent hover:bg-gray-700">
                                                            <Eye color="gray" />
                                                        </Button>
                                                    </Link>
                                                }
                                                {can('incised.edit') &&
                                                    <Link href={route('inciseds.edit', incised.id)}>
                                                        <Button className="bg-transparent hover:bg-gray-700">
                                                            <Pencil color="blue" />
                                                        </Button>
                                                    </Link>
                                                }
                                                {can('incised.delete') &&
                                                    <Button
                                                        disabled={processing}
                                                        onClick={() => handleDelete(incised.id, incised.product)}
                                                        className="bg-transparent hover:bg-gray-700"
                                                    >
                                                        <Trash color="red" />
                                                    </Button>
                                                }
                                            </TableCell>
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