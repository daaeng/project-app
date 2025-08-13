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
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kasbon', href: '/kasbons' },
    { title: 'Tambah Kasbon Pegawai', href: route('kasbons.create_pegawai') },
];

// --- INTERFACES ---
interface EmployeeOption {
    id: number;
    label: string;
    salary: number;
}

interface PageProps {
    employees: EmployeeOption[];
    statuses: string[];
    flash: {
        message?: string;
        error?: string;
    };
    errors: {
        employee_id?: string;
        kasbon?: string;
        status?: string;
        reason?: string;
    };
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

// --- MAIN COMPONENT ---
export default function CreateKasbonPegawai({ employees, statuses, flash, errors: pageErrors }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        kasbon: 0,
        status: 'Pending', // Default status sesuai backend
        reason: '',
    });

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);

    useEffect(() => {
        // Reset form errors when flash messages are present
        if (flash.message || flash.error) {
            reset();
        }
    }, [flash]);

    const handleEmployeeChange = (employeeId: string) => {
        const employee = employees.find(e => String(e.id) === employeeId) || null;
        setSelectedEmployee(employee);
        setData('employee_id', employeeId);
        if (employee) {
            // Set default kasbon amount to 0 or a logical value
            setData('kasbon', 0);
        } else {
            setData('kasbon', 0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Logika validasi frontend
        if (selectedEmployee && data.kasbon > selectedEmployee.salary) {
            alert('Jumlah kasbon tidak boleh melebihi gaji pokok.');
            return;
        }

        post(route('kasbons.store_pegawai'), {
            onSuccess: () => {
                // reset form and selected employee on success
                reset();
                setSelectedEmployee(null);
            },
            onError: (errors) => {
                console.error('Errors:', errors);
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kasbon Pegawai" />
            <div className="max-w-4xl mx-auto space-y-6 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Heading title="Buat Kasbon Pegawai" description="Isi formulir untuk membuat pengajuan kasbon baru untuk pegawai." />
                    <Link href={route('kasbons.index')}>
                        <Button variant="outline">
                            <Undo2 className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {(flash.error || pageErrors.kasbon || pageErrors.employee_id) && (
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>
                            {flash.error || pageErrors.kasbon || pageErrors.employee_id}
                        </AlertDescription>
                    </Alert>
                )}
                {flash.message && (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Form Inputs */}
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

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                        <SelectTrigger><SelectValue placeholder="Pilih Status..." /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status}</p>}
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

                    {/* Right Column: Information */}
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
