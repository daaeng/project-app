import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react'; 
import { CirclePlus, Eye, Megaphone, Pencil, Search, Trash } from 'lucide-react';
import { can } from '@/lib/can';
import { Input } from '@/components/ui/input'; 
import { useState, useEffect } from 'react'; 

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penoreh',
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

interface PaginationLink { 
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: {
        message?: string;
    };
    incisors: {
        data: Incisor[]; 
        links: PaginationLink[]; 
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string };
}

// const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('id-ID', {
//         style: 'currency',
//         currency: 'IDR',
//         minimumFractionDigits: 0, 
//     }).format(value);
// };

export default function Admin({ incisors, flash, filter } : PageProps ) {
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
            route('incisors.index'),
            { search: searchValue }, 
            {
                preserveState: true,
                replace: true,
                only: ['incisors', 'filter'], 
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();  
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete this - ${id}. ${name} `)) {
            destroy(route('incisors.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => { 
                    router.get(route('incisors.index'), { search: searchValue }, { preserveState: true });
                },
            });
        }
    };
 
    const renderPagination = (pagination: PageProps['incisors']) => {  
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
            <Head title="Incisor" />

            {can('incisor.view') && (
                <>
                    <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                        <Heading title="Data Penoreh" />

                        <div className="border h-auto p-3 rounded-lg">
                            {can('incisor.create') && (
                                <div className="w-full mb-2 justify-end h-auto flex gap-2">
                                    <Link href={route('incisors.create')}>
                                        <Button className="bg-blue-600 w-32 hover:bg-blue-500 text-white">
                                            <CirclePlus className="w-4 h-4 mr-2" />  
                                            Add Penoreh
                                        </Button>
                                    </Link>
                                </div>
                            )}

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
                                        placeholder="Search by Name, Location, No. Invoice..."
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

                            <CardContent className="border rounded-lg mt-4">  
                                <div className="rounded-md">
                                    {incisors.data.length > 0 ? (  
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
                                                {incisors.data.map((incisor) => (
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
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No results found.
                                        </div>
                                    )}
                                </div>
                                {incisors.data.length > 0 && renderPagination(incisors)}  
                            </CardContent>
                        </div>
                    </div>
                </>
            )}

        </AppLayout>
    );
}
