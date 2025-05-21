<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
       return Inertia('UserManagements/index');
    }
}
