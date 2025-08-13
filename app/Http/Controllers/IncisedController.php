<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incised;
use App\Models\Incisor;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class IncisedController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');
        // --- PERUBAHAN 1: Set default time_period ke 'this-month' ---
        $timePeriod = $request->input('time_period', 'this-month');
        $specificMonth = $request->input('month');
        $specificYear = $request->input('year');

        // --- Fungsi untuk menerapkan filter waktu ---
        $applyTimeFilter = function ($query, $period, $month, $year) {
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
                // --- PERUBAHAN 2: Tambah case untuk 'last-month' ---
                case 'last-month':
                    $query->whereMonth('date', Carbon::now()->subMonth()->month)
                          ->whereYear('date', Carbon::now()->subMonth()->year);
                    break;
                case 'this-year':
                    $query->whereYear('date', Carbon::now()->year);
                    break;
                // --- PERUBAHAN 3: Tambah case untuk 'specific-month' ---
                case 'specific-month':
                    if ($month && $year) {
                        $query->whereMonth('date', $month)
                              ->whereYear('date', $year);
                    }
                    break;
                case 'all-time':
                default:
                    // Tidak ada filter tanggal untuk 'all-time'
                    break;
            }
        };
        
        // --- Query utama untuk tabel ---
        $incisedsQuery = Incised::query()->with('incisor');

        // Terapkan filter pencarian
        $incisedsQuery->when($searchTerm, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('product', 'like', "%{$search}%")
                  ->orWhere('no_invoice', 'like', "%{$search}%")
                  ->orWhere('lok_kebun', 'like', "%{$search}%")
                  ->orWhere('j_brg', 'like', "%{$search}%")
                  ->orWhereHas('incisor', function ($subq) use ($search) {
                      $subq->where('name', 'like', "%{$search}%");
                  });
            });
        });

        // Terapkan filter waktu
        $applyTimeFilter($incisedsQuery, $timePeriod, $specificMonth, $specificYear);

        // --- Data untuk Kartu Statistik ---
        $baseStatQuery = Incised::query();
        $applyTimeFilter($baseStatQuery, $timePeriod, $specificMonth, $specificYear);
        
        $totalKebunA = (clone $baseStatQuery)->where('lok_kebun', 'Temadu')->sum('qty_kg');
        $totalKebunB = (clone $baseStatQuery)->where('lok_kebun', 'Sebayar')->sum('qty_kg');

        $mostProductiveIncisorQuery = Incised::query()
            ->select('incisors.name', DB::raw('SUM(inciseds.qty_kg) as total_qty_kg'))
            ->join('incisors', 'inciseds.no_invoice', '=', 'incisors.no_invoice')
            ->groupBy('incisors.name')
            ->orderByDesc('total_qty_kg');
            
        $applyTimeFilter($mostProductiveIncisorQuery, $timePeriod, $specificMonth, $specificYear);
        $mostProductiveIncisor = $mostProductiveIncisorQuery->first();

        $mostProductiveIncisorData = [
            'name' => $mostProductiveIncisor ? $mostProductiveIncisor->name : 'N/A',
            'total_qty_kg' => $mostProductiveIncisor ? (float)$mostProductiveIncisor->total_qty_kg : 0,
        ];

        // Paginate hasil query utama
        $inciseds = $incisedsQuery
            ->orderBy('date', 'DESC')
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
                    'incisor_name' => $incisor ? $incisor->name : null,
                ];
            })
            ->withQueryString();

        return Inertia::render("Inciseds/index", [
            "inciseds" => $inciseds,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']),
            'totalKebunA' => (float)$totalKebunA,
            'totalKebunB' => (float)$totalKebunB,
            'mostProductiveIncisor' => $mostProductiveIncisorData,
        ]);
    }

    // ... (Fungsi create, store, edit, update, show, destroy lainnya tidak diubah) ...

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

        $incised->update($request->all());

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
