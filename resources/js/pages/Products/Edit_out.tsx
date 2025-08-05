import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Tag_Karet from '@/components/ui/tag_karet';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';

interface Product{
    id: number,
    product: string,
    date: string,
    no_invoice: string,
    nm_supplier: string,
    j_brg: string,
    desk: string,
    qty_kg: string,
    price_qty: string,
    amount: string,
    keping: string,
    kualitas: string,
    qty_out: string,
    price_out: string,
    amount_out: string,
    keping_out: string,
    kualitas_out: string,
    status: string,
}

interface props{
    product : Product
}

export default function edit({product} : props) {

    const {data, setData, put, processing, errors } = useForm({

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

    const handleUpdate = (e: React.FormEvent) =>{
        e.preventDefault();
        put(route('products.update', product.id));
    }

    return (
        <AppLayout breadcrumbs={[{title: 'Edit Data Product', href:`/product/${product.id}/edit`}]}>
            <Head title="Edit Product" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Edit Data Pengeluaran Product'/>

                <Link href={route('products.index')}>
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
                    <form onSubmit={handleUpdate} className='space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Product </Label>
                                <Input placeholder='Product Name' value={data.product} onChange={(e) => setData('product', e.target.value)} readOnly/>
                                {/* <select value={data.product} onChange={(e) => setData('product', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Pilih Jenis Product</option>
                                    <option value="Karet" >Karet</option>
                                    <option value="Kelapa" >Kelapa</option>
                                    <option value="Pupuk" >Pupuk</option>
                                </select> */}
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> No. Invoice </Label>
                                <Input placeholder='Invoice' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Supplier </Label>
                                {/* <Input placeholder='Name Supplier' value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} /> */}
                                <select value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Pilih Supplier</option>
                                    <option value="Sebayar" >Sebayar</option>
                                    <option value="Temadu" >Temadu</option>
                                    <option value="Agro" >GK Agro</option>
                                    <option value="GKA" >GKA</option>
                                </select>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                <Input placeholder='Jenis Barang' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)} readOnly/>
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Status </Label>
                                <div>
                                    <Tag_Karet status={product.status} />
                                </div>
                            </div>

                        </div>
                        

                        <div className='grid grid-cols-3'>
                            {/* <div className='gap-2 sm:col-span-3 bg'>
                                <Label htmlFor='Product Name'> Status </Label>
                                <div>
                                    <Tag_Karet status={product.status} />
                                </div> */}
                                {/* <Input placeholder='Product Name' value={data.status} onChange={(e) => setData('status', e.target.value)} readOnly/> */}
                                {/* <select value={data.status} onChange={(e) => setData('status', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Pilih Lokasi Kebun</option>
                                    <option value="tsa" >TSA</option>
                                    <option value="gka" >TSA to GKA</option>
                                </select> */}
                            {/* </div> */}

                            <div className='p-2 mt-3 col-span-3 bg-gray-900 rounded-md h-fit text-white'>

                                <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2'>

                                    <div className='gap-2 sm:col-span-3'>
                                        <Label htmlFor='In'> MASUK </Label>
                                    </div>

                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping / Buah</Label>
                                        <Input placeholder='Keping' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} />
                                    </div>

                                    {/* <div className='gap-2 sm:col-span-3 mt-5'>
                                        <Label htmlFor='In'> KELUAR </Label>
                                    </div>

                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input placeholder='Quantity' value={data.qty_out} onChange={(e) => setData('qty_out', e.target.value)} readOnly/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input placeholder='Price' value={data.price_out} onChange={(e) => setData('price_out', e.target.value)} readOnly/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        <Input placeholder='Amount' value={data.amount_out} onChange={(e) => setData('amount_out', e.target.value)} readOnly/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping / Buah </Label>
                                        <Input placeholder='Keping Keluar' value={data.keping_out} onChange={(e) => setData('keping_out', e.target.value)} readOnly/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas_out} onChange={(e) => setData('kualitas_out', e.target.value)} readOnly/>
                                    </div> */}
                                                                        
                                </div>
                                
                            </div>


                        </div>

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-green-600 hover:bg-green-500'>
                                Update Product
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
