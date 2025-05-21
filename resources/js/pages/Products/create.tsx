import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Product',
        href: '/products',
    },
];

export default function index() {

    const {data, setData, post, processing, errors } = useForm({

        product: '',
        date: '',
        no_invoice: '',
        nm_supplier: '',
        j_brg: '',
        desk: '',
        qty_kg: '',
        price_qty: '',
        amount: '',
        qty_out: '',
        price_out: '',
        amount_out: '',

    })

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Create Product'/>

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

                    <form onSubmit={handleSubmit} className='space-y-3 grid grid-cols-2 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Product </Label>
                                <Input placeholder='Product Name' value={data.product} onChange={(e) => setData('product', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> No. Invoice </Label>
                                <Input placeholder='Invoice' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Name Supplier </Label>
                                <Input placeholder='Name Supplier' value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                <Input placeholder='Jenis Barang' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)}/>
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)}/>
                            </div>

                        </div>
                        

                        <div className='grid grid-cols-3'>
                            <div className='p-2 mt-3 col-span-3 bg-gray-900 rounded-md h-fit text-white'>

                                <div className='grid grid-cols-2 gap-3 p-2'>

                                    <div className='gap-2 col-span-3'>
                                        <Label htmlFor='In'> MASUK </Label>
                                    </div>

                                    <div className='gap-2'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_kg} onChange={(e) => setData('qty_kg', e.target.value)}/>
                                    </div>
                                    <div className='gap-2'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_qty} onChange={(e) => setData('price_qty', e.target.value)}/>
                                    </div>
                                    <div className='gap-2'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount} onChange={(e) => setData('amount', e.target.value)}/>
                                    </div>

                                    <div className='gap-2 col-span-3 mt-5'>
                                        <Label htmlFor='In'> KELUAR </Label>
                                    </div>

                                    <div className='gap-2'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)}/>
                                    </div>
                                    <div className='gap-2'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)}/>
                                    </div>
                                    <div className='gap-2'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)}/>
                                    </div>
                                                                        
                                </div>
                                
                            </div>


                        </div>

                        <div className=''>
                            <Button type='submit'>
                                Add Product
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
