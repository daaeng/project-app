<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Nota;
use App\Models\PpbHeader;
use App\Models\HargaInformasi;
use App\Models\Pengeluaran;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdministrasiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10;
        
        // Ambil filter dari request
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);
        $timePeriod = $request->input('time_period', 'this-month'); 

        // Inisialisasi Query Dasar
        $productQuery = Product::query();
        $pengeluaranQuery = Pengeluaran::query();

        // --- Logic Filter Waktu ---
        $dateRangeStart = null;
        $dateRangeEnd = null;

        if ($timePeriod === 'specific-month') {
            $dateRangeStart = Carbon::create($selectedYear, $selectedMonth, 1)->startOfMonth();
            $dateRangeEnd = Carbon::create($selectedYear, $selectedMonth, 1)->endOfMonth();
        } elseif ($timePeriod === 'today') {
            $dateRangeStart = Carbon::today();
            $dateRangeEnd = Carbon::today();
        } elseif ($timePeriod === 'this-week') {
            $dateRangeStart = Carbon::now()->startOfWeek();
            $dateRangeEnd = Carbon::now()->endOfWeek();
        } elseif ($timePeriod === 'this-month') {
            $dateRangeStart = Carbon::now()->startOfMonth();
            $dateRangeEnd = Carbon::now()->endOfMonth();
        } elseif ($timePeriod === 'last-month') {
            $dateRangeStart = Carbon::now()->subMonth()->startOfMonth();
            $dateRangeEnd = Carbon::now()->subMonth()->endOfMonth();
        } elseif ($timePeriod === 'this-year') {
            $dateRangeStart = Carbon::now()->startOfYear();
            $dateRangeEnd = Carbon::now()->endOfYear();
        }

        // Terapkan filter tanggal jika ada
        if ($dateRangeStart && $dateRangeEnd) {
            $productQuery->whereBetween('date', [$dateRangeStart, $dateRangeEnd]);
            $pengeluaranQuery->whereBetween('tanggal_pengeluaran', [$dateRangeStart, $dateRangeEnd]);
        }

        // --- [BARU] Logic Data Chart (Cash Flow) ---
        // Mengelompokkan data berdasarkan tanggal atau bulan untuk grafik
        $chartData = [];
        
        // Jika filter tahunan, group by Bulan. Jika filter bulanan/mingguan, group by Tanggal.
        $groupBy = ($timePeriod === 'this-year' || $timePeriod === 'all-years') ? 'month' : 'date';
        
        // 1. Data Pemasukan (Dari Penjualan Karet - Status Buyer)
        $incomeData = $productQuery->clone()
            ->where('product', 'karet')
            ->where('status', 'buyer')
            ->selectRaw($groupBy === 'month' 
                ? 'MONTH(date) as label, SUM(amount_out) as total' 
                : 'DATE(date) as label, SUM(amount_out) as total')
            ->groupBy('label')
            ->pluck('total', 'label');

        // 2. Data Pengeluaran
        $expenseData = $pengeluaranQuery->clone()
            ->selectRaw($groupBy === 'month' 
                ? 'MONTH(tanggal_pengeluaran) as label, SUM(jumlah) as total' 
                : 'DATE(tanggal_pengeluaran) as label, SUM(jumlah) as total')
            ->groupBy('label')
            ->pluck('total', 'label');

        // Gabungkan keys (label waktu) dari kedua data agar sumbu X lengkap
        $allLabels = $incomeData->keys()->merge($expenseData->keys())->unique()->sort();
        
        foreach ($allLabels as $label) {
            // Format label untuk tampilan (misal: "Jan", "Feb" atau "12 Agt")
            $displayLabel = $groupBy === 'month' 
                ? Carbon::create()->month($label)->locale('id')->isoFormat('MMM') 
                : Carbon::parse($label)->locale('id')->isoFormat('D MMM');

            $chartData[] = [
                'name' => $displayLabel,
                'Pemasukan' => (float) ($incomeData[$label] ?? 0),
                'Pengeluaran' => (float) ($expenseData[$label] ?? 0),
            ];
        }
        // --- [Selesai Logic Chart] ---

        // Data Paginasi untuk Tabel Arsip (Tetap ambil semua urut tanggal terbaru)
        $requests = PpbHeader::orderBy('created_at', 'DESC')->paginate($perPage);
        $notas = Nota::orderBy('created_at', 'DESC')->paginate($perPage);

        // --- Hitung Summary Keuangan (Sesuai Filter Waktu) ---
        $totalPengeluaran = $pengeluaranQuery->clone()->sum('jumlah');
        
        // Total Penjualan Karet (Omset)
        $totalPenjualanKaret = $productQuery->clone()
             ->where('product', 'karet')
             ->where('status', 'buyer')
             ->sum('amount_out');

        // Laba Rugi = Pemasukan - Pengeluaran
        $labaRugi = $totalPenjualanKaret - $totalPengeluaran;

        // Data Statistik Lainnya
        $hargaSahamKaret = HargaInformasi::where('jenis', 'harga_saham_karet')->orderBy('tanggal_berlaku', 'DESC')->first();
        $hargaDollar = HargaInformasi::where('jenis', 'harga_dollar')->orderBy('tanggal_berlaku', 'DESC')->first();
        
        // Stok & Volume Karet (Sesuai Filter Waktu)
        $s_karet = $productQuery->clone()->where('status', 'buyer')->where('product', 'karet')->sum('qty_out');
        $tb_karet = $productQuery->clone()->where('status', 'gka')->where('product', 'karet')->sum('amount_out');
        
        // Total Request Pending (Untuk Badge Notification)
        $pendingCount = PpbHeader::where('status', 'belum ACC')->count() + Nota::where('status', 'belum ACC')->count();

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
            "summary" => [
                "totalRequests" => PpbHeader::count(),
                "totalNotas" => Nota::count(),
                "pendingCount" => $pendingCount,
                "hargaSahamKaret" => $hargaSahamKaret ? (float)$hargaSahamKaret->nilai : 0,
                "hargaDollar" => $hargaDollar ? (float)$hargaDollar->nilai : 0,
                "totalPengeluaran" => $totalPengeluaran,
                "labaRugi" => $labaRugi,
                "totalPenjualanKaret" => $totalPenjualanKaret, // Revenue
                "s_karet" => $s_karet,
                "tb_karet" => $tb_karet,
            ],
            "chartData" => $chartData, // <--- Data Chart dikirim ke frontend
            "filter" => $request->only(['time_period', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth,
            "currentYear" => (int)$selectedYear,
        ]);
    }

    // Metode baru untuk mengambil data pengeluaran dengan filter (dipanggil via AJAX untuk Modal List)
    public function getPengeluarans(Request $request)
    {
        $perPage = 10;
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);
        $page = $request->input('page', 1);

        $query = Pengeluaran::query();

        // Terapkan filter bulan dan tahun
        $query->whereYear('tanggal_pengeluaran', $year)
              ->whereMonth('tanggal_pengeluaran', $month);

        $pengeluarans = $query->orderBy('tanggal_pengeluaran', 'DESC')->paginate($perPage, ['*'], 'page', $page);

        return response()->json($pengeluarans);
    }

    // Metode untuk menyimpan/memperbarui harga saham/dollar
    public function updateHarga(Request $request)
    {
        $request->validate([
            'jenis' => 'required|string|in:harga_saham_karet,harga_dollar',
            'nilai' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
        ]);

        $harga = HargaInformasi::where('jenis', $request->jenis)
                               ->where('tanggal_berlaku', $request->tanggal_berlaku)
                               ->first();

        if ($harga) {
            $harga->update(['nilai' => $request->nilai]);
        } else {
            HargaInformasi::create([
                'jenis' => $request->jenis,
                'nilai' => $request->nilai,
                'tanggal_berlaku' => $request->tanggal_berlaku,
            ]);
        }

        return redirect()->back()->with('success', 'Harga berhasil diperbarui!');
    }

    // Metode untuk menyimpan pengeluaran baru
    public function storePengeluaran(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric|min:0',
            'tanggal_pengeluaran' => 'required|date',
        ]);

        Pengeluaran::create($request->all());

        return redirect()->back()->with('success', 'Pengeluaran berhasil ditambahkan!');
    }

    // Metode untuk memperbarui pengeluaran yang sudah ada
    public function updatePengeluaran(Request $request, $id)
    {
        $request->validate([
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric|min:0',
            'tanggal_pengeluaran' => 'required|date',
        ]);

        $pengeluaran = Pengeluaran::findOrFail($id);
        $pengeluaran->update($request->all());

        return redirect()->back()->with('success', 'Pengeluaran berhasil diperbarui!');
    }

    // Metode untuk menghapus pengeluaran
    public function destroyPengeluaran($id)
    {
        $pengeluaran = Pengeluaran::findOrFail($id);
        $pengeluaran->delete();

        return redirect()->back()->with('success', 'Pengeluaran berhasil dihapus!');
    }
}