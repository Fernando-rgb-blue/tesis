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
        $ejemplar->precio = $request->precio;
        $ejemplar->anioingreso = $request->anioingreso;
        $ejemplar->save();
        return response()->json(['message' => 'Ejemplar creado exitosamente.'], 201);
    }

    public function store2(Request $request, $codigolibroID)
    {
        // Decodificar el codigolibroID en caso de que venga codificado en la URL
        $codigolibroID = urldecode($codigolibroID);

        // Crear el nuevo ejemplar
        $ejemplar = new Ejemplar();
        $ejemplar->ningresoID = $request->ningresoID;
        $ejemplar->codigolibroID = $codigolibroID; // Se obtiene desde la URL
        $ejemplar->estadolibro = $request->estadolibro;
        $ejemplar->precio = $request->precio;
        $ejemplar->anioingreso = $request->anioingreso;
        $ejemplar->save();

        // Responder con los datos creados
        return response()->json([
            'message' => 'Ejemplar creado exitosamente.',
            'ejemplar' => $ejemplar
        ], 201);
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


    public function show2(Request $request, $codigolibroID, $ningresoID)
    {
        // Buscar el ejemplar que coincida con 'codigolibroID' y 'ningresoID'
        $ejemplar = Ejemplar::where('codigolibroID', $codigolibroID)
            ->where('ningresoID', $ningresoID)
            ->first();

        // Verificar si no se encontró el ejemplar
        if (!$ejemplar) {
            return response()->json(['message' => 'No se encontró el ejemplar con los datos proporcionados.'], 404);
        }

        // Retornar el ejemplar encontrado
        return response()->json($ejemplar);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $codigolibroID, $ningresoID)
    {
        // Decodificar parámetros en base64
        $codigolibroID = base64_decode($codigolibroID);
        $ningresoID = base64_decode($ningresoID);

        // Buscar el ejemplar
        $ejemplar = Ejemplar::where('codigolibroID', $codigolibroID)
            ->where('ningresoID', $ningresoID)
            ->firstOrFail();

        // Actualizar los campos
        $ejemplar->ningresoID = $request->ningresoID;
        $ejemplar->estadolibro = $request->estadolibro;
        $ejemplar->precio = $request->precio;
        $ejemplar->anioingreso = $request->anioingreso;
        $ejemplar->updated_at = now();
        $ejemplar->save();

        return response()->json(['message' => 'Ejemplar actualizado correctamente.'], 200);
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($codigolibroID, $ningresoID)
    {
        // Decodificar parámetros en base64
        $codigolibroID = base64_decode($codigolibroID);
        $ningresoID = base64_decode($ningresoID);

        // Buscar el ejemplar por codigolibroID y ningresoID
        $ejemplar = Ejemplar::where('codigolibroID', $codigolibroID)
            ->where('ningresoID', $ningresoID)
            ->first();

        if (!$ejemplar) {
            return response()->json(['message' => 'Ejemplar no encontrado.'], 404);
        }

        $ejemplar->delete();
        return response()->json(['message' => 'Ejemplar eliminado exitosamente.'], 200);
    }
}
