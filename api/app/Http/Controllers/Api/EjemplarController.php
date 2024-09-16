<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ejemplar;
use Illuminate\Http\Request;

class EjemplarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ejemplar = Ejemplar::all();
        return $ejemplar; 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $ejemplar= new Ejemplar();
        $ejemplar->ningresoID = $request->ningresoID;
        $ejemplar->codigolibroID = $request->codigolibroID;
        $ejemplar->estadolibro = $request->estadolibro;
        // Guardar el nuevo libro en la base de datos
        $ejemplar->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $ningresoID)
    {
        $ejemplar = Ejemplar::where('ningresoID', $ningresoID)->first();
        return $ejemplar;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $ningresoID)
    {
        // Busca el ejemplar por ningresoID, lanza una excepción si no se encuentra
        $ejemplar = Ejemplar::where('ningresoID', $ningresoID)->firstOrFail();
        // Actualiza los campos con los datos del request
        $ejemplar->codigolibroID = $request->codigolibroID;
        $ejemplar->estadolibro = $request->estadolibro;
        // Actualiza la fecha de actualización
        $ejemplar->updated_at = now();
        // Guarda los cambios en la base de datos
        $ejemplar->save();
        return response()->json(['message' => 'Ejemplar actualizado correctamente'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $ningresoID)
    {
        // Buscar el libro por libroID
        $ejemplar = Ejemplar::where('ningresoID', $ningresoID)->first();

        // Verificar si el libro existe
        if (!$ejemplar) {
            return response()->json(['message' => 'Libro no encontrado.'], 404);
        }

        // Eliminar el libro
        $ejemplar->delete();

        return response()->json(['message' => 'Libro eliminado exitosamente.'], 200);
    }
}
