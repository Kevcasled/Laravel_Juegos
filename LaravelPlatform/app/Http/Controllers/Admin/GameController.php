<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Games/Index', [
            'games' => Game::with('creator')->latest()->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Games/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location'    => ['required', 'string', 'max:255'],
        ]);

        $validated['user_id']      = auth()->id();
        $validated['is_published'] = false;

        Game::create($validated);

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego creado correctamente.');
    }

    public function edit(Game $game): Response
    {
        return Inertia::render('Admin/Games/Edit', [
            'game' => $game->load('creator'),
        ]);
    }

    public function update(Request $request, Game $game): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location'    => ['required', 'string', 'max:255'],
        ]);

        $game->update($validated);

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego actualizado correctamente.');
    }

    public function destroy(Game $game): RedirectResponse
    {
        $game->delete();

        return redirect()->route('admin.games.index')
            ->with('success', 'Juego eliminado correctamente.');
    }

    public function togglePublish(Game $game): RedirectResponse
    {
        $game->update(['is_published' => ! $game->is_published]);

        $message = $game->is_published ? 'Juego publicado.' : 'Juego despublicado.';

        return redirect()->back()->with('success', $message);
    }
}
