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
        title: 'Edit Request',
        href: '/requests?edit',
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
    dana: number,
    file: string,
}

interface props{
    requests : Requested
}

export default function index({requests} : props) {

    const {data, setData, put, processing, errors } = useForm({

        name: requests.name || '',
        date: requests.date || '',
        devisi: requests.devisi || '',
        j_pengajuan: requests.j_pengajuan || '',
        mengetahui: requests.mengetahui || '',
        desk: requests.desk || '',
        dana: requests.dana || '',
        file: requests.file || '',

    })

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        put(route('requests.update', requests.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Request" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Edit Pengajuan'/>

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

                    <form onSubmit={handleSubmit} className='space-y-3 w-auto grid grid-cols-2 gap-2'>

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

                        <div className='gap-2'>
                            <Label htmlFor='Foto Nota'> Screan Shot (SS) </Label>
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
                                            className="h-100 object-contain"
                                        />
                                    </a>
                                )}
{/*                                 
                                <img 
                                src={`/storage/${data.file.replace('storage/', '')}`} 
                                alt={data.name || 'Nota'}
                                className="h-100 object-contain"
                                /> */}
                            </div>
                        </div> 

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-green-600 hover:bg-green-500'>
                                Update
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}


// import Heading from '@/components/heading';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { CircleAlert, Image, Undo2 } from 'lucide-react';
// import { useState } from 'react';


// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Edit Form',
//         href: '/requests?',
//     },
// ];



// export default function index({requested} : props) {

//     const {data, setData, put, errors } = useForm({
    
//         name: requested.name || '',
//         date: requested.date || '',
//         devisi: requested.devisi || '',
//         j_pengajuan: requested.j_pengajuan || '',
//         mengetahui: requested.mengetahui || '',
//         desk: requested.desk || '',
//         file: requested.file || '',

//     })

//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         put(route('requests.update', requested.id), {
//             onFinish: () => setIsSubmitting(false),
//             // preserveScroll: true
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Edit Form" />

//             <div className="h-full flex-col rounded-xl p-4">
            
//                 <Heading title='Ubah Form'/>

//                 <Link href={route('requests.index')}>
//                     <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
//                         <Undo2 />
//                         Back
//                     </Button>
//                 </Link>

//                 <div className='w-full p-4'>

//                     {Object.keys(errors). length > 0 && (
//                         <Alert>
//                             <CircleAlert className='h-4 w-4'/>
//                             <AlertTitle className='text-red-600'>
//                                 Errors...!
//                             </AlertTitle>
//                             <AlertDescription>
//                                 <ul>
//                                     {Object.entries(errors).map(([key, message]) =>
//                                         <li key={key}>
//                                             {message as string  }
//                                         </li>
//                                     )}
//                                 </ul>
//                             </AlertDescription>
//                         </Alert>
//                     )}

//                     <form onSubmit={handleSubmit} className='space-y-3 w-full gap-2 grid grid-cols-2'>

//                         <div className='space-y-2'>
//                             <div className='gap-2'>
//                                 <Label htmlFor='Name'> Name </Label>
//                                 <Input placeholder='Yang mengajukan' value={data.name} onChange={(e) => setData('name', e.target.value)}/>
//                             </div>
//                             <div className='gap-2'>
//                                 <Label htmlFor='Tanggal'> Tanggal </Label>
//                                 <Input type='date' placeholder='Tanggal' value={data.date} onChange={(e) => setData('date', e.target.value)}/>
//                             </div>
//                             <div className='gap-2'>
//                                 <Label htmlFor='Devisi'> Devisi </Label>
//                                 <Input placeholder='Devisi' value={data.devisi} onChange={(e) => setData('devisi', e.target.value)} />
//                             </div>
//                             <div className='gap-2'>
//                                 <Label htmlFor='Jenis Pengajuan'> Jenis Pengajuan </Label>
//                                 <Input placeholder='Jenis Pengajuan' value={data.j_pengajuan} onChange={(e) => setData('j_pengajuan', e.target.value)}/>
//                             </div>
//                             <div className='gap-2'>
//                                 <Label htmlFor='Mengetahui'> Mengetahui </Label>
//                                 <Input placeholder='Mengetahui'  value={data.mengetahui} onChange={(e) => setData('mengetahui', e.target.value)}/>
//                             </div>                        
//                             <div className='gap-2'>
//                                 <Label htmlFor='Description'> Description </Label>
//                                 <Textarea placeholder='Description' value={data.desk} onChange={(e) => setData('desk', e.target.value)}/>
//                             </div>
                            

//                         </div>

//                         <div className='gap-2'>
//                             <Label htmlFor='Foto Requests'> Foto Form </Label>
//                             <div>
//                                 <div className='flex'>
//                                     <Image className='p-1'/> 
//                                     Tidak Dapat Ubah Gambar
//                                 </div>
//                                 <img 
//                                 src={`/storage/${data.file.replace('storage/', '')}`} 
//                                 alt={data.name || 'Reqeusts'}
//                                 className="h-100 object-contain"
//                                 />
//                             </div>
//                         </div>                        

//                         <div className=''>
//                             <Button 
//                                 type="submit" 
//                                 disabled={isSubmitting}
//                                 className={isSubmitting ? 'opacity-50' : ''} 
//                             >
//                                 Upload Form
//                             </Button>
//                         </div>

//                     </form>
                    
//                 </div>

                

//             </div>


//         </AppLayout>
//     );
// }
