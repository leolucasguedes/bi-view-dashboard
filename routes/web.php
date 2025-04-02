<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RankingPageController;
use App\Http\Controllers\DashboardPageController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\FilterPageController;
use App\Http\Controllers\UserPageController;
use App\Http\Controllers\RegionPageController;
use App\Http\Controllers\UsersController;
use Lab404\Impersonate\Controllers\ImpersonateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/admin/login', function () {
    return redirect('/login');
});

Route::get('/dashboard',  [DashboardPageController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/ranking',  [RankingPageController::class, 'index'])->middleware(['auth', 'verified'])->name('ranking');

Route::get('/contato',  [ContactPageController::class, 'index'])->middleware(['auth', 'verified'])->name('contato');

Route::get('/filtro',  [FilterPageController::class, 'index'])->middleware(['auth', 'verified'])->name('filtro');

Route::get('/cadastrados',  [UsersController::class, 'index'])->middleware(['auth', 'verified'])->name('usuarios');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bairro/{name}', [RegionPageController::class, 'index'])->middleware(['auth', 'verified'])->name('bairro.index');
    Route::post('/bairro/region', [RegionPageController::class, 'regionData'])->name('bairro.regionData');
});

Route::impersonate('impersonate', ImpersonateController::class);

Route::middleware('auth')->group(function () {
    Route::get('/painel/{id}', [UserPageController::class, 'index'])->name('painel.index');
    Route::patch('/painel/{id}', [UserPageController::class, 'update'])->name('painel.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('perfil.edit');
    Route::patch('/perfil', [ProfileController::class, 'update'])->name('perfil.update');
    Route::delete('/perfil', [ProfileController::class, 'destroy'])->name('perfil.destroy');
});

require __DIR__ . '/auth.php';
