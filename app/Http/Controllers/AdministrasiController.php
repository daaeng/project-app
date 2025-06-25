<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Nota;
use App\Models\Requested;

class AdministrasiController extends Controller
{
    public function index()
    {
        $perPage = 10; // Jumlah item per halaman, bisa disesuaikan
        $requests = Requested::orderBy('created_at', 'DESC')->paginate($perPage);
        $notas = Nota::orderBy('created_at', 'DESC')->paginate($perPage);

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
        ]);
    }
}