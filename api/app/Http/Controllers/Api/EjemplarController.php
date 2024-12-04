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
        $ejemplar = new Ejemplar();
        $ejemplar->ningresoID = $request->ningresoID;
        $ejemplar->codigolibroID = $request->codigolibroID;
        $ejemplar->estadolibro = $request->estadolibro;
        $ejemplar->save();
        return response()->json(['message' => 'Ejemplar creado exitosamente.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $codigolibroID)
    {
        // Buscar todos los ejemplares que coincidan con 'codigolibroID'
        $ejemplares = Ejemplar::where('codigolibroID', $codigolibroID)->get();
        // Verificar si no se encontraron registros
        if ($ejemplares->isEmpty()) {
            return response()->json(['message' => 'No se encontraron ejemplares con el código proporcionado.'], 404);
        }
        // Retornar los ejemplares encontrados
        return response()->json($ejemplares);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $ejemplar = Ejemplar::findOrFail($id); // Buscar por ID principal
        $ejemplar->codigolibroID = $request->codigolibroID;
        $ejemplar->estadolibro = $request->estadolibro;
        $ejemplar->updated_at = now();
        $ejemplar->save();
        return response()->json(['message' => 'Ejemplar actualizado correctamente.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $ejemplar = Ejemplar::find($id); // Buscar por ID principal
        if (!$ejemplar) {
            return response()->json(['message' => 'Ejemplar no encontrado.'], 404);
        }
        $ejemplar->delete();
        return response()->json(['message' => 'Ejemplar eliminado exitosamente.'], 200);
    }
}
