<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmotionEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_session_id',
        'emotion',
        'confidence',
        'elapsed_seconds',
    ];

    protected $casts = [
        'confidence' => 'float',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function gameSession(): BelongsTo
    {
        return $this->belongsTo(GameSession::class);
    }
}
