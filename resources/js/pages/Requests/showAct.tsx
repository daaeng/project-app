import Heading from '@/components/heading';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Tag from '@/components/ui/tag';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Image, Undo2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasis',
        href: '/Administrasis',
    },
];

interface Requested{
    id: number,
    name: string,
    date: string,
    devisi: string,
    j_pengajuan: string,
    mengetahui: string,
    desk: string,
    dana: string,
    status: string,
    file: string,
}

interface props{
    requests : Requested
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function index({requests} : props) {

    const {data, setData, } = useForm({

        name: requests.name,
        date: requests.date,
        devisi: requests.devisi,
        j_pengajuan: requests.j_pengajuan,
        mengetahui: requests.mengetahui,
        desk: requests.desk,
        dana: requests.dana,
        status: requests.status,
        file: requests.file,

    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Request" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Edit Pengajuan'/>

                <Link href={route('administrasis.index')}>
                    <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                        <Undo2 />
                        Back
                    </Button>
                </Link>

                <div className='w-full p-4'>

                    <form className='space-y-3 w-auto grid grid-cols-2 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Name'> Name </Label>
                                <Input placeholder='Yang mengajukan' value={data.name} onChange={(e) => setData('name', e.target.value)} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Devisi'> Devisi </Label>
                                <Input placeholder='Devisi' value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Pengajuan'> Jenis Pengajuan </Label>
                                <Input placeholder='Jenis Pengajuan' value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)} readOnly />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Mengetahui'> Mengetahui </Label>
                                <Input placeholder='Mengetahui' value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} readOnly />
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)}readOnly />
                            </div>  
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Status </Label>
                                <div>
                                    <Tag status={data.status} />
                                </div>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Dana'> Dana </Label>
                                <div className='flex'>
                                    
                                    <Input placeholder='Dana' value={formatCurrency(data.dana)} onChange={(e) => setData('dana', e.target.value)} readOnly />
                                </div>
                            </div>                    

                        </div>

                        <div>
                            
                            <div className='gap-2'>
                                <Label htmlFor='Foto Nota'> Screan Shot (SS) </Label>
                                <div className='flex'>
                                    <Image className='p-1'/> 

                                    {data.file && (
                                        <a 
                                            href={`/storage/${data.file.replace('storage/', '')}`} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src={`/storage/${data.file.replace('storage/', '')}`} 
                                                alt={data.name || 'Nota'}
                                                className="h-100 object-contain"
                                            />
                                        </a>
                                    )}
                                    {/* <img 
                                    src={`/storage/${data.file.replace('storage/', '')}`} 
                                    alt={data.name || 'Nota'}
                                    className="h-100 object-contain"
                                    /> */}
                                </div>
                            </div> 
                        </div>

                    </form>
                </div>
            </div>

        </AppLayout>
    );
}
