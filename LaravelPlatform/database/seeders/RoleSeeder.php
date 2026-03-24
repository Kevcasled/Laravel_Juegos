<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the three test users
        $admin = User::firstOrCreate(
            ['email' => 'admin@platform.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password'),
                'role'     => User::ROLE_ADMIN,
            ]
        );

        $gestor = User::firstOrCreate(
            ['email' => 'gestor@platform.com'],
            [
                'name'     => 'Gestor',
                'password' => Hash::make('password'),
                'role'     => User::ROLE_GESTOR,
            ]
        );

        User::firstOrCreate(
            ['email' => 'jugador@platform.com'],
            [
                'name'     => 'Jugador',
                'password' => Hash::make('password'),
                'role'     => User::ROLE_JUGADOR,
            ]
        );

        // Create 2 test games associated with the gestor
        Game::firstOrCreate(
            ['title' => 'Runner3D (Published)'],
            [
                'description'  => 'Juego Runner3D en modo publicado.',
                'is_published' => true,
                'location'     => 'http://localhost:5173',
                'user_id'      => $gestor->id,
            ]
        );

        Game::firstOrCreate(
            ['title' => 'Runner3D (Draft)'],
            [
                'description'  => 'Juego Runner3D en modo borrador.',
                'is_published' => false,
                'location'     => 'http://localhost:5173',
                'user_id'      => $gestor->id,
            ]
        );
    }
}
