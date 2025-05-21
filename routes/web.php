<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AdministrasiController;
use App\Http\Controllers\UserManagementController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // ~~~~~~~~~~~~~ PRODUCT ~~~~~~~~~~~~~
    route::get('/products', [ProductController::class, 'index'])->name('products.index');
    route::post('/products', [ProductController::class, 'store'])->name('products.store');
    route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    
    // ~~~~~~~~~~~~~ REQUEST ~~~~~~~~~~~~~
    route::get('/usermanagements', [UserManagementController::class, 'index'])->name('usermanagements.index');
    

    // ~~~~~~~~~~~~~ REQUEST ~~~~~~~~~~~~~
    route::get('/requests', [RequestController::class, 'index'])->name('requests.index');
    route::get('/requests/create', [RequestController::class, 'create'])->name('requests.create');


    // ~~~~~~~~~~~~~ ADMINISTRASI ~~~~~~~~~~~~~
    route::get('/administrasis', [AdministrasiController::class, 'index'])->name('administrasis.index');
    
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
