import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'nota Information',
        href: '/notas',
    },
];

interface Nota{
    name: string,
    date: date,
    devisi: string,
    mengetahui: string,
    desk: string,
    file: string,
}

interface props{
    nota : Nota
}

export default function edit({nota} : props) {

    const {data } = useForm({

        name: nota.name,
        date: nota.date,
        devisi: nota.devisi,
        mengetahui: nota.mengetahui,
        desk: nota.desk,
        file: nota.file,

    })

    return (
        
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="nota" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Show Data nota'/>

                <Link href={route('notas.index')}>
                    <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                        <Undo2 />
                        Back
                    </Button>
                </Link>

                <div className='w-full p-4'>

                    <form className='space-y-3 grid lg:grid-cols-2 md:grid-cols-1 gap-2'>

                        <div className='space-y-2'>
                            <div className='gap-2'>
                                <Label htmlFor='nota Name'> Name </Label>
                                <Input placeholder='nota Name' value={data.name} readOnly className='bg-gray-50'/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Tanggal'> Tanggal </Label>
                                <Input type='date' placeholder='Tanggal' value={data.date} readOnly className='bg-gray-50'/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Invoice'> Devisi </Label>
                                <Input placeholder='Invoice' value={data.devisi} readOnly className='bg-gray-50'/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Name Supplier'> Mengetahui </Label>
                                <Input placeholder='Name Supplier' value={data.mengetahui} readOnly className='bg-gray-50'/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Description'> Description </Label>
                                <Textarea placeholder='Description' value={data.desk} readOnly className='bg-gray-50'/>
                            </div>

                        </div>
                        
                        <div>

                            <div className='gap-2'>
                                <Label htmlFor='Jenis Barang'> Image </Label>
                                {/* <Input placeholder='Jenis Barang' value={data.file} readOnly className='bg-gray-50'/> */}
                                <img 
                                    src={`/storage/${data.file.replace('storage/', '')}`} 
                                    alt={data.name || 'Nota'}
                                    className="h-100 object-contain"
                                    />
                            </div>                        
                        </div>
            

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
