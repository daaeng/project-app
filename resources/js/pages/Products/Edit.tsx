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
import React, { useEffect } from 'react'; // Import useEffect

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
    });

    // --- START: Logika Perhitungan Otomatis ---
    useEffect(() => {
        // Mengambil nilai qty dan price, jika kosong atau bukan angka, dianggap 0
        const qty = parseFloat(data.qty_kg) || 0;
        const price = parseFloat(data.price_qty) || 0;
        
        // Melakukan kalkulasi sesuai rumus: qty * price * 40%
        const calculatedAmount = qty * price * 0.40;
        
        // Memperbarui state 'amount' dengan hasil kalkulasi
        // .toFixed(2) untuk membatasi hasil menjadi 2 angka desimal
        setData('amount', calculatedAmount.toFixed(2));

    }, [data.qty_kg, data.price_qty]); // Hook ini akan berjalan setiap kali nilai qty_kg atau price_qty berubah
    // --- END: Logika Perhitungan Otomatis ---

    const handleUpdate = (e: React.FormEvent) =>{
        e.preventDefault();
        put(route('products.update', product.id));
    }

    return (
        <AppLayout breadcrumbs={[{title: 'Edit Data Product', href:`/product/${product.id}/edit`}]}>
            <Head title="Edit Product" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Edit Data Product'/>

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
                                            {message as string}
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
                                <Input placeholder='Product Name' value={data.product} readOnly className="bg-gray-100 dark:bg-gray-800"/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} readOnly className="bg-gray-100 dark:bg-gray-800"/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> No. Invoice </Label>
                                <Input placeholder='Invoice' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Supplier </Label>
                                <select value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled>Pilih Supplier</option>
                                    <option value="Sebayar">Sebayar</option>
                                    <option value="Temadu">Temadu</option>
                                    <option value="Agro">GK Agro</option>
                                    <option value="GKA">GKA</option>
                                </select>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                <Input placeholder='Jenis Barang' value={data.j_brg} readOnly className="bg-gray-100 dark:bg-gray-800"/>
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
                            <div className='p-2 mt-3 col-span-3 bg-gray-900 rounded-md h-fit text-white'>
                                <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-3 p-2'>
                                    <div className='gap-2 sm:col-span-3'>
                                        <Label htmlFor='In'> MASUK </Label>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Quantity'> Quantity (Kg) </Label>
                                        <Input type='number' placeholder='Quantity' value={data.qty_kg} onChange={(e) => setData('qty_kg', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Price'> Price /Qty </Label>
                                        <Input type='number' placeholder='Price' value={data.price_qty} onChange={(e) => setData('price_qty', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Amount'> Amount </Label>
                                        {/* Input Amount dibuat readOnly */}
                                        <Input placeholder='Amount' value={data.amount} readOnly className="bg-gray-600"/>
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Keping'> Keping / Buah</Label>
                                        <Input type='number' placeholder='Keping' value={data.keping} onChange={(e) => setData('keping', e.target.value)} />
                                    </div>
                                    <div className='gap-2 md:col-span-1 sm:col-span-3'>
                                        <Label htmlFor='Kualitas'> Kualitas </Label>
                                        <Input placeholder='Kualitas' value={data.kualitas} onChange={(e) => setData('kualitas', e.target.value)} />
                                    </div>
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

