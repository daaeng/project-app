<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'DESC')->get();
        // dd($products);
        
        //berdasarkan product Karet
        $karet = Product::where('product', 'karet')->SUM('qty_kg');
        $karet2 = Product::where('product', 'karet')->SUM('qty_out');

        $saldoin = Product::where('product', 'karet')->SUM('amount');
        $saldoout = Product::where('product', 'karet')->SUM('amount_out');

        //berdasarkan product Kelapa
        $klp = Product::where('product', 'kelapa')->SUM('qty_kg');
        $klp2 = Product::where('product', 'kelapa')->SUM('qty_out');

        $saldoinklp = Product::where('product', 'kelapa')->SUM('amount');
        $saldooutklp = Product::where('product', 'kelapa')->SUM('amount_out');
        
        //berdasarkan product Pupuk
        $ppk = Product::where('product', 'pupuk')->SUM('qty_kg');
        $ppk2 = Product::where('product', 'pupuk')->SUM('qty_out');

        $saldoinppk = Product::where('product', 'pupuk')->SUM('amount');
        $saldooutppk = Product::where('product', 'pupuk')->SUM('amount_out');

        return Inertia::render("Products/index", [
            // "products" => Product::all(),
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

    public function store(Request $request)
    {
        $request->validate([
            'product' => 'required|string|max:250',
            'date' => 'required|date',
            'no_invoice' => 'required|string|max:250',
            'nm_supplier' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'keping' => 'required|numeric',
            'qty_out' => 'required|numeric',
            'price_out' => 'required|numeric',
            'amount_out' => 'required|numeric',
            'keping_out' => 'required|numeric',
            // 'status' => 'required|string|max:250',
        ]);

        Product::create($request->all());
        return redirect()->route('products.index')->with('message', 'Product Creadted Successfully');        
    }

    public function edit(Product $product){
        return inertia('Products/Edit', compact('product'));
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
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'keping' => 'required|numeric',
            'qty_out' => 'required|numeric',
            'price_out' => 'required|numeric',
            'amount_out' => 'required|numeric',
            'keping_out' => 'required|numeric',
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
            'qty_out' => $request->input('qty_out'),
            'price_out' => $request->input('price_out'),
            'amount_out' => $request->input('amount_out'),
            'keping_out' => $request->input('keping_out'),
            'status' => $request->input('status'),
        ]);

        return redirect()->route('products.index')->with('message', 'Product Updated Successfully');        

    }

    public function show(Product $product){
        return inertia('Products/show', compact('product'));
    }

    public function gka()
    {
        $products = Product::where('product', 'karet')
            ->where('qty_kg', '>', 0)
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->get();
        
        $product2 = Product::where('product', 'karet')
            ->where('qty_out', '>', 0)
            ->where('status', 'buyer')
            ->orderBy('created_at', 'DESC')
            ->get();
        // dd($products);
        
        //berdasarkan product Karet
        $karet = Product::where('status', 'gka')
            ->where('product', 'karet')->SUM('qty_kg');

        $karet2 = Product::where('status', 'buyer')
            ->where('product', 'karet')->SUM('qty_out');

        $saldoin = Product::where('status', 'gka')
            ->where('product', 'karet')->SUM('amount');
        $saldoout = Product::where('status', 'buyer')
            ->where('product', 'karet')->SUM('amount_out');

        // ----------------GKA----------------
        $tm_slin = Product::where('status', 'gka')
            ->where('product', 'karet')->SUM('amount');

        $tm_slou = Product::where('status', 'buyer')
            ->where('product', 'karet')->SUM('amount_out');

        // -------------GKA STOCK-------------
        $tm_sin = Product::where('status', 'gka')
            ->where('product', 'karet')->SUM('qty_kg');

        $tm_sou = Product::where('status', 'buyer')
            ->where('product', 'karet')->SUM('qty_out');

        return Inertia::render("Products/gka", [
            "products" => $products,
            "products2" => $product2,
            "filter" => request()->only(['search']),

            // "hsl_karet" => $karet - $karet2,
            "saldoin" => $saldoin,
            "saldoout" => $saldoout,            
            
            "tm_slin" => $tm_slin,
            "tm_slou" => $tm_slou,
            
            "tm_sin" => $tm_sin,
            "tm_sou" => $tm_sou,
        ]);
    }
    
    public function tsa()
    {
        $products = Product::where('product', 'karet')
            ->where('qty_kg', '>', 0)
            ->where('status', 'tsa')
            ->orderBy('created_at', 'DESC')
            ->get();
        
        $product2 = Product::where('product', 'karet')
            ->where('qty_kg', '>', 0)
            ->where('status', 'gka')
            ->orderBy('created_at', 'DESC')
            ->get();

        $karet = Product::where('status', 'tsa')
            ->where('product', 'karet')->SUM('qty_kg');

        $karet2 = Product::where('status', 'tsa')
            ->where('product', 'karet')->SUM('qty_out');

        $saldoin = Product::where('status', 'tsa')
            ->where('product', 'karet')->SUM('amount');

        $saldoout = Product::where('status', 'gka')
            ->where('product', 'karet')->SUM('amount');        
        
        // ----------------TEMADU----------------
        $tm_slin = Product::where('nm_supplier', 'Temadu')
            ->where('status', 'tsa')
            ->where('product', 'karet')->SUM('amount');

        $tm_slou = Product::where('nm_supplier', 'Temadu')
            ->where('status', 'gka')
            ->where('product', 'karet')->SUM('amount');

        // -------------TEMADU STOCK-------------
        $tm_sin = Product::where('nm_supplier', 'Temadu')
            ->where('status', 'tsa')
            ->where('product', 'karet')->SUM('qty_kg');

        $tm_sou = Product::where('nm_supplier', 'Temadu')
            ->where('status', 'gka')
            ->where('product', 'karet')->SUM('qty_kg');
        
        // ----------------Sebayar----------------
        $ts_slin = Product::where('nm_supplier', 'Sebayar')
            ->where('status', 'tsa')
            ->where('product', 'karet')->SUM('amount');

        $ts_slou = Product::where('nm_supplier', 'Sebayar')
            ->where('status', 'gka')
            ->where('product', 'karet')->SUM('amount');

        // -------------Sebayar STOCK-------------
        $ts_sin = Product::where('nm_supplier', 'Sebayar')
            ->where('status', 'tsa')
            ->where('product', 'karet')->SUM('qty_kg');

        $ts_sou = Product::where('nm_supplier', 'Sebayar')
            ->where('status', 'gka')
            ->where('product', 'karet')->SUM('qty_kg');

        return Inertia::render("Products/tsa", [
            "products" => $products,
            "products2" => $product2,
            "filter" => request()->only(['search']),

            "hsl_karet" => $karet - $karet2,
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
                        
        ]);
    }

    public function allof()
    {
        $query = Product::query();

        // Ambil parameter pencarian dari request
        $search = request()->input('search');

        // Jika ada kata kunci pencarian, terapkan filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product', 'like', "%{$search}%")
                  ->orWhere('no_invoice', 'like', "%{$search}%")
                  ->orWhere('nm_supplier', 'like', "%{$search}%");
            });
        }

        $products = Product::orderBy('created_at', 'DESC')->get();
        
        //berdasarkan product Karet
        $karet = Product::where('product', 'karet')->SUM('qty_kg');
        $karet2 = Product::where('product', 'karet')->SUM('qty_out');

        $saldoin = Product::where('product', 'karet')->SUM('amount');
        $saldoout = Product::where('product', 'karet')->SUM('amount_out');

        //berdasarkan product Kelapa
        $klp = Product::where('product', 'kelapa')->SUM('qty_kg');
        $klp2 = Product::where('product', 'kelapa')->SUM('qty_out');

        $saldoinklp = Product::where('product', 'kelapa')->SUM('amount');
        $saldooutklp = Product::where('product', 'kelapa')->SUM('amount_out');
        
        //berdasarkan product Pupuk
        $ppk = Product::where('product', 'pupuk')->SUM('qty_kg');
        $ppk2 = Product::where('product', 'pupuk')->SUM('qty_out');

        $saldoinppk = Product::where('product', 'pupuk')->SUM('amount');
        $saldooutppk = Product::where('product', 'pupuk')->SUM('amount_out');

        return Inertia::render("Products/allof", [
            // "products" => Product::all(),
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

    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted Successfully');
    }
}

//return inertia::render('Products/index', []);
//        return redirect()->route('products.index')
