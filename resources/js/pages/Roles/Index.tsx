import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Trash } from 'lucide-react';
import { can } from '@/lib/can';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface Role {
    id : number,
    name : string,
    permissions : string,

}

interface PageProps{
    flash:{
        message?: string
    }, 
    roles: Role[]
}

export default function index({ roles,  flash } : PageProps) {

    const {processing, delete: destroy} = useForm();
    
    const handleDelete = (id:number, name:string) => {
        if(confirm(`Do you want delete this  - ${id}. ${name} ` )){
            destroy(route('roles.destroy', id))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Roles User Management'/>

                <div className='border h-auto p-3 rounded-lg'>

                    {can('roles.create') && 
                    
                        <div className='w-full mb-2 justify-end h-auto flex gap-2'>
                            <Link href={route('roles.create')}>
                                <Button className='bg-blue-600 w-25 hover:bg-blue-500 text-white'>
                                    <CirclePlus />
                                    User
                                </Button>
                            </Link>
                        </div>
                    }

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
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permission</TableHead>
                                    
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                {roles.map(({id, name, permissions}) =>
                                    <TableBody>

                                        <TableRow>
                                            <TableCell>{id}</TableCell>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>
                                                {permissions.map((permission) =>
                                                    <span className='mr-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg p-1.5 w-auto'>
                                                        {permission.name}
                                                    </span>
                                                
                                                )}
                                            </TableCell>
                                            
                                            <TableCell className="text-center space-x-2">
                                                
                                                {can('roles.view') &&
                                                    <Link href={route('roles.show', id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Eye color='gray'/>
                                                        </Button>
                                                    </Link>
                                                }
                                                
                                                {can('roles.edit') && 
                                                    <Link href={route('roles.edit', id)}>
                                                        <Button className='bg-transparent hover:bg-gray-700'>
                                                            <Pencil color='blue'/>
                                                        </Button>
                                                    </Link>
                                                
                                                }
                                                
                                                {can('roles.delete') && 
                                                    <Button disabled={processing} onClick={() => handleDelete(id, name)} className='bg-transparent hover:bg-gray-700'>
                                                        <Trash color='red'/>
                                                    </Button>
                                                
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                            

                        </div>
                    </CardContent>
                </div>

                
            </div>



        </AppLayout>
    );
}
