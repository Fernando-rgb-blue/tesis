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

    public function index()
    {
        $books = Libro::all();
        return response()->json($books);
    }

    public function search()
    {
        $books = Libro::All();
        return response()->json($books);
    }

    public function store(Request $request)
    {

        $autor = Autor::where('nombre', $request->autor_nombre)->first();
        if (!$autor) {
            return back()->withErrors(['autor_nombre' => 'El autor no existe.']);
        }

        $categoria = Categoria::where('nombre', $request->categoria_nombre)->first();
        if (!$categoria) {
            return back()->withErrors(['categoria_nombre' => 'La categoría no existe.']);
        }

        $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
        if (!$editorial) {
            return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
        }

        $libro = new Libro();
        $libro->codigolibroID= $request->codigolibroID;
        $libro->isbn = $request->isbn;
        $libro->titulo = $request->titulo;
        $libro->autorID = $autor->autorID;
        $libro->categoriaID = $categoria->categoriaID;
        $libro->editorialID = $editorial->editorialID;
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->edicion = $request->edicion;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->volumen = $request->volumen;
        $libro->tomo = $request->tomo;

        $libro->save();
    }

    public function show(string $id)
    {
        $libro = Libro::where('id', $id)->first();

        if ($libro) {
            // Busca el autor en la tabla 'autors' usando el 'autorID' del libro
            $autor = Autor::where('autorID', $libro->autorID)->first();
            if ($autor) {
                $libro->autorID = $autor->nombre; // Reemplaza 'autorID' con el nombre del autor
            }

            // Busca la editorial en la tabla 'editorials' usando el 'editorialID' del libro
            $editorial = Editorial::where('editorialID', $libro->editorialID)->first();
            if ($editorial) {
                $libro->editorialID = $editorial->nombre; // Reemplaza 'editorialID' con el nombre de la editorial
            }

            // Busca la categoría en la tabla 'categorias' usando el 'categoriaID' del libro
            $categoria = Categoria::where('categoriaID', $libro->categoriaID)->first();
            if ($categoria) {
                $libro->categoriaID = $categoria->nombre; // Reemplaza 'categoriaID' con el nombre de la categoría
            }
            return response()->json($libro);
        }
        return response()->json([
            'message' => 'Libro no encontrado.'
        ], 404);
    }

    // {
    //     "codigolibroID": "LIB114",
    //     "isbn": "978-3-16-148410-0",
    //     "titulo": "Cien años de soledad",
    //     "autor_nombre": "Gabriel García Márquez",
    //     "categoria_nombre": "Ficción",
    //     "editorial_nombre": "Editorial Planeta",
    //     "aniopublicacion": 1967,
    //     "edicion": "Primera",
    //     "numeropaginas": 417,
    //     "ejemplaresdisponibles": 5,
    //     "volumen": "1",
    //     "tomo": "1"
    //   }

    public function update(Request $request, string $id)
    {
        $libro = Libro::where('id', $id)->firstOrFail();

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

        $libro->codigolibroID= $request->codigolibroID;
        $libro->isbn = $request->isbn;
        $libro->titulo = $request->titulo;
        $libro->autorID = $autor->autorID;
        $libro->categoriaID = $categoria->categoriaID;
        $libro->editorialID = $editorial->editorialID;
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->edicion = $request->edicion;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->volumen = $request->volumen;
        $libro->tomo = $request->tomo;
        $libro->save();
    }

    public function destroy(string $id)
    {

        $libro = Libro::where('id', $id)->first();
        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }
        $libro->delete();

        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
