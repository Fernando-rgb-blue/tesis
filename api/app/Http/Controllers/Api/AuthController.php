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
        $request->validate([
            'name' => 'required|string|max:255',
            'dni' => 'required|integer|unique:users',
            'domicilio' => 'required|string|max:255',
            'telefono' => 'required|integer',
            'fechanacimiento' => 'required|date',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed|min:8',
            'turno' => 'nullable|string|max:50'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->dni = $request->dni;
        $user->tipousuario = 'Alumno(a)'; // valor por defecto
        $user->estadousuario = 'Activo';  // valor por defecto
        $user->domicilio = $request->domicilio;
        $user->telefono = $request->telefono;
        $user->fechanacimiento = $request->fechanacimiento;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->turno = $request->has('turno') ? $request->turno : null;
        $user->save();

        return response($user, Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);

            return response(["token" => $token], Response::HTTP_OK)
                ->withCookie($cookie);
        } else {
            return response(["message" => "Credenciales inválidas"], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function userProfile(Request $request)
    {
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $cookie = Cookie::forget('cookie_token');

        return response(["message" => "Cierre de sesión exitoso"], Response::HTTP_OK)->withCookie($cookie);
    }

    public function allUsers()
    {
        $users = User::all();
        return response()->json(["users" => $users]);
    }

    // ✅ Eliminar usuario por ID
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(["message" => "Usuario no encontrado"], Response::HTTP_NOT_FOUND);
        }

        $user->delete();

        return response()->json(["message" => "Usuario eliminado correctamente"], Response::HTTP_OK);
    }

    // ✅ Editar usuario por ID
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'dni' => 'sometimes|required|integer|unique:users,dni,' . $user->id,
            'tipousuario' => 'sometimes|required|string|exists:tipousuarios,tipousuario',
            'estadousuario' => 'sometimes|required|string|exists:estadousuarios,estadousuario',
            'domicilio' => 'sometimes|required|string|max:255',
            'telefono' => 'sometimes|required|integer',
            'fechanacimiento' => 'sometimes|required|date',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'turno' => 'nullable|string|max:50',
            // No se incluye password aquí para que no se modifique accidentalmente
        ]);

        // Actualiza solo los campos que vengan en la solicitud
        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('dni')) $user->dni = $request->dni;
        if ($request->has('tipousuario')) $user->tipousuario = $request->tipousuario;
        if ($request->has('estadousuario')) $user->estadousuario = $request->estadousuario;
        if ($request->has('domicilio')) $user->domicilio = $request->domicilio;
        if ($request->has('telefono')) $user->telefono = $request->telefono;
        if ($request->has('fechanacimiento')) $user->fechanacimiento = $request->fechanacimiento;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('turno')) $user->turno = $request->turno;

        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ], Response::HTTP_OK);
    }
}
