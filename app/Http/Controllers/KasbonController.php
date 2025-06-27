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

    public function create()
    {
        // return Inertia('Kasbons/create');
        $incisors = Incisor::select('id', 'no_invoice', 'name')->get()->map(function ($incisor) {
            return ['id' => $incisor->id, 'label' => "{$incisor->no_invoice} - {$incisor->name}"];
        });
        $monthsYears = Incised::select(DB::raw('YEAR(date) as year, MONTH(date) as month'))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                return ['year' => $item->year, 'month' => $item->month];
            });
        return Inertia::render("Kasbons/create", [
            'incisors' => $incisors,
            'monthsYears' => $monthsYears,
            'statuses' => $this->statuses,
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
        return Inertia::render("Kasbons/show", [
            'kasbon' => [
                'id' => $kasbon->id,
                'incisor_name' => $kasbon->incisor ? $kasbon->incisor->name : 'N/A',
                'incised_no_invoice' => $kasbon->incised ? $kasbon->incised->no_invoice : 'N/A',
                'gaji' => $kasbon->gaji,
                'kasbon' => $kasbon->kasbon,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'incised_amount' => $kasbon->incised ? $kasbon->incised->amount : 0,
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
        $incisors = Incisor::select('id', 'no_invoice', 'name')->get();
        $inciseds = Incised::select('id', 'no_invoice')->get();

        return Inertia::render("Kasbons/edit", [
            'kasbon' => [
                'id' => $kasbon->id,
                'incisor_id' => $kasbon->incisor_id,
                'incised_id' => $kasbon->incised_id,
                'kasbon' => $kasbon->kasbon,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
            ],
            'incisors' => $incisors->map(function ($incisor) {
                return [
                    'id' => $incisor->id,
                    'label' => "{$incisor->no_invoice} - {$incisor->name}",
                ];
            }),
            'inciseds' => $inciseds->map(function ($incised) {
                return [
                    'id' => $incised->id,
                    'label' => $incised->no_invoice,
                ];
            }),
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
            'incised_id' => 'required|exists:inciseds,id',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'nullable|string|max:255|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string|max:255',
        ]);

        $incisor = Incisor::findOrFail($validated['incisor_id']);
        $incised = Incised::findOrFail($validated['incised_id']);

        if ($incisor->no_invoice !== $incised->no_invoice) {
            return redirect()->back()->withErrors(['incised_id' => 'No invoice tidak cocok dengan penoreh yang dipilih.'])->withInput();
        }

        if (!$incised->date) {
            return redirect()->back()->withErrors(['incised_id' => 'Data incised tidak memiliki tanggal yang valid.'])->withInput();
        }

        $month = Carbon::parse($incised->date)->format('m');
        $year = Carbon::parse($incised->date)->format('Y');
        $totalAmount = Incised::where('no_invoice', $incised->no_invoice)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');

        if ($totalAmount <= 0) {
            return redirect()->back()->withErrors(['incised_id' => 'Tidak ada data amount untuk no_invoice ini pada bulan/tahun tersebut.'])->withInput();
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