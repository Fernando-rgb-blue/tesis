<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log; // Para el log
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LibrosExport;
use App\Models\Libro;
use Illuminate\Support\Facades\Storage;
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
        $request->validate([
            'rutafoto' => 'nullable|file|image|max:5000', // Validación para imágenes
        ]);

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

        // Procesar y guardar la imagen con el nombre del libro (codigolibroID)
        $imagePath = null;
        if ($request->hasFile('rutafoto')) {
            // Obtener el código del libro (codigolibroID)
            $codigolibroID = $request->codigolibroID;

            // Obtener la extensión de la imagen
            $extension = $request->file('rutafoto')->getClientOriginalExtension();

            // Crear el nombre del archivo con el código del libro
            $fileName = $codigolibroID . '.' . $extension;

            // Guardar la imagen con el nuevo nombre
            $imagePath = $request->file('rutafoto')->storeAs('uploads/books', $fileName, 'public');
        }

        // Crear y guardar el libro
        $libro = new Libro();
        $libro->controltopografico = $request->controltopografico;
        $libro->codigolibroID = $request->codigolibroID;
        $libro->isbn = $request->isbn;
        $libro->autorID = $autor->autorID;
        $libro->titulo = $request->titulo;
        $libro->resumen = $request->resumen;
        $libro->volumen = $request->volumen;
        $libro->tomo = $request->tomo;
        $libro->categoriaID = $categoria->categoriaID;
        $libro->edicion = $request->edicion;
        $libro->editorialID = $editorial->editorialID;
        $libro->pais = $request->pais;
        $libro->idioma = $request->idioma;
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->formadeadquisicion = $request->formadeadquisicion;
        $libro->precio = $request->precio;
        $libro->procedenciaproovedor = $request->procedenciaproovedor;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->rutafoto = $imagePath; // Guarda la ruta relativa con el nombre personalizado

        $libro->save();

        return response()->json(['message' => 'Libro creado exitosamente.', 'libro' => $libro], 201);
    }



    public function show(string $valor)
    {
        $libro = Libro::where('id', $valor)->orWhere('codigolibroID', $valor)->firstOrFail();

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


    public function update(Request $request, string $valor)
    {
        // Buscar el libro por ID o por codigolibroID
        $libro = Libro::where('id', $valor)->orWhere('codigolibroID', $valor)->firstOrFail();

        // Validaciones del request
        $request->validate([
            'rutafoto' => 'nullable|file|image|max:5000', // Validación para imágenes
        ]);

        // Verificar que los datos estén llegando correctamente
        Log::info('Datos de la solicitud:', $request->all());

        // Procesar y guardar la nueva imagen si se proporciona una
        $imagePath = null;
        if ($request->hasFile('rutafoto')) {
            // Log para verificar si el archivo se está enviando
            Log::info('Archivo recibido:', [$request->file('rutafoto')->getClientOriginalName()]);

            // Eliminar la imagen anterior si existe
            if ($libro->rutafoto && Storage::exists('public/' . $libro->rutafoto)) {
                $oldImagePath = 'public/' . $libro->rutafoto;
                Log::info('Eliminando imagen anterior:', [$oldImagePath]);
                Storage::delete($oldImagePath); // Eliminar archivo existente
            }

            // Obtener la extensión del archivo de imagen
            $extension = $request->file('rutafoto')->getClientOriginalExtension();

            // Crear el nombre del archivo basado en el código del libro
            $fileName = $libro->codigolibroID . '.' . $extension;

            // Guardar la imagen en la carpeta uploads/books
            $imagePath = $request->file('rutafoto')->storeAs('uploads/books/', $fileName, 'public');
            Log::info('Imagen guardada en:', [$imagePath]);

            // Actualizar la ruta de la imagen en el libro
            $libro->rutafoto = 'uploads/books/' . $fileName;
        }

        // Verificar y actualizar los datos relacionados (autor, categoría, editorial) si se proporcionan
        if ($request->filled('autor_nombre')) {
            $autor = Autor::where('nombre', $request->autor_nombre)->first();
            if (!$autor) {
                return back()->withErrors(['autor_nombre' => 'El autor no existe.']);
            }
            $libro->autorID = $autor->autorID;
        }

        if ($request->filled('categoria_nombre')) {
            $categoria = Categoria::where('nombre', $request->categoria_nombre)->first();
            if (!$categoria) {
                return back()->withErrors(['categoria_nombre' => 'La categoría no existe.']);
            }
            $libro->categoriaID = $categoria->categoriaID;
        }

        if ($request->filled('editorial_nombre')) {
            $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
            if (!$editorial) {
                return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
            }
            $libro->editorialID = $editorial->editorialID;
        }

        // Actualizar los datos del libro si están presentes en la solicitud
        $libro->controltopografico = $request->controltopografico ?? $libro->controltopografico;
        $libro->codigolibroID = $request->codigolibroID ?? $libro->codigolibroID;
        $libro->isbn = $request->isbn ?? $libro->isbn;
        $libro->titulo = $request->titulo ?? $libro->titulo;
        $libro->resumen = $request->resumen ?? $libro->resumen;
        $libro->volumen = $request->volumen ?? $libro->volumen;
        $libro->tomo = $request->tomo ?? $libro->tomo;
        $libro->edicion = $request->edicion ?? $libro->edicion;
        $libro->pais = $request->pais ?? $libro->pais;
        $libro->idioma = $request->idioma ?? $libro->idioma;
        $libro->aniopublicacion = $request->aniopublicacion ?? $libro->aniopublicacion;
        $libro->formadeadquisicion = $request->formadeadquisicion ?? $libro->formadeadquisicion;
        $libro->precio = $request->precio ?? $libro->precio;
        $libro->procedenciaproovedor = $request->procedenciaproovedor ?? $libro->procedenciaproovedor;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles ?? $libro->ejemplaresdisponibles;
        $libro->numeropaginas = $request->numeropaginas ?? $libro->numeropaginas;

        // Guardar los cambios
        $libro->save();

        // Retornar una respuesta con el libro actualizado
        return response()->json(['message' => 'Libro actualizado exitosamente.', 'libro' => $libro], 201);
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

    public function export(Request $request)
    {
        // Obtén los filtros desde la solicitud
        $filters = $request->only(['time', 'limit']);

        // Retorna la descarga del archivo Excel
        return Excel::download(new LibrosExport($filters), 'libros.xlsx');
    }
}
