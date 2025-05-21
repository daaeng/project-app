import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { CirclePlus } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/usermanagements',
    },
];

export default function admin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='User Management'/>

                <div className='bg-gray-300 h-auto p-3 rounded-lg'>

                    <div className='w-full justify-end h-auto flex gap-2'>
                        <Link href={''}>
                            <Button className='bg-blue-600 w-25 hover:bg-blue-500 text-white'>
                                <CirclePlus />
                                User
                            </Button>
                        </Link>
                    </div>
                </div>

                
            </div>



        </AppLayout>
    );
}
