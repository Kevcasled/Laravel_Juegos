<?php

namespace App\Http\Controllers;

use App\Events\MessageSend;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with('user')
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values()
            ->map(fn($m) => [
                'id'         => $m->id,
                'content'    => $m->content,
                'created_at' => $m->created_at->toISOString(),
                'user'       => [
                    'id'   => $m->user?->id,
                    'name' => $m->user?->name ?? 'Deleted user',
                ],
            ]);

        return Inertia::render('Chat', compact('messages'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:1|max:1000',
        ]);

        $message = auth()->user()->messages()->create([
            'content' => $validated['content'],
        ]);

        MessageSend::dispatch($message);

        return response()->json(['ok' => true]);
    }
}
