<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        //validación de los datos
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);
        //alta del usuario
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();
        //respuesta
        /* return response()->json([
            "message" => "Alta exitosa"
        ]); */
        return response($user, Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            return response(["token" => $token], Response::HTTP_OK)->withCookie($cookie);
        } else {
            return response(["message" => "Credenciales inválidas"], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function userProfile(Request $request)
    {
        // Verifica si el usuario está autenticado
        if (auth()->check()) {
            return response()->json([
                "message" => "userProfile OK",
                "userData" => auth()->user()
            ], Response::HTTP_OK);
        } else {
            // Si no está autenticado, retorna un error 401
            return response()->json([
                "message" => "No logeado"
            ], Response::HTTP_UNAUTHORIZED);
        }
    }
    
    public function logout(Request $request)
    {
        // Revoca el token actual
        $request->user()->currentAccessToken()->delete();

        // Opcional: Elimina la cookie si estás usando cookies
        $cookie = Cookie::forget('cookie_token');

        return response(["message" => "Cierre de sesión exitoso"], Response::HTTP_OK)->withCookie($cookie);
    }

    public function allUsers()
    {
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }
}
