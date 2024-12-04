<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Editorial;
use Illuminate\Http\Request;

class EditorialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $editorial = Editorial::all();
        return $editorial;
        //asdasddas
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $editorial= new Editorial();
        $editorial->nombre = $request->nombre;
        $editorial->pais = $request->pais;
        // Guardar el nuevo libro en la base de datos
        $editorial->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $editorialID)
    {
        $editorial = Editorial::where('editorialID', $editorialID)->first();
        return $editorial;
    }

    /**
     * Update the specified resource in storage.
     */
    
    public function update(Request $request, string $editorialID)
    {
        $editorial = Editorial::where('editorialID', $editorialID)->firstOrFail();
        $editorial->nombre = $request->nombre;
        $editorial->pais = $request->pais;
        // Guardar el nuevo libro en la base de datos
        $editorial->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $editorialID)
    {
        // Buscar el libro por libroID
        $editorial = Editorial::where('editorialID', $editorialID)->first();
        // Verificar si el libro existe
        if (!$editorial) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }
        // Eliminar el libro
        $editorial->delete();
        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
