<?php

namespace App\Http\Controllers\Api;

use App\Models\Libro;
use App\Http\Controllers\Controller;
use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editorial;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Libro::paginate(10); // Cambia 10 al número de resultados por página que desees
        return response()->json($books);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Capturando su ID
        $autor = Autor::where('nombre', $request->autor_nombre)->first();
        if (!$autor) {
            return back()->withErrors(['autor_nombre' => 'El autor no existe.']);
        }

        // Capturando su ID
        $categoria = Categoria::where('nombre', $request->categoria_nombre)->first();
        if (!$categoria) {
            return back()->withErrors(['categoria_nombre' => 'La categoría no existe.']);
        }

        // Capturando su ID
        $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
        if (!$editorial) {
            return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
        }


        $libro = new Libro();
        $libro->isbn = $request->isbn;
        $libro->codigo = $request->codigo;
        $libro->titulo = $request->titulo;
        $libro->autorID = $autor->autorID;
        $libro->categoriaID = $categoria->categoriaID;
        $libro->editorialID = $editorial->editorialID;
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->edicion = $request->edicion;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->estadolibro = $request->estadolibro;

        // Guardar el nuevo libro en la base de datos

        $libro->save();
    }

    /**
     * Display the specified resource.
     */

    //      Método find:
    // El método find en Eloquent asume que el campo de identificación en la base de datos es id. Si tu columna de identificación se llama libroID, debes usar where en lugar de find.
    // Cambia tu código a algo como esto:

    public function show(string $libroID)
    {
        $libro = Libro::where('libroID', $libroID)->first();
        return $libro;
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $libroID)
    {
        // Buscar el libro por libroID
        $libro = Libro::where('libroID', $libroID)->firstOrFail();

        // Buscar el ID del autor por su nombre
        $autor = Autor::where('nombre', $request->autor_nombre)->first();
        if (!$autor) {
            return back()->withErrors(['autor_nombre' => 'El autor no existe.']);
        }

        // Buscar el ID de la categoría por su nombre
        $categoria = Categoria::where('nombre', $request->categoria_nombre)->first();
        if (!$categoria) {
            return back()->withErrors(['categoria_nombre' => 'La categoría no existe.']);
        }

        // Buscar el ID de la editorial por su nombre
        $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
        if (!$editorial) {
            return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
        }

        // Actualizar los campos del libro
        $libro->isbn = $request->isbn;
        $libro->codigo = $request->codigo;
        $libro->titulo = $request->titulo;
        $libro->autorID = $autor->autorID; // Usar el ID del autor
        $libro->categoriaID = $categoria->categoriaID; // Usar el ID de la categoría
        $libro->editorialID = $editorial->editorialID; // Usar el ID de la editorial
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->edicion = $request->edicion;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->estadolibro = $request->estadolibro;

        // Guardar los cambios en la base de datos
        $libro->save();
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $libroID)
    {
        // Buscar el libro por libroID
        $libro = Libro::where('libroID', $libroID)->first();

        // Verificar si el libro existe
        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }

        // Eliminar el libro
        $libro->delete();

        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
