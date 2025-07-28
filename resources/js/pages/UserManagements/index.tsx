import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Added 'router'
import { CirclePlus, Eye, Megaphone, Pencil, Search, Trash } from 'lucide-react'; // Added 'Search' icon
import { can } from '@/lib/can';
import { Input } from '@/components/ui/input'; // Added Input component
import { useState, useEffect } from 'react'; // Added useState and useEffect

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/usermanagements',
    },
];

interface Role { // Define Role interface as it's used in User
    id: number;
    name: string;
}

interface User {
    id: number; // Added id as it's used for keys and delete
    name: string;
    email: string; // Added email as it's displayed in table
    roles: Role[]; // Added roles as it's displayed in table
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
    usermanagements: { // Updated to be paginated data structure
        data: User[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string }; // Added filter prop for search value
}

export default function Index({ usermanagements, flash, filter } : PageProps) { // Destructure filter from props

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
            route('usermanagements.index'),
            { search: searchValue }, // Send the search term to the backend
            {
                preserveState: true,
                replace: true,
                only: ['usermanagements', 'filter'], // Only update 'usermanagements' and 'filter' props
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
            destroy(route('usermanagements.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // After successful deletion, refresh the data with the current search filter
                    router.get(route('usermanagements.index'), { search: searchValue }, { preserveState: true });
                },
            });
        }
    };

    // Fungsi untuk render link paginasi
    const renderPagination = (pagination: PageProps['usermanagements']) => { // Adjusted type for better type safety
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
            <Head title="User Management" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <Heading title='User Management' />

                <div className='border h-auto p-3 rounded-lg'>
                    {can('usermanagements.create') &&
                        <div className='w-full mb-2 justify-end h-auto flex gap-2'>
                            <Link href={route('usermanagements.create')}>
                                <Button className='bg-blue-600 w-30 hover:bg-blue-500 text-white'>
                                    <CirclePlus className="w-4 h-4 mr-2" /> {/* Added class for icon spacing */}
                                    Add User
                                </Button>
                            </Link>
                        </div>
                    }

                    <div>
                        {flash.message && (
                            <Alert className="mb-4"> {/* Added margin-bottom */}
                                <Megaphone className='h-4 w-4' /> {/* Corrected class from h4-w4 */}
                                <AlertTitle className='text-green-600'>
                                    Notification
                                </AlertTitle>
                                <AlertDescription>
                                    {flash.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className='flex flex-col gap-4 py-4 sm:flex-row sm:items-center'> {/* Changed layout for search and button */}
                        <div className='relative flex-1'> {/* Make search input flexible */}
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search by Name, Email, Role..."
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

                    <CardContent className='border rounded-lg mt-4'> {/* Added mt-4 for spacing */}
                        <div className="rounded-md">
                            {usermanagements.data.length > 0 ? ( // Conditional rendering based on data existence
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>NAME</TableHead>
                                            <TableHead>EMAIL</TableHead>
                                            <TableHead>ROLES</TableHead>
                                            <TableHead className="text-center">ACTION</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {usermanagements.data.map(({ id, name, email, roles }) => ( // Use usermanagements.data
                                            <TableRow key={id}>
                                                <TableCell>{id}</TableCell>
                                                <TableCell>{name}</TableCell>
                                                <TableCell>{email}</TableCell>
                                                <TableCell>
                                                    {roles.map((role) =>
                                                        <span key={role.id} className='mr-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg p-1.5 w-auto'>
                                                            {role.name}
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-center space-x-2">
                                                    {can('usermanagements.view') &&
                                                        <Link href={route('usermanagements.show', id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Eye color='gray' />
                                                            </Button>
                                                        </Link>
                                                    }

                                                    {can('usermanagements.edit') &&
                                                        <Link href={route('usermanagements.edit', id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Pencil color='blue' />
                                                            </Button>
                                                        </Link>
                                                    }

                                                    {can('usermanagements.delete') &&
                                                        <Button disabled={processing} onClick={() => handleDelete(id, name)} className='bg-transparent hover:bg-gray-700'>
                                                            <Trash color='red' />
                                                        </Button>
                                                    }
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
                        {usermanagements.data.length > 0 && renderPagination(usermanagements)} {/* Add pagination navigation */}
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}
