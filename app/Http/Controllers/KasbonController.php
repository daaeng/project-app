<?php

namespace App\Http\Controllers;

use App\Models\Incisor;
use App\Models\Incised;
use App\Models\Kasbon;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class KasbonController extends Controller
{
    // Standarisasi status untuk konsistensi di seluruh aplikasi
    private $statuses = ['Pending', 'Approved', 'Rejected'];

    /**
     * Menampilkan daftar semua kasbon (Pegawai dan Penoreh).
     */
    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');
        $statusFilter = $request->input('status');

        $kasbons = Kasbon::query()
            // Eager load relasi polimorfik 'kasbonable'
            // Ini akan mengambil data Employee atau Incisor secara otomatis.
            ->with(['kasbonable']) 
            ->when($searchTerm, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    // Pencarian untuk nama Penoreh (Incisor)
                    $q->orWhereHasMorph('kasbonable', [Incisor::class], function ($incisorQuery) use ($search) {
                        $incisorQuery->where('name', 'like', "%{$search}%")
                                     ->orWhere('no_invoice', 'like', "%{$search}%");
                    })
                    // Pencarian untuk nama Pegawai (Employee)
                    ->orWhereHasMorph('kasbonable', [Employee::class], function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%{$search}%")
                                      ->orWhere('employee_id', 'like', "%{$search}%");
                    });
                });
            })
            ->when($statusFilter && $statusFilter !== 'all', function ($query) use ($statusFilter) {
                 // Map frontend status to backend status if necessary
                $backendStatus = '';
                if ($statusFilter === 'pending') $backendStatus = 'Pending';
                if ($statusFilter === 'approved') $backendStatus = 'Approved';
                if ($statusFilter === 'rejected') $backendStatus = 'Rejected';
                
                if ($backendStatus) {
                    return $query->where('status', $backendStatus);
                }
                return $query;
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->through(function ($kasbon) {
                // Logika untuk menentukan nama dan ID pemilik kasbon
                $ownerName = 'N/A';
                $ownerIdentifier = 'N/A';
                $kasbonType = 'Tidak Diketahui';

                if ($kasbon->kasbonable) {
                    if ($kasbon->kasbonable_type === Employee::class) {
                        $ownerName = $kasbon->kasbonable->name;
                        $ownerIdentifier = 'NIP: ' . $kasbon->kasbonable->employee_id;
                        $kasbonType = 'Pegawai';
                    } elseif ($kasbon->kasbonable_type === Incisor::class) {
                        $ownerName = $kasbon->kasbonable->name;
                        $ownerIdentifier = 'No. Invoice: ' . $kasbon->kasbonable->no_invoice;
                        $kasbonType = 'Penoreh';
                    }
                }

                return [
                    'id' => $kasbon->id,
                    'owner_name' => $ownerName,
                    'owner_identifier' => $ownerIdentifier,
                    'kasbon_type' => $kasbonType,
                    'gaji' => $kasbon->gaji,
                    'kasbon' => $kasbon->kasbon,
                    'status' => $kasbon->status,
                    'reason' => $kasbon->reason,
                    'created_at' => $kasbon->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->withQueryString();

        // Kalkulasi summary data (tidak perlu diubah)
        $totalPendingKasbon = Kasbon::where('status', 'Pending')->count();
        $totalApprovedKasbon = Kasbon::where('status', 'Approved')->count();
        $sumApprovedKasbonAmount = Kasbon::where('status', 'Approved')->sum('kasbon');

        return Inertia::render("Kasbons/index", [
            'kasbons' => $kasbons,
            'filter' => $request->only('search', 'status'),
            'statuses' => $this->statuses,
            'totalPendingKasbon' => $totalPendingKasbon,
            'totalApprovedKasbon' => $totalApprovedKasbon,
            'sumApprovedKasbonAmount' => $sumApprovedKasbonAmount,
        ]);
    }

    /**
     * Menampilkan form untuk membuat kasbon penoreh baru.
     */
    public function create()
    {
        $incisors = Incisor::select('id', 'no_invoice', 'name')->get()->map(fn ($i) => ['id' => $i->id, 'label' => "{$i->no_invoice} - {$i->name}"]);
        $monthsYears = Incised::select(DB::raw('YEAR(date) as year, MONTH(date) as month'))
            ->groupBy('year', 'month')->orderBy('year', 'desc')->orderBy('month', 'desc')->get()
            ->map(function ($item) {
                $monthName = Carbon::createFromDate($item->year, $item->month, 1)->translatedFormat('F');
                return ['year' => $item->year, 'month' => $item->month, 'label' => "{$monthName} {$item->year}"];
            });

        return Inertia::render('Kasbons/create', [
            'incisors' => $incisors,
            'monthsYears' => $monthsYears,
            'statuses' => $this->statuses
        ]);
    }

    /**
     * Menyimpan kasbon penoreh baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'required|string|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string',
        ]);

        $incisor = Incisor::findOrFail($validated['incisor_id']);
        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->sum('amount');
        $gaji = $totalAmount * 0.5;

        if ($validated['kasbon'] > $gaji && $gaji > 0) {
            return redirect()->back()->with('error', 'Jumlah kasbon tidak boleh melebihi gaji.')->withInput();
        }

        $kasbon = new Kasbon(array_merge($validated, ['gaji' => $gaji]));
        $incisor->kasbons()->save($kasbon);

        return redirect()->route('kasbons.index')->with('message', 'Kasbon Penoreh berhasil dibuat.');
    }

    /**
     * Menampilkan detail satu kasbon.
     */
    public function show(Kasbon $kasbon)
    {
        $kasbon->load('kasbonable');
        return Inertia::render('Kasbons/show', compact('kasbon'));
    }

    /**
     * Menampilkan form untuk mengedit kasbon.
     */
    public function edit(Kasbon $kasbon)
    {
        $kasbon->load('kasbonable');
        $isEmployee = $kasbon->kasbonable_type === Employee::class;

        if ($isEmployee) {
            return Inertia::render('Kasbons/edit_pegawai', [
                'kasbon' => $kasbon,
                'statuses' => $this->statuses
            ]);
        } else {
            $incisors = Incisor::select('id', 'no_invoice', 'name')->get()->map(fn ($i) => ['id' => $i->id, 'label' => "{$i->no_invoice} - {$i->name}"]);
            return Inertia::render('Kasbons/edit', [
                'kasbon' => $kasbon,
                'incisors' => $incisors,
                'statuses' => $this->statuses
            ]);
        }
    }

    /**
     * Mengupdate data kasbon.
     */
    public function update(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'kasbon' => 'required|numeric|min:0',
            'status' => 'required|string|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string|max:255',
        ]);
        
        // Validasi tambahan untuk memastikan kasbon tidak melebihi gaji
        if ($kasbon->kasbonable_type === Employee::class) {
            if ($validated['kasbon'] > $kasbon->kasbonable->salary) {
                return redirect()->back()->with('error', 'Jumlah kasbon tidak boleh melebihi gaji pokok.')->withInput();
            }
        } elseif ($kasbon->kasbonable_type === Incisor::class) {
            if ($validated['kasbon'] > $kasbon->gaji) {
                 return redirect()->back()->with('error', 'Jumlah kasbon tidak boleh melebihi gaji penoreh.')->withInput();
            }
        }

        $kasbon->update($validated);
        return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil diperbarui.');
    }

    /**
     * Menghapus data kasbon.
     */
    public function destroy(Kasbon $kasbon)
    {
        $kasbon->delete();
        return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil dihapus.');
    }

    /**
     * Menampilkan form untuk membuat kasbon pegawai baru.
     */
    public function createPegawai()
    {
        $employees = Employee::select('id', 'name', 'salary', 'employee_id')->get()->map(fn ($e) => ['id' => $e->id, 'label' => "{$e->employee_id} - {$e->name}", 'salary' => $e->salary]);
        return Inertia::render("Kasbons/create_pegawai", [
            'employees' => $employees,
            'statuses' => $this->statuses
        ]);
    }

    /**
     * Menyimpan kasbon pegawai baru.
     */
    public function storePegawai(Request $request)
    {
        // 1. Validasi request, termasuk 'employee_id'.
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'kasbon' => 'required|numeric|min:0',
            'status' => 'required|string|in:' . implode(',', $this->statuses),
            'reason' => 'nullable|string',
        ]);

        // 2. Temukan pegawai berdasarkan ID yang divalidasi.
        $employee = Employee::findOrFail($validated['employee_id']);

        // 3. Validasi logika bisnis (kasbon tidak boleh > gaji).
        if ($validated['kasbon'] > $employee->salary) {
            return redirect()->back()->with('error', 'Jumlah kasbon tidak boleh melebihi gaji pokok.')->withInput();
        }

        // 4. Siapkan data untuk model Kasbon, TANPA menyertakan 'employee_id'.
        $kasbonData = [
            'kasbon' => $validated['kasbon'],
            'status' => $validated['status'],
            'reason' => $validated['reason'],
            'gaji'   => $employee->salary, // 'gaji' di sini adalah batas pinjaman.
        ];

        DB::beginTransaction();
        try {
            // 5. Buat instance Kasbon dengan data yang sudah bersih.
            $kasbon = new Kasbon($kasbonData);
            
            // 6. Simpan menggunakan relasi polimorfik.
            //    Laravel akan secara otomatis mengisi 'kasbonable_id' dan 'kasbonable_type'.
            $employee->kasbons()->save($kasbon);

            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon pegawai berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Mencatat error untuk mempermudah debugging
            Log::error('Gagal menyimpan kasbon pegawai: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.')->withInput();
        }
    }

    /**
     * Mengambil data penoreh via AJAX.
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

        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $request->month)
            ->whereYear('date', $request->year)
            ->sum('amount');

        $gaji = $totalAmount * 0.5;

        return response()->json([
            'incisor' => $incisor,
            'total_toreh_bulan_ini' => $totalAmount,
            'gaji_bulan_ini' => $gaji,
            'max_kasbon_amount' => $gaji,
        ]);
    }
}
