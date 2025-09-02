import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, FileText, Briefcase, Plane, UserCheck, UserX, BookUser, FileDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Tipe data yang dibutuhkan halaman ini
interface Employee {
    id: number;
    name: string;
}
interface AttendanceDetail {
    id: number;
    clock_in_time: string;
    clock_out_time: string | null;
    status: string;
    notes: string | null;
    employee: Employee;
}
interface IndividualReportData {
    total_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_alpha: number;
    total_cuti: number;
    total_jam_kerja: number;
    detail_absensi: AttendanceDetail[];
}
interface DaySummary {
    summary: {
        Hadir: number;
        Izin: number;
        Sakit: number;
        Alpha: number;
        Cuti: number;
    };
    details: AttendanceDetail[];
}
type AllReportData = Record<string, DaySummary>;

interface PageProps {
    reportType: 'all' | 'individual';
    reportData: IndividualReportData | AllReportData | null;
    selectedMonth: string;
    selectedEmployeeId: string | null;
    selectedEmployee: Employee | null;
    employees: Employee[];
}

// Komponen utama halaman laporan
export default function AttendanceReportPage({ reportType, reportData, selectedMonth, selectedEmployeeId, employees, selectedEmployee }: PageProps) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Laporan Rekap', href: '#' },
    ];

    // [FIX] Menggunakan route 'attendances.index' untuk filter
    const handleFilter = (key: 'month' | 'employee_id', value: string) => {
        const currentParams = new URLSearchParams(window.location.search);
        if (key === 'employee_id' && value === 'all') {
            currentParams.delete('employee_id');
        } else if (value) {
            currentParams.set(key, value);
        } else {
            currentParams.delete(key);
        }

        router.get(route('attendances.index'), Object.fromEntries(currentParams.entries()), {
            preserveState: true,
            replace: true,
        });
    };
    
    const handleExport = () => {
        const params = new URLSearchParams({
            month: selectedMonth,
        });
        if (selectedEmployeeId) {
            params.append('employee_id', selectedEmployeeId);
        }
        window.open(route('attendances.export') + '?' + params.toString(), '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Absensi" />
            <div className="space-y-6 p-4 md:p-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle>Laporan Rekapitulasi Absensi</CardTitle>
                        <CardDescription>Pilih bulan dan karyawan untuk melihat rekap kehadiran.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                        <Input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => handleFilter('month', e.target.value)}
                            className="w-full sm:w-auto"
                        />
                        <Select onValueChange={(value) => handleFilter('employee_id', value)} value={selectedEmployeeId ?? 'all'}>
                            <SelectTrigger className="w-full sm:w-[250px]">
                                <SelectValue placeholder="Semua Karyawan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Karyawan</SelectItem>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={String(employee.id)}>
                                        {employee.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                            <Link href={route('attendances.create')} className="w-full sm:w-auto">
                                <Button className="w-full">Input Manual</Button>
                            </Link>
                            <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
                                <FileDown className="h-4 w-4 mr-2" />
                                Ekspor
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {reportType === 'individual' && reportData && (
                    <IndividualReport report={reportData as IndividualReportData} employee={selectedEmployee!} />
                )}

                {reportType === 'all' && reportData && (
                     <AllEmployeesCalendar attendancesByDate={reportData as AllReportData} selectedMonth={selectedMonth} />
                )}

                 {(!reportData || (reportType === 'all' && Object.keys(reportData).length === 0) || (reportType === 'individual' && (reportData as IndividualReportData).detail_absensi.length === 0)) && (
                    <Card className="mt-6">
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            Tidak ada data absensi untuk periode atau karyawan yang dipilih.
                        </CardContent>
                    </Card>
                )}

            </div>
        </AppLayout>
    );
}

// Komponen untuk Rekap Individu
const IndividualReport = ({ report, employee }: { report: IndividualReportData; employee: Employee; }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Rekap Kehadiran: {employee.name}</CardTitle>
                <CardDescription>Detail kehadiran selama periode yang dipilih.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Hadir" value={report.total_hadir} icon={CheckCircle2} color="text-green-500" />
                <StatCard title="Sakit" value={report.total_sakit} icon={FileText} color="text-yellow-500" />
                <StatCard title="Izin" value={report.total_izin} icon={FileText} color="text-blue-500" />
                <StatCard title="Alpha" value={report.total_alpha} icon={XCircle} color="text-red-500" />
                <StatCard title="Cuti" value={report.total_cuti} icon={Plane} color="text-indigo-500" />
                <StatCard title="Total Jam Kerja" value={`${report.total_jam_kerja} Jam`} icon={Briefcase} color="text-gray-500" />
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle>Rincian Absensi</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Jam Masuk</TableHead>
                            <TableHead>Jam Pulang</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Catatan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {report.detail_absensi.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{format(new Date(item.clock_in_time), 'EEEE, dd MMM yyyy', { locale: id })}</TableCell>
                                <TableCell>{format(new Date(item.clock_in_time), 'HH:mm')}</TableCell>
                                <TableCell>{item.clock_out_time ? format(new Date(item.clock_out_time), 'HH:mm') : '-'}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.notes || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

// Komponen kecil untuk menampilkan kartu statistik
const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) => (
    <div className="p-4 border rounded-lg flex flex-col items-center justify-center text-center">
        <Icon className={cn("h-8 w-8 mb-2", color)} />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </div>
);


// Komponen untuk Kalender Semua Karyawan
const AllEmployeesCalendar = ({ attendancesByDate, selectedMonth }: { attendancesByDate: AllReportData, selectedMonth: string }) => {
    const [modalData, setModalData] = useState<{ date: Date; details: AttendanceDetail[] } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const monthStart = startOfMonth(new Date(selectedMonth));
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfMonth = getDay(monthStart);

    const handleDayClick = (day: Date, details: AttendanceDetail[]) => {
        if (details.length > 0) {
            setModalData({ date: day, details });
            setIsModalOpen(true);
        }
    };

    const statusIcons: Record<string, React.ElementType> = {
        Hadir: UserCheck, Izin: BookUser, Sakit: FileText, Alpha: UserX, Cuti: Plane,
    };
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Kalender Absensi Tim</CardTitle>
                    <CardDescription>Ringkasan kehadiran semua karyawan. Klik pada tanggal untuk melihat detail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                            <div key={day} className="text-center font-bold text-xs md:text-sm text-muted-foreground pb-2">{day}</div>
                        ))}
                        
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="border rounded-lg bg-muted/50 aspect-square"></div>
                        ))}
                        
                        {daysInMonth.map(day => {
                            const dateString = format(day, 'yyyy-MM-dd');
                            const dayData = attendancesByDate[dateString];
                            const hasAttendance = dayData && dayData.details.length > 0;
                            
                            return (
                                <div 
                                    key={dateString} 
                                    className={cn(
                                        "border rounded-lg p-1.5 md:p-2 flex flex-col aspect-square",
                                        hasAttendance ? "cursor-pointer hover:bg-accent hover:border-primary transition-colors" : "bg-muted/50"
                                    )}
                                    onClick={() => hasAttendance && handleDayClick(day, dayData.details)}
                                >
                                    <span className="font-bold text-xs md:text-sm">{format(day, 'd')}</span>
                                    {hasAttendance && (
                                        <div className="mt-1 space-y-1 overflow-hidden text-xs">
                                            {Object.entries(dayData.summary).map(([status, count]) => {
                                                if (count === 0) return null;
                                                const Icon = statusIcons[status];
                                                return (
                                                    <div key={status} className="flex items-center gap-1.5">
                                                        {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
                                                        <span className="font-medium">{count}</span>
                                                        <span className="text-muted-foreground hidden lg:inline">{status}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detail Absensi - {modalData && format(modalData.date, 'EEEE, dd MMMM yyyy', { locale: id })}</DialogTitle>
                        <DialogDescription>Rincian kehadiran karyawan pada tanggal yang dipilih.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Karyawan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Jam</TableHead>
                                    <TableHead>Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalData?.details.map(att => (
                                    <TableRow key={att.id}>
                                        <TableCell className="font-medium">{att.employee.name}</TableCell>
                                        <TableCell>{att.status}</TableCell>
                                        <TableCell>{format(new Date(att.clock_in_time), 'HH:mm')} - {att.clock_out_time ? format(new Date(att.clock_out_time), 'HH:mm') : '...'}</TableCell>
                                        <TableCell>{att.notes || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

