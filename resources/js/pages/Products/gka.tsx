import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CirclePlus, Eye, FileDown, Megaphone, Pencil, Search, Send, Sprout, Trash, TreePalm, Undo2, Wheat } from 'lucide-react';
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
import { useState, useEffect, useMemo } from 'react'; // Added useMemo

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
  products5: {
    data: Product[];
    links: PaginationLink[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  products6: {
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
  s_ready: number;
  
  ppk_slin: number;
  ppk_slou: number;
  ppk_sin: number;
  ppk_sou: number;
  p_ready: number;
  
  klp_slin: number;
  klp_slou: number;
  klp_sin: number;
  klp_sou: number;
  klp_ready: number
  
  filter?: { search?: string; time_period?: string; product_type?: string }; // Added product_type to filter
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

export default function GkaPage({
  flash, products, products2, products3, products4, products5, products6, 
  tm_slin, tm_slou, tm_sin, tm_sou, filter, s_ready,
  ppk_slin, ppk_slou, ppk_sin, ppk_sou, p_ready,
  klp_slin, klp_slou, klp_sin, klp_sou, klp_ready,
}: PageProps) {
  const [searchValue, setSearchValue] = useState(filter?.search || '');
  const [timePeriod, setTimePeriod] = useState(filter?.time_period || 'all-time'); // State for time period filter
  const [productType, setProductType] = useState(filter?.product_type || 'all'); // State for product type filter

  useEffect(() => {
    setSearchValue(filter?.search || '');
    setTimePeriod(filter?.time_period || 'all-time'); // Sync time period from props
    setProductType(filter?.product_type || 'all'); // Sync product type from props
  }, [filter?.search, filter?.time_period, filter?.product_type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    // Trigger search when time period changes
    router.get(route('products.gka'),
      { search: searchValue, time_period: value, product_type: productType }, // Include product_type in the request
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready'],
      }
    );
  };

  const handleProductTypeChange = (value: string) => {
    setProductType(value);
    // Trigger search when product type changes
    router.get(route('products.gka'),
      { search: searchValue, time_period: timePeriod, product_type: value }, // Include product_type in the request
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready'],
      }
    );
  };

  const performSearch = () => {
    router.get(route('products.gka'),
      { search: searchValue, time_period: timePeriod, product_type: productType }, // Include product_type in the search
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready'],
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleDelete = (id: number, product: string) => {
    if (confirm(`Apakah Anda ingin menghapus ini - ${id}. ${product}?`)) {
      router.delete(route('products.destroy', id), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          router.get(route('products.gka'), { search: searchValue, time_period: timePeriod, product_type: productType }, { preserveState: true }); // Preserve all filters after delete
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
              href={link.url + (searchValue ? `&search=${searchValue}` : '') + (timePeriod !== 'all-time' ? `&time_period=${timePeriod}` : '') + (productType !== 'all' ? `&product_type=${productType}` : '')} // Append all filters to pagination links
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

  // Use useMemo to combine and filter products based on productType
  const filteredProductsIn = useMemo(() => {
    if (productType === 'all') {
      // Combine all 'in' products and add a product_type field
      const combined = [
        ...products.data.map(p => ({ ...p, product_type_display: 'Karet' })),
        ...products3.data.map(p => ({ ...p, product_type_display: 'Pupuk' })),
        ...products5.data.map(p => ({ ...p, product_type_display: 'Kelapa' })),
      ];
      // Sort combined data by date (newest first)
      return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (productType === 'karet') {
      return products.data.map(p => ({ ...p, product_type_display: 'Karet' }));
    } else if (productType === 'pupuk') {
      return products3.data.map(p => ({ ...p, product_type_display: 'Pupuk' }));
    } else if (productType === 'kelapa') {
      return products5.data.map(p => ({ ...p, product_type_display: 'Kelapa' }));
    }
    return [];
  }, [productType, products.data, products3.data, products5.data]);

  const filteredProductsOut = useMemo(() => {
    if (productType === 'all') {
      // Combine all 'out' products and add a product_type field
      const combined = [
        ...products2.data.map(p => ({ ...p, product_type_display: 'Karet' })),
        ...products4.data.map(p => ({ ...p, product_type_display: 'Pupuk' })),
        ...products6.data.map(p => ({ ...p, product_type_display: 'Kelapa' })),
      ];
      // Sort combined data by date (newest first)
      return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (productType === 'karet') {
      return products2.data.map(p => ({ ...p, product_type_display: 'Karet' }));
    } else if (productType === 'pupuk') {
      return products4.data.map(p => ({ ...p, product_type_display: 'Pupuk' }));
    } else if (productType === 'kelapa') {
      return products6.data.map(p => ({ ...p, product_type_display: 'Kelapa' }));
    }
    return [];
  }, [productType, products2.data, products4.data, products6.data]);


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="PT. Garuda Karya Amanat" />
      <div className="h-full flex-col rounded-xl p-4 space-y-4">
        <Heading title="PT. Garuda Karya Amanat" />
        <div className="mb-3">
          <Link href={route('products.index')}>
            <Button variant="outline">
              <Undo2 className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
        </div>

        <div className='w-full justify-center h-auto flex mb-5 gap-2'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
              <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                  <CardHeader className="bg-amber-300">
                  <div className="flex items-center p-1 justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        <div className='grid grid-cols-2'>
                          <div>
                            Stok Karet
                          </div>
                          <div className='flex justify-end mr-2'>
                            {s_ready} Kg
                          </div>
                        </div>
                      </CardTitle>
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

              <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                  <CardHeader className="bg-red-300">
                  <div className="flex items-center p-1 justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        <div className='grid grid-cols-2'>
                          <div>
                            Stok Pupuk
                          </div>
                          <div className='flex justify-end mr-2'>
                            {p_ready} Kg
                          </div>
                        </div>
                      </CardTitle>
                      <div className="rounded-lg bg-red-100 p-2">
                      <Wheat size={18} className="text-red-600" />
                      </div>
                  </div>
                  </CardHeader>
                  <CardContent className="lg:-mt-4 text-red-700">
                  <div className="grid grid-cols-2">
                      <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(ppk_slin)}</div>
                      <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(ppk_slou)}</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{ppk_sin} Kg</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{ppk_sou} Kg</div>
                  </div>
                  </CardContent>
              </Card>
              
              <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                  <CardHeader className="bg-blue-300">
                  <div className="flex items-center p-1 justify-between">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        <div className='grid grid-cols-2'>
                          <div>
                            Stok Kelapa
                          </div>
                          <div className='flex justify-end mr-2'>
                            {klp_ready} Kg
                          </div>
                        </div>
                      </CardTitle>
                      <div className="rounded-lg bg-blue-100 p-2">
                      <TreePalm size={18} className="text-blue-600" />
                      </div>
                  </div>
                  </CardHeader>
                  <CardContent className="lg:-mt-4 text-blue-700">
                  <div className="grid grid-cols-2">
                      <div className="flex gap-2"><p className="text-red-400">IN</p> {formatCurrency(klp_slin)}</div>
                      <div className="flex gap-2"><p className="text-green-400">OUT</p> {formatCurrency(klp_slou)}</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{klp_sin} Kg</div>
                      <div className="text-2xl w-full justify-center flex font-bold">{klp_sou} Kg</div>
                  </div>
                  </CardContent>
              </Card>
            </div>
        </div>

          {flash?.message && (
            <Alert className="mb-4">
              <Megaphone className="h-4 w-4" />
              <AlertTitle className="text-green-600">Pemberitahuan</AlertTitle>
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
                      <CirclePlus className="w-4 h-4 " /> Produk
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
                  placeholder="Cari berdasarkan supplier, invoice, item..."
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={performSearch}>
                <Search className="h-4 w-4 mr-2" /> Cari
              </Button>
              <div className="flex items-center gap-2">
                {/* Select filter by product type */}
                <Select value={productType} onValueChange={handleProductTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Jenis Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Produk</SelectItem>
                    <SelectItem value="karet">Karet</SelectItem>
                    <SelectItem value="kelapa">Kelapa</SelectItem>
                    <SelectItem value="pupuk">Pupuk</SelectItem>
                  </SelectContent>
                </Select>
                {/* Select filter by time period */}
                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Periode Waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">Sepanjang Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="this-week">Minggu Ini</SelectItem>
                    <SelectItem value="this-month">Bulan Ini</SelectItem>
                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-1">
                  <FileDown className="h-4 w-4" /> Ekspor
                </Button>
              </div>
            </div>

            {/* Conditional rendering for combined tables or specific product tables */}
            {(productType === 'all' || productType === 'karet') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border p-2 rounded-lg">
                  <div className="font-bold text-2xl mb-4">Data Pembelian {productType === 'all' ? 'Semua Produk' : 'Karet'}</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          {productType === 'all' && <TableHead>Jenis Produk</TableHead>} {/* New column for product type */}
                          <TableHead>Supplier</TableHead>
                          <TableHead>Barang</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Outcome</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProductsIn.length > 0 ? (
                          filteredProductsIn.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.date}</TableCell>
                              {productType === 'all' && <TableCell>{product.product_type_display}</TableCell>} {/* Display product type */}
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
                            <TableCell colSpan={productType === 'all' ? 7 : 6} className="h-24 text-center">
                              Tidak ada hasil ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {products.data.length > 0 && renderPagination(products)} {/* Pagination for karet is used here, needs adjustment if all products are paginated */}
                </div>

                <div className="border p-2 rounded-lg">
                  <div className="font-bold text-2xl mb-4">Data Penjualan {productType === 'all' ? 'Semua Produk' : 'Karet'}</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          {productType === 'all' && <TableHead>Jenis Produk</TableHead>} {/* New column for product type */}
                          <TableHead>Supplier</TableHead>
                          <TableHead>Barang</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProductsOut.length > 0 ? (
                          filteredProductsOut.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.date}</TableCell>
                              {productType === 'all' && <TableCell>{product.product_type_display}</TableCell>} {/* Display product type */}
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
                            <TableCell colSpan={productType === 'all' ? 7 : 6} className="h-24 text-center">
                              Tidak ada hasil ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {products2.data.length > 0 && renderPagination(products2)} {/* Pagination for karet is used here, needs adjustment if all products are paginated */}
                </div>
              </div>
            )}

            {/* Only show specific tables if a specific product type is selected */}
            {productType === 'pupuk' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          <TableHead className="text-center">Aksi</TableHead>
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
                              Tidak ada hasil ditemukan.
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
                          <TableHead className="text-center">Aksi</TableHead>
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
                              Tidak ada hasil ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {products4.data.length > 0 && renderPagination(products4)}
                </div>
              </div>
            )}
            
            {productType === 'kelapa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border p-2 rounded-lg">
                  <div className="font-bold text-2xl mb-4">Data Pembelian Kelapa</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Barang</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Outcome</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products5.data.length > 0 ? (
                          products5.data.map((product) => (
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
                              Tidak ada hasil ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {products5.data.length > 0 && renderPagination(products5)}
                </div>

                <div className="border p-2 rounded-lg">
                  <div className="font-bold text-2xl mb-4">Data Penjualan Kelapa</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Barang</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products6.data.length > 0 ? (
                          products6.data.map((product) => (
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
                              Tidak ada hasil ditemukan.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {products6.data.length > 0 && renderPagination(products6)}
                </div>
              </div>
            )}
          </CardContent>
        </div>

      </div>
    </AppLayout>
  );
}
