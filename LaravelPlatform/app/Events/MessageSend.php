<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSend implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('chat'),
        ];
    }

    public function broadcastWith(): array
    {
        // SerializesModels rehidrata el modelo pero no las relaciones.
        // loadMissing garantiza que user esté disponible al serializar.
        $this->message->loadMissing('user');

        return [
            'message' => [
                'id'         => $this->message->id,
                'content'    => $this->message->content,
                'created_at' => $this->message->created_at->toISOString(),
                'user'       => [
                    'id'   => $this->message->user->id,
                    'name' => $this->message->user->name,
                ],
            ],
        ];
    }
}
