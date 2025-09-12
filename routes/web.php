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
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\AttendanceController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ~~~~~~~~~~~~~ PRODUCT ~~~~~~~~~~~~~
    route::get('/products', [ProductController::class, 'index'])->name('products.index')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::post('/products', [ProductController::class, 'store'])->name('products.store')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/create', [ProductController::class, 'create'])->name('products.create')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/c_send', [ProductController::class, 'c_send'])->name('products.c_send')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/s_gka', [ProductController::class, 's_gka'])->name('products.s_gka')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/{product}/edit_out', [ProductController::class, 'edit_out'])->name('products.edit_out')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/{product}/show', [ProductController::class, 'show'])->name('products.show')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/gka', [ProductController::class, 'gka'])->name('products.gka')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/tsa', [ProductController::class, 'tsa'])->name('products.tsa')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/agro', [ProductController::class, 'agro'])->name('products.agro')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    route::get('/products/allof', [ProductController::class, 'allof'])->name('products.allof')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    Route::get('/products/export/excel', [ProductController::class, 'exportExcel'])->name('products.export.excel')
        ->middleware("permission:products.create|products.edit|products.delete|products.view");
    
    // ~~~~~~~~~~~~~ UserManagement ~~~~~~~~~~~~~
    route::get('/usermanagements', [UserManagementController::class, 'index'])->name('usermanagements.index')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::post('/usermanagements', [UserManagementController::class, 'store'])->name('usermanagements.store')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::get('/usermanagements/create', [UserManagementController::class, 'create'])->name('usermanagements.create')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::get('/usermanagements/{user}', [UserManagementController::class, 'show'])->name('usermanagements.show')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::get('/usermanagements/{user}/edit', [UserManagementController::class, 'edit'])->name('usermanagements.edit')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::put('/usermanagements/{user}', [UserManagementController::class, 'update'])->name('usermanagements.update')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    route::delete('/usermanagements/{user}', [UserManagementController::class, 'destroy'])->name('usermanagements.destroy')
        ->middleware("permission:usermanagements.create|usermanagements.edit|usermanagements.delete|usermanagements.view");
    
    // ~~~~~~~~~~~~~ PEGAWAI ~~~~~~~~~~~~~
    Route::resource('pegawai', PegawaiController::class)
        ->middleware("permission:pegawai.create|pegawai.edit|pegawai.delete|pegawai.view");

    // ~~~~~~~~~~~~~ PAYROLL (PENGGAJIAN) ~~~~~~~~~~~~~
    Route::get('/payroll/generate', [PayrollController::class, 'generate'])->name('payroll.generate');
    Route::resource('/payroll', PayrollController::class)->except(['destroy']);
    
    // ~~~~~~~~~~~~~ REQUEST ~~~~~~~~~~~~~
    Route::get('/requests', [RequestController::class, 'index'])->name('requests.index')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::post('/requests', [RequestController::class, 'surat'])->name('requests.surat')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::get('/requests/create', [RequestController::class, 'create'])->name('requests.create')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::get('/requests/{requested}/edit', [RequestController::class, 'edit'])->name('requests.edit')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::put('/requests/{requested}', [RequestController::class, 'update'])->name('requests.update')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::get('/requests/{requested}/show', [RequestController::class, 'show'])->name('requests.show')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::delete('/requests/{requested}', [RequestController::class, 'destroy'])->name('requests.destroy')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");

    Route::get('/requests/{requested}/editAct', [RequestController::class, 'editAct'])->name('requests.editAct')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::put('/requests/{requested}/act', [RequestController::class, 'updateAct'])->name('requests.updateAct')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    Route::get('/requests/{requested}/showAct', [RequestController::class, 'showAct'])->name('requests.showAct')
        ->middleware("permission:requests.create|requests.edit|requests.delete|requests.view");
    
    // ~~~~~~~~~~~~~ Invoice ~~~~~~~~~~~~~
    route::get('/notas', [NotaController::class, 'index'])->name('notas.index')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::post('/notas', [NotaController::class, 'c_nota'])->name('notas.c_nota')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::get('/notas/up_nota', [NotaController::class, 'up_nota'])->name('notas.up_nota')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::get('/notas/{nota}/edit', [NotaController::class, 'edit'])->name('notas.edit')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::put('/notas/{nota}', [NotaController::class, 'update'])->name('notas.update')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::get('/notas/{nota}/show', [NotaController::class, 'show'])->name('notas.show')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::delete('/notas/{nota}', [NotaController::class, 'destroy'])->name('notas.destroy')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::get('/notas/{nota}/editAct', [NotaController::class, 'editAct'])->name('notas.editAct')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::put('/notas/{nota}', [NotaController::class, 'updateAct'])->name('notas.updateAct')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");
    route::get('/notas/{nota}/showAct', [NotaController::class, 'showAct'])->name('notas.showAct')
        ->middleware("permission:notas.create|notas.edit|notas.delete|notas.view");

    // ~~~~~~~~~~~~~ ADMINISTRASI ~~~~~~~~~~~~~
    route::get('/administrasis', [AdministrasiController::class, 'index'])->name('administrasis.index')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");
    Route::get('/administrasis/pengeluarans', [AdministrasiController::class, 'getPengeluarans'])->name('administrasis.getPengeluarans')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");
    Route::post('/administrasis/update-harga', [AdministrasiController::class, 'updateHarga'])->name('administrasis.updateHarga')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");
    Route::post('/administrasis/store-pengeluaran', [AdministrasiController::class, 'storePengeluaran'])->name('administrasis.storePengeluaran')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");
    Route::put('/administrasis/update-pengeluaran/{id}', [AdministrasiController::class, 'updatePengeluaran'])->name('administrasis.updatePengeluaran')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");
    Route::delete('/administrasis/destroy-pengeluaran/{id}', [AdministrasiController::class, 'destroyPengeluaran'])->name('administrasis.destroyPengeluaran')
        ->middleware("permission:administrasis.create|administrasis.edit|administrasis.delete|administrasis.view");

    // ~~~~~~~~~~~~~ Role ~~~~~~~~~~~~~
    Route::resource("roles", RoleController::class)
                    ->only(["create", "store", "edit", "update", "destroy", "index", "show"])
                    ->middleware("permission:roles.create|roles.edit|roles.delete|roles.view");
    
    // ~~~~~~~~~~~~~ Incisor ~~~~~~~~~~~~~
    route::get('/incisors', [IncisorController::class, 'index'])->name('incisors.index')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::post('/incisors', [IncisorController::class, 'store'])->name('incisors.store')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::get('/incisors/create', [IncisorController::class, 'create'])->name('incisors.create')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::get('/incisors/{incisor}/edit', [IncisorController::class, 'edit'])->name('incisors.edit')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::put('/incisors/{incisor}', [IncisorController::class, 'update'])->name('incisors.update')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::get('/incisors/{incisor}/show', [IncisorController::class, 'show'])->name('incisors.show')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    route::delete('/incisors/{incisor}', [IncisorController::class, 'destroy'])->name('incisors.destroy')
        ->middleware("permission:incisor.create|incisor.edit|incisor.delete|incisor.view");
    
    // ~~~~~~~~~~~~~ Inciseds ~~~~~~~~~~~~~
    route::get('/inciseds', [IncisedController::class, 'index'])->name('inciseds.index')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::post('/inciseds', [IncisedController::class, 'store'])->name('inciseds.store')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::get('/inciseds/create', [IncisedController::class, 'create'])->name('inciseds.create')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::get('/inciseds/{incised}/edit', [IncisedController::class, 'edit'])->name('inciseds.edit')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::put('/inciseds/{incised}', [IncisedController::class, 'update'])->name('inciseds.update')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::get('/inciseds/{incised}/show', [IncisedController::class, 'show'])->name('inciseds.show')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    route::delete('/inciseds/{incised}', [IncisedController::class, 'destroy'])->name('inciseds.destroy')
        ->middleware("permission:incised.create|incised.edit|incised.delete|incised.view");
    
    // ~~~~~~~~~~~~~ KASBON / UTANG ~~~~~~~~~~~~~
    Route::post('/kasbons/get-incisor-data', [KasbonController::class, 'getIncisorData'])
        ->name('kasbons.getIncisorData')
        ->middleware("permission:kasbons.create|kasbons.edit|kasbons.delete|kasbons.view");

    Route::post('/kasbons/pay', [KasbonController::class, 'pay'])
        ->name('kasbons.pay')
        ->middleware("permission:kasbons.edit");

    Route::get('/kasbons/print', [KasbonController::class, 'print'])->name('kasbons.print')
        ->middleware("permission:kasbons.view");
    
    Route::get('/kasbons/print-detail/{type}/{id}', [KasbonController::class, 'printDetail'])->name('kasbons.printDetail')
        ->middleware("permission:kasbons.view");

    Route::get('/kasbons/details/{type}/{id}', [KasbonController::class, 'showByUser'])->name('kasbons.showByUser')
        ->middleware("permission:kasbons.view");
        
    Route::resource('kasbons', KasbonController::class)->except(['show'])
        ->middleware("permission:kasbons.create|kasbons.edit|kasbons.delete|kasbons.view");

    Route::get('/kasbons-pegawai/create', [KasbonController::class, 'createPegawai'])
        ->name('kasbons.create_pegawai')
        ->middleware("permission:kasbons.create|kasbons.edit|kasbons.delete|kasbons.view");

    Route::post('/kasbons-pegawai', [KasbonController::class, 'storePegawai'])
        ->name('kasbons.store_pegawai')
        ->middleware("permission:kasbons.create|kasbons.edit|kasbons.delete|kasbons.view");
        
    Route::put('/kasbon-payments/{payment}', [KasbonController::class, 'updatePayment'])->name('kasbon-payments.update')
        ->middleware('permission:kasbons.edit');
        
    Route::delete('/kasbon-payments/{payment}', [KasbonController::class, 'destroyPayment'])->name('kasbon-payments.destroy')
        ->middleware('permission:kasbons.delete');

    // ~~~~~~~~~~~~~ INVENTORY ~~~~~~~~~~~~~
    Route::get('/inventories', [InventoryController::class, 'index'])->name('inventories.index');
    Route::post('/inventories', [InventoryController::class, 'store'])->name('inventories.store');
    Route::put('/inventories/{inventory}', [InventoryController::class, 'update'])->name('inventories.update');
    Route::delete('/inventories/{inventory}', [InventoryController::class, 'destroy'])->name('inventories.destroy');
    Route::get('/inventories/{inventory}', [InventoryController::class, 'show'])->name('inventories.show');
    Route::post('/inventories/{inventory}/stock-in', [InventoryController::class, 'stockIn'])->name('inventories.stockIn');
    Route::post('/inventories/{inventory}/stock-out', [InventoryController::class, 'stockOut'])->name('inventories.stockOut');

    // ~~~~~~~~~~~~~ ATTENDANCE (ABSENSI) ~~~~~~~~~~~~~
    Route::resource('attendances', AttendanceController::class);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
