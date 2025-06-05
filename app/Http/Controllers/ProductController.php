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
        ]);

        return redirect()->route('products.index')->with('message', 'Product Updated Successfully');        

    }

    public function show(Product $product){
        return inertia('Products/show', compact('product'));
    }

    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted Successfully');
    }
}

//return inertia::render('Products/index', []);
//        return redirect()->route('products.index')
