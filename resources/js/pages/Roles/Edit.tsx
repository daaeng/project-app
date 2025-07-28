import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';
import { permission } from 'process';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Edit',
        href: '/roles',
    },
];

export default function Edit({role, rolePermissions, permissions}) {

    const {data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        permissions : rolePermissions || [] 
    })

    function handleCheckBox(permissionName, checked) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else{
            setData('permissions', data.permissions.filter(name => name !== permissionName))
        }
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        put(route('roles.update', role.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Edit" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Role Edit Users'/>

                <div className='w-full h-auto'>
                    <Link href={route('roles.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full p-4'>

                    <div className=''>
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

                    </div>

                    <form onSubmit={handleSubmit} className='space-y-3 gap-2'>

                        <div className='space-y-2 w-100'>
                            <div className='gap-2'>
                                <Label htmlFor=' Name'> Name </Label>
                                <Input placeholder='Enter Name' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </div>
                        </div>

                        <div className='space-y-2 w-100'>
                            <div className='gap-2'>
                                <Label htmlFor=' Permission'> Permission </Label>
                                
                                {permissions.map((permission) =>
                                    <div className='flex gap-2' key={permission}>
                                        <Input 
                                            type='checkbox' 
                                            value={'permission'} 
                                            checked={data.permissions.includes(permission)}
                                            onChange={(e) => handleCheckBox(permission, e.target.checked)}
                                            id={permission} 
                                            className='form-checkbox rounded focus:ring-2 h-5 w-5  text-blue-600' />
                                        <span> {permission} </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-amber-600 hover:bg-amber-400'>
                                Update Role
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
