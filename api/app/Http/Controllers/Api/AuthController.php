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
    /**
     * Registrar un nuevo usuario
     */
    public function register(Request $request)
    {
        // Validación de los datos
        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|integer|unique:users',
            'tipousuario' => 'required|string|exists:tipousuarios,tipousuario',
            'estadousuario' => 'required|string|exists:estadousuarios,estadousuario',
            'domicilio' => 'required|string|max:255',
            'telefono' => 'required|integer',
            'fechanacimiento' => 'required|date',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed|min:8'
        ]);

        // Crear el nuevo usuario
        $user = new User();
        $user->name = $request->name;
        $user->dni = $request->dni;
        $user->tipousuario = $request->tipousuario;
        $user->estadousuario = $request->estadousuario;
        $user->domicilio = $request->domicilio;
        $user->telefono = $request->telefono;
        $user->fechanacimiento = $request->fechanacimiento;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        // Respuesta de éxito
        return response($user, Response::HTTP_CREATED);
    }

    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        // Validar las credenciales
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        // Intentar la autenticación
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            return response(["token" => $token], Response::HTTP_OK)->withCookie($cookie);
        } else {
            return response(["message" => "Credenciales inválidas"], Response::HTTP_UNAUTHORIZED);
        }
    }

    /**
     * Obtener el perfil del usuario autenticado
     */
    public function userProfile(Request $request)
    {
        // Verificar si el usuario está autenticado
        if (auth()->check()) {
            return response()->json([
                "message" => "userProfile OK",
                "userData" => auth()->user()
            ], Response::HTTP_OK);
        } else {
            return response()->json([
                "message" => "No logeado"
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    /**
     * Logout del usuario autenticado
     */
    public function logout(Request $request)
    {
        // Revocar el token actual
        $request->user()->currentAccessToken()->delete();

        // Opcional: Eliminar la cookie si se usa
        $cookie = Cookie::forget('cookie_token');

        return response(["message" => "Cierre de sesión exitoso"], Response::HTTP_OK)->withCookie($cookie);
    }

    /**
     * Obtener todos los usuarios
     */
    public function allUsers()
    {
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }
}
