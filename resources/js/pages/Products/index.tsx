import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, FolderOpen, Sprout, Trees } from 'lucide-react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { can } from '@/lib/can';

// Mendefinisikan palet warna yang lebih modern
const customColors = {
    primary: '#4F46E5', // Biru gelap untuk brand
    secondary: '#EEF2FF', // Biru muda sebagai latar belakang kartu
    accentAmber: '#FDBA74', // Oranye lembut
    accentBlue: '#60A5FA', // Biru cerah
    accentGreen: '#34D399', // Hijau cerah
    textPrimary: '#1F2937', // Teks gelap
    textSecondary: '#6B7280', // Teks abu-abu
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Information',
        href: '/products',
    },
];

export default function index() {
    // Data produk dummy
    const products = [
        {
            name: 'PT. Garuda Karya Amanat',
            icon: <Building2 size={24} color={customColors.accentAmber} />,
            color: 'amber',
            route: 'products.gka',
        },
        {
            name: 'Temadu Sebayar Agro',
            icon: <Trees size={24} color={customColors.accentBlue} />,
            color: 'blue',
            route: 'products.tsa',
        },
        {
            name: 'Garuda Karya Agro',
            icon: <Sprout size={24} color={customColors.accentGreen} />,
            color: 'green',
            route: 'products.agro',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />
            
            {can('products.view') && (
                <>
                    {/* Container utama dengan latar belakang abu-abu terang dan padding */}
                    <div className="h-full flex-col rounded-xl p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
                        <Heading title='Product Information' />

                        {/* Bagian kartu produk */}
                        <div className="w-full h-auto flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                                {products.map((product) => (
                                    <Card key={product.name} className={`shadow-lg transition-transform transform hover:scale-105 duration-300 rounded-xl bg-white dark:bg-gray-800 border-${product.color}-300 border-l-4`}>
                                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg bg-${product.color}-100 dark:bg-gray-700`}>
                                                    {product.icon}
                                                </div>
                                                <CardTitle className={`ml-3 text-lg font-semibold text-gray-700 dark:text-gray-200`}>
                                                    {product.name}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardFooter className="p-4 pt-0">
                                            <Link href={route(product.route)}>
                                                <Button variant="link" className="flex h-auto items-center p-0 text-primary hover:text-blue-700 transition-colors duration-200">
                                                    View details <ArrowRight size={16} className="ml-2" />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Garis pemisah */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

                        {/* Tombol "All Product Data" */}
                        {can('products.create') && 
                            <div className="w-full flex justify-center">
                                <Link href={route('products.allof')}>
                                    <Button className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200">
                                        <FolderOpen size={20} className="mr-2" />
                                        All Product Data
                                    </Button>
                                </Link>
                            </div>
                        }
                    </div>
                </>
            )}

        </AppLayout>
    );
}

