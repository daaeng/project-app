import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { Undo2 } from 'lucide-react';
import { permission } from 'process';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Show',
        href: '/roles',
    },
];

export default function Edit({role, permissions}) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Show" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Role Show Users'/>

                <div className='w-full h-auto'>
                    <Link href={route('roles.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full p-4'>

                    <form className='space-y-3 gap-2'>

                        <div className='space-y-2 w-100'>
                            <div className='gap-2'>
                                <Label htmlFor=' Name'> Name </Label>
                                <Input placeholder='Enter Name' value={role.name} readOnly/>
                            </div>
                        </div>

                        <div className='space-y-2 w-100'>
                            <div className='gap-2'>
                                <Label htmlFor=' Permission'> Permission </Label>
                                {permissions.map((permission) =>
                                    <span className='mr-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg p-1.5 wauto'>
                                        {permission}
                                    </span>
                                )}
                            </div>
                        </div>

                    </form>
                    
                </div>

                

            </div>


        </AppLayout>
    );
}
