import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CirclePlus, Eye, FileDown, Megaphone, Package, Pencil, Search, Send, Sprout, Trash, Undo2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { can } from '@/lib/can';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Product Information', href: '/products' },
  { title: 'PT. Garuda Karya Amanat', href: '/products/gka' },
];

interface Product {
  id: number;
  product: string;
  date: string;
  no_invoice: string;
  nm_supplier: string;
  j_brg: string;
  desk: string;
  qty_kg: number;
  price_qty: number;
  amount: number;
  keping: number;
  kualitas: string;
  qty_out: number;
  price_out: number;
  amount_out: number;
  keping_out: number;
  kualitas_out: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  flash: { message?: string };
  products: {
    data: Product[];
    links: PaginationLink[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  products2: {
    data: Product[];
    links: PaginationLink[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  products3: {
    data: Product[];
    links: PaginationLink[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  products4: {
    data: Product[];
    links: PaginationLink[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  saldoin: number;
  saldoout: number;
  tm_slin: number;
  tm_slou: number;
  tm_sin: number;
  tm_sou: number;
  s_ready: number
  filter?: { search?: string; time_period?: string }; // Added time_period to filter
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function GkaPage({
  flash, products, products2,  products3, products4, saldoin, saldoout,
  tm_slin, tm_slou, tm_sin, tm_sou, filter, s_ready
}: PageProps) {
  const [searchValue, setSearchValue] = useState(filter?.search || '');
  const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time'); // State for time period filter

  useEffect(() => {
    setSearchValue(filter?.search || '');
    setTimePeriod(filter?.time_period || 'all-time'); // Sync time period from props
  }, [filter?.search, filter?.time_period]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    // Trigger search when time period changes
    router.get(route('products.gka'),
      { search: searchValue, time_period: value }, // Include time_period in the request
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'filter', 'saldoin', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou'],
      }
    );
  };

  const performSearch = () => {
    router.get(route('products.gka'),
      { search: searchValue, time_period: timePeriod }, // Include time_period in the search
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'filter', 'saldoin', 'saldoout', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou'],
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleDelete = (id: number, product: string) => {
    if (confirm(`Do you want to delete this - ${id}. ${product}`)) {
      router.delete(route('products.destroy', id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          router.get(route('products.gka'), { search: searchValue, time_period: timePeriod }, { preserveState: true }); // Preserve time_period after delete
        },
      });
    }
  };

  const renderPagination = (pagination: PageProps['products']) => {
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        {pagination.links.map((link: PaginationLink, index: number) => (
          link.url === null ? (
            <div
              key={index}
              className="px-4 py-2 text-sm text-gray-400"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ) : (
            <Link
              key={`link-${index}`}
              href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '')} // Append search and time_period to pagination links
              className={`px-4 py-2 text-sm rounded-md transition ${
                link.active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              preserveState
              preserveScroll
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Link>
          )
        ))}
      </div>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="PT. Garuda Karya Amanat" />
      <div className="h-full flex-col rounded-xl p-4 space-y-4">
        <Heading title="PT. Garuda Karya Amanat" />
        <div className="mb-3">
          <Link href={route('products.index')}>
            <Button variant="outline">
              <Undo2 className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        <div className='w-full justify-center h-auto flex mb-5 gap-2'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
              <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                  <CardHeader className="bg-blue-300">
                  <div className="flex items-center p-1 justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">Available Stock Karet</CardTitle>
                      <div className="rounded-lg bg-blue-100 p-2">
                      <Package size={18} className="text-blue-600" />
                      </div>
                  </div>
                  </CardHeader>
                  <CardContent className="lg:-mt-4 text-blue-700">
                    <div className='grid grid-cols-2'>
                      <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(saldoin)}</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{s_ready} Kg</div>
                      <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(saldoout)}</div>
                    </div>
                  </CardContent>
              </Card>

              <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                  <CardHeader className="bg-amber-300">
                  <div className="flex items-center p-1 justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">Stock Information</CardTitle>
                      <div className="rounded-lg bg-amber-100 p-2">
                      <Sprout size={18} className="text-amber-600" />
                      </div>
                  </div>
                  </CardHeader>
                  <CardContent className="lg:-mt-4 text-amber-700">
                  <div className="grid grid-cols-2">
                      <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(tm_slin)}</div>
                      <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(tm_slou)}</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{tm_sin} Kg</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{tm_sou} Kg</div>
                  </div>
                  </CardContent>
              </Card>
              
            </div>
        </div>

          {flash?.message && (
            <Alert className="mb-4">
              <Megaphone className="h-4 w-4" />
              <AlertTitle className="text-green-600">Notification</AlertTitle>
              <AlertDescription>{flash.message}</AlertDescription>
            </Alert>
          )}

        <div>
          {can('products.create') && 
            <div className='w-full justify-end h-auto flex mb-5 gap-2'>
              <Link href={route('products.c_send')}>
                  <Button className='bg-green-600 hover:bg-green-400'>
                      <Send />
                      Kirim Barang
                  </Button>
              </Link>

              <Link href={route('products.create')}>
                  <Button className="bg-yellow-600 hover:bg-yellow-500">
                      <CirclePlus className="w-4 h-4 " /> Product
                  </Button>
              </Link>

            </div>
          }
        </div>

        <div>
          <CardContent className="p-1">

            <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search by supplier, invoice, item..."
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={performSearch}>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
              <div className="flex items-center gap-2">
                {/* Select filter by time period */}
                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-1">
                  <FileDown className="h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-2 rounded-lg">
                <div className="font-bold text-2xl mb-4">Data Pembelian Karet</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Qty </TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.data.length > 0 ? (
                        products.data.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.date}</TableCell>
                            <TableCell>{product.nm_supplier}</TableCell>
                            <TableCell>{product.j_brg}</TableCell>
                            <TableCell>{product.qty_kg}</TableCell>
                            <TableCell>{formatCurrency(product.amount)}</TableCell>
                            <TableCell className="text-center space-x-2">
                              {can('products.view') && (
                                <Link href={route('products.show', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                  </Button>
                                </Link>
                              )}
                              
                              {/* {can('roles.edit') && (
                                <Link href={route('products.edit', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Send color="blue" />
                                  </Button>
                                </Link>
                              )} */}

                              {can('roles.delete') && (
                                <Button
                                  onClick={() => handleDelete(product.id, product.product)}
                                  className="bg-transparent hover:bg-gray-700"
                                >
                                  <Trash color="red" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {products.data.length > 0 && renderPagination(products)}
              </div>

              <div className="border p-2 rounded-lg">
                <div className="font-bold text-2xl mb-4">Data Penjualan Karet</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Qty </TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products2.data.length > 0 ? (
                        products2.data.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.date}</TableCell>
                            <TableCell>{product.nm_supplier}</TableCell>
                            <TableCell>{product.j_brg}</TableCell>
                            <TableCell>{product.qty_out}</TableCell>
                            <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                            <TableCell className="text-center space-x-2">
                              {can('products.view') && (
                                <Link href={route('products.show', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                  </Button>
                                </Link>
                              )}
                              
                              {can('roles.edit') && (
                                <Link href={route('products.edit', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Pencil color="blue" />
                                  </Button>
                                </Link>
                              )}

                              {can('roles.delete') && (
                                <Button
                                  onClick={() => handleDelete(product.id, product.product)}
                                  className="bg-transparent hover:bg-gray-700"
                                >
                                  <Trash color="red" />
                                </Button>
                              )} 
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {products2.data.length > 0 && renderPagination(products2)}
              </div>
            </div>
          </CardContent>
        </div>
        
        <div>
          <CardContent className="p-1">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-2 rounded-lg">
                <div className="font-bold text-2xl mb-4">Data Pembelian Pupuk</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Qty </TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products3.data.length > 0 ? (
                        products3.data.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.date}</TableCell>
                            <TableCell>{product.nm_supplier}</TableCell>
                            <TableCell>{product.j_brg}</TableCell>
                            <TableCell>{product.qty_kg}</TableCell>
                            <TableCell>{formatCurrency(product.amount)}</TableCell>
                            <TableCell className="text-center space-x-2">
                              {can('products.view') && (
                                <Link href={route('products.show', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                  </Button>
                                </Link>
                              )}
                              
                              {/* {can('roles.edit') && (
                                <Link href={route('products.edit', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Send color="blue" />
                                  </Button>
                                </Link>
                              )} */}

                              {can('roles.delete') && (
                                <Button
                                  onClick={() => handleDelete(product.id, product.product)}
                                  className="bg-transparent hover:bg-gray-700"
                                >
                                  <Trash color="red" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {products3.data.length > 0 && renderPagination(products3)}
              </div>

              <div className="border p-2 rounded-lg">
                <div className="font-bold text-2xl mb-4">Data Penjualan Pupuk</div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Qty </TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products4.data.length > 0 ? (
                        products4.data.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.date}</TableCell>
                            <TableCell>{product.nm_supplier}</TableCell>
                            <TableCell>{product.j_brg}</TableCell>
                            <TableCell>{product.qty_out}</TableCell>
                            <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                            <TableCell className="text-center space-x-2">
                              {can('products.view') && (
                                <Link href={route('products.show', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Eye color="gray" />
                                  </Button>
                                </Link>
                              )}
                              
                              {can('roles.edit') && (
                                <Link href={route('products.edit', product.id)}>
                                  <Button className="bg-transparent hover:bg-gray-700">
                                    <Pencil color="blue" />
                                  </Button>
                                </Link>
                              )}

                              {can('roles.delete') && (
                                <Button
                                  onClick={() => handleDelete(product.id, product.product)}
                                  className="bg-transparent hover:bg-gray-700"
                                >
                                  <Trash color="red" />
                                </Button>
                              )} 
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {products4.data.length > 0 && renderPagination(products4)}
              </div>
            </div>
          </CardContent>
        </div>

      </div>
    </AppLayout>
  );
}
