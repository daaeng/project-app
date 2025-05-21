<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function index()
    {
       return Inertia('Requests/index');
    }
    
    public function create()
    {
       return Inertia('Requests/create');
    }
}
