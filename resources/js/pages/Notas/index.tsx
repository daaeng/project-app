import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Eye, Megaphone, Pencil, Search, Trash, Upload, Clock, FileText, Receipt, DollarSign } from 'lucide-react'; // Added Clock, CheckCircle2, Wallet icons
import { can } from '@/lib/can';
import Tag from '@/components/ui/tag';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: {
        message?: string;
    };
    notas: {
        data: Nota[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string };
    totalPendingNotas: number; 
    totalApprovedNotas: number; 
    sumApprovedNotasAmount: number; 
    jml_nota: number; 
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function Index({ notas, flash, filter, totalPendingNotas, totalApprovedNotas, sumApprovedNotasAmount, jml_nota } : PageProps) {

    const { processing, delete: destroy } = useForm();

    const [searchValue, setSearchValue] = useState(filter?.search || '');

    useEffect(() => {
        setSearchValue(filter?.search || '');
    }, [filter?.search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const performSearch = () => {
        router.get(
            route('notas.index'),
            { search: searchValue },
            {
                preserveState: true,
                replace: true,
                only: ['notas', 'filter', 'totalPendingNotas', 'totalApprovedNotas', 'sumApprovedNotasAmount'], // Include new props in `only`
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus nota ini - ${id}. ${name}?`)) {
            destroy(route('notas.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.get(route('notas.index'), { search: searchValue }, { preserveState: true });
                },
            });
        }
    };

    const renderPagination = (pagination: PageProps['notas']) => {
        return (
            <div className="flex justify-center items-center mt-6 space-x-1">
                {pagination.links.map((link: PaginationLink, index: number) => (
                    link.url === null ? (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={`link-${index}`}
                            href={link.url}
                            className={`px-4 py-2 text-sm rounded-md transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            preserveState
                            preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    )
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request" />

            {can('notas.view') && (
                <>
                    <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                        <Heading title="Request - Upload Nota" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Card 1: Total Request Letters */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium opacity-90">Total Pengajuan</div>
                                    <div className="text-3xl font-bold mt-1"> {jml_nota}</div>
                                </div>
                                <FileText size={40} className="opacity-70" />
                            </div>

                            {/* Card 2: Total Nota/Kwitansi */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium opacity-90">Nota/Kwitansi ACC</div>
                                    <div className="text-3xl font-bold mt-1">{totalApprovedNotas}</div>
                                </div>
                                <Receipt size={40} className="opacity-70" />
                            </div>

                            {/* Card 3: Request Pending */}
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium opacity-90">Nota/Kwitansi Pending</div>
                                    <div className="text-3xl font-bold mt-1">{totalPendingNotas}</div> {/* Menggunakan totalPendingRequests */}
                                </div>
                                <Clock size={40} className="opacity-70" />
                            </div>

                            {/* Card 4: Total Dana Disetujui (Contoh) */}
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-lg flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium opacity-90">Total Kwitansi/Nota Dana Disetujui</div>
                                    <div className="text-3xl font-bold mt-1">{formatCurrency(sumApprovedNotasAmount)}</div> {/* Menggunakan totalApprovedDana */}
                                </div>
                                <DollarSign size={40} className="opacity-70" />
                            </div>
                        </div>

                        <div className="border rounded-lg p-2">
                            <div className="grid grid-cols-2 items-center">
                                <div className="font-bold">Submission Report</div>

                                <div className="w-full justify-end h-auto flex mb-5 gap-2">
                                    {can('notas.create') && (
                                        <Link href={route('notas.up_nota')}>
                                            <Button className="bg-blue-600 w-30 hover:bg-blue-500">
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Nota
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div>
                                {flash.message && (
                                    <Alert className="mb-4">
                                        <Megaphone className="h-4 w-4" />
                                        <AlertTitle className="text-green-600">Notification</AlertTitle>
                                        <AlertDescription>{flash.message}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center'>
                                <div className='relative flex-1'>
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="Search by Name, Devisi, Mengetahui..."
                                        value={searchValue}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
                                        className="pl-10"
                                    />
                                </div>
                                <Button onClick={performSearch}>
                                    <Search className="h-4 w-4 mr-2" /> Search
                                </Button>
                            </div>

                            <div className="border rounded-lg">
                                {notas.data.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Devisi</TableHead>
                                                <TableHead>Mengetahui</TableHead>
                                                <TableHead>Deskripsi</TableHead>
                                                <TableHead>Dana</TableHead>
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
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No results found.
                                    </div>
                                )}
                            </div>
                            {notas.data.length > 0 && renderPagination(notas)}
                        </div>
                    </div>
                </>
            )}

        </AppLayout>
    );
}
