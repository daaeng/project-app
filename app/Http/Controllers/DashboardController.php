<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Requested;
use App\Models\Nota;
use App\Models\Incisor;
use App\Models\User;
use App\Models\Incised; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 10;
        $searchTerm = $request->input('search');
        $timePeriod = $request->input('time_period', 'this-month'); 
        $selectedMonth = $request->input('month');
        $selectedYear = $request->input('year');
        
        $productQueryFilteredByTime = Product::query();
        $incisedQueryFilteredByTime = Incised::query(); 

        if ($timePeriod !== 'all-time' && $timePeriod !== 'all-years') {
            $dateRangeStart = null;
            $dateRangeEnd = null;

            switch ($timePeriod) {
                case 'today':
                    $dateRangeStart = Carbon::today();
                    $dateRangeEnd = Carbon::today();
                    break;
                case 'this-week':
                    $dateRangeStart = Carbon::now()->startOfWeek();
                    $dateRangeEnd = Carbon::now()->endOfWeek();
                    break;
                case 'this-month':
                    $dateRangeStart = Carbon::now()->startOfMonth();
                    $dateRangeEnd = Carbon::now()->endOfMonth();
                    break;
                case 'last-month':
                    $dateRangeStart = Carbon::now()->subMonth()->startOfMonth();
                    $dateRangeEnd = Carbon::now()->subMonth()->endOfMonth();
                    break;
                case 'this-year':
                    $dateRangeStart = Carbon::now()->startOfYear();
                    $dateRangeEnd = Carbon::now()->endOfYear();
                    break;
                case 'custom':
                    if ($selectedMonth && $selectedYear) {
                        $dateRangeStart = Carbon::createFromDate($selectedYear, $selectedMonth, 1)->startOfMonth();
                        $dateRangeEnd = Carbon::createFromDate($selectedYear, $selectedMonth, 1)->endOfMonth();
                    }
                    break;
            }

            if ($dateRangeStart && $dateRangeEnd) {
                $productQueryFilteredByTime->whereBetween('date', [$dateRangeStart, $dateRangeEnd]);
                $incisedQueryFilteredByTime->whereBetween('date', [$dateRangeStart, $dateRangeEnd]);
            }
        }

        $totalAmountOutKaret = $productQueryFilteredByTime->clone()->where('status', 'buyer')->where('product', 'karet')->sum('amount_out');
        $karet_sebayar = $productQueryFilteredByTime->clone()->where('nm_supplier', 'Sebayar')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        $karet_temadu = $productQueryFilteredByTime->clone()->where('nm_supplier', 'Temadu')->where('status', 'tsa')->where('product', 'karet')->sum('qty_kg');
        
        $stok_gka_qty_kg = $productQueryFilteredByTime->clone()->where('status', 'gka')->where('product', 'karet')->sum('qty_kg');
        $stok_gka_qty_out = $productQueryFilteredByTime->clone()->where('status', 'gka')->where('product', 'karet')->sum('qty_out');
        $stok_gka = $stok_gka_qty_kg > 0 ? $stok_gka_qty_kg : $stok_gka_qty_out;

        $hsl_sebayar = $productQueryFilteredByTime->clone()->where('nm_supplier', 'Sebayar')->where('product', 'karet')->sum('amount');
        $hsl_temadu = $productQueryFilteredByTime->clone()->where('nm_supplier', 'Temadu')->where('product', 'karet')->sum('amount');

        $totalRevenueAmount = $productQueryFilteredByTime->clone()->where('status', 'buyer')->where('product', 'karet')->sum('amount_out');
        $totalRevenueKg = $productQueryFilteredByTime->clone()->where('status', 'buyer')->where('product', 'karet')->sum('qty_out');

        $totalPendingRequests = Requested::where('status', 'belum ACC')->count();
        $totalPendingNota = Nota::where('status', 'belum ACC')->sum('dana');
        $jml_penoreh = Incisor::count();
        $jml_pegawai = User::count();

        $monthlyData = [];
        $monthlyRevenueData = [];

        if ($monthlyData === 'all-years') {
            $years = Product::selectRaw('DISTINCT YEAR(date) as year')
                            ->orderBy('year', 'asc')
                            ->pluck('year');

            foreach ($years as $year) {
                $produksiTemaduTahunIni = Product::where('product', 'karet')
                                            ->where('nm_supplier', 'Temadu')
                                            ->where('status', 'tsa')
                                            ->whereYear('date', $year)
                                            ->sum('qty_kg');
                
                $produksiSebayarTahunIni = Product::where('product', 'karet')
                                            ->where('nm_supplier', 'Sebayar')
                                            ->where('status', 'tsa')
                                            ->whereYear('date', $year)
                                            ->sum('qty_kg');

                $penjualanTahunIni = Product::where('product', 'karet')
                                            ->where('status', 'buyer')
                                            ->whereYear('date', $year)
                                            ->sum('amount_out');

                $monthlyData[] = [
                    'name' => (string)$year, 
                    'temadu' => $produksiTemaduTahunIni, 
                    'sebayar' => $produksiSebayarTahunIni, 
                    'penjualan' => $penjualanTahunIni,
                ];

                $monthlyRevenueData[] = [
                    'name' => (string)$year,
                    'value' => $penjualanTahunIni,
                ];
            }
        } else {
            $currentYear = $selectedYear ?? Carbon::now()->year;
            $startMonth = 1;
            $endMonth = 12;

            if ($timePeriod === 'today') {
                $startMonth = Carbon::now()->month;
                $endMonth = Carbon::now()->month;
            } elseif ($timePeriod === 'this-week') {
                $startMonth = Carbon::now()->month;
                $endMonth = Carbon::now()->month;
            } elseif ($timePeriod === 'this-month') {
                $startMonth = Carbon::now()->month;
                $endMonth = Carbon::now()->month;
            } elseif ($timePeriod === 'last-month') {
                $startMonth = Carbon::now()->subMonth()->month;
                $endMonth = Carbon::now()->subMonth()->month;
                $currentYear = Carbon::now()->subMonth()->year;
            } elseif ($timePeriod === 'custom' && $selectedMonth) {
                $startMonth = (int)$selectedMonth;
                $endMonth = (int)$selectedMonth;
            }

            for ($i = $startMonth; $i <= $endMonth; $i++) {
                $monthName = Carbon::create()->month($i)->translatedFormat('M');

                $produksiTemaduBulanIni = Product::where('product', 'karet')
                    ->where('nm_supplier', 'Temadu')
                    ->where('status', 'tsa')
                    ->whereMonth('date', $i)
                    ->whereYear('date', $currentYear)
                    ->sum('qty_kg');

                $produksiSebayarBulanIni = Product::where('product', 'karet')
                    ->where('nm_supplier', 'Sebayar')
                    ->where('status', 'tsa')
                    ->whereMonth('date', $i)
                    ->whereYear('date', $currentYear)
                    ->sum('qty_kg');

                $penjualanBulanIni = Product::where('product', 'karet')
                    ->where('status', 'buyer')
                    ->whereMonth('date', $i)
                    ->whereYear('date', $currentYear)
                    ->sum('amount_out');

                $monthlyData[] = [
                    'name' => $monthName,
                    'temadu' => $produksiTemaduBulanIni,
                    'sebayar' => $produksiSebayarBulanIni,
                    'penjualan' => $penjualanBulanIni,
                ];

                $monthlyRevenueData[] = [
                    'name' => $monthName,
                    'value' => $penjualanBulanIni,
                ];
            }
        }

        $qualityDistributionData = Product::query()
            ->selectRaw('kualitas_out as kualitas, SUM(qty_out) as total_qty')
            ->where('product', 'karet')
            ->where('status', 'gka')
            ->whereNotNull('kualitas_out')
            ->whereNotNull('qty_out')
            ->groupBy('kualitas_out')
            ->get();

        $qualityDistribution = [];
        foreach ($qualityDistributionData as $item) {
            $qualityName = $item->kualitas;
            $qualityDistribution[] = [
                'name' => $qualityName,
                'value' => (float)$item->total_qty
            ];
        }

        if (empty($qualityDistribution)) {
            $qualityDistribution = [
                ['name' => 'Grade A', 'value' => 0],
                ['name' => 'Grade B', 'value' => 0],
                ['name' => 'Grade C', 'value' => 0],
                ['name' => 'Reject', 'value' => 0],
            ];
        }

        $topIncisorRevenue = Incisor::select(
                'incisors.name',
                \DB::raw('SUM(inciseds.amount) as total_revenue'),
                \DB::raw('SUM(inciseds.qty_kg) as total_qty_karet')
            )
            ->join('inciseds', 'incisors.no_invoice', '=', 'inciseds.no_invoice')
            ->where('inciseds.product', 'karet')
            ->groupBy('incisors.name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (float)$item->total_revenue,
                    'qty_karet' => (float)$item->total_qty_karet
                ];
            })->toArray();

        if (empty($topIncisorRevenue)) {
            $topIncisorRevenue = [
                ['name' => 'Penoreh A', 'value' => 0, 'qty_karet' => 0],
                ['name' => 'Penoreh B', 'value' => 0, 'qty_karet' => 0],
                ['name' => 'Penoreh C', 'value' => 0, 'qty_karet' => 0],
                ['name' => 'Penoreh D', 'value' => 0, 'qty_karet' => 0],
                ['name' => 'Penoreh E', 'value' => 0, 'qty_karet' => 0],
            ];
        }

        $products = $productQueryFilteredByTime->clone()
            ->when($searchTerm, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('product', 'like', "%{$search}%")
                      ->orWhere('no_invoice', 'like', "%{$search}%")
                      ->orWhere('nm_supplier', 'like', "%{$search}%")
                      ->orWhere('j_brg', 'like', "%{$search}%");
                });
            })
            ->where('product', 'karet')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage, ['*'], 'page')
            ->withQueryString();

        return Inertia::render("Dashboard/Index", [
            "products" => $products,
            "filter" => $request->only(['search', 'time_period', 'month', 'year']),
            'totalAmountOutKaret' => $totalAmountOutKaret,
            "hsl_tsa" => $karet_sebayar + $karet_temadu,
            "totalPendingRequests" => $totalPendingRequests,
            "totalPendingNota" => $totalPendingNota,
            'stok_gka' => $stok_gka,
            'jml_penoreh' => $jml_penoreh,
            'jml_pegawai' => $jml_pegawai,
            'monthlyData' => $monthlyData,
            'monthlyRevenueData' => $monthlyRevenueData,
            'qualityDistribution' => $qualityDistribution,
            'topIncisorRevenue' => $topIncisorRevenue,
            'totalRevenueAmount' => $totalRevenueAmount,
            'totalRevenueKg' => $totalRevenueKg,
            'hsl_beli' => $hsl_sebayar + $hsl_temadu,
        ]);
    }
}