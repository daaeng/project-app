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
        title: 'Role Create',
        href: '/roles',
    },
];

export default function Index({permissions}) {

    const {data, setData, post, processing, errors } = useForm({
        name: '',
        permissions : [] 
    })

    function handleCheckBox(permissionName: string, checked: boolean) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else{
            setData('permissions', data.permissions.filter((name: string) => name !== permissionName))
        }
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        post(route('roles.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create" />
            <div className="h-full flex-col rounded-xl p-6 bg-gray-50 dark:bg-black shadow-2xl">
                <Heading title='Create New Role' />

                <div className='w-full mb-6'>
                    <Link href={route('roles.index')}>
                        <Button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'>
                            <Undo2 className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className='w-full p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700'>

                    <div className='mb-6'>
                        {Object.keys(errors).length > 0 && (
                            <Alert className="bg-red-900/20 border border-red-800 text-red-400">
                                <CircleAlert className='h-4 w-4 text-red-500'/>
                                <AlertTitle className='font-semibold'>
                                    Errors!
                                </AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc list-inside">
                                        {Object.entries(errors).map(([key, message]) =>
                                            <li key={key}>
                                                {message as string}
                                            </li>
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Form for role creation with increased vertical spacing */}
                    <form onSubmit={handleSubmit} className='space-y-6'>

                        {/* Input field for Role Name with styled label and input for a clean look */}
                        <div className='space-y-2'>
                            <Label htmlFor='name' className="text-gray-300 text-sm font-medium">Role Name</Label>
                            <Input 
                                id='name'
                                placeholder='Enter Role Name' 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                className="bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-lg py-2 px-4 transition duration-300 ease-in-out"
                            />
                        </div>

                        {/* Section for permissions, arranged in a responsive grid for better organization */}
                        <div className='space-y-4'>
                            <Label htmlFor='permissions' className="text-gray-300 text-sm font-medium">Permissions</Label>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {permissions.map((permission: string) =>
                                    <div className='flex items-center gap-3 p-3 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition duration-200 ease-in-out cursor-pointer' key={permission}>
                                        <Input 
                                            type='checkbox' 
                                            checked={data.permissions.includes(permission)}
                                            onChange={(e) => handleCheckBox(permission, e.target.checked)}
                                            id={permission} 
                                            className='form-checkbox h-5 w-5 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 transition duration-200 ease-in-out'
                                        />
                                        <label htmlFor={permission} className="text-gray-200 text-sm cursor-pointer"> {permission} </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit button with dynamic text and enhanced styling for a prominent call to action */}
                        <div className='pt-4'>
                            <Button 
                                type='submit' 
                                disabled={processing} 
                                className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto'
                            >
                                {processing ? 'Adding Role...' : 'Add Role'}
                            </Button>
                        </div>

                    </form>
                    
                </div>
            </div>
        </AppLayout>
    );
}
