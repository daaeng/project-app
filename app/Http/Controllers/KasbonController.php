<?php

namespace App\Http\Controllers;

use App\Models\Kasbon;
use App\Models\Incisor;
use App\Models\Incised;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class KasbonController extends Controller
{
    private $statuses = ['Pending', 'Approved', 'Rejected'];

    public function index(Request $request)
    {
        $perPage = 10; 
        $searchTerm = $request->input('search'); 

        $kasbons = Kasbon::query()
            ->with(['incisor', 'incised']) 
            ->when($searchTerm, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->orWhereHas('incisor', function ($incisorQuery) use ($search) {
                        $incisorQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('incised', function ($incisedQuery) use ($search) {
                        $incisedQuery->where('no_invoice', 'like', "%{$search}%");
                    })
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->through(function ($kasbon) {
                return [
                    'id' => $kasbon->id,
                    'incisor_id' => $kasbon->incisor_id,
                    'incisor_name' => $kasbon->incisor ? $kasbon->incisor->name : 'N/A',
                    'incised_id' => $kasbon->incised_id,
                    'incised_no_invoice' => $kasbon->incised ? $kasbon->incised->no_invoice : 'N/A',
                    'incisor_no_invoice' => $kasbon->incisor ? $kasbon->incisor->no_invoice : 'N/A',
                    'gaji' => $kasbon->gaji,
                    'kasbon' => $kasbon->kasbon,
                    'status' => $kasbon->status,
                    'reason' => $kasbon->reason,
                    'created_at' => $kasbon->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->withQueryString();

        // Calculate summary data for the cards
        $totalPendingKasbon = Kasbon::where('status', 'Pending')->count();
        $totalApprovedKasbon = Kasbon::where('status', 'Approved')->count();
        $sumApprovedKasbonAmount = Kasbon::where('status', 'Approved')->sum('kasbon');


        return Inertia::render("Kasbons/index", [
            'kasbons' => $kasbons,
            'filter' => $request->only('search'),
            'statuses' => $this->statuses, // Kirim daftar status ke frontend
            'totalPendingKasbon' => $totalPendingKasbon,
            'totalApprovedKasbon' => $totalApprovedKasbon,
            'sumApprovedKasbonAmount' => $sumApprovedKasbonAmount,
        ]);
    }

    public function create()
    {
        // Mengambil semua penoreh (Incisor) untuk dropdown
        $incisors = Incisor::select('id', 'no_invoice', 'name')->get()->map(function ($incisor) {
            return ['id' => $incisor->id, 'label' => "{$incisor->no_invoice} - {$incisor->name}"];
        });

        // Mengambil kombinasi bulan dan tahun unik dari tabel Incised
        $monthsYears = Incised::select(DB::raw('YEAR(date) as year, MONTH(date) as month'))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                // Mengonversi angka bulan menjadi nama bulan yang lebih mudah dibaca
                $monthName = Carbon::createFromDate($item->year, $item->month, 1)->translatedFormat('F');
                return ['year' => $item->year, 'month' => $item->month, 'label' => "{$monthName} {$item->year}"];
            });

        return Inertia::render("Kasbons/create", [
            'incisors' => $incisors,
            'monthsYears' => $monthsYears,
            'statuses' => $this->statuses,
        ]);
    }

    public function getIncisorData(Request $request)
    {
        $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);

        $incisor = Incisor::find($request->incisor_id);

        if (!$incisor) {
            return response()->json(['message' => 'Penoreh tidak ditemukan.'], 404);
        }

        // Hitung total torehan untuk bulan dan tahun yang dipilih
        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $request->month)
            ->whereYear('date', $request->year)
            ->sum('amount');

        // Hitung gaji (50% dari total amount)
        $gaji = $totalAmount * 0.5;

        return response()->json([
            'incisor' => [
                'name' => $incisor->name,
                'address' => $incisor->address,
                'no_invoice' => $incisor->no_invoice, 
            ],
            'total_toreh_bulan_ini' => $totalAmount,
            'gaji_bulan_ini' => $gaji,
            'max_kasbon_amount' => $gaji, 
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:255|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string|max:255',
        ]);

        $incisor = Incisor::findOrFail($validated['incisor_id']);
        // Mengambil total amount berdasarkan no_invoice dari incisor yang dipilih
        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->sum('amount');

        if ($totalAmount <= 0) {
            return redirect()->back()->withErrors(['month' => 'Tidak ada data amount untuk periode ini.'])->withInput();
        }

        $gaji = $totalAmount * 0.5;

        DB::beginTransaction();
        try {
            $kasbon = Kasbon::create(array_merge($validated, ['gaji' => $gaji]));
            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating kasbon: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal membuat kasbon: ' . $e->getMessage())->withInput();
        }
    }

    public function show(Kasbon $kasbon)
    {
        $kasbon->load(['incisor', 'incised']);

        // Pastikan incisor ada sebelum mengakses propertinya, untuk mencegah error
        $incisorNoInvoice = $kasbon->incisor ? $kasbon->incisor->no_invoice : 'N/A';

        // 'Total Toreh Bulan Ini' haruslah gaji utama sebelum dipotong 50%.
        // Karena 'gaji' di tabel kasbons adalah 50% dari total toreh, maka
        // total toreh bulan ini adalah 'gaji' * 2.
        $totalTorehBulanIni = $kasbon->gaji * 2;

        return Inertia::render("Kasbons/show", [
            'kasbon' => [
                'id' => $kasbon->id,
                'incisor_name' => $kasbon->incisor ? $kasbon->incisor->name : 'N/A',
                'incisor_no_invoice' => $incisorNoInvoice,
                'gaji' => $kasbon->gaji, 
                'kasbon' => $kasbon->kasbon, 
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'total_toreh_bulan_ini_raw' => $totalTorehBulanIni, 
                'created_at' => $kasbon->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $kasbon->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function edit(Kasbon $kasbon)
    {
        $kasbon->load(['incisor', 'incised']);

        // Safely get month and year from incised date, defaulting to empty strings
        $month = '';
        $year = '';
        if ($kasbon->incised && $kasbon->incised->date) {
            $carbonDate = Carbon::parse($kasbon->incised->date);
            $month = (string)$carbonDate->format('n'); 
            $year = (string)$carbonDate->format('Y'); 
        }
        
        $incisors = Incisor::select('id', 'no_invoice', 'name')->get();

        // Mengambil kombinasi bulan dan tahun unik dari tabel Incised
        $monthsYears = Incised::select(DB::raw('YEAR(date) as year, MONTH(date) as month'))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                $monthName = Carbon::createFromDate($item->year, $item->month, 1)->translatedFormat('F');
                return ['year' => $item->year, 'month' => $item->month, 'label' => "{$monthName} {$item->year}"];
            });

        return Inertia::render("Kasbons/edit", [
            'kasbon' => [
                'id' => $kasbon->id,
                'incisor_id' => $kasbon->incisor_id,
                'incised_id' => $kasbon->incised_id,
                'kasbon' => $kasbon->kasbon,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'gaji' => $kasbon->gaji, 
                'month' => $month, 
                'year' => $year,  
            ],
            'incisors' => $incisors->map(function ($incisor) {
                return [
                    'id' => $incisor->id,
                    'label' => "{$incisor->no_invoice} - {$incisor->name}",
                ];
            }),
            'monthsYears' => $monthsYears, 
            'statuses' => $this->statuses, 
        ]);
    }

    public function update(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12', 
            'year' => 'required|integer',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:255|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string|max:255',
        ]);

        $incisor = Incisor::findOrFail($validated['incisor_id']);

        // Hitung ulang totalAmount dan gaji berdasarkan bulan/tahun baru
        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->sum('amount');

        if ($totalAmount <= 0) {
            return redirect()->back()->withErrors(['month' => 'Tidak ada data amount untuk penoreh ini pada bulan/tahun tersebut.'])->withInput();
        }

        $gaji = $totalAmount * 0.5;

        DB::beginTransaction();
        try {
            $kasbon->update(array_merge($validated, ['gaji' => $gaji]));
            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating kasbon: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui kasbon: ' . $e->getMessage())->withInput();
        }
    }

    public function destroy(Kasbon $kasbon)
    {
        DB::beginTransaction();
        try {
            $kasbon->delete();
            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting kasbon: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus kasbon: ' . $e->getMessage());
        }
    }
}

