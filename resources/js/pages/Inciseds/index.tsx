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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { FaSeedling, FaUserFriends } from 'react-icons/fa'; // Import new icons

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incised',
        href: '/inciseds',
    },
];

interface Incised {
    id: number;
    product: string;
    date: string;
    no_invoice: string;
    lok_kebun: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    incisor_name: string | null;
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
    inciseds: {
        data: Incised[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filter?: { search?: string; time_period?: string }; // Added time_period to filter
    totalKebunA: number; // Added for Kebun A total
    totalKebunB: number; // Added for Kebun B total
    mostProductiveIncisor: { // Added for most productive incisor
        name: string;
        total_qty_kg: number;
    };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// StatCard component (reused and adapted from Dashboard for consistent look)
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    subtitle: string;
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div className={`p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${gradient} text-white`}>
        <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Icon className="text-blue-500 text-xl" />
            </div>
            <div>
                <h4 className="text-sm font-medium">{title}</h4>
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-xs opacity-90">{subtitle}</p>
            </div>
        </div>
    </div>
);


export default function Admin({ inciseds, flash, filter, totalKebunA, totalKebunB, mostProductiveIncisor } : PageProps) {
    const { processing, delete: destroy } = useForm();

    const [searchValue, setSearchValue] = useState(filter?.search || '');
    const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time'); // State for time period filter

    useEffect(() => {
        setSearchValue(filter?.search || '');
        setTimePeriod(filter?.time_period || 'all-time'); // Sync time period from props
    }, [filter?.search, filter?.time_period]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTimePeriodChange = (value: string) => {
        setTimePeriod(value);
        // Trigger search when time period changes
        router.get(
            route('inciseds.index'),
            { search: searchValue, time_period: value }, // Include time_period in the request
            {
                preserveState: true,
                replace: true,
                only: ['inciseds', 'filter', 'totalKebunA', 'totalKebunB', 'mostProductiveIncisor'], // Ensure new data is refreshed
            }
        );
    };

    const performSearch = () => {
        router.get(
            route('inciseds.index'),
            { search: searchValue, time_period: timePeriod }, // Send the search term and time_period to the backend
            {
                preserveState: true,
                replace: true,
                only: ['inciseds', 'filter', 'totalKebunA', 'totalKebunB', 'mostProductiveIncisor'], // Ensure new data is refreshed
            }
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    const handleDelete = (id: number, product: string) => {
        if (confirm(`Do you want to delete this - ${id}. ${product} `)) {
            destroy(route('inciseds.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // After successful deletion, refresh the data with the current search and time filters
                    router.get(route('inciseds.index'), { search: searchValue, time_period: timePeriod }, { preserveState: true });
                },
            });
        }
    };

    // Fungsi untuk render link paginasi
    const renderPagination = (pagination: PageProps['inciseds']) => {
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
                            href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '')} // Append search and time_period
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
            <Head title="Incised" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
                <Heading title="Data Harian Penoreh" />

                {/* New Stat Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        icon={FaSeedling}
                        title="Total Karet Temadu"
                        value={`${totalKebunA} kg`}
                        subtitle="Total Kuantitas Karet"
                        gradient="from-green-400 to-green-600"
                    />
                    <StatCard
                        icon={FaSeedling}
                        title="Total Karet Sebayar"
                        value={`${totalKebunB} kg`}
                        subtitle="Total Kuantitas Karet"
                        gradient="from-blue-400 to-blue-600"
                    />
                    <StatCard
                        icon={FaUserFriends}
                        title="Penoreh Paling Produktif"
                        value={mostProductiveIncisor.name}
                        subtitle={`Total ${mostProductiveIncisor.total_qty_kg} kg`}
                        gradient="from-purple-400 to-purple-600"
                    />
                </div>
                {/* End New Stat Cards Section */}

                <div className="border h-auto p-3 rounded-lg">
                    <div className="w-full mb-2 justify-end h-auto flex gap-2">
                        {can('incised.create') && (
                            <Link href={route('inciseds.create')}>
                                <Button className="bg-blue-600 w-25 hover:bg-blue-500 text-white">
                                    <CirclePlus className="w-4 h-4 mr-2" />
                                    Add User
                                </Button>
                            </Link>
                        )}
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
                                placeholder="Search by Product, Invoice, Kebun, Jenis Barang..."
                                value={searchValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={performSearch}>
                            <Search className="h-4 w-4 mr-2" /> Search
                        </Button>
                        {/* Select filter by time period */}
                        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-time">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <CardContent className="border rounded-lg mt-4">
                        <div className="rounded-md">
                            {inciseds.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Kode/Penoreh</TableHead>
                                            <TableHead>Kebun</TableHead>
                                            <TableHead>Jenis Barang</TableHead>
                                            <TableHead>Qty (kg)</TableHead>
                                            <TableHead>Total Harga</TableHead>
                                            <TableHead className="text-center">ACTION</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {inciseds.data.map((incised) => (
                                            <TableRow key={incised.id}>
                                                <TableCell>{incised.product}</TableCell>
                                                <TableCell>{incised.date}</TableCell>
                                                <TableCell>
                                                    {incised.no_invoice} - {incised.incisor_name || 'N/A'}
                                                </TableCell>
                                                <TableCell>{incised.lok_kebun}</TableCell>
                                                <TableCell>{incised.j_brg}</TableCell>
                                                <TableCell>{incised.qty_kg}</TableCell>
                                                <TableCell>{formatCurrency(incised.amount)}</TableCell>
                                                <TableCell className="text-center space-x-2">
                                                    {can('incised.view') && (
                                                        <Link href={route('inciseds.show', incised.id)}>
                                                            <Button className="bg-transparent hover:bg-gray-700">
                                                                <Eye color="gray" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('incised.edit') && (
                                                        <Link href={route('inciseds.edit', incised.id)}>
                                                            <Button className="bg-transparent hover:bg-gray-700">
                                                                <Pencil color="blue" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {can('incised.delete') && (
                                                        <Button
                                                            disabled={processing}
                                                            onClick={() => handleDelete(incised.id, incised.product)}
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
                        {inciseds.data.length > 0 && renderPagination(inciseds)}
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}
