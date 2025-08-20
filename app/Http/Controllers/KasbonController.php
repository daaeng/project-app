<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Incisor;
use App\Models\Incised;
use App\Models\Kasbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;
use Throwable;

class KasbonController extends Controller
{
    private $statuses = ['Pending', 'Approved', 'Rejected'];

    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');
        $statusFilter = $request->input('status');

        $kasbons = Kasbon::query()
            ->with(['kasbonable', 'payments'])
            ->when($searchTerm, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->orWhereHasMorph('kasbonable', [Incisor::class], function ($incisorQuery) use ($search) {
                        $incisorQuery->where('name', 'like', "%{$search}%")
                                     ->orWhere('no_invoice', 'like', "%{$search}%");
                    })
                    ->orWhereHasMorph('kasbonable', [Employee::class], function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%{$search}%")
                                      ->orWhere('employee_id', 'like', "%{$search}%");
                    });
                });
            })
            ->when($statusFilter && $statusFilter !== 'all', function ($query) use ($statusFilter) {
                if (in_array($statusFilter, ['paid', 'unpaid', 'partial'])) {
                    return $query->where('payment_status', $statusFilter);
                }
                $backendStatus = ucfirst($statusFilter);
                if (in_array($backendStatus, $this->statuses)) {
                    return $query->where('status', $backendStatus);
                }
                return $query;
            })
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->through(function ($kasbon) {
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
                
                $totalPaid = $kasbon->payments->sum('amount');
                $remaining = $kasbon->kasbon - $totalPaid;

                return [
                    'id' => $kasbon->id,
                    'owner_name' => $ownerName,
                    'owner_identifier' => $ownerIdentifier,
                    'kasbon_type' => $kasbonType,
                    'kasbon' => $kasbon->kasbon,
                    'status' => $kasbon->status,
                    'payment_status' => $kasbon->payment_status,
                    'created_at' => $kasbon->created_at->format('Y-m-d H:i:s'),
                    'total_paid' => $totalPaid,
                    'remaining' => $remaining,
                ];
            })
            ->withQueryString();

        $totalPendingKasbon = Kasbon::where('status', 'Pending')->count();
        $approvedKasbons = Kasbon::with('payments')->where('status', 'Approved')->whereIn('payment_status', ['unpaid', 'partial'])->get();
        
        $totalApprovedKasbon = $approvedKasbons->count();
        $sumRemainingAmount = $approvedKasbons->reduce(function ($carry, $kasbon) {
            $paid = $kasbon->payments->sum('amount');
            $remaining = $kasbon->kasbon - $paid;
            return $carry + $remaining;
        }, 0);

        return Inertia::render("Kasbons/index", [
            'kasbons' => $kasbons,
            'filter' => $request->only('search', 'status'),
            'totalPendingKasbon' => $totalPendingKasbon,
            'totalApprovedKasbon' => $totalApprovedKasbon,
            'sumApprovedKasbonAmount' => $sumRemainingAmount,
        ]);
    }

    public function pay(Request $request, Kasbon $kasbon)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'notes' => 'nullable|string|max:255',
        ]);

        if ($kasbon->status !== 'Approved') {
            return redirect()->back()->with('error', 'Kasbon ini belum disetujui dan tidak dapat dibayar.');
        }

        $totalPaid = $kasbon->payments()->sum('amount');
        $remaining = $kasbon->kasbon - $totalPaid;

        // Gunakan toleransi kecil untuk perbandingan angka desimal
        if ($validated['amount'] > ($remaining + 0.001)) {
            return redirect()->back()->with('error', 'Jumlah pembayaran melebihi sisa kasbon. Sisa: ' . number_format($remaining, 0, ',', '.'));
        }

        DB::beginTransaction();
        try {
            $kasbon->payments()->create([
                'amount' => $validated['amount'],
                'payment_date' => now(),
                'notes' => $validated['notes'],
            ]);

            $newTotalPaid = $totalPaid + $validated['amount'];
            
            $newPaymentStatus = 'partial';
            if (bccomp((string)$newTotalPaid, (string)$kasbon->kasbon, 2) >= 0) {
                $newPaymentStatus = 'paid';
            }

            $kasbon->update([
                'payment_status' => $newPaymentStatus,
                'paid_at' => ($newPaymentStatus === 'paid') ? now() : null,
            ]);

            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Pembayaran cicilan berhasil dicatat.');
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error("Gagal memproses pembayaran kasbon.", ['kasbon_id' => $kasbon->id, 'error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Terjadi kesalahan server saat memproses pembayaran.');
        }
    }

    // ... (sisa fungsi lainnya)
    public function createPegawai()
    {
        $employees = Employee::select('id', 'name', 'salary', 'employee_id')->get()->map(fn ($e) => [
            'id' => $e->id,
            'label' => "{$e->employee_id} - {$e->name}",
            'salary' => $e->salary
        ]);
        return Inertia::render("Kasbons/create_pegawai", [
            'employees' => $employees,
            'statuses' => $this->statuses
        ]);
    }

   public function storePegawai(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'gaji'        => 'required|numeric|min:0',
            'kasbon'      => 'required|numeric|min:1',
            'status'      => 'required|string',
            'reason'      => 'nullable|string',
        ]);

        $employeeId = $request->employee_id;

        Kasbon::create([
            'gaji'            => $validated['gaji'],
            'kasbon'          => $validated['kasbon'],
            'status'          => $validated['status'],
            'reason'          => $validated['reason'] ?? null,
            'month'           => now()->month,
            'year'            => now()->year,
            'kasbonable_type' => \App\Models\Employee::class,
            'kasbonable_id'   => $employeeId,
        ]);

        return redirect()->route('kasbons.index')->with('message', 'Kasbon pegawai berhasil dibuat.');
    }

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
        $gaji = $totalAmount ;

        if ($validated['kasbon'] > $gaji && $gaji > 0) {
            return redirect()->back()->with('error', 'Jumlah kasbon tidak boleh melebihi gaji.')->withInput();
        }

        DB::beginTransaction();
        try {
            $incisor->kasbons()->create(array_merge($validated, ['gaji' => $gaji]));

            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon Penoreh berhasil dibuat.');
        } catch (Throwable $e) {
            DB::rollBack();
            
            Log::error("Gagal menyimpan kasbon penoreh.", [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Terjadi kesalahan server saat menyimpan data. Silakan coba lagi.')->withInput();
        }
    }

    public function show(Kasbon $kasbon)
    {
        $kasbon->load('kasbonable');

        $isEmployee = $kasbon->kasbonable_type === Employee::class;
        $ownerType = $isEmployee ? 'Pegawai' : 'Penoreh';

        $ownerData = [
            'name' => $kasbon->kasbonable->name ?? 'Data Tidak Ditemukan',
            'identifier_label' => $isEmployee ? 'NIP' : 'Kode Penoreh',
            'identifier_value' => $isEmployee ? $kasbon->kasbonable->employee_id : $kasbon->kasbonable->no_invoice,
        ];

        $formattedKasbon = [
            'id' => $kasbon->id,
            'owner_type' => $ownerType,
            'owner' => $ownerData,
            'gaji' => $kasbon->gaji,
            'kasbon' => $kasbon->kasbon,
            'status' => $kasbon->status,
            'reason' => $kasbon->reason,
            'created_at' => $kasbon->created_at->toDateTimeString(),
            'updated_at' => $kasbon->updated_at->toDateTimeString(),
            'payment_status' => $kasbon->payment_status,
            'paid_at' => $kasbon->paid_at,
        ];

        return Inertia::render('Kasbons/show', [
            'kasbon' => $formattedKasbon
        ]);
    }

    public function edit(Kasbon $kasbon)
    {
        $kasbon->load('kasbonable');
        $isEmployee = $kasbon->kasbonable_type === Employee::class;

        $props = [
            'kasbon' => [
                'id' => $kasbon->id,
                'kasbonable_type' => $kasbon->kasbonable_type,
                'kasbonable_id' => $kasbon->kasbonable_id,
                'kasbon' => $kasbon->kasbon,
                'gaji' => $kasbon->gaji,
                'status' => $kasbon->status,
                'reason' => $kasbon->reason,
                'month' => $kasbon->month,
                'year' => $kasbon->year,
                'owner' => $kasbon->kasbonable,
            ],
            'statuses' => $this->statuses,
        ];

        if ($isEmployee) {
            $props['employees'] = Employee::select('id', 'name', 'salary', 'employee_id')->get()->map(fn ($e) => [
                'id' => $e->id,
                'label' => "{$e->employee_id} - {$e->name}",
                'salary' => $e->salary
            ]);
            return Inertia::render('Kasbons/edit_pegawai', $props);
        }
        
        $props['incisors'] = Incisor::select('id', 'no_invoice', 'name')->get()->map(fn ($i) => [
            'id' => $i->id, 
            'label' => "{$i->no_invoice} - {$i->name}"
        ]);
        $props['monthsYears'] = Incised::select(DB::raw('YEAR(date) as year, MONTH(date) as month'))
            ->groupBy('year', 'month')->orderBy('year', 'desc')->orderBy('month', 'desc')->get()
            ->map(function ($item) {
                $monthName = Carbon::createFromDate($item->year, $item->month, 1)->translatedFormat('F');
                return ['year' => $item->year, 'month' => $item->month, 'label' => "{$monthName} {$item->year}"];
            });
        
        return Inertia::render('Kasbons/edit', $props);
    }

    public function update(Request $request, Kasbon $kasbon)
    {
        $isEmployee = $kasbon->kasbonable_type === Employee::class;

        try {
            if ($isEmployee) {
                $validated = $request->validate([
                    'employee_id' => 'required|exists:employees,id',
                    'kasbon'      => 'required|numeric|min:0',
                    'status'      => 'required|string|in:' . implode(',', $this->statuses),
                    'reason'      => 'nullable|string|max:255',
                ]);

                $employee = Employee::findOrFail($validated['employee_id']);
                // if ($validated['kasbon'] > $employee->salary) {
                //     return redirect()->back()->with('error', "Jumlah kasbon tidak boleh melebihi gaji pokok pegawai (" . number_format($employee->salary, 0, ',', '.') . ").")->withInput();
                // }

                $kasbon->update([
                    'kasbonable_id'   => $validated['employee_id'],
                    'kasbonable_type' => Employee::class,
                    'kasbon'          => $validated['kasbon'],
                    'status'          => $validated['status'],
                    'reason'          => $validated['reason'],
                    'gaji'            => $employee->salary,
                ]);

            } else {
                $validated = $request->validate([
                    'incisor_id' => 'required|exists:incisors,id',
                    'month'      => 'required|integer|between:1,12',
                    'year'       => 'required|integer',
                    'kasbon'     => 'required|numeric|min:0',
                    'status'     => 'required|string|in:' . implode(',', $this->statuses),
                    'reason'     => 'nullable|string|max:255',
                ]);
                
                $incisor = Incisor::findOrFail($validated['incisor_id']);
                $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
                    ->whereMonth('date', $validated['month'])
                    ->whereYear('date', $validated['year'])
                    ->sum('amount');
                $gaji = $totalAmount * 0.5;

                if ($validated['kasbon'] > $gaji) {
                    return redirect()->back()->with('error', "Jumlah kasbon tidak boleh melebihi gaji penoreh pada periode ini (" . number_format($gaji, 0, ',', '.') . ").")->withInput();
                }
                
                $kasbon->update([
                    'kasbonable_id'   => $validated['incisor_id'],
                    'kasbonable_type' => Incisor::class,
                    'month'           => $validated['month'],
                    'year'            => $validated['year'],
                    'kasbon'          => $validated['kasbon'],
                    'status'          => $validated['status'],
                    'reason'          => $validated['reason'],
                    'gaji'            => $gaji,
                ]);
            }

            return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil diperbarui.');

        } catch (Throwable $e) {
            Log::error("Gagal mengupdate kasbon.", [ 'kasbon_id' => $kasbon->id, 'error_message' => $e->getMessage() ]);
            return redirect()->back()->with('error', 'Terjadi kesalahan server saat mengupdate data.')->withInput();
        }
    }

    public function destroy(Kasbon $kasbon)
    {
        $kasbon->delete();
        return redirect()->route('kasbons.index')->with('message', 'Kasbon berhasil dihapus.');
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

    public function print(Request $request)
    {
        $searchTerm = $request->input('search');
        $statusFilter = $request->input('status');

        $kasbons = Kasbon::query()
            ->with(['kasbonable', 'payments'])
            ->when($searchTerm, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                     $q->orWhereHasMorph('kasbonable', [Incisor::class], function ($incisorQuery) use ($search) {
                        $incisorQuery->where('name', 'like', "%{$search}%")->orWhere('no_invoice', 'like', "%{$search}%");
                    })
                    ->orWhereHasMorph('kasbonable', [Employee::class], function ($employeeQuery) use ($search) {
                        $employeeQuery->where('name', 'like', "%{$search}%")->orWhere('employee_id', 'like', "%{$search}%");
                    });
                });
            })
            ->when($statusFilter && $statusFilter !== 'all', function ($query) use ($statusFilter) {
                if (in_array($statusFilter, ['paid', 'unpaid', 'partial'])) {
                    return $query->where('payment_status', $statusFilter);
                }
                $backendStatus = ucfirst($statusFilter);
                if (in_array($backendStatus, $this->statuses)) {
                    return $query->where('status', $backendStatus);
                }
            })
            ->orderBy('created_at', 'DESC')
            ->get() // Mengambil SEMUA data, bukan paginate
            ->map(function ($kasbon) {
                // Logika transformasi data sama seperti di index
                $ownerName = 'N/A';
                $kasbonType = 'Tidak Diketahui';
                if ($kasbon->kasbonable) {
                    $kasbonType = $kasbon->kasbonable_type === Employee::class ? 'Pegawai' : 'Penoreh';
                    $ownerName = $kasbon->kasbonable->name;
                }
                $totalPaid = $kasbon->payments->sum('amount');
                $remaining = $kasbon->kasbon - $totalPaid;
                return [
                    'owner_name' => $ownerName,
                    'kasbon_type' => $kasbonType,
                    'kasbon' => $kasbon->kasbon,
                    'total_paid' => $totalPaid,
                    'remaining' => $remaining,
                    'payment_status' => $kasbon->payment_status,
                    'status' => $kasbon->status,
                ];
            });

        return Inertia::render("Kasbons/Print", [
            'kasbons' => $kasbons,
            'filters' => $request->only(['search', 'status']),
            'printDate' => now()->translatedFormat('d F Y'),
        ]);
    }
}
