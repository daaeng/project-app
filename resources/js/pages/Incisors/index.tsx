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
        title: 'Incisor',
        href: '/incisors',
    },
];

interface Incisor {
    id: number;
    lok_toreh: string;
    name: string;
    ttl: string;
    gender: string;
    agama: string;
    no_invoice: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    incisors: {
        data: Incisor[]; // Data incisors
        links: any[];    // Link paginasi
        meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        };
    };
}

export default function admin() {
    const { incisors, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want delete this - ${id}. ${name} `)) {
        destroy(route('incisors.destroy', id)); // Perbaiki: Gunakan rute yang benar 'incisors.destroy'
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
        <Head title="Incisor" />

        <div className="h-full flex-col rounded-xl p-4">
            <Heading title="Penoreh" />

            <div className="border h-auto p-3 rounded-lg">
            {can('incisor.create') && (
                <div className="w-full mb-2 justify-end h-auto flex gap-2">
                <Link href={route('incisors.create')}>
                    <Button className="bg-blue-600 w-32 hover:bg-blue-500 text-white">
                    <CirclePlus />
                    Add Penoreh
                    </Button>
                </Link>
                </div>
            )}

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
                        <TableHead>Kode</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead>Tanggal Lahir</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>Agama</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-center">ACTION</TableHead>
                    </TableRow>
                    </TableHeader>

                    <TableBody>
                    {incisors.data.length > 0 && (
                        incisors.data.map((incisor) => (
                        <TableRow key={incisor.id}>
                            <TableCell>{incisor.no_invoice}</TableCell>
                            <TableCell>{incisor.name}</TableCell>
                            <TableCell>{incisor.ttl}</TableCell>
                            <TableCell>{incisor.gender}</TableCell>
                            <TableCell>{incisor.agama}</TableCell>
                            <TableCell>{incisor.lok_toreh}</TableCell>
                            <TableCell className="text-center space-x-2">
                            {can('incisor.view') && (
                                <Link href={route('incisors.show', incisor.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                </Button>
                                </Link>
                            )}
                            {can('incisor.edit') && (
                                <Link href={route('incisors.edit', incisor.id)}>
                                <Button className="bg-transparent hover:bg-gray-700">
                                    <Pencil color="blue" />
                                </Button>
                                </Link>
                            )}
                            {can('incisor.delete') && (
                                <Button
                                disabled={processing}
                                onClick={() => handleDelete(incisor.id, incisor.name)}
                                className="bg-transparent hover:bg-gray-700"
                                >
                                <Trash color="red" />
                                </Button>
                            )}
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                    </TableBody>
                </Table>
                </div>
                {renderPagination(incisors)} {/* Tambahkan navigasi paginasi */}
            </CardContent>
            </div>
        </div>
        </AppLayout>
    );
}