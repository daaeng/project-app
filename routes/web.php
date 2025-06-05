<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\AdministrasiController;
use App\Http\Controllers\UserManagementController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('dashboard', DashboardController::class);

    Route::get('dashboard', function () {
        return Inertia::render("Dashboard/Index");
    })->name('dashboard');
    
    // ~~~~~~~~~~~~~ PRODUCT ~~~~~~~~~~~~~
    route::get('/products', [ProductController::class, 'index'])->name('products.index');
    route::post('/products', [ProductController::class, 'store'])->name('products.store');
    route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    route::get('/products/{product}/show', [ProductController::class, 'show'])->name('products.show');
    route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    
    // ~~~~~~~~~~~~~ UserManagement ~~~~~~~~~~~~~
    route::get('/usermanagements', [UserManagementController::class, 'index'])->name('usermanagements.index');
    route::post('/usermanagements', [UserManagementController::class, 'store'])->name('usermanagements.store');
    route::get('/usermanagements/create', [UserManagementController::class, 'create'])->name('usermanagements.create');
    route::get('/usermanagements/{user}', [UserManagementController::class, 'show'])->name('usermanagements.show');
    route::get('/usermanagements/{user}/edit', [UserManagementController::class, 'edit'])->name('usermanagements.edit');
    route::put('/usermanagements/{user}', [UserManagementController::class, 'update'])->name('usermanagements.update');
    route::delete('/usermanagements/{user}', [UserManagementController::class, 'destroy'])->name('usermanagements.destroy');
    
    // ~~~~~~~~~~~~~ REQUEST ~~~~~~~~~~~~~
    route::get('/requests', [RequestController::class, 'index'])->name('requests.index');
    route::post('/requests', [RequestController::class, 'surat'])->name('requests.surat');
    route::get('/requests/create', [RequestController::class, 'create'])->name('requests.create');
    route::delete('/requests/{requested}', [RequestController::class, 'destroy'])->name('requests.destroy');

    
    // ~~~~~~~~~~~~~ Invoice ~~~~~~~~~~~~~
    route::get('/notas', [NotaController::class, 'index'])->name('notas.index');
    route::post('/notas', [NotaController::class, 'c_nota'])->name('notas.c_nota');
    route::get('/notas/up_nota', [NotaController::class, 'up_nota'])->name('notas.up_nota');
    route::get('/notas/{nota}/edit', [NotaController::class, 'edit'])->name('notas.edit');
    route::get('/notas/{nota}/show', [NotaController::class, 'show'])->name('notas.show');
    route::delete('/notas/{nota}', [NotaController::class, 'destroy'])->name('notas.destroy');

    // Route::get('/notas', [NotaController::class, 'getNotas']);

    // ~~~~~~~~~~~~~ ADMINISTRASI ~~~~~~~~~~~~~
    route::get('/administrasis', [AdministrasiController::class, 'index'])->name('administrasis.index');


    // ~~~~~~~~~~~~~ Role ~~~~~~~~~~~~~
    //routes
    Route::resource("roles", RoleController::class)
                    ->only(["create", "store"])
                    ->middleware("permission::roles.create");

    Route::resource("roles", RoleController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission::roles.edit");
    
    Route::resource("roles", RoleController::class)
                    ->only(["destroy"])
                    ->middleware("permission::roles.delete");
    
    // Route::resource("roles", RoleController::class)
    //                 ->only(["index", "show"])
    //                 ->middleware("permission::roles.view|roles.create|roles.edit|roles.delete");
    

    Route::resource('roles', RoleController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
