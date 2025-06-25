import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CirclePlus, Eye, Megaphone, Pencil, Trash } from 'lucide-react';
import { can } from '@/lib/can';
import Tag from '@/components/ui/tag';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Request',
    href: '/requests',
  },
];

interface Requested {
  id: number;
  name: string;
  date: string;
  devisi: string;
  j_pengajuan: string;
  mengetahui: string;
  desk: string;
  status: string;
  file: string;
}

interface PageProps {
  flash: {
    message?: string;
  };
  requests: {
    data: Requested[]; // Data request
    links: any[];      // Link paginasi
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export default function index() {
  const { requests, flash } = usePage().props as PageProps;

  const { processing, delete: destroy } = useForm();

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Do you want delete this - ${id}. ${name} `)) {
      destroy(route('requests.destroy', id));
    }
  };

  // Fungsi untuk render link paginasi
  const renderPagination = (pagination: any) => {
        return (
        <div className="flex justify-center mt-4">
            {pagination.links.map((link: any, index: number) => (
            <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                onClick={() => window.location.href = link.url}
                disabled={!link.url}
                className="mx-1"
            >
                {link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, '')}
            </Button>
            ))}
        </div>
        );
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Request" />

      <div className="h-full flex-col rounded-xl p-4">
        <Heading title="Request Latter" />

        <div className="rounded-lg border p-2">
          <div className="grid grid-cols-2">
            <div className="font-bold">Submission Report</div>

            {can('requests.create') && (
              <div className="w-full justify-end h-auto flex mb-5 gap-2">
                <Link href={route('requests.create')}>
                  <Button className="bg-yellow-600 w-25 hover:bg-yellow-500">
                    <CirclePlus />
                    Form
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div>
            {flash.message && (
              <Alert>
                <Megaphone className="h4-w4" />
                <AlertTitle className="text-blue-600">Notification</AlertTitle>
                <AlertDescription>{flash.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            {requests.data.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Devisi</TableHead>
                    <TableHead>Jenis Pengajuan</TableHead>
                    <TableHead>Mengetahui</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {requests.data.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.devisi}</TableCell>
                      <TableCell>{request.j_pengajuan}</TableCell>
                      <TableCell>{request.mengetahui}</TableCell>
                      <TableCell>
                        <Tag status={request.status} />
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        {can('requests.view') && (
                          <Link href={route('requests.show', request.id)}>
                            <Button className="bg-transparent hover:bg-gray-700">
                              <Eye color="gray" />
                            </Button>
                          </Link>
                        )}

                        {can('requests.edit') && (
                          <Link href={route('requests.edit', request.id)}>
                            <Button className="bg-transparent hover:bg-gray-700">
                              <Pencil color="blue" />
                            </Button>
                          </Link>
                        )}

                        {can('requests.delete') && (
                          <Button
                            disabled={processing}
                            onClick={() => handleDelete(request.id, request.name)}
                            className="bg-transparent hover:bg-gray-700"
                          >
                            <Trash color="red" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {renderPagination(requests)} {/* Tambahkan navigasi paginasi */}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}