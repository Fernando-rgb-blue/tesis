<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Http;



class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect(); // ESTO REDIRIGE DIRECTAMENTE
    }
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            if (!Str::endsWith($googleUser->getEmail(), '@unitru.edu.pe')) {
                return response()->json([
                    'message' => 'Acceso solo permitido para correos @unitru.edu.pe'
                ], 403);
            }

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(16))
                ]
            );

            // Token para frontend (Vite)
            $token = $user->createToken('unitru_token')->plainTextToken;

            return response()->json([
                'message' => 'Autenticado correctamente',
                'user' => $user,
                'token' => $token
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en autenticación',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
