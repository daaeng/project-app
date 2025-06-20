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
        $requests = Requested::orderBy('created_at', 'DESC')->get();
        $notas = Nota::orderBy('created_at', 'DESC')->get();

        return Inertia::render("Administrasis/index", [
            "requests" => $requests,
            "notas" => $notas,
        ]);
    //    return Inertia('Administrasis/index');
    }

    

}
