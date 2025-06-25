import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, Megaphone, Pencil, Trash, Upload } from 'lucide-react';
import { can } from '@/lib/can';
import Tag from '@/components/ui/tag';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Invoice',
    href: '/invoices',
  },
];

interface Nota {
  id: number;
  name: string;
  date: string;
  devisi: string;
  mengetahui: string;
  desk: string;
  dana: number;
  status: string;
  file: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    notas: {
        data: Nota[]; // Data notas
        links: any[];  // Link paginasi
        meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        };
    };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function index() {
    const { notas, flash } = usePage().props as PageProps;

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want delete this - ${id}. ${name} `)) {
        destroy(route('notas.destroy', id));
        }
    };

  // Fungsi untuk render link paginasi
    const renderPagination = (pagination: any) => {
        return (
        <div className="flex justify-center mt-4">
            {pagination.links.map((link: any, index: number) => (
            <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                onClick={() => window.location.href = link.url}
                disabled={!link.url}
                className="mx-1"
            >
                {link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, '')}
            </Button>
            ))}
        </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Request" />

        <div className="h-full flex-col rounded-xl p-4">
            <Heading title="Request - Upload Nota" />

            <div className="border rounded-lg p-2">
            <div className="grid grid-cols-2">
                <div className="font-bold">Submission Report</div>

                <div className="w-full justify-end h-auto flex mb-5 gap-2">
                {can('notas.create') && (
                    <Link href={route('notas.up_nota')}>
                    <Button className="bg-blue-600 w-30 hover:bg-blue-500">
                        <Upload />
                        Upload Nota
                    </Button>
                    </Link>
                )}
                </div>
            </div>

            <div>
                {flash.message && (
                <Alert>
                    <Megaphone className="h4-w4" />
                    <AlertTitle className="text-green-600">Notification</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
                )}
            </div>

            <div className="border rounded-lg">
                {notas.data.length > 0 && (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Devisi</TableHead>
                        <TableHead>Mengetahui</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>dana</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {notas.data.map((nota) => (
                        <TableRow key={nota.id}>
                        <TableCell>{nota.name}</TableCell>
                        <TableCell>{nota.date}</TableCell>
                        <TableCell>{nota.devisi}</TableCell>
                        <TableCell>{nota.mengetahui}</TableCell>
                        <TableCell>{nota.desk}</TableCell>
                        <TableCell>{formatCurrency(nota.dana)}</TableCell>
                        <TableCell>
                            <Tag status={nota.status} />
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                            {can('notas.view') && (
                            <Link href={route('notas.show', nota.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                <Eye color="gray" />
                                </Button>
                            </Link>
                            )}
                            {can('notas.edit') && (
                            <Link href={route('notas.edit', nota.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                <Pencil color="blue" />
                                </Button>
                            </Link>
                            )}
                            {can('notas.delete') && (
                            <Button
                                disabled={processing}
                                onClick={() => handleDelete(nota.id, nota.name)}
                                className="bg-transparent hover:bg-gray-700"
                            >
                                <Trash color="red" />
                            </Button>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
                {renderPagination(notas)} {/* Tambahkan navigasi paginasi */}
            </div>
            </div>
        </div>
        </AppLayout>
    );
}