<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Autor;
use Illuminate\Http\Request;
use PharIo\Manifest\Author;

class AutorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $autor = Autor::all();
        return $autor;
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $autor= new Autor();
        $autor->nombre = $request->nombre;
        $autor->nacionalidad = $request->nacionalidad;
        // Guardar el nuevo libro en la base de datos
        $autor->save();
    }
    /**
     * Display the specified resource.
     */
    public function show(string $autorID)
    {
        $autor = Autor::where('autorID', $autorID)->first();
        return $autor;
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $autorID)
    {
        $autor = Autor::where('autorID', $autorID)->firstOrFail();
        $autor->nombre = $request->nombre;
        $autor->nacionalidad = $request->nacionalidad;
        // Guardar el nuevo libro en la base de datos
        $autor->save();
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $autorID)
    {
        // Buscar el libro por libroID
        $autor = Autor::where('autorID', $autorID)->first();
        // Verificar si el libro existe
        if (!$autor) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }
        // Eliminar el libro
        $autor->delete();
        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
