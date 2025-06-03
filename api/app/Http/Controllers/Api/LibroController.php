<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log; // Para el log
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LibrosExport;
use App\Exports\EjemplarsExport;
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

        $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
        if (!$editorial) {
            return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
        }

        // Procesar y guardar la imagen con el nombre del libro (codigolibroID)

        $imagePath = null;
        if ($request->hasFile('rutafoto')) {

            $codigolibroID = $request->codigolibroID;
            $extension = $request->file('rutafoto')->getClientOriginalExtension();
            $fileName = $codigolibroID . '.' . $extension;
            $imagePath = $request->file('rutafoto')->storeAs('uploads/books', $fileName, 'public');
        }

        // Crear y guardar el libro
        $libro = new Libro();
        $libro->codigolibroID = $request->codigolibroID;
        $libro->isbn = $request->isbn;
        $libro->titulo = $request->titulo;
        $libro->resumen = $request->resumen;
        $libro->edicion = $request->edicion;
        $libro->editorialID = $editorial->editorialID;
        $libro->pais = $request->pais;
        $libro->voltomejemp = $request->voltomejemp;
        $libro->idioma = $request->idioma;
        $libro->aniopublicacion = $request->aniopublicacion;
        $libro->formadeadquisicion = $request->formadeadquisicion;
        $libro->procedenciaproovedor = $request->procedenciaproovedor;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles;
        $libro->numeropaginas = $request->numeropaginas;
        $libro->habilitacion = $request->habilitacion;
        $libro->rutafoto = $imagePath;
        $libro->save();

        return response()->json(['message' => 'Libro creado exitosamente.', 'libro' => $libro], 201);
    }

    public function show(string $valor)
    {
        $libro = Libro::where('id', $valor)->orWhere('codigolibroID', $valor)->firstOrFail();

        if ($libro) {
            // Busca la editorial en la tabla 'editorials' usando el 'editorialID' del libro
            $editorial = Editorial::where('editorialID', $libro->editorialID)->first();
            if ($editorial) {
                $libro->editorialID = $editorial->nombre; // Reemplaza 'editorialID' con el nombre de la editorial
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
        $libro = Libro::where('id', $valor)->orWhere('codigolibroID', $valor)->firstOrFail();

        // Validar solo si se envía imagen
        $request->validate([
            'rutafoto' => 'nullable|file|image|max:5000',
            'habilitacion' => 'nullable|boolean', // validamos si se desea modificar habilitación
        ]);

        Log::info('Datos de la solicitud:', $request->all());

        // Si solo se quiere actualizar habilitación
        // Validar que si se envía habilitacion, sea 0 o 1
        $request->validate([
            'habilitacion' => 'nullable|in:0,1',
        ]);

        // Si solo se quiere actualizar habilitación
        if ($request->has('habilitacion') && count($request->all()) === 1) {
            $libro->habilitacion = (int) $request->habilitacion; // Asegura que sea entero 0 o 1
            $libro->save();

            return response()->json([
                'message' => 'Campo habilitación actualizado.',
                'libro' => $libro
            ], 200);
        }

        // Procesar y guardar imagen
        if ($request->hasFile('rutafoto')) {
            Log::info('Archivo recibido:', [$request->file('rutafoto')->getClientOriginalName()]);
            if ($libro->rutafoto && Storage::exists('public/' . $libro->rutafoto)) {
                Storage::delete('public/' . $libro->rutafoto);
            }

            $extension = $request->file('rutafoto')->getClientOriginalExtension();
            $fileName = $libro->codigolibroID . '.' . $extension;
            $imagePath = $request->file('rutafoto')->storeAs('uploads/books/', $fileName, 'public');

            Log::info('Imagen guardada en:', [$imagePath]);
            $libro->rutafoto = 'uploads/books/' . $fileName;
        }

        // Validar y asignar editorial si se proporciona
        if ($request->filled('editorial_nombre')) {
            $editorial = Editorial::where('nombre', $request->editorial_nombre)->first();
            if (!$editorial) {
                return back()->withErrors(['editorial_nombre' => 'La editorial no existe.']);
            }
            $libro->editorialID = $editorial->editorialID;
        }

        // Asignar el resto de campos (mantener valores actuales si no se envían)
        $libro->codigolibroID = $request->codigolibroID ?? $libro->codigolibroID;
        $libro->isbn = $request->isbn ?? $libro->isbn;
        $libro->titulo = $request->titulo ?? $libro->titulo;
        $libro->resumen = $request->resumen ?? $libro->resumen;
        $libro->edicion = $request->edicion ?? $libro->edicion;
        $libro->pais = $request->pais ?? $libro->pais;
        $libro->voltomejemp = $request->voltomejemp ?? $libro->voltomejemp;
        $libro->idioma = $request->idioma ?? $libro->idioma;
        $libro->aniopublicacion = $request->aniopublicacion ?? $libro->aniopublicacion;
        $libro->formadeadquisicion = $request->formadeadquisicion ?? $libro->formadeadquisicion;
        $libro->procedenciaproovedor = $request->procedenciaproovedor ?? $libro->procedenciaproovedor;
        $libro->ejemplaresdisponibles = $request->ejemplaresdisponibles ?? $libro->ejemplaresdisponibles;
        $libro->numeropaginas = $request->numeropaginas ?? $libro->numeropaginas;
        $libro->habilitacion = $request->habilitacion ?? $libro->habilitacion;

        $libro->save();

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
        $filters = $request->only(['time', 'limit']);
        return Excel::download(new LibrosExport($filters), 'libros.xlsx');
    }
}
