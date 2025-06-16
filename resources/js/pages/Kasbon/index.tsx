import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cash Receipt',
        href: '/cashr',
    },
];

export default function admin() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cash Receipt" />

            <div className="h-full flex-col rounded-xl p-4">
            
                <Heading title='Administrasi'/>

                <div className='font-bold'>
                    Data Kasbon
                </div>

                
            </div>



        </AppLayout>
    );
}
