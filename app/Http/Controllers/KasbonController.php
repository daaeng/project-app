<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Incisor;
use App\Models\Incised;
use App\Models\Kasbon;
use App\Models\KasbonPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;
use Throwable;
use Illuminate\Validation\Rule;

class KasbonController extends Controller
{
    private $statuses = ['Pending', 'Approved', 'Rejected'];

    // ... (Method index tidak berubah, diasumsikan sudah akurat dari perbaikan sebelumnya) ...
    public function index(Request $request)
    {
        $perPage = 20;
        $searchTerm = $request->input('search');

        $query = Kasbon::query()
            ->select('kasbonable_id', 'kasbonable_type')
            ->groupBy('kasbonable_id', 'kasbonable_type');

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHasMorph('kasbonable', [Employee::class], function ($query, $type) use ($searchTerm) {
                    $query->where('name', 'like', "%{$searchTerm}%")
                          ->orWhere('employee_id', 'like', "%{$searchTerm}%");
                })->orWhereHasMorph('kasbonable', [Incisor::class], function ($query, $type) use ($searchTerm) {
                    $query->where('name', 'like', "%{$searchTerm}%")
                          ->orWhere('no_invoice', 'like', "%{$searchTerm}%");
                });
            });
        }
        
        $kasbonGroups = $query->paginate($perPage)->through(function ($group) {
            $totalKasbon = Kasbon::where('kasbonable_id', $group->kasbonable_id)
                ->where('kasbonable_type', $group->kasbonable_type)
                ->where('status', 'Approved')
                ->sum('kasbon');

            $kasbonIds = Kasbon::where('kasbonable_id', $group->kasbonable_id)
                ->where('kasbonable_type', $group->kasbonable_type)
                ->pluck('id');

            $totalPaid = KasbonPayment::whereIn('kasbon_id', $kasbonIds)->sum('amount');
            
            $owner = $group->kasbonable;
            $ownerName = 'N/A';
            $ownerIdentifier = 'N/A';
            $kasbonType = 'Tidak Diketahui';

            if ($owner) {
                $ownerName = $owner->name;
                if ($group->kasbonable_type === Employee::class) {
                    $ownerIdentifier = 'NIP: ' . $owner->employee_id;
                    $kasbonType = 'Pegawai';
                } elseif ($group->kasbonable_type === Incisor::class) {
                    $ownerIdentifier = 'No. Invoice: ' . $owner->no_invoice;
                    $kasbonType = 'Penoreh';
                }
            }
            
            $remaining = $totalKasbon - $totalPaid;

            return [
                'owner_id' => $group->kasbonable_id,
                'owner_type' => $group->kasbonable_type,
                'owner_name' => $ownerName,
                'owner_identifier' => $ownerIdentifier,
                'kasbon_type' => $kasbonType,
                'total_kasbon' => (float) $totalKasbon,
                'total_paid' => (float) $totalPaid,
                'remaining' => $remaining > 0 ? $remaining : 0,
            ];
        });
        
        $totalPendingKasbon = Kasbon::where('status', 'Pending')->count();
        $approvedKasbons = Kasbon::where('status', 'Approved')->get(['id', 'kasbon']);
        $totalApprovedPaid = KasbonPayment::whereIn('kasbon_id', $approvedKasbons->pluck('id'))->sum('amount');
        $sumRemainingAmount = $approvedKasbons->sum('kasbon') - $totalApprovedPaid;
        $totalApprovedKasbon = Kasbon::where('status', 'Approved')->whereIn('payment_status', ['unpaid', 'partial'])->count();


        return Inertia::render("Kasbons/index", [
            'kasbons' => $kasbonGroups,
            'filter' => $request->only('search'),
            'totalPendingKasbon' => $totalPendingKasbon,
            'totalApprovedKasbon' => $totalApprovedKasbon,
            'sumApprovedKasbonAmount' => $sumRemainingAmount,
        ]);
    }
    
    public function showByUser($type, $id)
    {
        $modelType = ($type === 'employee') ? Employee::class : Incisor::class;
        $owner = $modelType::findOrFail($id);
        
        $ownerData = [];
        if ($modelType === Employee::class) {
            $ownerData = ['name' => $owner->name, 'identifier' => 'NIP: ' . $owner->employee_id];
        } else {
            $ownerData = ['name' => $owner->name, 'identifier' => 'No. Invoice: ' . $owner->no_invoice];
        }

        $kasbons = Kasbon::where('kasbonable_id', $id)
            ->where('kasbonable_type', $modelType)
            ->get();

        $kasbonIds = $kasbons->pluck('id');
        $payments = KasbonPayment::whereIn('kasbon_id', $kasbonIds)->with('kasbon')->get();

        $transactions = collect([]);
        foreach ($kasbons as $kasbon) {
            $transactions->push([
                'id' => 'k-'.$kasbon->id,
                'date' => $kasbon->created_at,
                'description' => 'Pinjaman Dana (Kasbon) - ' . $kasbon->status,
                'debit' => $kasbon->kasbon,
                'credit' => 0,
                'transaction_type' => 'kasbon',
                'transaction_ref' => $kasbon,
            ]);
        }
        foreach ($payments as $payment) {
            $transactions->push([
                'id' => 'p-'.$payment->id,
                'date' => $payment->created_at,
                'description' => $payment->notes ?: 'Pembayaran Cicilan',
                'debit' => 0,
                'credit' => $payment->amount,
                'transaction_type' => 'payment',
                'transaction_ref' => $payment,
            ]);
        }
        
        $sortedTransactions = $transactions->sortBy('date')->values();
        
        $runningBalance = 0;
        $balanceMap = [];
        
        foreach ($sortedTransactions as $tx) {
            $kasbonStatus = $tx['transaction_type'] === 'kasbon' 
                ? $tx['transaction_ref']['status'] 
                : ($tx['transaction_ref']['kasbon']['status'] ?? 'Approved');

            if ($kasbonStatus === 'Approved') {
                 $runningBalance += $tx['debit'] - $tx['credit'];
            }
            $balanceMap[$tx['id']] = $runningBalance;
        }

        $history = $sortedTransactions->map(function ($item) use ($balanceMap) {
            $item['balance'] = $balanceMap[$item['id']] ?? 0;
            $carbonDate = Carbon::parse($item['date']);
            $item['date_formatted'] = $carbonDate->isoFormat('D MMM YYYY, HH:mm');
            $item['date_input_format'] = $carbonDate->format('Y-m-d');
            return $item;
        });

        $payableKasbons = Kasbon::where('kasbonable_id', $id)
            ->where('kasbonable_type', $modelType)
            ->where('status', 'Approved')
            ->whereIn('payment_status', ['unpaid', 'partial'])
            ->orderBy('created_at', 'desc')
            ->get(['id', 'kasbon', 'created_at']);

        return Inertia::render('Kasbons/Detail', [
            'owner' => $ownerData,
            'history' => $history->sortBy('date')->values()->all(),
            'payableKasbons' => $payableKasbons,
            'kasbon_owner_id' => $id,
            'kasbon_owner_type' => $type,
            'errors' => session()->get('errors') ? session()->get('errors')->getBag('default')->getMessages() : (object)[],
        ]);
    }

    public function pay(Request $request)
    {
        // [PEMBARUAN] owner_id dan owner_type tidak perlu divalidasi karena tidak disimpan ke tabel payments
        $validated = $request->validate([
            'kasbon_id' => 'required|exists:kasbons,id',
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:255',
        ]);
        
        DB::beginTransaction();
        try {
            $kasbon = Kasbon::with('payments')->findOrFail($validated['kasbon_id']);

            if ($kasbon->status !== 'Approved') {
                return back()->with('error', 'Hanya kasbon yang sudah disetujui yang bisa dibayar.')->withInput();
            }

            $totalPaid = $kasbon->payments->sum('amount');
            $remaining = $kasbon->kasbon - $totalPaid;

            if ($validated['amount'] > ($remaining + 0.001)) { 
                 return back()->withErrors(['amount' => 'Jumlah pembayaran melebihi sisa utang.'])->withInput();
            }
            
            // [PEMBARUAN KUNCI] Menyimpan data yang sudah divalidasi ke tabel payments
            $kasbon->payments()->create($validated);
            
            $this->updateKasbonPaymentStatus($kasbon);

            DB::commit();

            // [PEMBARUAN] Redirect kembali ke halaman detail user agar data ter-refresh
            return redirect()->route('kasbons.showByUser', [
                'type' => $request->input('owner_type'), 
                'id' => $request->input('owner_id')
            ])->with('message', 'Pembayaran berhasil dicatat.');
    
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error("Gagal memproses pembayaran kasbon.", ['error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan server saat memproses pembayaran.');
        }
    }

    public function updatePayment(Request $request, KasbonPayment $payment)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $kasbon = $payment->kasbon()->with('payments')->firstOrFail();
            
            $otherPaymentsTotal = $kasbon->payments->where('id', '!=', $payment->id)->sum('amount');
            $remaining = $kasbon->kasbon - $otherPaymentsTotal;
            if ($validated['amount'] > ($remaining + 0.001)) {
                return back()->withErrors(['amount' => 'Jumlah pembayaran melebihi sisa utang.'])->withInput();
            }
            
            // [PEMBARUAN KUNCI] Langsung update dengan data yang sudah divalidasi
            $payment->update($validated);
            
            $this->updateKasbonPaymentStatus($kasbon);

            DB::commit();
            return back()->with('message', 'Data pembayaran berhasil diperbarui.');
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error('Gagal update pembayaran kasbon', ['payment_id' => $payment->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan saat memperbarui pembayaran.');
        }
    }

    public function destroyPayment(KasbonPayment $payment)
    {
        DB::beginTransaction();
        try {
            $kasbon = $payment->kasbon;
            $payment->delete();
            $this->updateKasbonPaymentStatus($kasbon);
            DB::commit();
            return back()->with('message', 'Data pembayaran berhasil dihapus.');
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error('Gagal hapus pembayaran kasbon', ['payment_id' => $payment->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan saat menghapus pembayaran.');
        }
    }

    private function updateKasbonPaymentStatus(Kasbon $kasbon)
    {
        $kasbon->refresh()->load('payments');
        $totalPaid = $kasbon->payments->sum('amount');

        if (bccomp((string)$totalPaid, (string)$kasbon->kasbon, 2) >= 0) {
            $kasbon->payment_status = 'paid';
            $kasbon->paid_at = now();
        } elseif ($totalPaid > 0) {
            $kasbon->payment_status = 'partial';
            $kasbon->paid_at = null;
        } else {
            $kasbon->payment_status = 'unpaid';
            $kasbon->paid_at = null;
        }
        $kasbon->save();
    }
    
    // ... (Method-method lain seperti create, store, edit, update, destroy tidak berubah dari versi sebelumnya) ...
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
            'transaction_date' => 'required|date',
        ]);
        
        $employee = Employee::findOrFail($validated['employee_id']);

        if ($validated['status'] === 'Approved' && $validated['kasbon'] > $employee->salary) {
            return back()->withErrors(['kasbon' => 'Jumlah kasbon tidak boleh melebihi gaji pegawai.'])->withInput();
        }
        
        $dataToCreate = $validated;
        $dataToCreate['kasbonable_type'] = Employee::class;
        $dataToCreate['kasbonable_id'] = $validated['employee_id'];
        $dataToCreate['month'] = Carbon::parse($validated['transaction_date'])->month;
        $dataToCreate['year'] = Carbon::parse($validated['transaction_date'])->year;
        
        Kasbon::create($dataToCreate);

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
            'statuses' => $this->statuses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'incisor_id' => 'required|exists:incisors,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'kasbon' => 'required|numeric|min:1',
            'status' => ['required', 'string', Rule::in($this->statuses)],
            'reason' => 'nullable|string',
            'transaction_date' => 'required|date',
        ]);
        
        $incisor = Incisor::findOrFail($validated['incisor_id']);
        $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
            ->whereMonth('date', $validated['month'])
            ->whereYear('date', $validated['year'])
            ->sum('amount');
        $gaji = $totalAmount;

        if ($validated['status'] === 'Approved' && $validated['kasbon'] > $gaji) {
            return back()->withErrors(['kasbon' => 'Jumlah kasbon tidak boleh melebihi total gaji penoreh pada periode ini.'])->withInput();
        }

        DB::beginTransaction();
        try {
            $dataToCreate = $validated;
            $dataToCreate['gaji'] = $gaji;
            $dataToCreate['kasbonable_type'] = Incisor::class;
            $dataToCreate['kasbonable_id'] = $validated['incisor_id'];

            Kasbon::create($dataToCreate);

            DB::commit();
            return redirect()->route('kasbons.index')->with('message', 'Kasbon Penoreh berhasil dibuat.');
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error("Gagal menyimpan kasbon penoreh.", ['error_message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Terjadi kesalahan server saat menyimpan data.')->withInput();
        }
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
                'transaction_date' => Carbon::parse($kasbon->transaction_date ?? $kasbon->created_at)->format('Y-m-d'),
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
                    'transaction_date'  => 'required|date',
                ]);

                $employee = Employee::findOrFail($validated['employee_id']);

                if ($validated['status'] === 'Approved' && $validated['kasbon'] > $employee->salary) {
                     return back()->withErrors(['kasbon' => 'Jumlah kasbon tidak boleh melebihi gaji pegawai.'])->withInput();
                }
                
                $dataToUpdate = $validated;
                $dataToUpdate['kasbonable_id'] = $validated['employee_id'];
                $dataToUpdate['kasbonable_type'] = Employee::class;
                $dataToUpdate['gaji'] = $employee->salary;

                $kasbon->update($dataToUpdate);

            } else {
                $validated = $request->validate([
                    'incisor_id' => 'required|exists:incisors,id',
                    'month'      => 'required|integer|between:1,12',
                    'year'       => 'required|integer',
                    'kasbon'     => 'required|numeric|min:0',
                    'status'      => 'required|string|in:' . implode(',', $this->statuses),
                    'reason'     => 'nullable|string|max:255',
                    'transaction_date' => 'required|date',
                ]);
                
                $incisor = Incisor::findOrFail($validated['incisor_id']);
                $totalAmount = Incised::where('no_invoice', $incisor->no_invoice)
                    ->whereMonth('date', $validated['month'])
                    ->whereYear('date', $validated['year'])
                    ->sum('amount');
                $gaji = $totalAmount;
                
                if ($validated['status'] === 'Approved' && $validated['kasbon'] > $gaji) {
                     return back()->withErrors(['kasbon' => 'Jumlah kasbon tidak boleh melebihi total gaji penoreh pada periode ini.'])->withInput();
                }
                
                $dataToUpdate = $validated;
                $dataToUpdate['kasbonable_id'] = $validated['incisor_id'];
                $dataToUpdate['kasbonable_type'] = Incisor::class;
                $dataToUpdate['gaji'] = $gaji;
                
                $kasbon->update($dataToUpdate);
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

        $gaji = $totalAmount;

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
        $statuses = ['Pending', 'Approved', 'Rejected'];

        $query = Kasbon::query()
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
            ->when($statusFilter && $statusFilter !== 'all', function ($query) use ($statusFilter, $statuses) {
                if (in_array($statusFilter, ['paid', 'unpaid', 'partial'])) {
                    return $query->where('payment_status', $statusFilter);
                }
                $backendStatus = ucfirst($statusFilter);
                if (in_array($backendStatus, $statuses)) {
                    return $query->where('status', $backendStatus);
                }
            })
            ->orderBy('created_at', 'DESC');

        $kasbons = $query->get()->map(function ($kasbon) {
            $ownerName = 'N/A';
            $location = '-';

            if ($kasbon->kasbonable) {
                $ownerName = $kasbon->kasbonable->name;
                if ($kasbon->kasbonable_type === Incisor::class) {
                    $location = $kasbon->kasbonable->lok_toreh ?? '-';
                } else {
                    $location = 'Kantor'; 
                }
            }
            
            $totalPaid = $kasbon->payments->sum('amount');
            $remaining = $kasbon->kasbon - $totalPaid;

            return [
                'owner_name' => $ownerName,
                'location' => $location,
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

