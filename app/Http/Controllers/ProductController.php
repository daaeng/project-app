<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsAllExport; 
use Carbon\Carbon; 

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')->get();
        
        $karet = Product::where('product', 'karet')->SUM('qty_kg');
        $karet2 = Product::where('product', 'karet')->SUM('qty_out');

        $saldoin = Product::where('product', 'karet')->SUM('amount');
        $saldoout = Product::where('product', 'karet')->SUM('amount_out');

        $klp = Product::where('product', 'kelapa')->SUM('qty_kg');
        $klp2 = Product::where('product', 'kelapa')->SUM('qty_out');

        $saldoinklp = Product::where('product', 'kelapa')->SUM('amount');
        $saldooutklp = Product::where('product', 'kelapa')->SUM('amount_out');
        
        $ppk = Product::where('product', 'pupuk')->SUM('qty_kg');
        $ppk2 = Product::where('product', 'pupuk')->SUM('qty_out');

        $saldoinppk = Product::where('product', 'pupuk')->SUM('amount');
        $saldooutppk = Product::where('product', 'pupuk')->SUM('amount_out');

        return Inertia::render("Products/index", [
            "products" => $products,
            "filter" => request()->only(['search']), 
            "hsl_karet" => $karet - $karet2,
            "saldoin" => $saldoin,
            "saldoout" => $saldoout,            
            "hsl_kelapa" => $klp - $klp2,
            "saldoinklp" => $saldoinklp,
            "saldooutklp" => $saldooutklp,  
            "hsl_pupuk" => $ppk - $ppk2,
            "saldoinppk" => $saldoinppk,
            "saldooutppk" => $saldooutppk,  
        ]);
    }

    public function create()
    {
            return inertia('Products/create');
    }
    
    public function c_send()
    {
            return inertia('Products/c_send');
    }
    
    public function s_gka()
    {
            return inertia('Products/s_gka');
    }

    public function store(Request $request)
    {
        $request->validate([
            'product' => 'required|string|max:250',
            'date' => 'required|date',
            'no_invoice' => 'required|string|max:250',
            'nm_supplier' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'nullable|numeric',
            'price_qty' => 'nullable|numeric',
            'amount' => 'nullable|numeric',
            'keping' => 'nullable|numeric',
            'kualitas' => 'nullable|string|max:250',
            'qty_out' => 'nullable|numeric',
            'price_out' => 'nullable|numeric',
            'amount_out' => 'nullable|numeric',
            'keping_out' => 'nullable|numeric',
            'kualitas_out' => 'nullable|string|max:250',
            'status' => 'required|string|max:250',
        ]);

        Product::create($request->all());
        return redirect()->route('products.index')->with('message', 'Product Created Successfully');        
    }

    public function edit(Product $product){
        return inertia('Products/Edit', compact('product'));
    }
    
    public function edit_out(Product $product){
        return inertia('Products/Edit_out', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'product' => 'required|string|max:250',
            'date' => 'required|date',
            'no_invoice' => 'required|string|max:250',
            'nm_supplier' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'nullable|numeric',
            'price_qty' => 'nullable|numeric',
            'amount' => 'nullable|numeric',
            'keping' => 'nullable|numeric',
            'kualitas' => 'nullable|string|max:250',
            'qty_out' => 'nullable|numeric',
            'price_out' => 'nullable|numeric',
            'amount_out' => 'nullable|numeric',
            'keping_out' => 'nullable|numeric',
            'kualitas_out' => 'nullable|string|max:250',
            'status' => 'required|string|max:250',
        ]);
        
        $product->update([
            'product' => $request->input('product'),
            'date' => $request->input('date'),
            'no_invoice' => $request->input('no_invoice'),
            'nm_supplier' => $request->input('nm_supplier'),
            'j_brg' => $request->input('j_brg'),
            'desk' => $request->input('desk'),
            'qty_kg' => $request->input('qty_kg'),
            'price_qty' => $request->input('price_qty'),
            'amount' => $request->input('amount'),
            'keping' => $request->input('keping'),
            'kualitas' => $request->input('kualitas'),
            'qty_out' => $request->input('qty_out'),
            'price_out' => $request->input('price_out'),
            'amount_out' => $request->input('amount_out'),
            'keping_out' => $request->input('keping_out'),
            'kualitas_out' => $request->input('kualitas_out'),
            'status' => $request->input('status'),
        ]);

        return redirect()->route('products.index')->with('message', 'Product Updated Successfully');        

    }

    public function show(Product $product)
    {
       $susutValue = 0; // Default value

        if ($product->product === 'karet' && $product->status === 'buyer') {
            $productDate = Carbon::parse($product->date)->toDateString();

            $gkaTotalOnDate = Product::where('product', 'karet')
                ->where('status', 'gka')
                ->whereDate('date', $productDate)
                ->sum('qty_out');

            $buyerTotalOnDate = Product::where('product', 'karet')
                ->where('status', 'buyer')
                ->whereDate('date', $productDate)
                ->sum('qty_out');

            if ($gkaTotalOnDate > 0) {
                $susutValue = $gkaTotalOnDate - $buyerTotalOnDate;
            }
        }
        return inertia('Products/show', [
            'product' => $product,
            'susut_value' => $susutValue,
        ]);
    }
    
    public function show_buy(Product $product)
    {
    //     $susutValue = 0; // Default value

    //     if ($product->product === 'karet' && $product->status === 'buyer') {
    //         $productDate = Carbon::parse($product->date)->toDateString();

    //         $gkaTotalOnDate = Product::where('product', 'karet')
    //             ->where('status', 'gka')
    //             ->whereDate('date', $productDate)
    //             ->sum('qty_kg');

    //         $buyerTotalOnDate = Product::where('product', 'karet')
    //             ->where('status', 'buyer')
    //             ->whereDate('date', $productDate)
    //             ->sum('qty_kg');

    //         if ($gkaTotalOnDate > 0) {
    //             $susutValue = $gkaTotalOnDate - $buyerTotalOnDate;
    //         }
    //     }
        return inertia('Products/show_buy', [
            'product' => $product,
            // 'susut_value' => $susutValue,
        ]);
    }

    public function gka(Request $request)
    {
        $perPage = 20; 
        $searchTerm = $request->input('search');
        $timePeriod = $request->input('time_period', 'all-time'); 
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);
        $productType = $request->input('product_type', 'all'); 

        $baseQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });
        
        $dateFilterQuery = clone $baseQuery;
            
        if ($timePeriod === 'specific-month') {
            $dateFilterQuery->whereMonth('date', $selectedMonth)
                      ->whereYear('date', $selectedYear);
        } elseif ($timePeriod !== 'all-time') {
            switch ($timePeriod) {
                case 'today':
                    $dateFilterQuery->whereDate('date', Carbon::today());
                    break;
                case 'this-week':
                    $dateFilterQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                    break;
                case 'this-month':
                    $dateFilterQuery->whereMonth('date', Carbon::now()->month)
                              ->whereYear('date', Carbon::now()->year);
                    break;
                case 'last-month':
                    $lastMonth = Carbon::now()->subMonth();
                    $dateFilterQuery->whereMonth('date', $lastMonth->month)
                              ->whereYear('date', $lastMonth->year);
                    break;
                case 'this-year':
                    $dateFilterQuery->whereYear('date', Carbon::now()->year);
                    break;
            }
        }


        // --- START: LOGIKA PERHITUNGAN SUSUT (BERDASARKAN TANGGAL YANG SAMA) ---
        $susutMap = [];

        // 1. Ambil total qty_out per tanggal untuk status 'gka'
        $gkaTotalsByDate = Product::where('product', 'karet')
            ->where('status', 'gka')
            ->groupBy('date')
            ->select('date', DB::raw('SUM(qty_out) as total_gka_qty'))
            ->get()
            ->pluck('total_gka_qty', 'date');

        // 2. Ambil total qty_out per tanggal untuk status 'buyer'
        $buyerTotalsByDate = Product::where('product', 'karet')
            ->where('status', 'buyer')
            ->groupBy('date')
            ->select('date', DB::raw('SUM(qty_out) as total_buyer_qty'))
            ->get()
            ->pluck('total_buyer_qty', 'date');

        // 3. Hitung susut untuk setiap tanggal yang ada di data buyer
        foreach ($buyerTotalsByDate as $date => $buyerTotal) {
            // Cek apakah ada data gka di tanggal yang sama
            if (isset($gkaTotalsByDate[$date])) {
                $gkaTotal = $gkaTotalsByDate[$date];
                $susutMap[$date] = $gkaTotal - $buyerTotal;
            }
        }
        // --- END: LOGIKA PERHITUNGAN SUSUT ---


        // KARET - Data Pembelian (menampilkan status GKA)
        $products = $dateFilterQuery->clone()
            ->where('product', 'karet')
            ->where('qty_out', '>', 0)
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);

        // KARET - Data Penjualan (menampilkan status BUYER)
        $product2 = $dateFilterQuery->clone()
            ->where('product', 'karet')
            ->where('qty_out', '>', 0)  
            ->where('status', 'buyer') 
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);
        
        // 4. Tambahkan nilai susut ke data penjualan berdasarkan tanggal
        $product2->getCollection()->transform(function ($item) use ($susutMap) {
            // Mencocokkan berdasarkan tanggal dari item
            $itemDate = Carbon::parse($item->date)->toDateString();
            $item->susut_value = $susutMap[$itemDate] ?? 0;
            return $item;
        });

        // PUPUK
        $products3 = $dateFilterQuery->clone()
            ->where('product', 'pupuk')
            ->where('qty_out', '>', 0)
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);

        $product4 = $dateFilterQuery->clone()
            ->where('product', 'pupuk')
            ->where('qty_out', '>', 0)  
            ->where('status', 'buyer') 
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);
        
        $product4->getCollection()->transform(function ($item) {
            $item->susut_value = 0; return $item;
        });
        
        // KELAPA
        $products5 = $dateFilterQuery->clone()
            ->where('product', 'kelapa')
            ->where('qty_out', '>', 0)
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);

        $product6 = $dateFilterQuery->clone()
            ->where('product', 'kelapa')
            ->where('qty_out', '>', 0)  
            ->where('status', 'buyer') 
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage);
 
        $product6->getCollection()->transform(function ($item) {
            $item->susut_value = 0; return $item;
        });

        $statsQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });

            if ($timePeriod === 'specific-month') {
                $statsQuery->whereMonth('date', $selectedMonth)
                           ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $statsQuery->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $statsQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $statsQuery->whereMonth('date', Carbon::now()->month)
                                   ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month':
                        $lastMonth = Carbon::now()->subMonth();
                        $statsQuery->whereMonth('date', $lastMonth->month)
                                   ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $statsQuery->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

        // Statistik Karet
        $tm_slin = $statsQuery->clone()->where('status', 'gka')->where('product', 'karet')->SUM('amount_out');
        $tm_slou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'karet')->SUM('amount_out');
        $tm_sin = $statsQuery->clone()->where('status', 'gka')->where('product', 'karet')->SUM('qty_out');
        $tm_sou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'karet')->SUM('qty_out');
        
        // Statistik PUPUK
        $ppk_slin = $statsQuery->clone()->where('status', 'gka')->where('product', 'pupuk')->SUM('amount_out');
        $ppk_slou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'pupuk')->SUM('amount_out');
        $ppk_sin = $statsQuery->clone()->where('status', 'gka')->where('product', 'pupuk')->SUM('qty_out');
        $ppk_sou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'pupuk')->SUM('qty_out');
        
        // Statistik KELAPA
        $klp_slin = $statsQuery->clone()->where('status', 'gka')->where('product', 'kelapa')->SUM('amount_out');
        $klp_slou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'kelapa')->SUM('amount_out');
        $klp_sin = $statsQuery->clone()->where('status', 'gka')->where('product', 'kelapa')->SUM('qty_out');
        $klp_sou = $statsQuery->clone()->where('status', 'buyer')->where('product', 'kelapa')->SUM('qty_out');

        //keping
        $keping = $statsQuery->clone()->where('status', 'gka')->where('product', 'karet')->sum('keping_out');
        $keping2 = $statsQuery->clone()->where('status', 'buyer')->where('product', 'karet')->sum('keping_out');

        return Inertia::render("Products/gka", [
            "products" => $products,
            "products2" => $product2,

            "products3" => $products3,
            "products4" => $product4,
            
            "products5" => $products5,
            "products6" => $product6,
            "filter" => $request->only(['search', 'time_period', 'product_type', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth,
            "currentYear" => (int)$selectedYear,   
            
            // KARET
            "tm_slin" => $tm_slin,
            "tm_slou" => $tm_slou,
            
            "tm_sin" => $tm_sin,
            "tm_sou" => $tm_sou,

            "s_ready" => $tm_sin - $tm_sou,

            //keping
            "keping_in" => $keping,
            "keping_out" => $keping2,
            
            // PUPUK
            "ppk_slin" => $ppk_slin,
            "ppk_slou" => $ppk_slou,
            
            "ppk_sin" => $ppk_sin,
            "ppk_sou" => $ppk_sou,

            "p_ready" => $ppk_sin - $ppk_sou,
            
            // KELAPA
            "klp_slin" => $klp_slin,
            "klp_slou" => $klp_slou,
            
            "klp_sin" => $klp_sin,
            "klp_sou" => $klp_sou,

            "klp_ready" => $klp_sin - $klp_sou,
        ]);
    }
    
    public function tsa(Request $request) 
    {
        $perPage = 10; 
        $searchTerm = $request->input('search');
        // Default timePeriod menjadi 'this-month'
        $timePeriod = $request->input('time_period', 'this-month'); 
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);


        $baseQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });
            // Filter waktu diterapkan di sini
            if ($timePeriod === 'specific-month') {
                $baseQuery->whereMonth('date', $selectedMonth)
                          ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $baseQuery->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $baseQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $baseQuery->whereMonth('date', Carbon::now()->month)
                                  ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month': // Added last-month filter
                        $lastMonth = Carbon::now()->subMonth();
                        $baseQuery->whereMonth('date', $lastMonth->month)
                                  ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $baseQuery->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

        $products = $baseQuery->clone() 
            ->where('product', 'karet')
            ->where('qty_kg', '>', 0)
            ->where('status', 'tsa')
            ->orderBy('date', 'DESC')
            ->paginate($perPage, ['*'], 'page') 
            ->withQueryString(); 

        // --- Query untuk Tabel Penjualan Karet (products2) ---
        $product2 = $baseQuery->clone()
            ->where('product', 'karet')
            ->where('qty_out', '>', 0) 
            ->where('status', 'gka')
            ->orderBy('date', 'DESC')
            ->paginate($perPage, ['*'], 'page2') 
            ->withQueryString(); 

        // For statistics, apply the same time and search filters
        $statsQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });
            // Filter waktu diterapkan di sini
            if ($timePeriod === 'specific-month') {
                $statsQuery->whereMonth('date', $selectedMonth)
                           ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $statsQuery->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $statsQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $statsQuery->whereMonth('date', Carbon::now()->month)
                                   ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month': // Added last-month filter
                        $lastMonth = Carbon::now()->subMonth();
                        $statsQuery->whereMonth('date', $lastMonth->month)
                                   ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $statsQuery->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

            
        // TEMADU totals based on filtered data
        $tm_slin = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'tsa')->where('product', 'karet')->sum('amount');
        $tm_slou = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'gka')->where('product', 'karet')->sum('amount_out');
        $tm_sin = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $tm_sou = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        
        // Sebayar totals based on filtered data
        $ts_slin = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'tsa')->where('product', 'karet')->sum('amount');
        $ts_slou = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'gka')->where('product', 'karet')->sum('amount_out');
        $ts_sin = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $ts_sou = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        
        // Statistik Karet
        $karet = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $karet2 = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');

        //keping
        //keping total
        $keping = $statsQuery->clone()->where('status', 'tsa')->where('product', 'karet')->sum('keping');
        $keping2 = $statsQuery->clone()->where('status', 'gka')->where('product', 'karet')->sum('keping_out');
        //sebayar
        $keping_sbyr = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'tsa')->where('product', 'karet')->sum('keping');
        $keping_sbyr2 = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'gka')->where('product', 'karet')->sum('keping_out');
        //temadu
        $keping_tmd = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'tsa')->where('product', 'karet')->sum('keping');
        $keping_tmd2 = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'gka')->where('product', 'karet')->sum('keping_out');
        
        //hasil jual
        $jual = $statsQuery->clone()->where('nm_supplier', 'Sebayar')->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        $jual2 = $statsQuery->clone()->where('nm_supplier', 'Temadu')->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        
        //hasil karet
        $saldoin = $statsQuery->clone()->where('status', 'tsa')->where('product', 'karet')->sum('amount');
        $saldoout = $statsQuery->clone()->where('status', 'gka')->where('product', 'karet')->sum('amount_out');

        //hitung susut
        $susut_awal = Product::where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $susut_akhir = Product::where('status', 'gka')->where('product', 'karet')->sum('qty_out');

        return Inertia::render("Products/tsa", [
            "products" => $products,
            "products2" => $product2,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth, 
            "currentYear" => (int)$selectedYear,   

            "hsl_karet" => $karet + $karet2,
            "hsl_jual" => $jual + $jual2,
            
            "keping_in" => $keping,
            "keping_out" => $keping2,
            "keping_sbyr" => $keping_sbyr,
            "keping_sbyr2" => $keping_sbyr2,
            "keping_tmd" => $keping_tmd,
            "keping_tmd2" => $keping_tmd2,

            "saldoin" => $saldoin,
            "saldoout" => $saldoout,
            
            "tm_slin" => $tm_slin,
            "tm_slou" => $tm_slou,
            "tm_sin" => $tm_sin,
            "tm_sou" => $tm_sou,
            
            "ts_slin" => $ts_slin,
            "ts_slou" => $ts_slou,
            "ts_sin" => $ts_sin,
            "ts_sou" => $ts_sou,

            "s_ready" => $susut_awal - $susut_akhir,
        ]);
    }

    public function agro(Request $request) 
    {
        $perPage = 5; 
        $searchTerm = $request->input('search');
        // Default timePeriod menjadi 'this-month'
        $timePeriod = $request->input('time_period', 'this-month'); 
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);


        $baseQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });
            // Filter waktu diterapkan di sini
            if ($timePeriod === 'specific-month') {
                $baseQuery->whereMonth('date', $selectedMonth)
                          ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $baseQuery->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $baseQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $baseQuery->whereMonth('date', Carbon::now()->month)
                                  ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month': // Added last-month filter
                        $lastMonth = Carbon::now()->subMonth();
                        $baseQuery->whereMonth('date', $lastMonth->month)
                                  ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $baseQuery->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

        $products = $baseQuery->clone() 
            ->where('product', 'Pupuk')
            ->where('qty_kg', '>', 0)
            ->where('status', 'agro')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage, ['*'], 'page') 
            ->withQueryString(); 

        // --- Query untuk Tabel Penjualan Karet (products2) ---
        $product2 = $baseQuery->clone()
            ->where('product', 'Pupuk')
            ->where('qty_kg', '>', 0) 
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage, ['*'], 'page2') 
            ->withQueryString(); 

        // For statistics, apply the same time and search filters
        $statsQuery = Product::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            });
            // Filter waktu diterapkan di sini
            if ($timePeriod === 'specific-month') {
                $statsQuery->whereMonth('date', $selectedMonth)
                           ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $statsQuery->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $statsQuery->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $statsQuery->whereMonth('date', Carbon::now()->month)
                                   ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month': // Added last-month filter
                        $lastMonth = Carbon::now()->subMonth();
                        $statsQuery->whereMonth('date', $lastMonth->month)
                                   ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $statsQuery->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

        // Statistik Pupuk
        $ppk_in = $statsQuery->clone()->where('status', 'agro')->where('product', 'pupuk')->sum('qty_kg');
        $ppk_out = $statsQuery->clone()->where('status', 'agro')->where('product', 'pupuk')->sum('qty_out');
        $saldoin = $statsQuery->clone()->where('status', 'agro')->where('product', 'pupuk')->sum('amount');
        $saldoout = $statsQuery->clone()->where('status', 'agro')->where('product', 'pupuk')->sum('amount_out');

        // TEMADU totals based on filtered data
        $tm_slin = $statsQuery->clone()->where('nm_supplier', 'agro')->where('status', 'agro')->where('product', 'pupuk')->sum('amount');
        $tm_slou = $statsQuery->clone()->where('nm_supplier', 'agro')->where('status', 'gka')->where('product', 'pupuk')->sum('amount');
        $tm_sin = $statsQuery->clone()->where('nm_supplier', 'agro')->where('status', 'agro')->where('product', 'pupuk')->sum('qty_kg');
        $tm_sou = $statsQuery->clone()->where('nm_supplier', 'agro')->where('status', 'gka')->where('product', 'pupuk')->sum('qty_kg');

        return Inertia::render("Products/agro", [
            "products" => $products,
            "products2" => $product2,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']), 
            "currentMonth" => (int)$selectedMonth, 
            "currentYear" => (int)$selectedYear,  

            "hsl_karet" => $ppk_in - $ppk_out,
            "saldoin" => $saldoin,
            "saldoout" => $saldoout,
            
            "tm_slin" => $tm_slin,
            "tm_slou" => $tm_slou,
            "tm_sin" => $tm_sin,
            "tm_sou" => $tm_sou,
        ]);
    }

    public function allof(Request $request)
    {
        $perPage = 10; 
        $searchTerm = $request->input('search');
        // Default timePeriod menjadi 'this-month'
        $timePeriod = $request->input('time_period', 'this-month'); 
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);

        $query = Product::query()
            ->when($searchTerm, function ($q, $search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('product', 'like', "%{$search}%")
                             ->orWhere('no_invoice', 'like', "%{$search}%")
                             ->orWhere('nm_supplier', 'like', "%{$search}%")
                             ->orWhere('j_brg', 'like', "%{$search}%")
                             ->orWhere('status', 'like', "%{$search}%")
                             ->orWhere('date', 'like', "%{$search}%");
                });
            });
            // Filter waktu diterapkan di sini
            if ($timePeriod === 'specific-month') {
                $query->whereMonth('date', $selectedMonth)
                      ->whereYear('date', $selectedYear);
            } elseif ($timePeriod !== 'all-time') {
                switch ($timePeriod) {
                    case 'today':
                        $query->whereDate('date', Carbon::today());
                        break;
                    case 'this-week':
                        $query->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                        break;
                    case 'this-month':
                        $query->whereMonth('date', Carbon::now()->month)
                              ->whereYear('date', Carbon::now()->year);
                        break;
                    case 'last-month':
                        $lastMonth = Carbon::now()->subMonth();
                        $query->whereMonth('date', $lastMonth->month)
                              ->whereYear('date', $lastMonth->year);
                        break;
                    case 'this-year':
                        $query->whereYear('date', Carbon::now()->year);
                        break;
                }
            }

        // Clone the query before applying pagination to calculate statistics on the filtered set
        $filteredQueryForStats = clone $query;

        $products = $query->orderBy('created_at', 'DESC')->paginate($perPage)->appends($request->input());

        // Statistik Karet
        $karet_in = $filteredQueryForStats->clone()->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $karet_out = $filteredQueryForStats->clone()->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        $saldoin = $filteredQueryForStats->clone()->where('product', 'karet')->sum('amount');
        $saldoout = $filteredQueryForStats->clone()->where('product', 'karet')->sum('amount_out');

        // Statistik Kelapa
        $klp_in = $filteredQueryForStats->clone()->where('product', 'kelapa')->sum('qty_kg');
        $klp_out = $filteredQueryForStats->clone()->where('product', 'kelapa')->sum('qty_out');
        $saldoinklp = $filteredQueryForStats->clone()->where('product', 'kelapa')->sum('amount');
        $saldooutklp = $filteredQueryForStats->clone()->where('product', 'kelapa')->sum('amount_out');
        
        // Statistik Pupuk
        $ppk_in = $filteredQueryForStats->clone()->where('product', 'pupuk')->sum('qty_kg');
        $ppk_out = $filteredQueryForStats->clone()->where('product', 'pupuk')->sum('qty_out');
        $saldoinppk = $filteredQueryForStats->clone()->where('product', 'pupuk')->sum('amount');
        $saldooutppk = $filteredQueryForStats->clone()->where('product', 'pupuk')->sum('amount_out');

        return Inertia::render("Products/allof", [
            "products" => $products,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']), 
            "currentMonth" => (int)$selectedMonth, 
            "currentYear" => (int)$selectedYear,   
            
            "hsl_karet" => $karet_in - $karet_out,
            "saldoin" => $saldoin,
            "saldoout" => $saldoout,
            
            "hsl_kelapa" => $klp_in - $klp_out,
            "saldoinklp" => $saldoinklp,
            "saldooutklp" => $saldooutklp,
            
            "hsl_pupuk" => $ppk_in - $ppk_out,
            "saldoinppk" => $saldoinppk,
            "saldooutppk" => $saldooutppk,
        ]);
    }

    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted Successfully');
    }
}

