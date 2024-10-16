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
        $books = Libro::paginate(8); // Cambia 10 al número de resultados por página que desees
        return response()->json($books);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function search()
    {
        $books = Libro::All(); // Cambia 10 al número de resultados por página que desees
        return response()->json($books);
    }

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

        // Guardar el nuevo libro en la base de datos

        $libro->save();
    }

    /**
     * Display the specified resource.
     */

    //      Método find:
    // El método find en Eloquent asume que el campo de identificación en la base de datos es id. Si tu columna de identificación se llama libroID, debes usar where en lugar de find.
    // Cambia tu código a algo como esto:

    public function show(string $codigolibroID)
    {
        // Encuentra el libro basado en su ID
        $libro = Libro::where('codigolibroID', $codigolibroID)->first();

        // Verifica si se encontró el libro
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

            // Devuelve el libro con los IDs reemplazados por los nombres correspondientes
            return response()->json($libro);
        }

        // Si no se encuentra el libro, devolver un error
        return response()->json([
            'message' => 'Libro no encontrado.'
        ], 404);
    }


    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $codigolibroID)
    {
        // Buscar el libro por libroID
        $libro = Libro::where('codigolibroID', $codigolibroID)->firstOrFail();

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
        $libro->codigolibroID= $request->codigolibroID;
        $libro->isbn = $request->isbn;
        $libro->titulo = $request->titulo;
        $libro->autorID = $autor->autorID; // Usar el ID del autor
        $libro->categoriaID = $categoria->categoriaID; // Usar el ID de la categoría
        $libro->editorialID = $editorial->editorialID; // Usar el ID de la editorial
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->edicion = $request->edicion;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->volumen = $request->volumen;
        $libro->tomo = $request->tomo;

        // Guardar los cambios en la base de datos
        $libro->save();
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $codigolibroID)
    {
        // Buscar el libro por libroID
        $libro = Libro::where('codigolibroID', $codigolibroID)->first();

        // Verificar si el libro existe
        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }

        // Eliminar el libro
        $libro->delete();

        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
