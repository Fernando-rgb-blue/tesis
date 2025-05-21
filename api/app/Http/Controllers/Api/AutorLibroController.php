<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Libro;
use App\Models\Autor;
use Illuminate\Http\Request;

class AutorLibroController extends Controller
{
    // Listar todos los autores de un libro
    public function index($libro_id)
    {
        $libro = Libro::findOrFail($libro_id);
        return response()->json($libro->autores);
    }

    public function indexConLibros()
    {
        $autores = Autor::with('libros')->get();

        return response()->json([
            'autores' => $autores
        ]);
    }


    // Asignar uno o más autores a un libro (sin eliminar anteriores)
    public function store(Request $request, $libro_id)
    {
        $request->validate([
            'autor_nombres' => 'required|array',
            'autor_nombres.*' => 'string|max:255',
        ]);

        $libro = Libro::findOrFail($libro_id);
        $autorIDs = [];

        foreach ($request->autor_nombres as $nombre) {
            $autor = Autor::where('nombre', $nombre)->first();

            if (!$autor) {
                return response()->json([
                    'message' => "El autor '$nombre' no existe."
                ], 422);
            }

            $autorIDs[] = $autor->autorID;
        }

        $libro->autores()->syncWithoutDetaching($autorIDs);

        return response()->json([
            'message' => 'Autores asignados correctamente.',
            'autores' => $libro->autores
        ], 201);
    }




    // Mostrar un autor específico asociado a un libro
    public function show($libro_id, $autor_id)
    {
        $libro = Libro::findOrFail($libro_id);
        $autor = $libro->autores()->where('autorID', $autor_id)->first();

        if (!$autor) {
            return response()->json(['message' => 'Autor no asignado a este libro'], 404);
        }

        return response()->json($autor);
    }

    // Reemplazar todos los autores asignados a un libro

    public function update(Request $request, $libro_id)
    {
        // Validar los nombres de los autores
        $request->validate([
            'autor_nombres' => 'required|array',
            'autor_nombres.*' => 'exists:autors,nombre',
        ]);

        // Buscar el libro por ID
        $libro = Libro::findOrFail($libro_id); // Aquí es donde usas el ID del libro

        // Obtener los IDs de los autores usando sus nombres
        $autor_ids = Autor::whereIn('nombre', $request->autor_nombres)->pluck('autorID');

        // Reemplazar los autores actuales del libro por los nuevos autores
        $libro->autores()->sync($autor_ids);

        return response()->json([
            'message' => 'Autores actualizados correctamente.',
            'autores' => $libro->autores
        ]);
    }


    // Eliminar un autor específico de un libro
    public function destroy($libro_id, $autor_id)
    {
        $libro = Libro::findOrFail($libro_id);
        $libro->autores()->detach($autor_id);

        return response()->json(['message' => 'Autor eliminado del libro']);
    }
}
