import Heading from '@/components/heading';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
// import { CircleAlert } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Request',
        href: '/requests?create',
    },
];

export default function index() {

    // const {data, setData, post, processing, errors } = useForm({

    //     product: '',
    //     date: '',
    //     no_invoice: '',
    //     nm_supplier: '',
    //     j_brg: '',
    //     desk: '',
    //     qty_kg: '',
    //     price_qty: '',
    //     amount: '',
    //     qty_out: '',
    //     price_out: '',
    //     amount_out: '',

    // })

    // //change products -> requests
    // const handleSubmit = (e: React.FormEvent) =>{
    //     e.preventDefault();
    //     post(route('products.store'));
    // }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Request" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Create Request'/>

                <div className='w-full p-4'>

                    {/* {Object.keys(errors). length > 0 && (
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
                    )} */}

                    <form className='space-y-3 grid grid-cols-2 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Product Name'> Product </Label>
                                {/* <Input placeholder='Product Name' value={''} onChange={(e) => setData('product', e.target.value)} /> */}
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                {/* <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)}/> */}
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> No. Invoice </Label>
                                {/* <Input placeholder='Invoice' value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)} /> */}
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Name Supplier </Label>
                                {/* <Input placeholder='Name Supplier' value={data.nm_supplier} onChange={(e) => setData('nm_supplier', e.target.value)} /> */}
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Jenis Barang </Label>
                                {/* <Input placeholder='Jenis Barang' value={data.j_brg} onChange={(e) => setData('j_brg', e.target.value)}/> */}
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                {/* <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)}/> */}
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
