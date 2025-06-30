<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\AdministrasiController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\IncisorController;
use App\Http\Controllers\IncisedController;
use App\Http\Controllers\KasbonController;

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

    route::get('/products/gka', [ProductController::class, 'gka'])->name('products.gka');
    route::get('/products/tsa', [ProductController::class, 'tsa'])->name('products.tsa');
    
    route::get('/products/allof', [ProductController::class, 'allof'])->name('products.allof');

    Route::get('/products/export/excel', [ProductController::class, 'exportExcel'])->name('products.export.excel');
    
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
    route::get('/requests/{requested}/edit', [RequestController::class, 'edit'])->name('requests.edit');
    route::put('/requests/{requested}', [RequestController::class, 'update'])->name('requests.update');
    route::get('/requests/{requested}/show', [RequestController::class, 'show'])->name('requests.show');
    route::delete('/requests/{requested}', [RequestController::class, 'destroy'])->name('requests.destroy');
    
    route::get('/requests/{requested}/editAct', [RequestController::class, 'editAct'])->name('requests.editAct');
    route::put('/requests/{requested}', [RequestController::class, 'updateAct'])->name('requests.updateAct');
    route::get('/requests/{requested}/showAct', [RequestController::class, 'showAct'])->name('requests.showAct');
    
    // ~~~~~~~~~~~~~ Invoice ~~~~~~~~~~~~~
    // Route::resource('notas', NotaController::class);

    route::get('/notas', [NotaController::class, 'index'])->name('notas.index');
    route::post('/notas', [NotaController::class, 'c_nota'])->name('notas.c_nota');
    route::get('/notas/up_nota', [NotaController::class, 'up_nota'])->name('notas.up_nota');
    route::get('/notas/{nota}/edit', [NotaController::class, 'edit'])->name('notas.edit');
    route::put('/notas/{nota}', [NotaController::class, 'update'])->name('notas.update');
    route::get('/notas/{nota}/show', [NotaController::class, 'show'])->name('notas.show');
    route::delete('/notas/{nota}', [NotaController::class, 'destroy'])->name('notas.destroy');
    
    route::get('/notas/{nota}/editAct', [NotaController::class, 'editAct'])->name('notas.editAct');
    route::put('/notas/{nota}', [NotaController::class, 'updateAct'])->name('notas.updateAct');
    route::get('/notas/{nota}/showAct', [NotaController::class, 'showAct'])->name('notas.showAct');
    // Route::get('/notas', [NotaController::class, 'getNotas']);

    // ~~~~~~~~~~~~~ ADMINISTRASI ~~~~~~~~~~~~~
    route::get('/administrasis', [AdministrasiController::class, 'index'])->name('administrasis.index');


    // ~~~~~~~~~~~~~ Role ~~~~~~~~~~~~~
    //routes
    Route::resource("roles", RoleController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:roles.create");

    Route::resource("roles", RoleController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:roles.edit");
    
    Route::resource("roles", RoleController::class)
                    ->only(["destroy"])
                    ->middleware("permission:roles.delete");
    
    Route::resource("roles", RoleController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:roles.view|roles.create|roles.edit|roles.delete");
    

    Route::resource('roles', RoleController::class);

    // ~~~~~~~~~~~~~ Incisor ~~~~~~~~~~~~~
    route::get('/incisors', [IncisorController::class, 'index'])->name('incisors.index');
    route::post('/incisors', [IncisorController::class, 'store'])->name('incisors.store');
    route::get('/incisors/create', [IncisorController::class, 'create'])->name('incisors.create');
    route::get('/incisors/{incisor}/edit', [IncisorController::class, 'edit'])->name('incisors.edit');
    route::put('/incisors/{incisor}', [IncisorController::class, 'update'])->name('incisors.update');
    route::get('/incisors/{incisor}/show', [IncisorController::class, 'show'])->name('incisors.show');
    route::delete('/incisors/{incisor}', [IncisorController::class, 'destroy'])->name('incisors.destroy');
    
    // ~~~~~~~~~~~~~ Inciseds ~~~~~~~~~~~~~
    route::get('/inciseds', [IncisedController::class, 'index'])->name('inciseds.index');
    route::post('/inciseds', [IncisedController::class, 'store'])->name('inciseds.store');
    route::get('/inciseds/create', [IncisedController::class, 'create'])->name('inciseds.create');
    route::get('/inciseds/{incised}/edit', [IncisedController::class, 'edit'])->name('inciseds.edit');
    route::put('/inciseds/{incised}', [IncisedController::class, 'update'])->name('inciseds.update');
    route::get('/inciseds/{incised}/show', [IncisedController::class, 'show'])->name('inciseds.show');
    route::delete('/inciseds/{incised}', [IncisedController::class, 'destroy'])->name('inciseds.destroy');
    
    // ~~~~~~~~~~~~~ KASBON ~~~~~~~~~~~~~
    // Route::resource('kasbons', KasbonController::class);
    // Route::middleware(['auth'])->group(function () {
    //     Route::resource('kasbons', KasbonController::class);
    // });
    // route::get('/kasbons', [KasbonController::class, 'index'])->name('kasbons.index');
    // route::post('/kasbons', [KasbonController::class, 'store'])->name('kasbons.store');
    // route::get('/kasbons/create', [KasbonController::class, 'create'])->name('kasbons.create');
    // route::get('/kasbons/{incised}/edit', [KasbonController::class, 'edit'])->name('kasbons.edit');
    // route::put('/kasbons/{incised}', [KasbonController::class, 'update'])->name('kasbons.update');
    // route::get('/kasbons/{incised}/show', [KasbonController::class, 'show'])->name('kasbons.show');
    // route::delete('/kasbons/{incised}', [KasbonController::class, 'destroy'])->name('kasbons.destroy');

    Route::post('/kasbons/get-incisor-data', [KasbonController::class, 'getIncisorData'])->name('kasbons.getIncisorData');

    Route::resource('kasbons', KasbonController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
