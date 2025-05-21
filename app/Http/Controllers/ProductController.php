<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return inertia('Products/index', compact('products'));
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
            'no_invoice' => 'required|numeric',
            'nm_supplier' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'qty_out' => 'required|numeric',
            'price_out' => 'required|numeric',
            'amount_out' => 'required|numeric',
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
            'no_invoice' => 'required|numeric',
            'nm_supplier' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'qty_out' => 'required|numeric',
            'price_out' => 'required|numeric',
            'amount_out' => 'required|numeric',
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
            'qty_out' => $request->input('qty_out'),
            'price_out' => $request->input('price_out'),
            'amount_out' => $request->input('amount_out'),
        ]);

        return redirect()->route('products.index')->with('message', 'Product Updated Successfully');        

    }

    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted Successfully');
    }
}

//return inertia::render('Products/index', []);
//        return redirect()->route('products.index')
