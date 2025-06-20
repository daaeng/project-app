import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, } from '@inertiajs/react';
import { Eye, Megaphone, Pencil, Trash, Upload } from 'lucide-react';
import { can } from '@/lib/can';
import Tag from '@/components/ui/tag';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice',
        href: '/invoices',
    },
];

interface Nota {
    id : number,
    name : string,
    date : string,
    devisi : string,
    mengetahui : string,
    desk : string,
    dana : number,
    status : string,
    file : string,
}

interface PageProps{
    flash:{
        message?: string
    }, 
    notas: Nota[]
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function index() {

    const { notas, flash } =usePage().props as PageProps;

    const {processing, delete: destroy} = useForm();
    
    const handleDelete = (id:number, name:string) => {
        if(confirm(`Do you want delete this  - ${id}. ${name} ` )){
            destroy(route('notas.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Request - Upload Nota'/>

                <div className='border rounded-lg p-2'>

                    <div className='grid grid-cols-2'>
                        <div className='font-bold'>
                            Submission Report
                        </div>

                        <div className='w-full justify-end h-auto flex mb-5 gap-2'>

                            {can('notas.create') &&
                                <Link href={route('notas.up_nota')}>
                                    <Button className='bg-blue-600 w-30 hover:bg-blue-500'>
                                        <Upload />
                                        Upload Nota
                                    </Button>
                                </Link>
                            }
                        </div>

                    </div>

                    <div>
                        {flash.message && (
                            <Alert>
                                <Megaphone className='h4-w4'/>
                                <AlertTitle className='text-green-600'>
                                    Notification
                                </AlertTitle>
                                <AlertDescription>
                                    {flash.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className='border rounded-lg'>

                        {notas.length > 0 && (
                            <Table>
                                
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Devisi</TableHead>
                                        <TableHead>Mengetahui</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead>dana</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {notas.map((notas) => (

                                        <TableRow>
                                            <TableCell>{notas.name}</TableCell>
                                            <TableCell>{notas.date}</TableCell>
                                            <TableCell>{notas.devisi}</TableCell>
                                            <TableCell>{notas.mengetahui}</TableCell>
                                            <TableCell>{notas.desk}</TableCell>
                                            <TableCell>
                                                {formatCurrency(notas.dana)}
                                                {/* {notas.file && (
                                                    <a 
                                                        href={`/storage/${notas.file.replace('storage/', '')}`} 
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img 
                                                            src={`/storage/${notas.file.replace('storage/', '')}`} 
                                                            alt={notas.name || 'Nota'}
                                                            className="h-12 object-contain"
                                                        />
                                                    </a>
                                                )} */}
                                            </TableCell>
                                            <TableCell>
                                                <Tag status={notas.status} />
                                            </TableCell>
                                            <TableCell className="text-center space-x-2">
                                                {can('notas.view') && 
                                                    <Link href={route('notas.show', notas.id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                }
                                                {can('notas.edit') && 
                                                    <Link href={route('notas.edit', notas.id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                }

                                                {can('notas.delete') &&
                                                    <Button disabled={processing} onClick={() => handleDelete(notas.id, notas.name)} className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        )}
                    </div>

                </div>

                
            </div>



        </AppLayout>
    );
}
