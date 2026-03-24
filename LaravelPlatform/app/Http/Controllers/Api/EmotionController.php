<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmotionEvent;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmotionController extends Controller
{
    /**
     * Store a new emotion event for a game session.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id'      => ['required', 'integer', 'exists:game_sessions,id'],
            'emotion'         => ['required', 'string', 'in:neutral,happy,sad,angry,surprised'],
            'confidence'      => ['required', 'numeric', 'min:0', 'max:1'],
            'elapsed_seconds' => ['required', 'integer', 'min:0'],
        ]);

        $session = GameSession::findOrFail($validated['session_id']);

        if ($session->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $event = EmotionEvent::create([
            'game_session_id' => $session->id,
            'emotion'         => $validated['emotion'],
            'confidence'      => $validated['confidence'],
            'elapsed_seconds' => $validated['elapsed_seconds'],
        ]);

        return response()->json([
            'id'              => $event->id,
            'emotion'         => $event->emotion,
            'confidence'      => $event->confidence,
            'elapsed_seconds' => $event->elapsed_seconds,
        ], 201);
    }
}
