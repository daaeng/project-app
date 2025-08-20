// ./resources/js/Pages/Roles/Index.tsx

import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, ShieldCheck, Trash } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

// Interface untuk tipe data Permission
interface Permission {
    id: number;
    name: string;
}

// Interface untuk tipe data Role
interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

// Interface untuk props halaman
interface PageProps {
    flash: {
        message?: string;
    };
    roles: Role[];
}

export default function Index({ roles, flash }: PageProps) {
    const { processing, delete: destroy } = useForm();

    // Fungsi untuk menangani penghapusan role
    const handleDelete = (id: number, name: string) => {
        // Mengganti confirm() bawaan browser dengan modal kustom akan lebih baik di masa depan
        if (confirm(`Are you sure you want to delete the role: ${name}?`)) {
            destroy(route('roles.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            
            {/* Container utama dengan gaya "Holographic" */}
            <div className="holo-container p-4 md:p-8 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <Heading title="Role Access Matrix" className="title-sheen" />
                    {can('roles.create') && (
                        <Link href={route('roles.create')}>
                            <Button className="btn-sleek">
                                <CirclePlus className="mr-2 h-4 w-4" />
                                New Role
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Notifikasi flash message */}
                {flash.message && (
                    <Alert className="mb-6 bg-blue-900/30 border border-blue-500/30 text-blue-200 backdrop-blur-sm">
                        <Megaphone className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="font-semibold text-blue-200">System Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Grid untuk kartu-kartu role */}
                {roles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {roles.map(({ id, name, permissions }) => (
                            // Kartu individu untuk setiap role
                            <div key={id} className="holo-card group">
                                <div className="holo-shimmer"></div>
                                <div className="relative z-10 flex flex-col h-full p-6">
                                    {/* Header Kartu */}
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-2xl font-light text-gray-500 dark:text-white uppercase tracking-widest">
                                            {name}
                                        </h3>
                                        <ShieldCheck className="w-7 h-7 text-gray-500 group-hover:text-cyan-300 transition-colors duration-300" />
                                    </div>

                                    {/* Daftar Permissions */}
                                    <div className="flex-grow mb-4">
                                        <p className="text-xs text-gray-400 mb-2 uppercase">Permissions Granted:</p>
                                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar-sleek">
                                            {permissions.length > 0 ? (
                                                permissions.map((permission) => (
                                                    <span key={permission.id} className="permission-chip">
                                                        {permission.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-600 italic">
                                                    No specific permissions.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tombol Aksi (View, Edit, Delete) */}
                                    <div className="border-t border-gray-500/20 pt-4 mt-auto flex justify-end space-x-2">
                                        {can('roles.view') && (
                                            <Link href={route('roles.show', id)}>
                                                <Button variant="ghost" size="icon" className="action-icon text-gray-500 hover:text-cyan-400">
                                                    <Eye className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('roles.edit') && (
                                            <Link href={route('roles.edit', id)}>
                                                <Button variant="ghost" size="icon" className="action-icon text-gray-500 hover:text-green-400">
                                                    <Pencil className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        )}
                                        {can('roles.delete') && (
                                            <Button variant="ghost" size="icon" disabled={processing} onClick={() => handleDelete(id, name)} className="action-icon text-gray-500 hover:text-red-500">
                                                <Trash className="h-5 w-5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Tampilan jika tidak ada role
                    <div className="text-center py-20 text-gray-600">
                        <p className="text-lg">No Roles Defined in the System.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
