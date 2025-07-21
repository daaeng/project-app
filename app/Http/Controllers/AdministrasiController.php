<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Nota;
use App\Models\Requested; // Asumsi model untuk Request Letter adalah Requested

class AdministrasiController extends Controller
{
    public function index()
    {
        $perPage = 10; // Jumlah item per halaman, bisa disesuaikan

        // Ambil data paginasi untuk requests
        $requests = Requested::orderBy('created_at', 'DESC')->paginate($perPage);

        // Ambil data paginasi untuk notas
        $notas = Nota::orderBy('created_at', 'DESC')->paginate($perPage);

        // --- Hitung Data Summary ---
        $totalRequests = Requested::count();
        $totalNotas = Nota::count();
        $pendingRequests = Requested::where('status', 'belum ACC')->count();
        $pendingNotas = Nota::where('status', 'belum ACC')->count();
        $totalPendingRequests = $pendingRequests + $pendingNotas; // Perhitungan baru
        $totalApprovedDana = Nota::where('status', 'diterima')->sum('dana'); // Perhitungan diperbarui

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
            "summary" => [ // Kirim data summary ke frontend
                "totalRequests" => $totalRequests,
                "totalNotas" => $totalNotas,
                "totalPendingRequests" => $totalPendingRequests, // Kirim total pending gabungan
                "totalApprovedDana" => $totalApprovedDana, // Kirim total dana disetujui gabungan
            ],
        ]);
    }
}
