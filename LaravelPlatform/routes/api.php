<?php

use App\Http\Controllers\Api\GameSessionController;
use App\Http\Controllers\Api\EmotionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Info del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Sesiones de juego
    Route::post('/sessions/start', [GameSessionController::class, 'start']);
    Route::post('/sessions/{session}/end', [GameSessionController::class, 'end']);
    Route::get('/sessions', [GameSessionController::class, 'index']);

    // Eventos de emoción
    Route::post('/emotions', [EmotionController::class, 'store']);
});
