import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasi',
        href: '/administrasis',
    },
];

interface Request {
    id: number;
    date: string;
    devisi: string;
    j_pengajuan: string;
    dana: string;
    status: string;
}

interface Nota {
    id: number;
    name: string;
    date: string;
    devisi: string;
    desk: string;
    dana: string;
    status: string;
}

interface PageProps {
    requests: {
        data: Request[]; // Data requests
        links: any[];    // Link paginasi
        meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        };
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
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function admin() {
    const { requests, notas } = usePage().props as PageProps;

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
        <Head title="Administrasi" />

        <div className="h-full flex-col rounded-xl p-4">
            <Heading title="Administrasi" />

            <div className="w-full gap-2 grid grid-cols-2 p-1">
            <div className="border rounded-xl w-full gap-2 p-2">
                <div className="font-bold mb-3">Administrasi Request Latter</div>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Devisi</TableHead>
                    <TableHead>Jenis Pengajuan</TableHead>
                    <TableHead>Dana</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                {requests.data.length > 0 && (
                    <TableBody>
                    {requests.data.map((request) => (
                        <TableRow key={request.id}>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{request.devisi}</TableCell>
                        <TableCell>{request.j_pengajuan}</TableCell>
                        <TableCell>{request.dana}</TableCell>
                        <TableCell>
                            <Tag status={request.status} />
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                            {can('administrasis.view') && (
                            <Link href={route('requests.showAct', request.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                <Eye color="gray" />
                                </Button>
                            </Link>
                            )}
                            {can('administrasis.edit') && (
                            <Link href={route('requests.editAct', request.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                <Pencil color="blue" />
                                </Button>
                            </Link>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                )}
                </Table>
                {renderPagination(requests)} {/* Tambahkan navigasi paginasi untuk requests */}
            </div>

            <div className="border rounded-xl w-full gap-2">
                <div className="p-2">
                <div className="font-bold mb-3">Administrasi Nota / Kwitansi</div>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Devisi</TableHead>
                        <TableHead>Dana</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    {notas.data.length > 0 && (
                    <TableBody>
                        {notas.data.map((nota) => (
                        <TableRow key={nota.id}>
                            <TableCell>{nota.name}</TableCell>
                            <TableCell>{nota.date}</TableCell>
                            <TableCell>{nota.devisi}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(nota.dana))}</TableCell>
                            <TableCell>
                            <Tag status={nota.status} />
                            </TableCell>
                            <TableCell className="text-center space-x-2">
                            {can('administrasis.view') && (
                                <Link href={route('notas.showAct', nota.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                </Button>
                                </Link>
                            )}
                            {can('administrasis.edit') && (
                                <Link href={route('notas.editAct', nota.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                    <Pencil color="blue" />
                                </Button>
                                </Link>
                            )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    )}
                </Table>
                {renderPagination(notas)} {/* Tambahkan navigasi paginasi untuk notas */}
                </div>
            </div>
            </div>
        </div>
        </AppLayout>
    );
}