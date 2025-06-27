import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react'; // useForm and usePage are not needed for display only
import { Undo2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Edit Kasbon Baru', href: '/kasbons/create' },
];

// Interface for props is not needed if no dynamic data is received
// from the controller to automatically populate the form.
// However, if you plan to integrate this with real data in the future,
// you can add back PageProps and IncisorOption/IncisedOption.

export default function CreateKasbonSimple() { // Component name changed for distinction
    // No useForm or useState for inputs as this is display only
    // No useEffect for filtering as there's no interaction logic

    // No handleSubmit function as there's no form submission

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kasbon Baru" />

            <div className="h-full flex-col rounded-xl p-4">
                <Heading title="Edit Kasbon Baru" />
                <div className="mb-4">
                    {/* <Link href={route('kasbons.index')}>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Undo2 className="w-4 h-4" /> Kembali
                        </Button>
                    </Link> */}
                    
                    <Link href={route('kasbons.index')}>
                        <Button className='bg-auto w-25 hover:bg-accent hover:text-black'>
                            <Undo2 />
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Flash Messages section removed because this is a static display */}

                <div className='grid grid-cols-3 gap-4'>
                    <Card className="max-w-xl shadow-md">
                        <CardHeader>
                            <CardTitle>Form Edit Kasbon</CardTitle>
                            <CardDescription>Isi detail kasbon baru di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4"> {/* Form without onSubmit */}
                                {/* Incisor Select */}
                                <div>
                                    <Label htmlFor="incisor_id">Pilih Penoreh</Label>
                                    <Select
                                        // onValueChange removed
                                        // value removed
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Penoreh" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Added a dummy SelectItem with a unique non-empty value for placeholder behavior */}
                                            <SelectItem value="placeholder-incisor" disabled>Pilih Penoreh</SelectItem>
                                            {/* Example static items for display */}
                                            <SelectItem value="1">INV001 - John Doe</SelectItem>
                                            <SelectItem value="2">INV002 - Jane Smith</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* Error messages removed */}
                                </div>

                                {/* Max Kasbon Amount */}
                                <div>
                                    <Label htmlFor="kasbon">Jumlah Maximal Kasbon (IDR)</Label>
                                    <Input
                                        id="kasbon"
                                        type="number"
                                        placeholder="Jumlah kasbon" // Placeholder for display
                                        // value removed
                                        // onChange removed
                                        className="" // Error class removed
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Kasbon Amount */}
                                <div>
                                    <Label htmlFor="kasbon">Jumlah Kasbon (IDR)</Label>
                                    <Input
                                        id="kasbon"
                                        type="number"
                                        placeholder="Masukkan jumlah kasbon" // Placeholder for display
                                        // value removed
                                        // onChange removed
                                        className="" // Error class removed
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Status Select */}
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        // onValueChange removed
                                        value="Pending" // Static value for display
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Approved">Disetujui</SelectItem>
                                            <SelectItem value="Rejected">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* Error messages removed */}
                                </div>

                                {/* Reason Textarea */}
                                <div>
                                    <Label htmlFor="reason">Alasan (Opsional)</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Masukkan alasan jika diperlukan..." // Placeholder for display
                                        // value removed
                                        // onChange removed
                                        className="" // Error class removed
                                    />
                                    {/* Error messages removed */}
                                </div>

                                <Button type="button" disabled={false} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
                                    Simpan Kasbon {/* Static text */}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="max-w-xl">
                        <CardHeader>
                            <CardTitle>Informasi Penoreh</CardTitle>
                            <CardDescription>Data terisi secara otomatis.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4"> {/* Form without onSubmit */}
                                {/* Incisor Select */}
                                <div>
                                    <Label htmlFor="Nama">Nama Penoreh</Label>
                                    <Input
                                        id="Nama"
                                        placeholder="Nama Penoreh" 
                                        // value removed
                                        // onChange removed
                                        className="" // Error class removed
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Max Kasbon Amount */}
                                <div>
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        placeholder="Alamat" 
                                        // value removed
                                        // onChange removed
                                        className=""  
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Kasbon Amount */}
                                <div>
                                    <Label htmlFor="kode">Kode Penoreh</Label>
                                    <Input
                                        id="kode"
                                        placeholder="Kode Penoreh"
                                        // value removed
                                        // onChange removed
                                        className="" 
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Status Select */}
                                <div>
                                    <Label htmlFor="gaji">Pendapatan Bulan Ini</Label>
                                    <Input
                                        id="gaji"
                                        placeholder="Gaji Bulan ini"
                                        // value removed
                                        // onChange removed
                                        className="" 
                                    />
                                    {/* Error messages removed */}
                                </div>

                                {/* Reason Textarea */}
                                <div>
                                    <Label htmlFor="toreh">Total Toreh Bulan Ini</Label>
                                    <Input
                                        id="toreh"
                                        placeholder="Total Toreh Bulan Ini"  
                                        // value removed
                                        // onChange removed
                                        className="" 
                                    />
                                    {/* Error messages removed */}
                                </div>

                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
