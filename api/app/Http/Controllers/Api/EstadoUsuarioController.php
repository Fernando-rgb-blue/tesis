<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Estadousuario;
use Illuminate\Http\Request;

class EstadoUsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Estadousuario::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'estadousuario' => 'required|string|unique:estadousuarios,estadousuario',
            'descripcion' => 'required|string',
        ]);
        $estadoUsuario = Estadousuario::create($validatedData);
        return response()->json($estadoUsuario, 201);
    }

    /**
     * Display the specified resource.
     */

    public function show($id)
    {
        $estadoUsuario = EstadoUsuario::find($id); 
        if (!$estadoUsuario) {
            return response()->json(['message' => 'Estado de usuario no encontrado'], 404);
        }
        return response()->json($estadoUsuario, 200);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id)
    {
        $estadoUsuario = Estadousuario::find($id);
        if (!$estadoUsuario) {
            return response()->json(['message' => 'Estado de usuario no encontrado'], 404);
        }
        $validatedData = $request->validate([
            'estadousuario' => 'string|unique:estadousuarios,estadousuario,' . $id,
            'descripcion' => 'string',
        ]);
        $estadoUsuario->update($validatedData);
        return response()->json($estadoUsuario, 200);
    }

    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        $estadoUsuario = Estadousuario::find($id);
        if (!$estadoUsuario) {
            return response()->json(['message' => 'Estado de usuario no encontrado'], 404);
        }
        $estadoUsuario->delete();
        return response()->json(['message' => 'Estado de usuario eliminado'], 200);
    }
}
