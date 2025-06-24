<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incisor;
use App\Models\Incised;
use Inertia\Inertia;

class IncisorController extends Controller
{
    public function index()
    {
        $incisors = Incisor::orderBy('created_at', 'ASC')->get();
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

        $currentMonth = date('m'); 
        $currentYear = date('Y'); 

        $totalQtyKgThisMonth = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->sum('qty_kg');

        $totalQtyKg = Incised::where('no_invoice', $incisor->no_invoice)
                        ->sum('qty_kg');

        $pendapatanBulanIni = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->sum('amount');
        
        // Kasbon Bulan Ini (gaji = total amount per bulan * 50%)
        $totalAmountBulanIni = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->sum('amount');
        $kasbonBulanIni = $totalAmountBulanIni * 0.5;


        $dailyData = Incised::where('no_invoice', $incisor->no_invoice)
            ->select('product', 'date as tanggal', 'no_invoice as kode_penoreh', 'lok_kebun as kebun', 'j_brg as jenis_barang', 'qty_kg', 'amount as total_harga')
            ->orderBy('created_at', 'DESC')
            ->get();

        return Inertia::render('Incisors/show', [
            'incisor' => $incisor->toArray(), // Konversi ke array untuk konsistensi
            'totalQtyKg' => $totalQtyKg,
            'dailyData' => $dailyData,
            'totalQtyKgThisMonth' => $totalQtyKgThisMonth,
            'pendapatanBulanIni' => $pendapatanBulanIni,
            'kasbonBulanIni' => $kasbonBulanIni,
        ]);
        // return inertia('Incisors/show', compact('incisor'));
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
