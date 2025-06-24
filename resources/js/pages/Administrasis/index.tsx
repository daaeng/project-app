import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage} from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasi',
        href: '/administrasis',
    },
];

interface Request{
    id: number;
    date: string;
    devisi: string;
    j_pengajuan: string;
    dana: string;
    status: string;
    
}

interface Nota{
    id: number;
    name: string;
    date: string;
    devisi: string;
    desk: string;
    dana: string;
    status: string;
    
}

interface PageProps{
    requests : Request[];
    notas: Nota[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
    }).format(value);
};

export default function admin() {

     const { requests, notas } =usePage().props as PageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administrasi" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Administrasi'/>

                <div className='w-full gap-2 grid grid-cols-2 p-1'>
                    
                    <div className='border rounded-xl w-full gap-2 p-2'>
                        <div className='font-bold mb-3'>
                            Administrasi Request Latter
                        </div>
                        <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Devisi</TableHead>
                                        <TableHead>Jenis Pengajuan</TableHead>
                                        <TableHead>Dana</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                            {requests.map((requests) =>
                            
                                <TableBody>
                                        <TableRow>
                                            <TableCell>{requests.date}</TableCell>
                                            <TableCell>{requests.devisi}</TableCell>
                                            <TableCell>{requests.j_pengajuan}</TableCell>
                                            <TableCell>{requests.dana}</TableCell>
                                            <TableCell>
                                                <Tag status={requests.status} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                {can('administrasis.view') && 
                                                    <Link href={route('requests.showAct', requests.id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                }
                                                
                                                {can('administrasis.edit') && 
                                                    <Link href={route('requests.editAct', requests.id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                }
                                                
                                            </TableCell>
                                        </TableRow>
                                    
                                </TableBody>
                            )}
                        </Table>
                    </div>

                    <div className='border rounded-xl w-full gap-2 '>
                        <div className='p-2'>
                            <div className='font-bold mb-3'>
                                Administrasi Nota / Kwitansi
                            </div>
                            <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Devisi</TableHead>
                                            <TableHead>Dana</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                {notas.map((notas) =>
                                
                                    <TableBody>
                                            <TableRow>
                                                <TableCell>{notas.name}</TableCell>
                                                <TableCell>{notas.date}</TableCell>
                                                <TableCell>{notas.devisi}</TableCell>
                                                <TableCell>{formatCurrency(notas.dana)}</TableCell>
                                                <TableCell>
                                                    <Tag status={notas.status} />
                                                </TableCell>
                                                
                                                <TableCell className="text-center space-x-2">
                                                    {can('administrasis.view') && 
                                                        <Link href={route('notas.showAct', notas.id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Eye color='gray'/>
                                                            </Button>
                                                        </Link>
                                                    }

                                                    {can('administrasis.edit') && 
                                                        <Link href={route('notas.editAct', notas.id)}>
                                                            <Button className='bg-transparent hover:bg-gray-700'>
                                                                <Pencil color='blue'/>
                                                            </Button>
                                                        </Link>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </div>
                    </div>

                </div>

                
            </div>



        </AppLayout>
    );
}
