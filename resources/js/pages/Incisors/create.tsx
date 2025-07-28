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
    {
        title: 'Incisor',
        href: '/incisors',
    },
];

export default function index() {

    const {data, setData, post, processing, errors } = useForm({

        name: '',
        ttl: '',
        gender: '',
        address: '',
        agama: '',
        status: '',
        no_invoice: '',
        lok_toreh: '',

    })

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('incisors.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incisor" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Tambah Penoreh'/>

                <div className='w-full  h-auto'>
                    <Link href={route('incisors.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full p-4'>

                    <div className='p-4'>
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

                    </div>

                    <p className='text-red-600' style={{ fontSize:12 }}>
                        *Mohon data harus sama dengan KTP
                    </p>

                    <form onSubmit={handleSubmit} className='space-y-3 gap-2'>

                        <div className='space-y-2 w-3xl gap-5 grid grid-cols-2'>
                            <div>

                                <div className='gap-2'>
                                    <Label htmlFor=' Name'> Nama </Label>
                                    <Input placeholder=' Nama' 
                                        value={data.name} onChange={(e) => setData('name', e.target.value)} 
                                    />
                                </div>
                                
                                <div className='gap-2'>
                                    <Label htmlFor='TTL'> Tempat, Tanggal Lahir </Label>
                                    <Input type='date' placeholder='TTL' 
                                        value={data.ttl} onChange={(e) => setData('ttl', e.target.value)}
                                    />
                                </div>

                                <div className='gap-2'>
                                    <Label htmlFor='Jenis Kelamin'> Jenis Kelamin </Label>
                                    {/* <Input placeholder='Product Name' value={data.product} onChange={(e) => setData('product', e.target.value)} /> */}
                                    <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                        <option value="" disabled selected>Pilih Jenis Kelamin</option>
                                        <option value="Laki - laki" >Laki - laki</option>
                                        <option value="Perempuan" >Perempuan</option>
                                    </select>
                                </div>

                                <div className='gap-2'>
                                    <Label htmlFor='Alamat'> Alamat </Label>
                                    <Textarea placeholder='Alamat' 
                                        value={data.address} onChange={(e) => setData('address', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className='gap-2'>
                                    <Label htmlFor='Agama'> Agama </Label>
                                    <Input placeholder='Agama' 
                                        value={data.agama} onChange={(e) => setData('agama', e.target.value)}
                                    />
                                </div>
                                <div className='gap-2'>
                                    <Label htmlFor='Ststus'> Status </Label>
                                    <Input placeholder='Status' 
                                        value={data.status} onChange={(e) => setData('status', e.target.value)}
                                    />
                                </div>
                                <div className='gap-2'>
                                    <Label htmlFor='Kode Penoreh'> Kode Penoreh </Label>
                                    <Input placeholder='Kode Penoreh, ex: B.P0001' 
                                        value={data.no_invoice} onChange={(e) => setData('no_invoice', e.target.value)}
                                    />
                                </div>

                                <div className='gap-2'>
                                    <Label htmlFor='Lokasi'> Lokasi </Label>
                                    {/* <Input placeholder='Product Name' value={data.product} onChange={(e) => setData('product', e.target.value)} /> */}
                                    <select value={data.lok_toreh} onChange={(e) => setData('lok_toreh', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                        <option value="" disabled selected>Pilih Lokasi</option>
                                        <option value="Temadu" >Temadu</option>
                                        <option value="Sebayar" >Sebayar</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                        <div className=''>
                            <Button disabled={processing} type='submit' className='bg-green-600 hover:bg-green-400'>
                                Submit
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
