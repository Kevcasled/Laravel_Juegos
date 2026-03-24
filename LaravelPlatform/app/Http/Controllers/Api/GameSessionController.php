<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameSessionController extends Controller
{
    /**
     * Start a new game session.
     */
    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'game_id' => ['required', 'integer', 'exists:games,id'],
        ]);

        $game = Game::findOrFail($validated['game_id']);

        if (! $game->is_published) {
            return response()->json(['message' => 'El juego no está disponible.'], 403);
        }

        $session = GameSession::create([
            'user_id'    => auth()->id(),
            'game_id'    => $game->id,
            'started_at' => now(),
        ]);

        return response()->json([
            'session_id' => $session->id,
            'game_id'    => $session->game_id,
            'started_at' => $session->started_at,
            'message'    => 'Sesión iniciada correctamente.',
        ], 201);
    }

    /**
     * End an existing game session.
     */
    public function end(Request $request, GameSession $session): JsonResponse
    {
        if ($session->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $validated = $request->validate([
            'score' => ['nullable', 'numeric'],
        ]);

        $endedAt         = now();
        $durationSeconds = (int) $session->started_at->diffInSeconds($endedAt);

        $session->update([
            'ended_at'         => $endedAt,
            'duration_seconds' => $durationSeconds,
            'score'            => $validated['score'] ?? null,
        ]);

        return response()->json([
            'session_id'       => $session->id,
            'score'            => $session->score,
            'duration_seconds' => $session->duration_seconds,
            'message'          => 'Sesión finalizada correctamente.',
        ]);
    }

    /**
     * List game sessions for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $sessions = GameSession::with('game')
            ->where('user_id', auth()->id())
            ->latest('started_at')
            ->get();

        return response()->json($sessions);
    }
}
