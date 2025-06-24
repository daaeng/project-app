import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Image, Undo2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Request',
        href: '/requests?create',
    },
];

export default function index() {

    const {data, setData, post, processing, errors } = useForm({

        name: '',
        date: '',
        devisi: '',
        j_pengajuan: '',
        mengetahui: '',
        desk: '',
        dana: '',
        file: '',

    })

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('requests.surat'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Request" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Form Pengajuan'/>

                <Link href={route('requests.index')}>
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

                    <form onSubmit={handleSubmit} className='space-y-3 w-5xl gap-2 grid grid-cols-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Name'> Name </Label>
                                <Input placeholder='Yang mengajukan' value={data.name} onChange={(e) => setData('name', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Devisi'> Devisi </Label>
                                <Input placeholder='Devisi' value={data.devisi} onChange={(e) => setData('devisi', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Jenis Pengajuan'> Jenis Pengajuan </Label>
                                <Input placeholder='Jenis Pengajuan' value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Mengetahui'> Mengetahui </Label>
                                <Input placeholder='Mengetahui' value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)}/>
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Dana'> Dana </Label>
                                <div className='flex'>
                                    <div className='mt-1'>
                                        Rp.     
                                    </div>
                                    <Input placeholder='Dana' value={data.dana} onChange={(e) => setData('dana', e.target.value)}/>
                                </div>
                            </div>
                        
                        </div>
                        
                        <div>
                            <div className='gap-2'>
                                <Label htmlFor='File Pengajuan'> Foto </Label>
                                <div className='flex'>
                                    <Image className='p-1'/>
                                    <input 
                                            type="file" 
                                            onChange={(e) => setData('file', e.target.files[0])}
                                            disabled={processing}
                                            className='w-auto bg-blue-100 p-1 ml-1 rounded-xl'
                                        />
                                    {/* <Input type='file' className='bg-blue-200 p-1 w-auto' placeholder='Screen Shot File' value={data.file} onChange={(e) => setData('file', e.target.value)}/> */}
                                </div>
                                <div className='text-amber-600 ml-7' style={{ fontSize:12 }}>
                                    *Screenshots File
                                </div>
                            </div>                        

                        </div>

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-green-600 hover:bg-green-500'>
                                Add Pengajuan
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
