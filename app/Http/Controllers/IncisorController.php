<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incisor;
use Inertia\Inertia;

class IncisorController extends Controller
{
    public function index()
    {
        $incisors = Incisor::orderBy('created_at', 'DESC')->get();
        return Inertia::render("Incisors/index", 
            [
                "incisors" => $incisors,
            ]
        );
    }

    public function create()
    {
            // return inertia('Incisors/create');
            return Inertia::render("Incisors/create");
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'ttl' => 'required|date',
            'gender' => 'required|string|max:250',
            'address' => 'required|string|max:250',
            'agama' => 'required|string|max:250',
            'status' => 'required|string|max:250',
            'no_invoice' => 'required|string|max:250',
            'lok_toreh' => 'required|string|max:250',
            
        ]);

        Incisor::create($request->all());
        return redirect()->route('incisors.index')->with('message', 'Users Creadted Successfully');
    }

    public function edit(Incisor $incisor){
        return inertia('Incisors/edit', compact('incisor'));
    }

    public function update(Request $request, Incisor $incisor)
    {
        $request->validate([
            'name' => 'required|string|max:250',
            'ttl' => 'required|date',
            'gender' => 'required|string|max:250',
            'address' => 'required|string|max:250',
            'agama' => 'required|string|max:250',
            'status' => 'required|string|max:250',
            'no_invoice' => 'required|string|max:250',
            'lok_toreh' => 'required|string|max:250',
        ]);
        
        $incisor->update([
            'name' => $request->input('name'),
            'ttl' => $request->input('ttl'),
            'gender' => $request->input('gender'),
            'address' => $request->input('address'),
            'agama' => $request->input('agama'),
            'status' => $request->input('status'),
            'no_invoice' => $request->input('no_invoice'),
            'lok_toreh' => $request->input('lok_toreh'),
            
        ]);

        return redirect()->route('incisors.index')->with('message', 'Product Updated Successfully');        

    }

    public function show(Incisor $incisor){
        return inertia('Incisors/show', compact('incisor'));
    }

    public function destroy(Incisor $incisor){
        $incisor->delete();
        return redirect()->route('incisors.index')->with('message', 'Invoice deleted Successfully');
    }

    public function getNoInvoices()
    {
        $noInvoices = Incisor::pluck('no_invoice')->unique()->values();
        return response()->json($noInvoices);
    }
}
