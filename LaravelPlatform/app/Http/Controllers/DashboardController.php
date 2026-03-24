<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isGestor()) {
            return Inertia::render('Admin/Dashboard');
        }

        return Inertia::render('Player/Dashboard');
    }
}
