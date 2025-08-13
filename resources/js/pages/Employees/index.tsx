import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];


export default function Index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pegawai" />

            {can('roles.view') && (
                <div className="flex-col rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                    <Heading title="Data Pegawai" />

                    
                </div>
            )}
        </AppLayout>
    );
}
