<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalAmountOutKaret = Product::where('status', 'buyer')->where('product', 'karet')->SUM('amount_out');

        return Inertia::render("Dashboard/Index", [
            'totalAmountOutKaret' => $totalAmountOutKaret,
        ]);
    }
}