import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react'; // Added 'router'
import { Eye, Megaphone, Pencil, Search, Trash, Upload } from 'lucide-react';
import { can } from '@/lib/can';
import Tag from '@/components/ui/tag';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react'; // Added useState and useEffect

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

interface PaginationLink { // Added PaginationLink interface for consistency
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    flash: {
        message?: string;
    };
    notas: {
        data: Nota[]; // Data notas
        links: PaginationLink[]; // Changed to use PaginationLink interface
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string }; // Added filter prop for search value
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { // Changed to 'id-ID' for Indonesian currency format
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Changed to 0 for whole numbers
    }).format(value);
};

export default function Index() { // Renamed to Index (PascalCase for component names)
    const { notas, flash, filter } = usePage().props as PageProps; // Destructure filter from props

    const { processing, delete: destroy } = useForm();

    const [searchValue, setSearchValue] = useState(filter?.search || ''); // Initialize search value from filter prop

    useEffect(() => {
        setSearchValue(filter?.search || ''); // Update search value when filter prop changes
    }, [filter?.search]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value); // Update search value as user types
    };

    const performSearch = () => {
        router.get(
            route('notas.index'),
            { search: searchValue }, // Send the search term to the backend
            {
                preserveState: true,
                replace: true,
                only: ['notas', 'filter'], // Only update 'notas' and 'filter' props
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch(); // Trigger search on Enter key press
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete this - ${id}. ${name} `)) {
            destroy(route('notas.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // After successful deletion, refresh the data with the current search filter
                    router.get(route('notas.index'), { search: searchValue }, { preserveState: true });
                },
            });
        }
    };

    // Fungsi untuk render link paginasi
    const renderPagination = (pagination: PageProps['notas']) => { // Adjusted type for better type safety
        return (
            <div className="flex justify-center items-center mt-6 space-x-1"> {/* Added styling for better layout */}
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
                            preserveState // Maintain form state and scroll position
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

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title="Request - Upload Nota" />

                <div className="border rounded-lg p-2">
                    <div className="grid grid-cols-2 items-center"> {/* Added items-center for alignment */}
                        <div className="font-bold">Submission Report</div>

                        <div className="w-full justify-end h-auto flex mb-5 gap-2">
                            {can('notas.create') && (
                                <Link href={route('notas.up_nota')}>
                                    <Button className="bg-blue-600 w-30 hover:bg-blue-500">
                                        <Upload className="w-4 h-4 mr-2" /> {/* Added class for icon spacing */}
                                        Upload Nota
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div>
                        {flash.message && (
                            <Alert className="mb-4"> {/* Added margin-bottom */}
                                <Megaphone className="h-4 w-4" /> {/* Corrected class from h4-w4 */}
                                <AlertTitle className="text-green-600">Notification</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center'> {/* Changed layout for search and button */}
                        <div className='relative flex-1'> {/* Make search input flexible */}
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search by Name, Devisi, Mengetahui..."
                                value={searchValue} // Bind value to state
                                onChange={handleInputChange} // Handle input changes
                                onKeyPress={handleKeyPress} // Handle Enter key press
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={performSearch}> {/* Added search button */}
                            <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                    </div>

                    <div className="border rounded-lg">
                        {notas.data.length > 0 ? ( // Conditional rendering based on data existence
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
                    {notas.data.length > 0 && renderPagination(notas)} {/* Tambahkan navigasi paginasi */}
                </div>
            </div>
        </AppLayout>
    );
}
