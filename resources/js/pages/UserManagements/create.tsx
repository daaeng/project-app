import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Undo2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Users',
        href: '/usermanagements',
    },
];

export default function index({ roles }) {

    const {data, setData, post, processing, errors } = useForm({

        name: '',
        email: '',
        password: '',
        roles: []

    })

    function handleCheckBox(roleName, checked) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else{
            setData('roles', data.roles.filter(name => name !== roleName))
        }
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('usermanagements.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Users" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Add Users'/>

                    <div className='w-full mb-2  h-auto'>
                        <Link href={route('usermanagements.index')}>
                            <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                                <Undo2 />
                                Back
                            </Button>
                        </Link>
                    </div>

                <div className='w-full p-4'>

                    <div className='p-4'>
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
                                <Input placeholder=' Name' value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </div>
                            
                            <div className='gap-2'>
                                <Label htmlFor='Email'> Email </Label>
                                <Input type='email' placeholder='Email' value={data.email} onChange={(e) => setData('email', e.target.value)}/>
                            </div>
                            <div className='gap-2'>
                                <Label htmlFor='Password'> Password </Label>
                                <Input type='password' placeholder='Password' value={data.password} onChange={(e) => setData('password', e.target.value)}/>
                            </div>

                            <div className='space-y-2 w-100'>
                                <div className='gap-2'>
                                    <Label htmlFor=' roles'> Roles </Label>
                                    
                                    {roles.map((role) =>
                                        <div className='flex gap-2' key={role}>
                                            <Input 
                                                type='checkbox' 
                                                value={'role'} 
                                                onChange={(e) => handleCheckBox(role, e.target.checked)}
                                                id={role} 
                                                className='form-checkbox rounded focus:ring-2 h-5 w-5  text-blue-600' />
                                            <span> {role} </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        <div className=''>
                            <Button type='submit' disabled={processing} className='bg-green-600 hover:bg-green-400'>
                                Add User
                            </Button>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
