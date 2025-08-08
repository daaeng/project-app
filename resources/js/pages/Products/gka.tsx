import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, CirclePlus, Coins, Droplet, Eye, Megaphone, Package, Pencil, Search, Send, Sprout, Trash, TreePalm, Truck, Undo2, Warehouse, Wheat } from 'lucide-react';
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
import { useState, useEffect, useMemo } from 'react';

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
  keping_in: number;
  keping_out: number;
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
  
  filter?: { search?: string; time_period?: string; product_type?: string; month?: string; year?: string }; // Added month and year
  currentMonth: number; // New prop
  currentYear: number;   // New prop
  auth?: any;
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
  tm_slin, tm_slou, tm_sin, tm_sou, filter, s_ready, keping_in, keping_out,
  ppk_slin, ppk_slou, ppk_sin, ppk_sou, p_ready,
  klp_slin, klp_slou, klp_sin, klp_sou, klp_ready, currentMonth, currentYear
}: PageProps) {
  const [searchValue, setSearchValue] = useState(filter?.search || '');
  
  // Improved useState initialization for timePeriod
  const [timePeriod, setTimePeriod] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Prioritize 'time_period' parameter from URL if present
    if (urlParams.has('time_period')) {
        return urlParams.get('time_period') || 'this-month'; // Fallback if parameter in URL is empty
    }

    // If no 'time_period' parameter in URL,
    // and the filter prop from the backend is 'all-time' (possibly due to Inertia state persistence),
    // then force 'this-month' for the initial display.
    if (filter?.time_period === 'all-time') {
        return 'this-month';
    }
    
    // If no parameter in URL and filter prop is not 'all-time',
    // use the value from the filter prop (which should be 'this-month' from PHP default)
    // or fallback to 'this-month' if filter.time_period is undefined/null.
    return filter?.time_period || 'this-month';
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

  const [productType, setProductType] = useState(filter?.product_type || 'all'); // State for product type filter

  useEffect(() => {
    setSearchValue(filter?.search || '');
    setTimePeriod(filter?.time_period || 'this-month'); // Sync time period from props
    setSelectedMonth(String(filter?.month || currentMonth)); // Sync month from props
    setSelectedYear(String(filter?.year || currentYear));   // Sync year from props
    setProductType(filter?.product_type || 'all'); // Sync product type from props
  }, [filter?.search, filter?.time_period, filter?.month, filter?.year, currentMonth, currentYear, filter?.product_type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    const params: { search: string; time_period: string; product_type: string; month?: string; year?: string } = {
        search: searchValue,
        time_period: value,
        product_type: productType
    };

    if (value === 'specific-month') {
        const current = new Date();
        params.month = String(current.getMonth() + 1);
        params.year = String(current.getFullYear());
        setSelectedMonth(params.month);
        setSelectedYear(params.year);
    } else {
        // Clear month and year if not 'specific-month'
        setSelectedMonth(String(new Date().getMonth() + 1));
        setSelectedYear(String(new Date().getFullYear()));
    }

    router.get(route('products.gka'),
      params,
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear'],
      }
    );
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    router.get(route('products.gka'),
        { search: searchValue, time_period: timePeriod, product_type: productType, month: value, year: selectedYear },
        {
            preserveState: true,
            replace: true,
            only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear'],
        }
    );
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    router.get(route('products.gka'),
        { search: searchValue, time_period: timePeriod, product_type: productType, month: selectedMonth, year: value },
        {
            preserveState: true,
            replace: true,
            only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear'],
        }
    );
  };

  const handleProductTypeChange = (value: string) => {
    setProductType(value);
    // Trigger search when product type changes
    router.get(route('products.gka'),
      { search: searchValue, time_period: timePeriod, product_type: value, month: selectedMonth, year: selectedYear }, // Include month and year in the request
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear'],
      }
    );
  };

  const performSearch = () => {
    router.get(route('products.gka'),
      { search: searchValue, time_period: timePeriod, product_type: productType, month: selectedMonth, year: selectedYear }, // Include all filters in the search
      {
        preserveState: true,
        replace: true,
        only: ['products', 'products2', 'products3', 'products4', 'products5', 'products6', 'keping_in', 'keping_out', 'filter', 'tm_slin', 'tm_slou', 'tm_sin', 'tm_sou', 's_ready', 'ppk_slin', 'ppk_slou', 'ppk_sin', 'ppk_sou', 'p_ready', 'klp_slin', 'klp_slou', 'klp_sin', 'klp_sou', 'klp_ready', 'currentMonth', 'currentYear'],
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
          router.get(route('products.gka'), { search: searchValue, time_period: timePeriod, product_type: productType, month: selectedMonth, year: selectedYear }, { preserveState: true }); // Preserve all filters after delete
        },
      });
    }
  };

  const renderPagination = (pagination: PageProps['products'], pageParamName: string = 'page') => {
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        {pagination.links.map((link: PaginationLink, index: number) => {
            // Periksa apakah link.url ada dan valid sebelum membuat objek URL
            let url: URL | null = null;
            try {
                if (link.url) {
                    url = new URL(link.url);
                }
            } catch (e) {
                console.error("Invalid URL encountered:", link.url, e);
                // Jika URL tidak valid, kita bisa memilih untuk tidak merender link ini atau merender sebagai teks biasa
                return (
                    <div
                        key={index}
                        className="px-4 py-2 text-sm text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            }

            const currentParams = url ? new URLSearchParams(url.search) : new URLSearchParams();
            
            // Set the correct page parameter name
            currentParams.set(pageParamName, currentParams.get('page') || currentParams.get('page2') || link.label.replace(/&laquo;/g, '').replace(/&raquo;/g, ''));

            // Append existing filters
            if (searchValue) currentParams.set('search', searchValue);
            if (timePeriod !== 'all-time') currentParams.set('time_period', timePeriod);
            if (productType !== 'all') currentParams.set('product_type', productType); // Append product_type
            if (timePeriod === 'specific-month' && selectedMonth) currentParams.set('month', selectedMonth);
            if (timePeriod === 'specific-month' && selectedYear) currentParams.set('year', selectedYear);

            return link.url === null || !url ? ( // Tambahkan !url check di sini
                <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-400"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <Link
                    key={`link-${index}`}
                    href={`${url.origin}${url.pathname}?${currentParams.toString()}`}
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
            );
        })}
      </div>
    );
  };

  // Generate options for months (1-12)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
  }));

  // Generate options for years (e.g., current year - 5 to current year + 1)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => ({
    value: String(currentYearNum - 5 + i),
    label: String(currentYearNum - 5 + i),
  }));

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
      <div className="h-full flex-col rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-black">
        <Heading title="PT. Garuda Karya Amanat" />
        <div className="mb-3">
          <Link href={route('products.index')}>
            <Button variant="outline">
              <Undo2 className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Kartu Uang Masuk (saldoin) */}
          <Card className="shadow-2xl border-2 border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white transition-all duration-500 rounded-2xl hover:shadow-green-500/50 hover:scale-105">
              <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold flex items-center">
                      <Coins className="mr-3 text-white drop-shadow-md" size={32} /> Uang Masuk Karet
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                  <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                     {formatCurrency(tm_slou)} 
                  </p>
                  <div className="flex justify-between text-sm mt-3 text-green-100">
                      <div className="flex items-center font-medium">
                          <Truck size={18} className="mr-1" />
                          <span>Hasil Pengiriman</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Kartu Total KG (hsl_karet) */}
          <Card className="shadow-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-400 to-blue-600 text-white transition-all duration-500 rounded-2xl hover:shadow-blue-500/50 hover:scale-105">
              <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold flex items-center">
                      <Package className="mr-3 text-white drop-shadow-md" size={32} /> Total KG
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                  <p className="text-5xl font-extrabold mt-2 tracking-tighter">
                    {tm_sou} kg
                  </p>
                  <div className="flex justify-between text-sm mt-3 text-blue-100">
                      <div className="flex items-center font-medium">
                          <Warehouse size={18} className="mr-1" />
                          <span>Gudang : {tm_sin}</span>
                      </div>
                      <div className="flex items-center font-medium">
                          <Droplet size={18} className="mr-1" />
                          <span>Susut : {s_ready}kg</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

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
                        <div className="flex gap-2"><p className="text-red-400">OUT</p> {formatCurrency(tm_slin)}</div>
                        <div className="flex gap-2"><p className="text-green-400">IN</p> {formatCurrency(tm_slou)}</div>

                        <div className="flex gap-2"><p className="text-red-400">keping</p>{keping_in}</div>
                        <div className="flex gap-2"><p className="text-green-400">keping</p>{keping_out}</div>
                        
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

        {/* <div>
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
        </div> */}

        <div className="flex space-x-3 justify-end">
          <Link href={route('products.create')}>
              <Button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-3">
                  <CirclePlus size={18} className="mr-2" />
                  Tambah Produk
              </Button>
          </Link>
          {can('products.create') && (
              <Link href={route('products.c_send')}>
                  <Button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 px-6 py-3">
                      <Building2 size={18} className="mr-2" />
                      Kirim Barang
                  </Button>
              </Link>
          )}
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
                    <SelectItem value="last-month">Bulan Lalu</SelectItem> {/* Added "Last Month" */}
                    <SelectItem value="this-year">Tahun Ini</SelectItem>
                    <SelectItem value="specific-month">Pilih Bulan & Tahun</SelectItem>
                  </SelectContent>
                </Select>

                {timePeriod === 'specific-month' && (
                    <>
                        <Select value={selectedMonth} onValueChange={handleMonthChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year.value} value={year.value}>
                                        {year.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                )}

                {/* <Button variant="outline" className="flex items-center gap-1">
                  <FileDown className="h-4 w-4" /> Ekspor
                </Button> */}
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
                          <TableHead>Keping</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Outcome</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProductsIn.length > 0 ? (
                          filteredProductsIn.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell key={`${product.id}-date`}>{product.date}</TableCell>
                              {productType === 'all' && <TableCell key={`${product.id}-product-type`}>{product.product_type_display}</TableCell>} {/* Display product type */}
                              <TableCell key={`${product.id}-supplier`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-keping`}>{product.keping_out}</TableCell>
                              <TableCell key={`${product.id}-qty`}>{product.qty_out}</TableCell>
                              <TableCell key={`${product.id}-amount`}>{formatCurrency(product.amount_out)}</TableCell>
                              <TableCell key={`${product.id}-actions`} className="text-center space-x-2">
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
                          <TableHead>Keping</TableHead>
                          <TableHead>Qty </TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProductsOut.length > 0 ? (
                          filteredProductsOut.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell key={`${product.id}-date-out`}>{product.date}</TableCell>
                              {productType === 'all' && <TableCell key={`${product.id}-product-type-out`}>{product.product_type_display}</TableCell>} {/* Display product type */}
                              <TableCell key={`${product.id}-supplier-out`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-keping-out`}>{product.keping_out}</TableCell>
                              <TableCell key={`${product.id}-qty-out`}>{product.qty_out}</TableCell>
                              <TableCell key={`${product.id}-amount-out`}>{formatCurrency(product.amount_out)}</TableCell>
                              <TableCell key={`${product.id}-actions-out`} className="text-center space-x-2">
                                {can('products.view') && (
                                  <Link href={route('products.show', product.id)}>
                                    <Button className="bg-transparent hover:bg-gray-700">
                                      <Eye color="gray" />
                                    </Button>
                                  </Link>
                                )}
                                
                                {can('roles.edit') && (
                                  <Link href={route('products.edit_out', product.id)}>
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
                              <TableCell key={`${product.id}-date-in-pupuk`}>{product.date}</TableCell>
                              <TableCell key={`${product.id}-supplier-in-pupuk`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-jbrg-in-pupuk`}>{product.j_brg}</TableCell>
                              <TableCell key={`${product.id}-qty-in-pupuk`}>{product.qty_kg}</TableCell>
                              <TableCell key={`${product.id}-amount-in-pupuk`}>{formatCurrency(product.amount)}</TableCell>
                              <TableCell key={`${product.id}-actions-in-pupuk`} className="text-center space-x-2">
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
                              <TableCell key={`${product.id}-date-out-pupuk`}>{product.date}</TableCell>
                              <TableCell key={`${product.id}-supplier-out-pupuk`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-jbrg-out-pupuk`}>{product.j_brg}</TableCell>
                              <TableCell key={`${product.id}-qty-out-pupuk`}>{product.qty_out}</TableCell>
                              <TableCell key={`${product.id}-amount-out-pupuk`}>{formatCurrency(product.amount_out)}</TableCell>
                              <TableCell key={`${product.id}-actions-out-pupuk`} className="text-center space-x-2">
                                {can('products.view') && (
                                  <Link href={route('products.show', product.id)}>
                                    <Button className="bg-transparent hover:bg-gray-700">
                                      <Eye color="gray" />
                                    </Button>
                                  </Link>
                                )}
                                
                                {can('roles.edit') && (
                                  <Link href={route('products.edit_out', product.id)}>
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
                              <TableCell key={`${product.id}-date-in-kelapa`}>{product.date}</TableCell>
                              <TableCell key={`${product.id}-supplier-in-kelapa`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-jbrg-in-kelapa`}>{product.j_brg}</TableCell>
                              <TableCell key={`${product.id}-qty-in-kelapa`}>{product.qty_kg}</TableCell>
                              <TableCell key={`${product.id}-amount-in-kelapa`}>{formatCurrency(product.amount)}</TableCell>
                              <TableCell key={`${product.id}-actions-in-kelapa`} className="text-center space-x-2">
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
                              <TableCell key={`${product.id}-date-out-kelapa`}>{product.date}</TableCell>
                              <TableCell key={`${product.id}-supplier-out-kelapa`}>{product.nm_supplier}</TableCell>
                              <TableCell key={`${product.id}-jbrg-out-kelapa`}>{product.j_brg}</TableCell>
                              <TableCell key={`${product.id}-qty-out-kelapa`}>{product.qty_out}</TableCell>
                              <TableCell key={`${product.id}-amount-out-kelapa`}>{formatCurrency(product.amount_out)}</TableCell>
                              <TableCell key={`${product.id}-actions-out-kelapa`} className="text-center space-x-2">
                                {can('products.view') && (
                                  <Link href={route('products.show', product.id)}>
                                    <Button className="bg-transparent hover:bg-gray-700">
                                      <Eye color="gray" />
                                    </Button>
                                  </Link>
                                )}
                                
                                {can('roles.edit') && (
                                  <Link href={route('products.edit_out', product.id)}>
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
