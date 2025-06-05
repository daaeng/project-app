import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Users',
        href: '/usermanagements',
    },
];

interface User{
    id: number,
    name: string,
    email: string,
    password: string,
}

interface props{
    user : User
}

export default function index({user} : props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Users" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Edit Users'/>

                <div className='w-full mb-2  h-auto'>
                    <Link href={route('usermanagements.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full p-4'>
                    <form className='space-y-3 gap-2'>
                        <div className='space-y-2 w-2xs'>
                            <div className='gap-2'>
                                <Label htmlFor=' Name'> Name </Label>
                                <Input placeholder=' Name' value={user.name} readOnly />
                            </div>
                            
                            <div className='gap-2'>
                                <Label htmlFor='Email'> Email </Label>
                                <Input type='email' placeholder='Email' value={user.email} readOnly/>
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </AppLayout>
    );
}
