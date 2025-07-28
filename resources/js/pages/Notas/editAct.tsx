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
import { useState } from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasis',
        href: '/Administrasis',
    },
];

interface Nota{
    id: number,
    name: string,
    date: string,
    devisi: string,
    mengetahui: string,
    desk: string,
    status: string,
    reason: string,
    dana: number,
    file: string,
}

interface props{
    nota : Nota
}

export default function index({nota} : props) {

    const {data, setData, put, errors } = useForm({
    
        name: nota.name || '',
        date: nota.date || '',
        devisi: nota.devisi || '',
        mengetahui: nota.mengetahui || '',
        desk: nota.desk || '',
        dana: nota.dana || '',
        status: nota.status || '',
        reason: nota.reason || '',
        file: nota.file || '',

    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        put(route('notas.updateAct', nota.id), {
            onFinish: () => setIsSubmitting(false),
            // preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Nota" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Ubah Nota / Struk / Resi'/>

                <Link href={route('administrasis.index')}>
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

                    <form onSubmit={handleSubmit} className='space-y-3 w-full gap-2 grid grid-cols-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='Name'> Name </Label>
                                <Input placeholder='Yang mengajukan' value={data.name} onChange={(e) => setData('name', e.target.value)} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Devisi'> Devisi </Label>
                                <Input placeholder='Devisi' value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} readOnly/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Mengetahui'> Mengetahui </Label>
                                <Input placeholder='Mengetahui'  value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)} readOnly/>
                            </div>                        
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)} readOnly/>
                            </div>
                            
                            <div className='gap-2'>
                                <Label htmlFor='Status'> Status </Label>                                
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className='w-full border p-1 rounded-md text-destructive-foreground' required>
                                    <option value="" disabled selected>Info Status</option>
                                    <option value="belum ACC" >Process</option>
                                    <option value="ditolak" >Rejected</option>
                                    <option value="diterima" >Accepted</option>
                                </select>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Reason'> Reason </Label>
                                <Input placeholder='Reason' value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Dana'> Dana </Label>
                                <div className='flex'>
                                    <div className='mt-1'>
                                        Rp.     
                                    </div>
                                    <Input placeholder='Dana' value={data.dana} onChange={(e) => setData('dana', e.target.value)} />
                                </div>
                            </div>
                            

                        </div>

                        <div className='gap-2'>
                            <Label htmlFor='Foto Nota'> Foto Nota </Label>
                            <div>
                                <div className='flex'>
                                    <Image className='p-1'/> 
                                    Tidak Dapat Ubah Gambar
                                </div>
                                {data.file && (
                                    <a 
                                        href={`/storage/${data.file.replace('storage/', '')}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img 
                                            src={`/storage/${data.file.replace('storage/', '')}`} 
                                            alt={data.name || 'Nota'}
                                            className="h-140 object-contain"
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

                        <div className=''>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={isSubmitting ? 'opacity-50' : '' + 'bg-green-600 hover:bg-green-500'} 
                            >
                                Update Nota
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
