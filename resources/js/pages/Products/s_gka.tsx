import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Product Information', href: '/products' },
  { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
  { title: 'Send Product', href: '/products/c_send' },
];

export default function index() {

    const {data, setData, post, processing, errors } = useForm({

        product: '',
        date: '',
        no_invoice: '',
        nm_supplier: '',
        j_brg: '',
        desk: '',
        qty_out: '',
        price_out: '',
        amount_out: '',
        keping_out: '',
        kualitas_out: '',
        status: '',
    })

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send To GKA" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Send To GKA'/>

                <Link href={route('products.tsa')}>
                    <Button className='bg-auto w-25 hover:bg-accent hover:text-accent-foreground'>
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

                    <form onSubmit={handleSubmit} className='space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Product </Label>
                                {/* <Input placeholder='Product Name' value={data.product} onChange={(e) => setData('product', e.target.value)} /> */}
                                <select value={data.product} onChange={(e) => setData('product', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Pilih Jenis Product</option>
                                    <option value="Karet" >Karet</option>
                                    <option value="Kelapa" >Kelapa</option>
                                    <option value="Pupuk" >Pupuk</option>
                                </select>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='No. Bukti'> No. Bukti </Label>
                                <Input placeholder='No. Bukti' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Supplier </Label>
                                {/* <Input placeholder='Name Supplier' value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} /> */}
                                <select value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Pilih Supplier</option>
                                    <option value="Sebayar" >Sebayar</option>
                                    <option value="Temadu" >Temadu</option>
                                    <option value="Agro" >GK Agro</option>
                                </select>
                            </div>
                            <div className='gap-2 sm:col-span-3'>
                                <Label htmlFor='Product Name'> Status</Label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Status</option>
                                    <option value="gka" >To GKA</option>
                                </select>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                <Input placeholder='Jenis Barang' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)}/>
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Pembeli </Label>
                                <Textarea placeholder='Pembeli ( jika perusahaan tulis lengkap nama nya )' value={data.desk} onChange={(e) => setData('desk', e.target.value)}/>
                            </div>

                        </div>
                        

                        <div className='grid lg:grid-cols-3'>

                            <div className='p-2 mt-3 col-span-3 border-2  rounded-md h-fit '>

                                <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2'>

                                    <div className='gap-2 sm:col-span-3 mt-5'>
                                        <Label htmlFor='In'> Stock To GKA </Label>
                                    </div>

                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)}/>
                                    </div>
                                    {/* <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)}/>
                                    </div> */}
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)}/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping </Label>
                                        <Input placeholder='Keping Keluar' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)}/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)}/>
                                    </div>
                                                                        
                                </div>
                                
                            </div>


                        </div>

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-green-600 hover:bg-green-500'>
                                Add Product
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
