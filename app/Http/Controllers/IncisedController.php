<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incised;
use App\Models\Incisor;
use Inertia\Inertia;

class IncisedController extends Controller
{
    public function index()
    {
        $perPage = 10; // Jumlah item per halaman, bisa disesuaikan
        $inciseds = Incised::with('incisor') // Pastikan relasi sudah didefinisikan di model
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->through(function ($incised) {
                $incisor = $incised->incisor;
                return [
                    'id' => $incised->id,
                    'product' => $incised->product,
                    'date' => $incised->date,
                    'no_invoice' => $incised->no_invoice,
                    'lok_kebun' => $incised->lok_kebun,
                    'j_brg' => $incised->j_brg,
                    'desk' => $incised->desk,
                    'qty_kg' => $incised->qty_kg,
                    'price_qty' => $incised->price_qty,
                    'amount' => $incised->amount,
                    'keping' => $incised->keping,
                    'kualitas' => $incised->kualitas,
                    'incisor_name' => $incisor ? $incisor->name : null, // Ambil nama dari incisor
                ];
            });

        return Inertia::render("Inciseds/index", [
            "inciseds" => $inciseds,
        ]);
    }

    public function create()
    {
        $noInvoicesWithNames = Incisor::select('no_invoice', 'name')->get()->map(function ($item) {
            return [
                'no_invoice' => $item->no_invoice,
                'name' => $item->name,
            ];
        })->unique('no_invoice')->values()->all(); // Hindari duplikat berdasarkan no_invoice
        return Inertia::render("Inciseds/create", [
            'noInvoicesWithNames' => $noInvoicesWithNames,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product' => 'required|string|max:250',
            'date' => 'required|date',
            'no_invoice' => 'required|string|max:250',
            'lok_kebun' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'keping' => 'required|numeric',
            'kualitas' => 'required|string|max:250',
        ]);

        Incised::create($request->all());
        return redirect()->route('inciseds.index')->with('message', 'Users Creadted Successfully');
    }

    public function edit(string $id)
    {
        $incised = Incised::with('incisor')->find($id);
        $noInvoicesWithNames = Incisor::select('no_invoice', 'name')->get()->map(function ($item) {
            return [
                'no_invoice' => $item->no_invoice,
                'name' => $item->name,
            ];
        })->unique('no_invoice')->values()->all();
        return Inertia::render('Inciseds/edit', [
            'incised' => $incised,
            'noInvoicesWithNames' => $noInvoicesWithNames,
        ]);
    }

    public function update(Request $request, Incised $incised)
    {
        $request->validate([
            'product' => 'required|string|max:250',
            'date' => 'required|date',
            'no_invoice' => 'required|string|max:250',
            'lok_kebun' => 'required|string|max:250',
            'j_brg' => 'required|string|max:250',
            'desk' => 'nullable|string',
            'qty_kg' => 'required|numeric',
            'price_qty' => 'required|numeric',
            'amount' => 'required|numeric',
            'keping' => 'required|numeric',
            'kualitas' => 'required|string|max:250',
        ]);

        $incised->update([
            'product' => $request->input('product'),
            'date' => $request->input('date'),
            'no_invoice' => $request->input('no_invoice'),
            'lok_kebun' => $request->input('lok_kebun'),
            'j_brg' => $request->input('j_brg'),
            'desk' => $request->input('desk'),
            'qty_kg' => $request->input('qty_kg'),
            'price_qty' => $request->input('price_qty'),
            'amount' => $request->input('amount'),
            'keping' => $request->input('keping'),
            'kualitas' => $request->input('kualitas'), // Perbaiki: hapus 'required|string|max:250' di sini
        ]);

        return redirect()->route('inciseds.index')->with('message', 'Data Updated Successfully');
    }

    public function show(Incised $incised)
    {
        $incised->load('incisor');
        $data = $incised->toArray();
        $data['incisor_name'] = $incised->incisor ? $incised->incisor->name : null;
        return Inertia::render('Inciseds/show', [
            'incised' => $data,
        ]);
    }

    public function destroy(Incised $incised)
    {
        $incised->delete();
        return redirect()->route('inciseds.index')->with('message', 'Invoice deleted Successfully');
    }
}