<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Nota;
use App\Models\Requested;
use App\Models\HargaInformasi;
use App\Models\Pengeluaran;
use App\Models\Product;
use Carbon\Carbon;

class AdministrasiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10;
        // Ambil filter waktu dari request, default ke bulan saat ini jika tidak ada
        $selectedMonth = $request->input('month', Carbon::now()->month);
        $selectedYear = $request->input('year', Carbon::now()->year);
        $timePeriod = $request->input('time_period', 'this-month'); // Default ke 'this-month'

        // Inisialisasi query untuk Product dan Pengeluaran yang akan difilter waktu
        $productQueryFilteredByTime = Product::query();
        $pengeluaranQueryFilteredByTime = Pengeluaran::query();

        $dateRangeStart = null;
        $dateRangeEnd = null;

        // Logika filter waktu yang lebih fleksibel
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
        // 'all-time' dan 'all-years' tidak memerlukan filter tanggal spesifik

        if ($dateRangeStart && $dateRangeEnd) {
            $productQueryFilteredByTime->whereBetween('date', [$dateRangeStart, $dateRangeEnd]);
            $pengeluaranQueryFilteredByTime->whereBetween('tanggal_pengeluaran', [$dateRangeStart, $dateRangeEnd]);
        }

        // Ambil data paginasi untuk requests
        $requests = Requested::orderBy('created_at', 'DESC')->paginate($perPage);

        // Ambil data paginasi untuk notas
        $notas = Nota::orderBy('created_at', 'DESC')->paginate($perPage);

        // --- Hitung Data Summary ---
        $totalRequests = Requested::count();
        $totalNotas = Nota::count();
        $pendingRequests = Requested::where('status', 'belum ACC')->count();
        $pendingNotas = Nota::where('status', 'belum ACC')->count();
        $totalPendingRequests = $pendingRequests + $pendingNotas;
        $totalApprovedDana = Nota::where('status', 'diterima')->sum('dana');

        // Harga Saham Karet terbaru (tidak difilter waktu)
        $hargaSahamKaret = HargaInformasi::where('jenis', 'harga_saham_karet')
                                        ->orderBy('tanggal_berlaku', 'DESC')
                                        ->first();
        $hargaSahamKaretValue = $hargaSahamKaret ? (float)$hargaSahamKaret->nilai : 0;

        // Harga Dollar terbaru (tidak difilter waktu)
        $hargaDollar = HargaInformasi::where('jenis', 'harga_dollar')
                                    ->orderBy('tanggal_berlaku', 'DESC')
                                    ->first();
        $hargaDollarValue = $hargaDollar ? (float)$hargaDollar->nilai : 0;

        // Total Pengeluaran (DIFILTER WAKTU, untuk kartu summary)
        $totalPengeluaran = $pengeluaranQueryFilteredByTime->sum('jumlah');

        // Total Penjualan Karet (DIFILTER WAKTU, untuk perhitungan laba/rugi)
        $totalPenjualanKaret = $productQueryFilteredByTime->clone()
                                      ->where('product', 'karet')
                                      ->where('status', 'buyer')
                                      ->sum('amount_out');

        // Perhitungan Laba/Rugi (DIFILTER WAKTU)
        $labaRugi = $totalPenjualanKaret - $totalPengeluaran;

        // Stok karet pengiriman (DIFILTER WAKTU)
        $s_karet = $productQueryFilteredByTime->clone()->where('status', 'buyer')->where('product', 'karet')->SUM('qty_out');
        // Harga Jual Karet (DIFILTER WAKTU)
        $h_karet = $productQueryFilteredByTime->clone()
                                                  ->where('product', 'karet')
                                                  ->where('status', 'buyer')
                                                  ->whereNotNull('price_out') // Hanya ambil yang price_out-nya tidak NULL
                                                  ->average('price_out');
        // Pembelian karet (DIFILTER WAKTU) - diasumsikan 'gka' adalah status pembelian
        $tb_karet = $productQueryFilteredByTime->clone()->where('status', 'gka')->where('product', 'karet')->SUM('amount_out');
        // Penjualan karet (DIFILTER WAKTU) - diasumsikan 'buyer' adalah status penjualan
        $tj_karet = $productQueryFilteredByTime->clone()->where('status', 'buyer')->where('product', 'karet')->SUM('amount_out');

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
            "summary" => [
                "totalRequests" => $totalRequests,
                "totalNotas" => $totalNotas,
                "totalPendingRequests" => $totalPendingRequests,
                "totalApprovedDana" => $totalApprovedDana,
                "hargaSahamKaret" => $hargaSahamKaretValue,
                "hargaDollar" => $hargaDollarValue,
                "totalPengeluaran" => $totalPengeluaran,
                "labaRugi" => $labaRugi,
                "totalPenjualanKaret" => $totalPenjualanKaret,
                "s_karet" => $s_karet,
                "h_karet" => $h_karet,
                "tb_karet" => $tb_karet,
                "tj_karet" => $tj_karet,
            ],
            "filter" => $request->only(['time_period', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth,
            "currentYear" => (int)$selectedYear,
        ]);
    }

    // Metode baru untuk mengambil data pengeluaran dengan filter (dipanggil via AJAX)
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
