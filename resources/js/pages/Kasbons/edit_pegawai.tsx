import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Undo2, Megaphone, User, FileText, Wallet, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- INTERFACES ---
interface EmployeeOption {
    id: number;
    label: string; // NIP - Nama
    salary: number;
}
interface KasbonData {
    id: number;
    kasbonable_id: number;
    kasbon: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string | null;
    owner: {
        name: string;
        employee_id: string; // NIP
        position: string;
        salary: number;
    };
}
interface PageProps {
    kasbon: KasbonData;
    employees: EmployeeOption[];
    statuses: string[];
    flash: {
        message?: string;
        error?: string;
    };
    errors: any;
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
        return "Rp 0";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// --- MAIN COMPONENT ---
export default function EditKasbonPegawai() {
    const { kasbon, employees, statuses, flash } = usePage().props as PageProps;

    const { data, setData, put, processing, errors } = useForm({
        employee_id: String(kasbon.kasbonable_id),
        kasbon: kasbon.kasbon,
        status: kasbon.status,
        reason: kasbon.reason || '',
    });

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | undefined>(
        employees.find(e => e.id === kasbon.kasbonable_id)
    );

    useEffect(() => {
        const employee = employees.find(e => e.id === Number(data.employee_id));
        setSelectedEmployee(employee);
    }, [data.employee_id, employees]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEmployee && data.kasbon > selectedEmployee.salary) {
            // Error handling can be improved, but for now, we rely on backend validation
        }
        put(route('kasbons.update', kasbon.id), {
            preserveScroll: true,
        });
    };

    const dynamicBreadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasbon', href: '/kasbons' },
        { title: `Edit Kasbon Pegawai #${kasbon.id}`, href: route('kasbons.edit', kasbon.id) },
    ];

    return (
        <AppLayout breadcrumbs={dynamicBreadcrumbs}>
            <Head title={`Edit Kasbon Pegawai #${kasbon.id}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title={`Edit Kasbon Pegawai`} description={`Mengubah data untuk kasbon #${kasbon.id}`} />
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* --- FLASH MESSAGES & ERRORS --- */}
                {flash.message && <Alert variant="success"><Megaphone className='h-4 w-4' /><AlertTitle>Berhasil!</AlertTitle><AlertDescription>{flash.message}</AlertDescription></Alert>}
                {flash.error && <Alert variant="destructive"><Megaphone className='h-4 w-4' /><AlertTitle>Gagal!</AlertTitle><AlertDescription>{flash.error}</AlertDescription></Alert>}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* --- Kolom Kiri: Form Edit --- */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Formulir Edit Kasbon</CardTitle>
                                <CardDescription>Silakan perbarui data yang diperlukan di bawah ini.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Employee Select */}
                                    <div>
                                        <Label htmlFor="employee_id">Pegawai</Label>
                                        <Select onValueChange={(value) => setData('employee_id', value)} value={data.employee_id}>
                                            <SelectTrigger><SelectValue placeholder="Pilih Pegawai" /></SelectTrigger>
                                            <SelectContent>
                                                {employees.map((employee) => (
                                                    <SelectItem key={employee.id} value={String(employee.id)}>{employee.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
                                    </div>

                                    {/* Kasbon Amount & Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="kasbon">Jumlah Kasbon (IDR)</Label>
                                            <Input id="kasbon" type="number" placeholder="Rp 0" value={data.kasbon}
                                                onChange={(e) => setData('kasbon', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors.kasbon && <p className="text-red-500 text-sm mt-1">{errors.kasbon}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select onValueChange={(value) => setData('status', value as any)} value={data.status}>
                                                <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>
                                    </div>

                                    {/* Reason Textarea */}
                                    <div>
                                        <Label htmlFor="reason">Alasan (Opsional)</Label>
                                        <Textarea id="reason" placeholder="Alasan persetujuan, penolakan, atau catatan lain..." value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={processing} size="lg">
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Kolom Kanan: Info Panel --- */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle>Informasi Pegawai</CardTitle>
                                <CardDescription>Data berdasarkan pegawai yang dipilih.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Pegawai</p>
                                        <p className="font-semibold">{selectedEmployee?.label.split(' - ')[1] || 'Pilih Pegawai'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 p-3 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">NIP</p>
                                        <p className="font-semibold">{selectedEmployee?.label.split(' - ')[0] || '-'}</p>
                                    </div>
                                </div>
                                <hr className="dark:border-slate-700"/>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 p-3 rounded-lg">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Gaji Pokok (Maks. Kasbon)</p>
                                        <p className="font-semibold text-lg">{formatCurrency(selectedEmployee?.salary)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
