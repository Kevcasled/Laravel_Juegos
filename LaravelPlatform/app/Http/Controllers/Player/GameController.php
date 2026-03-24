<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Player/Games/Index', [
            'games' => Game::published()->get(),
        ]);
    }

    public function show(Game $game): Response
    {
        if (! $game->is_published) {
            abort(403, 'Este juego no está disponible.');
        }

        return Inertia::render('Player/Games/Show', [
            'game' => $game,
        ]);
    }
}
