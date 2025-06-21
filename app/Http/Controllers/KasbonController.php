<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class KasbonController extends Controller
{
    public function index()
    {
        // $incisors = Incisor::orderBy('created_at', 'ASC')->get();
        return Inertia::render("Kasbon/index", 
            // [
            //     // "incisors" => $incisors,
            // ]
        );
    }
}
