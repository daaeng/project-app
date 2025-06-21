import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Eye, FileDown, Megaphone, Package, Pencil, Search, Sprout, Trash, Undo2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Information',
        href: '/products',
    },
];

interface Product {
    id: number;
    product : string,
    date: string;
    no_invoice: string;
    nm_supplier: string;
    j_brg: string;
    desk: string;
    qty_kg: number;
    price_qty: number;
    amount: number;
    keping: number;
    kualitas: string;
    qty_out: number;
    price_out: number;
    amount_out: number;
    keping_out: number;
    kualitas_out: string;
}

interface PageProps{
    flash:{
        message?: string
    }, 
    products: Product[],
    products2: Product[],
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};


export default function index({ saldoin, saldoout, tm_sin, tm_sou, tm_slin, tm_slou, }) {

    const { products, products2, flash } = usePage().props as PageProps;

    const {processing, delete: destroy} = useForm();

    const handleDelete = (id:number, product:string) => {
        if(confirm(`Do you want delete this  - ${id}. ${product} ` )){
            destroy(route('products.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            <div className="h-full flex-col rounded-xl p-4 space-y-4">
            
                <Heading title='PT. Garuda Karya Amanat'/>

                <div className='mb-3'>
                    <Link href={route('products.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-accent-foreground'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='grid grid-cols-4 gap-4'>
                    
                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                        <CardHeader className="bg-blue-300 ">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-700">Available Stock Karet</CardTitle>
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <Package size={18} className="text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='lg:-mt-4 text-blue-700'>
                            <div className=''>
                                <div className='flex gap-2'> <p className='text-green-400'>IN</p> {formatCurrency(saldoout)} </div>
                                <div className='flex gap-2'> <p className='text-red-400'>OUT</p> {formatCurrency(saldoin)} </div>
                                {/* <div className="text-2xl w-full justify-end flex font-bold row-span-2">{hsl_karet} Kg</div> */}
                            </div>
                        </CardContent>
                        
                    </Card>

                    <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                        <CardHeader className="bg-amber-300 ">
                            <div className="flex items-center p-1 justify-between">
                                <CardTitle className="text-sm font-medium text-gray-700">Stock Information</CardTitle>
                                <div className="rounded-lg bg-amber-100 p-2">
                                    <Sprout size={18} className="text-amber-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='lg:-mt-4 text-amber-700'>
                            <div className='grid grid-cols-2'>
                                <div className='flex gap-2'> <p className='text-green-400'>IN</p> {formatCurrency(tm_slin)} </div>
                                <div className='flex gap-2'> <p className='text-red-400'>OUT</p> {formatCurrency(tm_slou)} </div>

                                {/* Stock masuk */}
                                <div className="text-2xl w-full justify-center flex font-bold row-span-2">{tm_sin} Kg</div>

                                {/* Stock Keluar */}
                                <div className="text-2xl w-full justify-center flex font-bold row-span-2">{tm_sou} Kg</div>
                            </div>
                        </CardContent>
                        
                    </Card>

                </div>

                <div className='p-2'>
                    {flash.message && (
                        <Alert>
                            <Megaphone className='h4-w4' />
                            <AlertTitle className='text-green-600'>
                                Notification
                            </AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* <div>
                    {can('products.create') && 
                        <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                            <Link href={route('products.create')}>
                                <Button className='bg-yellow-600 w-25 hover:bg-yellow-500'>
                                    <CirclePlus />
                                    Product
                                </Button>
                            </Link>
                        </div>
                    }
                </div> */}

                <div className='grid grid-cols-2 gap-3'>
                    <div className='border p-2 rounded-lg'>

                        <div className='grid grid-cols-2'>
                            <div className='font-bold' style={{ fontSize:25 }}>
                                Data Pembelian Karet
                            </div>

                        </div>
                        
                        <CardContent className='border rounded-lg'>
                            <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-8"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select defaultValue="all-time">
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
                                    
                                    <Button variant="outline"  className="flex items-center gap-1">
                                        <FileDown className="h-4 w-4" />
                                        {/* onClick={handleExportToExcel} */}
                                        Export
                                    </Button>
                                </div>
                            </div>
                            <div className="rounded-md">
                            
                                {products.length > 0 && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            {/* <TableHead className="w-[100px]">ID</TableHead> */}
                                            {/* <TableHead>Produk</TableHead> */}
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Barang</TableHead>
                                            <TableHead>Qty (IN)</TableHead>
                                            <TableHead>Outcome</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {products.map((product) => (

                                                <TableRow>
                                                    {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                                                    {/* <TableCell>{product.product}</TableCell> */}
                                                    <TableCell>{product.date}</TableCell>
                                                    <TableCell>{product.nm_supplier}</TableCell>
                                                    <TableCell>{product.j_brg}</TableCell>
                                                    <TableCell>{product.qty_kg}</TableCell>
                                                    {/* <TableCell>{product.qty_out}</TableCell> */}
                                                    {/* <TableCell>{formatCurrency(product.amount_out)}</TableCell> */}
                                                    <TableCell>{formatCurrency(product.amount)}</TableCell>
                                                    <TableCell className="text-center space-x-2">

                                                        {can('products.view') &&
                                                            <Link href={route('products.show', product.id)}>
                                                                <Button className='bg-transparent hover:bg-gray-700'>
                                                                    <Eye color='gray'/>
                                                                </Button>
                                                            </Link>
                                                        }

                                                        {can('products.edit') && 
                                                            <Link href={route('products.edit', product.id)}>
                                                                <Button className='bg-transparent hover:bg-gray-700'>
                                                                    <Pencil color='blue'/>
                                                                </Button>
                                                            </Link>
                                                        }

                                                        {can('products.delete') && 
                                                            <Button disabled={processing} onClick={() => handleDelete(product.id, product.product)} className='bg-transparent hover:bg-gray-700'>
                                                                <Trash color='red'/>
                                                            </Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                )}

                            </div>
                        </CardContent>

                    </div>
                    <div className='border p-2 rounded-lg'>

                        <div className='grid grid-cols-2'>
                            <div className='font-bold' style={{ fontSize:25 }}>
                                Data Penjualan Karet
                            </div>

                            {/* <div>
                                {can('products.create') && 
                                    <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                                        <Link href={route('products.create')}>
                                            <Button className='bg-yellow-600 w-25 hover:bg-yellow-500'>
                                                <CirclePlus />
                                                Product
                                            </Button>
                                        </Link>
                                    </div>
                                }
                            </div> */}
                        </div>

                        <CardContent className='border rounded-lg'>
                            <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-8"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select defaultValue="all-time">
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
                                    
                                    <Button variant="outline"  className="flex items-center gap-1">
                                        <FileDown className="h-4 w-4" />
                                        {/* onClick={handleExportToExcel} */}
                                        Export
                                    </Button>
                                </div>
                            </div>
                            <div className="rounded-md">
                            
                                {products2.length > 0 && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            {/* <TableHead className="w-[100px]">ID</TableHead> */}
                                            {/* <TableHead>Produk</TableHead> */}
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Barang</TableHead>
                                            <TableHead>Qty (OUT)</TableHead>
                                            <TableHead>Income</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {products2.map((product) => (

                                                <TableRow>
                                                    {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                                                    {/* <TableCell>{product.product}</TableCell> */}
                                                    <TableCell>{product.date}</TableCell>
                                                    <TableCell>{product.nm_supplier}</TableCell>
                                                    <TableCell>{product.j_brg}</TableCell>
                                                    <TableCell>{product.qty_out}</TableCell>
                                                    <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                                                    <TableCell className="text-center space-x-2">

                                                        {can('products.view') &&
                                                            <Link href={route('products.show', product.id)}>
                                                                <Button className='bg-transparent hover:bg-gray-700'>
                                                                    <Eye color='gray'/>
                                                                </Button>
                                                            </Link>
                                                        }

                                                        {can('products.edit') && 
                                                            <Link href={route('products.edit', product.id)}>
                                                                <Button className='bg-transparent hover:bg-gray-700'>
                                                                    <Pencil color='blue'/>
                                                                </Button>
                                                            </Link>
                                                        }

                                                        {can('products.delete') && 
                                                            <Button disabled={processing} onClick={() => handleDelete(product.id, product.product)} className='bg-transparent hover:bg-gray-700'>
                                                                <Trash color='red'/>
                                                            </Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                )}

                            </div>
                        </CardContent>

                    </div>

                </div>

            </div>




        </AppLayout>
    );
}