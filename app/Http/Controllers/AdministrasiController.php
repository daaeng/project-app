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
        $pendingRequests = Requested::where('status', 'Pending')->count();
        // Contoh: Total dana dari nota yang statusnya 'Approved'
        $totalDanaApproved = Nota::where('status', 'Approved')->sum('dana');
        // Pastikan kolom 'dana' di database bertipe numerik (misal: decimal, double)
        // Jika 'dana' disimpan sebagai string, Anda mungkin perlu mengonversinya
        // $totalDanaApproved = Nota::where('status', 'Approved')
        //     ->get()
        //     ->sum(function($nota) {
        //         return (float) $nota->dana;
        //     });


        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
            "summary" => [ // Kirim data summary ke frontend
                "totalRequests" => $totalRequests,
                "totalNotas" => $totalNotas,
                "pendingRequests" => $pendingRequests,
                "totalDanaApproved" => $totalDanaApproved,
            ],
        ]);
    }
}
