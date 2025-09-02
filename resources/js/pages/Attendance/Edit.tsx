import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Heading from '@/components/heading';
import { format } from 'date-fns';

// Definisikan tipe data untuk props
interface Employee {
    id: number;
    name: string;
}

interface Attendance {
     id: number;
    employee_id: number;
    clock_in_time: string;
    clock_out_time: string | null;
    status: string;
    notes: string | null;
}

interface PageProps {
    attendance: Attendance;
    employees: Employee[];
}

export default function EditAttendancePage({ attendance, employees }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Edit Absensi', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        employee_id: String(attendance.employee_id),
        attendance_date: format(new Date(attendance.clock_in_time), 'yyyy-MM-dd'),
        clock_in_time: format(new Date(attendance.clock_in_time), 'HH:mm'),
        clock_out_time: attendance.clock_out_time ? format(new Date(attendance.clock_out_time), 'HH:mm') : '',
        status: attendance.status,
        notes: attendance.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('attendances.update', attendance.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Absensi" />
             <div className="p-4 md:p-6 min-h-screen">
                <Heading title="Edit Absensi" description={`Memperbarui data absensi untuk tanggal ${data.attendance_date}`} />
                <Card>
                    <CardHeader>
                        <CardTitle>Formulir Edit Absensi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                            <div>
                                <Label htmlFor="employee_id">Karyawan</Label>
                                <Select onValueChange={(value) => setData('employee_id', value)} value={data.employee_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Karyawan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="attendance_date">Tanggal Absensi</Label>
                                <Input
                                    type="date"
                                    id="attendance_date"
                                    value={data.attendance_date}
                                    onChange={(e) => setData('attendance_date', e.target.value)}
                                />
                                {errors.attendance_date && <p className="text-red-500 text-xs mt-1">{errors.attendance_date}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="clock_in_time">Jam Masuk</Label>
                                    <Input
                                        type="time"
                                        id="clock_in_time"
                                        value={data.clock_in_time}
                                        onChange={(e) => setData('clock_in_time', e.target.value)}
                                    />
                                    {errors.clock_in_time && <p className="text-red-500 text-xs mt-1">{errors.clock_in_time}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="clock_out_time">Jam Pulang</Label>
                                    <Input
                                        type="time"
                                        id="clock_out_time"
                                        value={data.clock_out_time}
                                        onChange={(e) => setData('clock_out_time', e.target.value)}
                                    />
                                    {errors.clock_out_time && <p className="text-red-500 text-xs mt-1">{errors.clock_out_time}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status">Status Kehadiran</Label>
                                <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hadir">Hadir</SelectItem>
                                        <SelectItem value="Izin">Izin</SelectItem>
                                        <SelectItem value="Sakit">Sakit</SelectItem>
                                        <SelectItem value="Alpha">Alpha</SelectItem>
                                        <SelectItem value="Cuti">Cuti</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>

                            <div>
                                <Label htmlFor="notes">Catatan (Opsional)</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                 <Link href={route('attendances.index')}>
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
