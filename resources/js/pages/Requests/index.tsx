import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { CirclePlus } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request',
        href: '/requests',
    },
];

export default function admin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Request" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Request'/>

                <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                    <Link href={route('requests.create')}>
                        <Button className='bg-yellow-600 w-25 hover:bg-yellow-500'>
                            <CirclePlus />
                            Form
                        </Button>
                    </Link>
                </div>

                <div className='font-bold'>
                    Submission Report
                </div>
                
            </div>



        </AppLayout>
    );
}
