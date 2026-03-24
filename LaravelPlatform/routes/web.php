<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Player\GameController as PlayerGameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página de bienvenida
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Auth routes (Breeze las genera automáticamente, no las dupliques)
require __DIR__.'/auth.php';

// Dashboard — protegido, redirige según rol
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin y Gestor — CRM de juegos
    Route::middleware('role:admin,gestor')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('games', AdminGameController::class);
        Route::patch('games/{game}/toggle-publish', [AdminGameController::class, 'togglePublish'])->name('games.toggle-publish');
    });

    // Solo Admin — gestión de usuarios
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', AdminUserController::class)->except(['create', 'store']);
    });

    // Jugador — ver y jugar juegos
    Route::middleware('role:jugador')->prefix('games')->name('player.')->group(function () {
        Route::get('/', [PlayerGameController::class, 'index'])->name('games.index');
        Route::get('/{game}', [PlayerGameController::class, 'show'])->name('games.show');
    });
});
