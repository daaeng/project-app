import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Undo2, Loader2, FileSignature, Info } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Tambah Kasbon Pegawai', href: route('kasbons.create_pegawai') },
];

interface EmployeeOption {
    id: number;
    label: string;
    salary: number;
}

interface PageProps {
    employees: EmployeeOption[];
    flash: {
        message?: string;
        error?: string;
    };
    errors: Record<string, string>;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function CreateKasbonPegawai({ employees, flash, errors: pageErrors }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        kasbon: 0,
        reason: '',
    });

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find(e => String(e.id) === employeeId) || null;
        setSelectedEmployee(employee);
        setData(prevData => ({
            ...prevData,
            employee_id: employeeId,
            kasbon: employee ? employee.salary : 0,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kasbons.store_pegawai'), {
            onSuccess: () => reset('kasbon', 'reason', 'employee_id'),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kasbon Pegawai" />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Buat Kasbon Pegawai" description="Isi formulir untuk membuat pengajuan kasbon baru untuk pegawai." />
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {flash.error && (
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="employee_id">Pilih Pegawai</Label>
                                    <Select onValueChange={handleEmployeeChange} value={data.employee_id}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Pegawai..." /></SelectTrigger>
                                        <SelectContent>
                                            {employees.map((employee) => (
                                                <SelectItem key={employee.id} value={String(employee.id)}>{employee.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && <p className="text-sm text-destructive mt-1">{errors.employee_id}</p>}
                                </div>

                                <div className={cn(!data.employee_id && "opacity-50 pointer-events-none")}>
                                    <Label htmlFor="kasbon">Jumlah Kasbon (IDR)</Label>
                                    <Input
                                        id="kasbon"
                                        type="number"
                                        placeholder="0"
                                        value={data.kasbon}
                                        onChange={(e) => setData('kasbon', parseFloat(e.target.value) || 0)}
                                        className="text-2xl font-bold h-14"
                                    />
                                    {errors.kasbon && <p className="text-sm text-destructive mt-1">{errors.kasbon}</p>}
                                </div>

                                <div className={cn(!data.employee_id && "opacity-50 pointer-events-none")}>
                                    <Label htmlFor="reason">Alasan (Opsional)</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Contoh: Untuk kebutuhan mendesak..."
                                        value={data.reason || ''}
                                        onChange={(e) => setData('reason', e.target.value)}
                                    />
                                    {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                             <Card className="bg-slate-800 text-white">
                                <CardHeader>
                                    <CardTitle className="text-white">Informasi Gaji</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-slate-400">Gaji Pokok</p>
                                        <p className="text-3xl font-bold">
                                            {selectedEmployee ? formatCurrency(selectedEmployee.salary) : '-'}
                                        </p>
                                        <p className="text-xs text-slate-400">Ini adalah batas maksimal kasbon.</p>
                                    </div>
                                </CardContent>
                            </Card>
                             <Button type="submit" disabled={processing || !data.employee_id} className="w-full text-lg py-6">
                                {processing ? <Loader2 className="animate-spin mr-2" /> : <FileSignature className="mr-2" />}
                                {processing ? 'Menyimpan...' : 'Ajukan Kasbon'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
