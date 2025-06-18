import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage} from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Trash } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incisor',
        href: '/incisors',
    },
];

interface Incisor{
    id: number;
    lok_toreh: string;
    name: string;
    ttl: string;
    gender: string;
    agama: string;
    no_invoice: string;
}

interface PageProps{
    flash:{
        message?: string
    }, 
    incisors: Incisor[]
}

export default function admin() {

    const { incisors, flash } =usePage().props as PageProps;

    const {processing, delete: destroy} = useForm();
        
    const handleDelete = (id:number, name:string) => {
        if(confirm(`Do you want delete this  - ${id}. ${name} ` )){
            destroy(route('notas.destroy', id))
        }
    }
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incisor" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Incisor'/>

                <div className='border h-auto p-3 rounded-lg'>

                    {/* {can('usermanagements.create') &&  */}
                        <div className='w-full mb-2 justify-end h-auto flex gap-2'>
                            <Link href={route('incisors.create')}>
                                <Button className='bg-blue-600 w-32 hover:bg-blue-500 text-white'>
                                    <CirclePlus />
                                    Add Penoreh
                                </Button>
                            </Link>
                        </div>
                    
                    {/* } */}

                    <div>
                        {flash.message && (
                            <Alert>
                                <Megaphone className='h4-w4' />
                                <AlertTitle className='text-green-600'>
                                    Notification
                                </AlertTitle>
                                <AlertDescription>
                                    {flash.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <CardContent className='border rounded-lg'>
                        <div className="rounded-md">
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>NAME</TableHead>
                                        <TableHead>Tanggal Lahir</TableHead>
                                        <TableHead>Jenis Kelamin</TableHead>
                                        <TableHead>Agama</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead className="text-center">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>

                                    <TableBody>
                                        {incisors.map((incisors) =>
                                            <TableRow>
                                                <TableCell>{incisors.no_invoice}</TableCell>
                                                <TableCell>{incisors.name}</TableCell>
                                                <TableCell>{incisors.ttl}</TableCell>
                                                <TableCell>{incisors.gender}</TableCell>
                                                <TableCell>{incisors.agama}</TableCell>
                                                <TableCell> 
                                                    {incisors.lok_toreh}     
                                                </TableCell>
                                                
                                                <TableCell className="text-center space-x-2">
                                                    
                                                        <Link href={route('incisors.show', incisors.id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Eye color='gray'/>
                                                            </Button>
                                                        </Link>
                                                    
                                                        <Link href={route('incisors.edit', incisors.id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Pencil color='blue'/>
                                                            </Button>
                                                        </Link>

                                                        <Button disabled={processing} onClick={() => handleDelete(incisors.id, incisors.name)} className='bg-transparent hover:bg-gray-700'>
                                                            <Trash color='red'/>
                                                        </Button>

                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                
                            </Table>
                            

                        </div>
                    </CardContent>
                </div>
                
            </div>



        </AppLayout>
    );
}
