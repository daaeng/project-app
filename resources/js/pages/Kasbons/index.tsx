import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Search, Trash } from 'lucide-react';
import { can } from '@/lib/can';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { PaginationLink } from '@/types/inertia';
import Tag from '@/components/ui/tag';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kasbon', // Changed title to Kasbon
        href: '/kasbons', // Changed href to /kasbons
    },
];

interface Kasbon {
    id: number;
    incisor_id: number;
    incisor_name: string;
    incised_id: number;
    incised_no_invoice: string; // Keep this for backend consistency, but we'll use incisor_no_invoice for display
    incisor_no_invoice: string; // Add this for displaying the Incisor's no_invoice
    gaji: number;
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'belum ACC' | 'ditolak' | 'diterima'; // Update status types to match TagProps
    reason: string | null;
    created_at: string;
}

interface PageProps {
    flash: {
        message?: string;
        error?: string; // Added error flash message
    };
    kasbons: {
        data: Kasbon[];
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

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function KasbonIndex() { // Renamed component for clarity
    const { kasbons, flash, filter } = usePage().props as PageProps;

    // Adjusted useForm to match KasbonController destroy method, removing 'processing' as it's not used
    const { delete: destroy } = useForm();

    const [searchValue, setSearchValue] = useState(filter?.search || '');

    useEffect(() => {
        setSearchValue(filter?.search || '');
    }, [filter?.search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const performSearch = () => {
        router.get(
            route('kasbons.index'),
            { search: searchValue },
            {
                preserveState: true,
                replace: true,
                only: ['kasbons', 'filter'],
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, incisorName: string, incisorNoInvoice: string) => { // Changed incisedNoInvoice to incisorNoInvoice
        if (confirm(`Apakah Anda yakin ingin menghapus Kasbon ini untuk ${incisorName} (Kode Penoreh: ${incisorNoInvoice})?`)) { // Updated message
            destroy(route('kasbons.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.get(route('kasbons.index'), { search: searchValue }, { preserveState: true });
                },
                onError: (errors) => {
                    console.error("Failed to delete kasbon:", errors);
                    // You might want to display a more prominent error message to the user
                    // For now, it will be handled by the flash.error in PageProps
                }
            });
        }
    };

    const renderPagination = (pagination: PageProps['kasbons']) => {
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
                            href={link.url + (searchValue ? `&search=${searchValue}` : '')} // Append search param
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
            <Head title="Data Kasbon" /> {/* Changed title */}

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title='Data Kasbon' />

                <div className='border h-auto p-3 rounded-lg  shadow-sm'>
                    {/* Add New Button */}
                    <div className='w-full mb-4 justify-end h-auto flex gap-2'>
                        {can('kasbons.create') &&
                            <Link href={route('kasbons.create')}>
                                <Button className='bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 flex items-center gap-2'>
                                    <CirclePlus className="w-4 h-4" />
                                    Tambah Kasbon
                                </Button>
                            </Link>
                        }
                    </div>

                    {/* Flash Messages */}
                    {flash.message && (
                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                            <Megaphone className='h-4 w-4 text-green-600' />
                            <AlertTitle className='text-green-700 font-semibold'>Notifikasi</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                    {flash.error && ( // Display error flash message
                        <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
                            <Megaphone className='h-4 w-4 text-red-600' />
                            <AlertTitle className='text-red-700 font-semibold'>Error</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Search Input */}
                    <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center'>
                        <div className='relative flex-1'>
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Cari berdasarkan Penoreh, Kode Penoreh, Status..." // Updated placeholder
                                value={searchValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <Button onClick={performSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 flex items-center gap-2">
                            <Search className="h-4 w-4" /> Cari
                        </Button>
                    </div>

                    {/* Data Table */}
                    <CardContent className='border rounded-lg p-0 overflow-hidden'> {/* Removed padding from CardContent */}
                        <div className="relative w-full overflow-auto"> {/* Added responsive scroll */}
                            {kasbons.data.length > 0 ? (
                                <Table className="min-w-full divide-y ">
                                    <TableHeader className="">
                                        <TableRow>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">ID</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Penoreh</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Kode Penoreh</TableHead> {/* Changed to Kode Penoreh */}
                                            {/* Kolom Gaji dihapus sesuai permintaan */}
                                            {/* <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gaji</TableHead> */}
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Kasbon</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Alasan</TableHead>
                                            <TableHead className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className=" ">
                                        {kasbons.data.map((kasbon) => (
                                            // Memastikan tidak ada whitespace antara TableRow dan TableCell pertama
                                            <TableRow key={kasbon.id}>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium ">{kasbon.id}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">{kasbon.incisor_name}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">{kasbon.incisor_no_invoice}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">{formatCurrency(kasbon.kasbon)}</TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">{/* Menggunakan komponen Tag */}
                                            <Tag status={kasbon.status === 'Pending' ? 'belum ACC' : (kasbon.status === 'Approved' ? 'diterima' : 'ditolak')} /></TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm ">{kasbon.reason || '-'}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                
                                            {can('kasbons.view') && 
                                                <Link href={route('kasbons.show', kasbon.id)}>
                                                    <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>}
                                            
                                            {can('kasbons.edit') && 
                                                <Link href={route('kasbons.edit', kasbon.id)}>
                                                    <Button size="icon" variant="ghost" className="text-blue-500 hover:text-blue-700">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>}
                                            
                                            {can('kasbons.delete') && 
                                                <Button onClick={() => handleDelete(kasbon.id, kasbon.incisor_name, kasbon.incisor_no_invoice)} 
                                                    size="icon" variant="ghost" 
                                                    className="text-red-500 hover:text-red-700">
                                                        
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            }
                                            </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="p-6 text-center text-gray-500 bg-white">
                                    Tidak ada data kasbon ditemukan.
                                </div>
                            )}
                        </div>
                        {/* Pagination */}
                        {kasbons.data.length > 0 && renderPagination(kasbons)}
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}
