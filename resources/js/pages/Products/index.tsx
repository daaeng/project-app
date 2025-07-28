import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link,  } from '@inertiajs/react';
import { ArrowRight, Building2, Droplet, FolderOpen, Sprout, Trees, } from 'lucide-react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product Information',
        href: '/products',
    },
];

export default function index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product" />

            <div className="h-full flex-col rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-black">
            
                <Heading title='Product Information'/>

                <div className='w-full justify-center h-auto flex mb-5 gap-2'>
                    
                    <div className='grid grid-cols-3 gap-4'>
                        
                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                            <CardHeader className="bg-amber-300 ">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">PT. Garuda Karya Amanat</CardTitle>
                                    <div className="rounded-lg bg-amber-100 p-2 ml-1">
                                        <Building2 size={18} className="text-amber-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="">
                                <Link href={route('products.gka')}>
                                    <Button variant="link"  className="flex h-auto items-center p-0 text-green-600">
                                        View details <ArrowRight size={16} className="ml-1" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                            <CardHeader className="bg-blue-400 ">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Temadu Sebayar Agro</CardTitle>
                                    <div className="rounded-lg bg-blue-100 p-2 ml-1">
                                        <Trees size={18} className="text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="">
                                <Link href={route('products.tsa')}>
                                    <Button variant="link"  className="flex h-auto items-center p-0 text-green-600">
                                        View details <ArrowRight size={16} className="ml-1" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                            <CardHeader className="bg-red-400 ">
                                <div className="flex items-center p-1 justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-700">Garuda Karya Agro</CardTitle>
                                    <div className="rounded-lg bg-red-100 p-2">
                                        <Sprout size={18} className="text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="">
                                <Link href={route('products.agro')}>
                                    <Button variant="link"  className="flex h-auto items-center p-0 text-green-600">
                                        View details <ArrowRight size={16} className="ml-1" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                    </div>
                </div>

                <div className='w-full justify-center border'/>
                <div>
                    {can('products.create') && 
                        <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                            <Link href={route('products.allof')}>
                                <Button className='bg-accent-foreground '>
                                    <FolderOpen />
                                    All Product Data
                                </Button>
                            </Link>
                        </div>
                    }

                    {can('products.create') && 
                        <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                            <Link href={''}>
                                <Button className='bg-red-500 '>
                                    <Droplet />
                                    - Penyusutan
                                </Button>
                            </Link>
                        </div>
                    }
                </div>

            </div>




        </AppLayout>
    );
}
                // <div className='w-full justify-center h-auto flex mb-5 gap-2'>
                //     <div className='grid grid-cols-3 gap-4'>
                        
                //         <Card className="shadow-sm transition-shadow hover:shadow-md bg-amber-50">
                //             <CardHeader className="bg-amber-300 ">
                //                 <div className="flex items-center p-1 justify-between">
                //                     <CardTitle className="text-sm font-medium text-gray-500">Available Stock Kelapa</CardTitle>
                //                     <div className="rounded-lg bg-amber-100 p-2">
                //                         <TreePalm size={18} className="text-amber-600" />
                //                     </div>
                //                 </div>
                //             </CardHeader>
                //             <CardContent className='lg:-mt-4 text-amber-700'>
                //                 <div className="text-2xl font-bold">{hsl_kelapa}</div>
                //                 <div className='flex gap-2'> <p className='text-green-400'>IN</p> {formatCurrency(saldoinklp)}</div>
                //                 <div className='flex gap-2'> <p className='text-red-400'>Out</p> {formatCurrency(saldooutklp)}</div>
                //             </CardContent>
                //         </Card>
                        
                //         <Card className="shadow-sm transition-shadow hover:shadow-md bg-blue-50">
                //             <CardHeader className="bg-blue-300 ">
                //                 <div className="flex items-center p-1 justify-between">
                //                     <CardTitle className="text-sm font-medium text-gray-500">Available Stock Karet</CardTitle>
                //                     <div className="rounded-lg bg-blue-100 p-2">
                //                         <Package size={18} className="text-blue-600" />
                //                     </div>
                //                 </div>
                //             </CardHeader>
                //             <CardContent className='lg:-mt-4 text-blue-700'>
                //                 <div className="text-2xl font-bold">{hsl_karet}</div>
                //                 <div className='flex gap-2'> <p className='text-green-400'>IN</p> {formatCurrency(saldoin)} <p>(Bayar Penoreh)</p></div>
                //                 <div className='flex gap-2'> <p className='text-red-400'>Out</p> {formatCurrency(saldoout)} <p>(Hasil Jual)</p></div>
                //             </CardContent>
                //             {/* <CardFooter className="">
                //                 <Button variant="link" className="flex h-auto items-center p-0 text-green-600">
                //                     View details <ArrowRight size={16} className="ml-1" />
                //                 </Button>
                //             </CardFooter> */}
                //         </Card>
                        
                        
                //         <Card className="shadow-sm transition-shadow hover:shadow-md bg-red-50">
                //             <CardHeader className="bg-red-300 ">
                //                 <div className="flex items-center p-1 justify-between">
                //                     <CardTitle className="text-sm font-medium text-gray-500">Available Stock Pupuk</CardTitle>
                //                     <div className="rounded-lg bg-red-100 p-2">
                //                         <Wheat size={18} className="text-red-600" />
                //                     </div>
                //                 </div>
                //             </CardHeader>
                //             <CardContent className='lg:-mt-4 text-red-700'>
                //                 <div className="text-2xl font-bold">{hsl_pupuk}</div>
                //                 <div className='flex gap-2'> <p className='text-green-400'>IN</p> {formatCurrency(saldoinppk)}</div>
                //                 <div className='flex gap-2'> <p className='text-red-400'>Out</p> {formatCurrency(saldooutppk)}</div>
                //             </CardContent>
                //         </Card>

                //     </div>

                // </div>
                

                // <div className='border p-2 rounded-lg'>

                //     {/* <div className=''>

                //         {can('products.create') && 
                //             <div className='w-full justify-end h-auto flex mb-5 gap-2'>
                //                 <Link href={route('products.create')}>
                //                     <Button className='bg-yellow-600 w-25 hover:bg-yellow-500'>
                //                         <CirclePlus />
                //                         Product
                //                     </Button>
                //                 </Link>
                //             </div>
                //         }
                //     </div> */}

                //     <div>
                //         {flash.message && (
                //             <Alert>
                //                 <Megaphone className='h4-w4' />
                //                 <AlertTitle className='text-green-600'>
                //                     Notification
                //                 </AlertTitle>
                //                 <AlertDescription>
                //                     {flash.message}
                //                 </AlertDescription>
                //             </Alert>
                //         )}
                //     </div>
                    
                //     <CardContent className=' rounded-lg'>
                //         <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                //             <div className="relative flex-1">
                //                 <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                //                 <Input
                //                     placeholder="Search..."
                //                     // value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                //                     // onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                //                     className="pl-8"
                //                 />
                //             </div>
                //             <div className="flex items-center gap-2">
                //                 <Select defaultValue="all-time">
                //                     <SelectTrigger className="w-[180px]">
                //                         <SelectValue placeholder="Select time period" />
                //                     </SelectTrigger>
                //                     <SelectContent>
                //                         <SelectItem value="all-time">All Time</SelectItem>
                //                         <SelectItem value="today">Today</SelectItem>
                //                         <SelectItem value="this-week">This Week</SelectItem>
                //                         <SelectItem value="this-month">This Month</SelectItem>
                //                         <SelectItem value="this-year">This Year</SelectItem>
                //                     </SelectContent>
                //                 </Select>
                                
                //                 <Button variant="outline"  className="flex items-center gap-1">
                //                     <FileDown className="h-4 w-4" />
                //                     {/* onClick={handleExportToExcel} */}
                //                     Export
                //                 </Button>
                //             </div>
                //         </div>
                //         <div className="rounded-md">
                        
                //             {products.length > 0 && (
                //                 <Table>
                //                     <TableHeader>
                //                         <TableRow>
                //                         {/* <TableHead className="w-[100px]">ID</TableHead> */}
                //                         <TableHead>Produk</TableHead>
                //                         <TableHead>Tanggal</TableHead>
                //                         <TableHead>Supplier</TableHead>
                //                         <TableHead>Jenis Barang</TableHead>
                //                         <TableHead>Quantity (IN)</TableHead>
                //                         <TableHead>Quantity (OUT)</TableHead>
                //                         <TableHead>Total Harga (IN)</TableHead>
                //                         <TableHead>Total Harga (OUT)</TableHead>
                //                         <TableHead className='text-center'>Status</TableHead>
                //                         {/* <TableHead className="text-center">Action</TableHead> */}
                //                         </TableRow>
                //                     </TableHeader>

                //                     <TableBody>
                //                         {products.map((product) => (

                //                             <TableRow>
                //                                 {/* <TableCell className="font-medium">{product.id}</TableCell> */}
                //                                 <TableCell>{product.product}</TableCell>
                //                                 <TableCell>{product.date}</TableCell>
                //                                 <TableCell>{product.nm_supplier}</TableCell>
                //                                 <TableCell>{product.j_brg}</TableCell>
                //                                 <TableCell>{product.qty_kg}</TableCell>
                //                                 <TableCell>{product.qty_out}</TableCell>
                //                                 <TableCell>{formatCurrency(product.amount)}</TableCell>
                //                                 <TableCell>{formatCurrency(product.amount_out)}</TableCell>
                //                                 <TableCell className="text-center ">
                //                                     <Tag_Karet status={product.status}/>        
                //                                 </TableCell>
                //                                 {/* <TableCell className="text-center space-x-2">

                //                                     {can('products.view') &&
                //                                         <Link href={route('products.show', product.id)}>
                //                                             <Button className='bg-transparent hover:bg-gray-700'>
                //                                                 <Eye color='gray'/>
                //                                             </Button>
                //                                         </Link>
                //                                     }

                //                                     {can('products.edit') && 
                //                                         <Link href={route('products.edit', product.id)}>
                //                                             <Button className='bg-transparent hover:bg-gray-700'>
                //                                                 <Pencil color='blue'/>
                //                                             </Button>
                //                                         </Link>
                //                                     }

                //                                     {can('products.delete') && 
                //                                         <Button disabled={processing} onClick={() => handleDelete(product.id, product.product)} className='bg-transparent hover:bg-gray-700'>
                //                                             <Trash color='red'/>
                //                                         </Button>
                //                                     }
                //                                 </TableCell> */}
                //                             </TableRow>
                //                         ))}
                //                     </TableBody>
                //                 </Table>

                //             )}

                //         </div>
                //     </CardContent>

                // </div>