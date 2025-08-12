import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Trash } from 'lucide-react';
import { can } from '@/lib/can';
import React from 'react'; // Import React

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

// --- PERBAIKAN 1: Perbarui Interface ---
// Definisikan tipe data untuk setiap permission
interface Permission {
    id: number;
    name: string;
}

// Definisikan tipe data untuk Role, dengan permissions sebagai array dari Permission
interface Role {
    id: number;
    name: string;
    permissions: Permission[]; // permissions adalah array of object
}

interface PageProps {
    flash: {
        message?: string;
    };
    roles: Role[];
}

export default function Index({ roles, flash }: PageProps) {
    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus role: ${name}?`)) {
            destroy(route('roles.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            {can('roles.view') && (
                <div className="flex-col rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                    <Heading title="Roles User Management" />

                    <div className="border border-gray-200 dark:border-gray-700 h-auto p-3 rounded-lg mt-4">
                        {can('roles.create') && (
                            <div className="w-full mb-4 justify-end h-auto flex gap-2">
                                <Link href={route('roles.create')}>
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                                        <CirclePlus className="mr-2 h-4 w-4" />
                                        Tambah Role
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {flash.message && (
                            <Alert className="mb-4 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <Megaphone className="h-4 w-4" />
                                <AlertTitle className="font-semibold">Notifikasi</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}

                        <CardContent className="border border-gray-200 dark:border-gray-700 rounded-lg p-0">
                            <div className="rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-100 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900">
                                            <TableHead className="w-[50px]">ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Permissions</TableHead>
                                            <TableHead className="text-center w-[200px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {/* --- PERBAIKAN 2: Struktur Looping yang Benar --- */}
                                    {/* <TableBody> harus di luar map */}
                                    <TableBody>
                                        {roles.map(({ id, name, permissions }) => (
                                            // key untuk <TableRow>
                                            <TableRow key={id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <TableCell>{id}</TableCell>
                                                <TableCell className="font-medium">{name}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {permissions.map((permission) => (
                                                            // --- PERBAIKAN 3: key untuk <span> ---
                                                            // key harus unik untuk setiap item dalam list
                                                            <span key={permission.id} className="mr-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg p-1.5 dark:bg-green-900 dark:text-green-300">
                                                                {permission.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center space-x-1">
                                                    {can('roles.view') && (
                                                        <Link href={route('roles.show', id)}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4 text-gray-500" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('roles.edit') && (
                                                        <Link href={route('roles.edit', id)}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4 text-blue-500" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('roles.delete') && (
                                                        <Button variant="ghost" size="icon" disabled={processing} onClick={() => handleDelete(id, name)}>
                                                            <Trash className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
