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
    user : User,
    userRoles: string[] // Menambahkan userRoles ke antarmuka props
}

export default function index({user, userRoles} : props) { // Mendestrukturisasi userRoles dari props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Users" />

            <div className="h-full flex-col rounded-xl p-4 bg-gray-50 dark:bg-black">
            
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
                        <div className='space-y-2'>
                            <div className='gap-2 w-2xs'>
                                <Label htmlFor=' Name'> Name </Label>
                                <Input placeholder=' Name' value={user.name} readOnly />
                            </div>
                            
                            <div className='gap-2 w-2xs'>
                                <Label htmlFor='Email'> Email </Label>
                                <Input type='email' placeholder='Email' value={user.email} readOnly/>
                            </div>

                            <div className='w-fit'>
                                <Label htmlFor='Email'> Role </Label>
                                <div className='w-full gap-2 mt-1'> {/* Menambahkan flex dan gap untuk penataan gaya */}
                                    {userRoles.map((roleName, index) => ( // Mengulang userRoles untuk menampilkan setiap nama peran
                                        <span key={index} className='mr-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg p-1.5 w-auto'> 
                                            {roleName} 
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </AppLayout>
    );
}
