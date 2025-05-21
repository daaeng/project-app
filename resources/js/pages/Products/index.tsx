import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Megaphone, Pencil, Plus, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Information',
        href: '/products',
    },
];

interface Product {
    product : string,

}

interface PageProps{
    flash:{
        message?: string
    }, 
    products: Product[]
}

export default function index() {
    
    const { products,  flash } = usePage().props as PageProps;

    const {processing, delete: destroy} = useForm();

    const handleDelete = (id:number, product:string) => {
        if(confirm(`Do you want delete this  - ${id}. ${product} ` )){
            destroy(route('products.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            <div className="h-full flex-col rounded-xl p-4 space-y-2">
            
                <Heading title='Product Information'/>

                <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                    <Link href={route('products.create')}>
                        <Button className='bg-yellow-600 w-25 hover:bg-yellow-500'>
                            <CirclePlus />
                            Product
                        </Button>
                    </Link>
                </div>

                <div className='font-bold'>
                    Rerport Data
                </div>

                <div>
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

                <div>

                    {products.length > 0 && (
                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Jenis Barang</TableHead>
                                <TableHead>Quantity (IN)</TableHead>
                                <TableHead>Quantity (OUT)</TableHead>
                                <TableHead>Total Harga</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {products.map((product) => (

                                    <TableRow>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>{product.product}</TableCell>
                                        <TableCell>{product.date}</TableCell>
                                        <TableCell>{product.nm_supplier}</TableCell>
                                        <TableCell>{product.j_brg}</TableCell>
                                        <TableCell>{product.qty_kg}</TableCell>
                                        <TableCell>{product.qty_out}</TableCell>
                                        <TableCell>Rp. {product.amount}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Link href={route('products.edit', product.id)}>
                                                <Button className='bg-amber-500 hover:bg-amber-400'>
                                                    <Pencil />
                                                </Button>
                                            </Link>
                                            <Button disabled={processing} onClick={() => handleDelete(product.id, product.product)} className='bg-red-600 hover:bg-red-500'>
                                                <Trash/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    )}
                </div>
                
            </div>



        </AppLayout>
    );
}

/*

                <div className='w-full h-auto flex mb-5 gap-2'>
                    <div className='bg-yellow-600 w-25 text-center h-auto p-2 rounded-md hover:bg-yellow-500'>
                        Temadu
                    </div>
                    <div className='bg-green-600 w-25 text-center h-auto p-2 rounded-md hover:bg-green-500'>
                        GK Agro
                    </div>
                </div>
*/