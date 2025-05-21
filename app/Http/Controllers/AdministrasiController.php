<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdministrasiController extends Controller
{
    public function index()
    {
       return Inertia('Administrasis/index');
    }

}
