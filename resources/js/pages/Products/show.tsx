import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import Tag_Karet from '@/components/ui/tag_karet';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Information',
        href: '/products',
    },
];

interface Product{
    product: string,
    date: string,
    no_invoice: number,
    nm_supplier: string,
    j_brg: string,
    desk: string,
    qty_kg: string,
    price_qty: number,
    amount: number,
    keping: number,
    kualitas: string,
    qty_out: number,
    price_out: number,
    amount_out: number,
    keping_out: number,
    kualitas_out: string,
    status: string,
}

interface props{
    product : Product
}

export default function edit({product} : props) {

    const {data, errors } = useForm({

        product: product.product,
        date: product.date,
        no_invoice: product.no_invoice,
        nm_supplier: product.nm_supplier,
        j_brg: product.j_brg,
        desk: product.desk,
        qty_kg: product.qty_kg,
        price_qty: product.price_qty,
        amount: product.amount,
        keping: product.keping,
        kualitas: product.kualitas,
        qty_out: product.qty_out,
        price_out: product.price_out,
        amount_out: product.amount_out,
        keping_out: product.keping_out,
        kualitas_out: product.kualitas_out,
        status: product.status,

    })

    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Show Data Product'/>

                <Link href={route('products.index')}>
                    <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                        <Undo2 />
                        Back
                    </Button>
                </Link>

                <div className='w-full p-4'>


                        {Object.keys(errors). length > 0 && (
                            <Alert>
                                <CircleAlert className='h-4 w-4'/>
                                <AlertTitle className='text-red-600'>
                                    Errors...!
                                </AlertTitle>
                                <AlertDescription>
                                    <ul>
                                        {Object.entries(errors).map(([key, message]) =>
                                            <li key={key}>
                                                {message as string  }
                                            </li>
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    <form className='space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Product </Label>
                                <Input placeholder='Product Name' value={data.product} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> No. Invoice </Label>
                                <Input placeholder='Invoice' value={data.no_invoice} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Name Supplier </Label>
                                <Input placeholder='Name Supplier' value={data.nm_supplier} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                <Input placeholder='Jenis Barang' value={data.j_brg} readOnly />
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Status'> Status </Label>
                                <div>
                                    <Tag_Karet status={product.status} />
                                </div>
                            </div>

                        </div>
                        

                        <div className='grid grid-cols-3'>
                            <div className='p-2 mt-3 col-span-3 border-2 rounded-md h-fit '>

                                <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2'>

                                    <div className='gap-2 sm:col-span-3'>
                                        <Label htmlFor='In'> MASUK </Label>
                                    </div>

                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_kg} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_qty} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping / Buah</Label>
                                        <Input placeholder='Keping' value={data.keping} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas} readOnly />
                                    </div>

                                    <div className='gap-2 sm:col-span-3 mt-5'>
                                        <Label htmlFor='In'> KELUAR </Label>
                                    </div>

                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_out} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_out} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount_out} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping / Buah </Label>
                                        <Input placeholder='Keping Keluar' value={data.keping_out} readOnly />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas_out} readOnly />
                                    </div>
                                                                        
                                </div>
                                
                            </div>


                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
