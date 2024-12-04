<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categoria = Categoria::all();
        return $categoria;       
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $categoria= new Categoria();
        $categoria->nombre = $request->nombre;
        $categoria->descripcion = $request->descripcion;
        // Guardar el nuevo libro en la base de datos
        $categoria->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $categoriaID)
    {
        $categoria = Categoria::where('categoriaID', $categoriaID)->first();
        return $categoria;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $categoriaID)
    {
        $categoria = Categoria::where('categoriaID', $categoriaID)->firstOrFail();
        $categoria->nombre = $request->nombre;
        $categoria->descripcion = $request->descripcion;
        // Guardar el nuevo libro en la base de datos
        $categoria->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $categoriaID)
    {
        // Buscar el libro por libroID
        $categoria = Categoria::where('categoriaID', $categoriaID)->first();
        // Verificar si el libro existe
        if (!$categoria) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }
        // Eliminar el libro
        $categoria->delete();
        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
