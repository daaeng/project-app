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
        } elseif ($timePeriod === 'last-month') { // Opsi baru: Bulan Lalu
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

        // Ambil semua data pengeluaran dengan paginasi (ini tetap tidak difilter waktu untuk tabel detail)
        // Menggunakan 'pengeluaranPage' sebagai nama parameter query string untuk paginasi pengeluaran
        $pengeluarans = Pengeluaran::orderBy('tanggal_pengeluaran', 'DESC')->paginate($perPage, ['*'], 'pengeluaranPage');


        // --- Hitung Data Summary yang sudah ada ---
        $totalRequests = Requested::count();
        $totalNotas = Nota::count();
        $pendingRequests = Requested::where('status', 'belum ACC')->count();
        $pendingNotas = Nota::where('status', 'belum ACC')->count();
        $totalPendingRequests = $pendingRequests + $pendingNotas;
        $totalApprovedDana = Nota::where('status', 'diterima')->sum('dana');

        // --- Ambil Data Baru untuk Kartu (SEKARANG DIFILTER WAKTU) ---
        // Harga Saham Karet terbaru (ini biasanya diambil yang paling baru, tidak difilter waktu)
        $hargaSahamKaret = HargaInformasi::where('jenis', 'harga_saham_karet')
                                        ->orderBy('tanggal_berlaku', 'DESC')
                                        ->first();
        $hargaSahamKaretValue = $hargaSahamKaret ? (float)$hargaSahamKaret->nilai : 0;

        // Harga Dollar terbaru (ini biasanya diambil yang paling baru, tidak difilter waktu)
        $hargaDollar = HargaInformasi::where('jenis', 'harga_dollar')
                                    ->orderBy('tanggal_berlaku', 'DESC')
                                    ->first();
        $hargaDollarValue = $hargaDollar ? (float)$hargaDollar->nilai : 0;

        // Total Pengeluaran (DIFILTER WAKTU)
        $totalPengeluaran = $pengeluaranQueryFilteredByTime->sum('jumlah');

        // Total Penjualan Karet (DIFILTER WAKTU)
        // Pastikan 'product' adalah 'karet' dan 'status' adalah 'buyer' untuk penjualan
        $totalPenjualanKaret = $productQueryFilteredByTime->clone()
                                      ->where('product', 'karet')
                                      ->where('status', 'buyer') // Pastikan hanya penjualan yang masuk perhitungan
                                      ->sum('amount_out');

        // Perhitungan Laba/Rugi (DIFILTER WAKTU)
        $labaRugi = $totalPenjualanKaret - $totalPengeluaran;

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
            "pengeluarans" => $pengeluarans,
            "summary" => [
                "totalRequests" => $totalRequests,
                "totalNotas" => $totalNotas,
                "totalPendingRequests" => $totalPendingRequests,
                "totalApprovedDana" => $totalApprovedDana,
                "hargaSahamKaret" => $hargaSahamKaretValue,
                "hargaDollar" => $hargaDollarValue,
                "totalPengeluaran" => $totalPengeluaran,
                "labaRugi" => $labaRugi,
                "totalPenjualanKaret" => $totalPenjualanKaret, // Pastikan ini dikirim
            ],
            // Kirim filter waktu yang lebih detail ke frontend
            "filter" => $request->only(['time_period', 'month', 'year']),
            "currentMonth" => (int)$selectedMonth,
            "currentYear" => (int)$selectedYear,
        ]);
    }

    // Metode untuk menyimpan/memperbarui harga saham/dollar
    public function updateHarga(Request $request)
    {
        $request->validate([
            'jenis' => 'required|string|in:harga_saham_karet,harga_dollar',
            'nilai' => 'required|numeric|min:0',
            'tanggal_berlaku' => 'required|date',
        ]);

        // Cari data harga yang berlaku pada tanggal tersebut
        $harga = HargaInformasi::where('jenis', $request->jenis)
                               ->where('tanggal_berlaku', $request->tanggal_berlaku)
                               ->first();

        if ($harga) {
            // Jika sudah ada, update nilainya
            $harga->update(['nilai' => $request->nilai]);
        } else {
            // Jika belum ada, buat entri baru
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
