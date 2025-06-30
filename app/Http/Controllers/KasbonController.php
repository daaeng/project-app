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
    // Daftar status yang valid (opsional, untuk konsistensi)
    private $statuses = ['Pending', 'Approved', 'Rejected'];

    /**
     * Display a listing of the Kasbon resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = 10; // Items per page
        $searchTerm = $request->input('search'); // Get search term from request

        $kasbons = Kasbon::query()
            ->with(['incisor', 'incised']) // Eager load relationships
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

        return Inertia::render("Kasbons/index", [
            'kasbons' => $kasbons,
            'filter' => $request->only('search'),
            'statuses' => $this->statuses, // Kirim daftar status ke frontend
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Mengambil daftar penoreh dan bulan/tahun yang tersedia dari data torehan.
     *
     * @return \Inertia\Response
     */
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

    /**
     * Mengambil detail penoreh dan data torehan terkait berdasarkan ID penoreh, bulan, dan tahun.
     * Endpoint ini akan dipanggil via AJAX/Inertia oleh frontend.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
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
                'no_invoice' => $incisor->no_invoice, // Ini adalah kode penoreh
            ],
            'total_toreh_bulan_ini' => $totalAmount,
            'gaji_bulan_ini' => $gaji,
            'max_kasbon_amount' => $gaji, // Asumsi maksimal kasbon adalah gaji bulan ini
        ]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
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

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Kasbon  $kasbon
     * @return \Inertia\Response
     */
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
                'incisor_no_invoice' => $incisorNoInvoice, // Mengirim kode penoreh
                'gaji' => $kasbon->gaji, // Ini adalah 50% dari total toreh (jumlah maksimal kasbon)
                'kasbon' => $kasbon->kasbon, // Ini adalah jumlah kasbon yang diajukan
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'total_toreh_bulan_ini_raw' => $totalTorehBulanIni, // Mengirim total toreh murni
                'created_at' => $kasbon->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $kasbon->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Kasbon  $kasbon
     * @return \Inertia\Response
     */
    public function edit(Kasbon $kasbon)
    {
        $kasbon->load(['incisor', 'incised']);

        // Safely get month and year from incised date, defaulting to empty strings
        $month = '';
        $year = '';
        if ($kasbon->incised && $kasbon->incised->date) {
            $carbonDate = Carbon::parse($kasbon->incised->date);
            $month = (string)$carbonDate->format('n'); // Ambil bulan dari tanggal incised (tanpa leading zero)
            $year = (string)$carbonDate->format('Y');   // Ambil tahun dari tanggal incised
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
                'gaji' => $kasbon->gaji, // Pastikan gaji dikirim
                'month' => $month, // Menggunakan nilai bulan yang sudah diperiksa dan dijamin string
                'year' => $year,   // Menggunakan nilai tahun yang sudah diperiksa dan dijamin string
            ],
            'incisors' => $incisors->map(function ($incisor) {
                return [
                    'id' => $incisor->id,
                    'label' => "{$incisor->no_invoice} - {$incisor->name}",
                ];
            }),
            'monthsYears' => $monthsYears, // Kirim daftar bulan/tahun ke frontend
            'statuses' => $this->statuses, // Kirim daftar status ke frontend
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kasbon  $kasbon
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12', // Tambahkan validasi bulan dan tahun
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Kasbon  $kasbon
     * @return \Illuminate\Http\RedirectResponse
     */
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
