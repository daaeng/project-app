import React, { useEffect, useState } from 'react';
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
import { CheckCircle2, XCircle, FileText, Briefcase, Plane, UserCheck, UserX, BookUser, FileDown, CalendarDays, Pencil, Megaphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    flash: {
        success?: string;
    };
}

// Komponen utama halaman laporan
export default function AttendanceReportPage({ reportType, reportData, selectedMonth, selectedEmployeeId, employees, selectedEmployee, flash }: PageProps) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Absensi', href: route('attendances.index') },
        { title: 'Laporan Rekap', href: '#' },
    ];

    const [flashMessage, setFlashMessage] = useState<string | undefined>(flash.success);

    useEffect(() => {
        setFlashMessage(flash.success);
        if (flash.success) {
            const timer = setTimeout(() => {
                setFlashMessage(undefined);
            }, 5000); // Pesan akan hilang setelah 5 detik
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Absensi" />
            <div className="space-y-6 p-4 md:p-6">

                {flashMessage && (
                    <div className="fixed top-24 right-6 w-auto z-50 animate-in fade-in-0 slide-in-from-top-5">
                        <Alert variant="default" className="bg-green-50/90 backdrop-blur-sm border-green-200 text-green-800">
                            <Megaphone className="h-4 w-4 text-green-600" />
                            <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                            <AlertDescription>{flashMessage}</AlertDescription>
                        </Alert>
                    </div>
                )}
                
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
                            {/* [FITUR EDIT] Menambahkan kolom Aksi */}
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {report.detail_absensi.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{format(new Date(item.clock_in_time), 'EEEE, dd MMM yyyy', { locale: id })}</TableCell>
                                <TableCell>{format(new Date(item.clock_in_time), 'HH:mm')}</TableCell>
                                <TableCell>{item.clock_out_time ? format(new Date(item.clock_out_time), 'HH:mm') : '-'}</TableCell>
                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                <TableCell className="max-w-xs truncate">{item.notes || '-'}</TableCell>
                                {/* [FITUR EDIT] Menambahkan tombol Edit */}
                                <TableCell className="text-center">
                                    <Link href={route('attendances.edit', item.id)}>
                                        <Button variant="outline" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
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

// Komponen helper untuk menampilkan badge status
const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
        Hadir: 'bg-green-500/10 text-green-400 border-green-500/20',
        Izin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Sakit: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        Alpha: 'bg-red-500/10 text-red-400 border-red-500/20',
        Cuti: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
    
    return (
        <span className={cn(
            'px-2 py-1 rounded-md text-xs font-semibold border',
            statusStyles[status] || 'bg-muted text-muted-foreground'
        )}>
            {status}
        </span>
    );
};

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
                            <div key={day} className={cn(
                                "text-center font-bold text-xs md:text-sm text-muted-foreground pb-2",
                                (day === 'Min' || day === 'Sab') && "text-red-500"
                            )}>
                                {day}
                            </div>
                        ))}
                        
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="border rounded-lg bg-muted/50 min-h-[120px] md:min-h-[140px]"></div>
                        ))}
                        
                        {daysInMonth.map(day => {
                            const dateString = format(day, 'yyyy-MM-dd');
                            const dayData = attendancesByDate[dateString];
                            const hasAttendance = dayData && dayData.details.length > 0;
                            const dayOfWeek = getDay(day);
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            
                            return (
                                <div 
                                    key={dateString} 
                                    className={cn(
                                        "border rounded-lg p-1.5 md:p-2 flex flex-col min-h-[120px] md:min-h-[140px]",
                                        hasAttendance ? "cursor-pointer hover:bg-accent hover:border-primary transition-colors" : "bg-muted/50",
                                        isWeekend && "border-red-500/20",
                                        isWeekend && !hasAttendance && "bg-red-500/5"
                                    )}
                                    onClick={() => hasAttendance && handleDayClick(day, dayData.details)}
                                >
                                    <span className={cn(
                                        "font-bold text-sm md:text-base",
                                        isWeekend && "text-red-500"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {hasAttendance && (
                                        <div className="flex-grow flex flex-col items-center justify-center gap-2">
                                            {Object.entries(dayData.summary).map(([status, count]) => {
                                                if (count === 0) return null;
                                                const Icon = statusIcons[status];
                                                return (
                                                    <div key={status} className="flex items-center gap-2">
                                                        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                                                        <span className="font-bold text-lg">{count}</span>
                                                        <span className="text-sm font-medium hidden sm:inline">{status}</span>
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
                <DialogContent className="max-w-7xl bg-background/80 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CalendarDays className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">
                                    Absensi - {modalData && format(modalData.date, 'EEEE, dd MMMM yyyy', { locale: id })}
                                </DialogTitle>
                                <DialogDescription>
                                    Rincian kehadiran karyawan pada tanggal yang dipilih.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto mt-4 pr-2">
                        <Table >
                            <TableHeader>
                                <TableRow className="border-b-primary/20">
                                    <TableHead className="text-accent-foreground font-semibold">Nama Karyawan</TableHead>
                                    <TableHead className="text-accent-foreground font-semibold">Status</TableHead>
                                    <TableHead className="text-accent-foreground font-semibold">Jam</TableHead>
                                    {/* [FITUR EDIT] Menambahkan kolom Aksi */}
                                    <TableHead className="text-accent-foreground font-semibold text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalData?.details.map(att => (
                                    <TableRow key={att.id} className="border-none hover:bg-primary/10 [&:nth-child(odd)]:bg-muted/30">
                                        <TableCell className="font-medium py-3 break-words">{att.employee.name}</TableCell>
                                        <TableCell className="py-3">{getStatusBadge(att.status)}</TableCell>
                                        <TableCell className="py-3">{format(new Date(att.clock_in_time), 'HH:mm')} - {att.clock_out_time ? format(new Date(att.clock_out_time), 'HH:mm') : '...'}</TableCell>
                                        {/* [FITUR EDIT] Menambahkan tombol Edit */}
                                        <TableCell className="py-3 text-center">
                                            <Link href={route('attendances.edit', att.id)}>
                                                <Button variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
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

