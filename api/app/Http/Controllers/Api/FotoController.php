<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Foto;


class FotoController extends Controller
{

    /**
     * Mostrar una lista de fotos.
     */

    public function index()
    {
        $fotos = Foto::with('ejemplar')->get(); // Carga las fotos con su ejemplar asociado
        return response()->json($fotos);
    }


    /**
     * Almacenar una nueva foto.
     */

     public function store(Request $request)
     {
         $request->validate([
             'ningresoID' => 'required|exists:ejemplars,ningresoID',
             'rutas' => 'required|array', // Validar que se reciba un array de rutas
             'rutas.*' => 'string', // Validar que cada ruta sea un string
         ]);
     
         // Iterar sobre las rutas y guardarlas en la base de datos
         foreach ($request->rutas as $ruta) {
             Foto::create([
                 'ningresoID' => $request->ningresoID,
                 'rutafoto' => $ruta, // Guardar la ruta de la foto
             ]);
         }
     
         return response()->json(['message' => 'Fotos subidas con éxito.'], 201);
     }
     
    

    /**
     * Mostrar los detalles de una foto.
     */

    public function show($id)
    {
        $foto = Foto::with('ejemplar')->findOrFail($id); // Buscar la foto o lanzar error si no existe
        return response()->json($foto);
    }

    /**
     * Actualizar una foto.
     */

    public function update(Request $request, $id)
    {
        $request->validate([
            'ningresoID' => 'nullable|exists:ejemplars,ningresoID',
            'rutafoto' => 'nullable|string',
        ]);

        $foto = Foto::findOrFail($id);
        $foto->update($request->all());

        return response()->json($foto);
    }

    /**
     * Eliminar una foto.
     */

    public function destroy($id)
    {
        $foto = Foto::findOrFail($id);
        $foto->delete();

        return response()->json(['message' => 'Foto eliminada con éxito.']);
    }

}