import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Tag from '@/components/ui/tag';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { Eye, Pencil, Trash } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrasi',
        href: '/administrasis',
    },
];

export default function admin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administrasi" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Administrasi'/>

                <div className='font-bold'>
                    Administrasi Request Latter
                </div>

                <div className=' bg-amber-300 w-full gap-2 grid grid-cols-2'>
                    
                    <div className=' bg-amber-500 w-full gap-2 p-2'>
                        <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Devisi</TableHead>
                                        <TableHead>Jenis Pengajuan</TableHead>
                                        <TableHead>Mengetahui</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>11/08/2025</TableCell>
                                            <TableCell>Accounting</TableCell>
                                            <TableCell>Pengajuan Dana</TableCell>
                                            <TableCell>Orista Miranti</TableCell>
                                            <TableCell>
                                                <Tag status={'belum ACC'} />
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                    <Link href={''}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                    <Button className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                            </TableCell>
                                        </TableRow>
                                    
                                </TableBody>
                            </Table>
                    </div>
                    <div className=' bg-amber-500 w-full gap-2 p-2 row-span-2'>
                        B
                    </div>
                    <div className=' bg-amber-500 w-full gap-2 p-2'>
                        c
                    </div>
                    <div className=' bg-amber-500 w-full gap-2 p-2 col-span-2'>
                        D
                    </div>

                </div>

                
            </div>



        </AppLayout>
    );
}
