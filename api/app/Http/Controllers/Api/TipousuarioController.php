<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tipousuario;
use Illuminate\Http\Request;

class TipousuarioController extends Controller
{
    /**
     * Lista todos los tipos de usuario.
     */
    public function index()
    {
        return response()->json(Tipousuario::all(), 200);
    }

    /**
     * Crea un nuevo tipo de usuario.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipousuario' => 'required|string|unique:tipousuarios,tipousuario',
        ]);

        $tipousuario = Tipousuario::create($validated);

        return response()->json($tipousuario, 201);
    }

    /**
     * Muestra un tipo de usuario específico.
     */
    public function show($id)
    {
        $tipousuario = Tipousuario::find($id);

        if (!$tipousuario) {
            return response()->json(['message' => 'Tipo de usuario no encontrado'], 404);
        }

        return response()->json($tipousuario, 200);
    }

    /**
     * Actualiza un tipo de usuario específico.
     */
    public function update(Request $request, $id)
    {
        $tipousuario = Tipousuario::find($id);

        if (!$tipousuario) {
            return response()->json(['message' => 'Tipo de usuario no encontrado'], 404);
        }

        $validated = $request->validate([
            'tipousuario' => 'required|string|unique:tipousuarios,tipousuario,' . $id,
        ]);

        $tipousuario->update($validated);

        return response()->json($tipousuario, 200);
    }

    /**
     * Elimina un tipo de usuario específico.
     */
    public function destroy($id)
    {
        $tipousuario = Tipousuario::find($id);

        if (!$tipousuario) {
            return response()->json(['message' => 'Tipo de usuario no encontrado'], 404);
        }

        $tipousuario->delete();

        return response()->json(['message' => 'Tipo de usuario eliminado correctamente'], 200);
    }
}
