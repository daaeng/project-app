<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incised;
use App\Models\Incisor;
use Inertia\Inertia;
use Carbon\Carbon; // Import Carbon untuk manipulasi tanggal

class IncisedController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10; // Jumlah item per halaman, bisa disesuaikan
        $searchTerm = $request->input('search'); // Get the search term from the request
        $timePeriod = $request->input('time_period', 'all-time'); // Get time_period, default to 'all-time'

        $inciseds = Incised::query()
            ->with('incisor') // Eager load the 'incisor' relationship
            ->when($searchTerm, function ($query, $search) {
                $query->where('product', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('lok_kebun', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%")
                      // If 'incisor_name' needs to be searchable from the Incisor model,
                      // you would typically need a join here:
                      ->orWhereHas('incisor', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            })
            ->when($timePeriod, function ($query, $period) {
                switch ($period) {
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
                    case 'this-year':
                        $query->whereYear('date', Carbon::now()->year);
                        break;
                    case 'all-time':
                    default:
                        // No date filter applied for 'all-time'
                        break;
                }
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->through(function ($incised) {
                // Ensure the 'incisor' relationship is loaded before accessing it
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
            })
            ->withQueryString(); // Keep search and time_period parameters in pagination links

        return Inertia::render("Inciseds/index", [
            "inciseds" => $inciseds,
            "filter" => $request->only(['search', 'time_period']), // Send back the current search and time_period filters
        ]);
    }

    public function create()
    {
        $noInvoicesWithNames = Incisor::select('no_invoice', 'name')->get()->map(function ($item) {
            return [
                'no_invoice' => $item->no_invoice,
                'name' => $item->name,
            ];
        })->unique('no_invoice')->values()->all();
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
            'kualitas' => $request->input('kualitas'),
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
