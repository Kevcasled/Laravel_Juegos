<?php

namespace App\Policies;

use App\Models\Game;
use App\Models\User;

class GamePolicy
{
    /**
     * Any authenticated user can list games.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Authenticated users can view published games.
     * Admin/gestor can view any game regardless of publish status.
     */
    public function view(User $user, Game $game): bool
    {
        if ($user->isAdmin() || $user->isGestor()) {
            return true;
        }

        return $game->is_published;
    }

    /**
     * Only admin or gestor can create games.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isGestor();
    }

    /**
     * Admin can update any game.
     * Gestor can only update games they created.
     */
    public function update(User $user, Game $game): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isGestor() && $game->user_id === $user->id;
    }

    /**
     * Admin can delete any game.
     * Gestor can only delete games they created.
     */
    public function delete(User $user, Game $game): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isGestor() && $game->user_id === $user->id;
    }

    /**
     * Only admin or gestor can publish/unpublish games.
     */
    public function publish(User $user, Game $game): bool
    {
        return $user->isAdmin() || $user->isGestor();
    }
}
