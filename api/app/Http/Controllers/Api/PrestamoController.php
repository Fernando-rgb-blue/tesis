<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prestamo;
use Illuminate\Http\Request;


class PrestamoController extends Controller
{
    /**
     * Mostrar todos los préstamos.
     */
    public function index()
    {
        // Obtener todos los préstamos con sus relaciones
        return response()->json(Prestamo::all(), 200);
    }

    /**
     * Crear un nuevo préstamo.
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validated = $request->validate([
            'numerodeprestamo' => 'required|string|max:255',
            'ningresoID' => 'required|string|exists:ejemplars,ningresoID',
            'usuarioid' => 'required|exists:users,id',
            'empleadoid' => 'nullable|exists:empleados,id', // Ahora es opcional
            'fechaprestamo' => 'required|date',
            'fechadevolucion' => 'required|date|after_or_equal:fechaprestamo',
            'estadoprestamo' => 'nullable|string|max:255', // Ahora es opcional
        ]);
    
        // Crear un nuevo préstamo
        $prestamo = Prestamo::create($validated);
    
        return response()->json($prestamo, 201);
    }
    

    /**
     * Mostrar un préstamo específico.
     */
    public function show($id)
    {
        $prestamo = Prestamo::with(['ejemplar', 'usuario', 'empleado'])->find($id);

        if (!$prestamo) {
            return response()->json(['message' => 'Préstamo no encontrado'], 404);
        }

        return response()->json($prestamo);
    }

    /**
     * Actualizar un préstamo.
     */
    public function update(Request $request, $id)
    {
        $prestamo = Prestamo::find($id);

        if (!$prestamo) {
            return response()->json(['message' => 'Préstamo no encontrado'], 404);
        }

        // Validar los datos de entrada
        $validated = $request->validate([
            'numerodeprestamo' => 'sometimes|string|max:255',
            'ningresoID' => 'sometimes|string|exists:ejemplars,ningresoID',
            'usuarioid' => 'sometimes|exists:users,id',
            'empleadoid' => 'sometimes|exists:empleados,id',
            'fechaprestamo' => 'sometimes|date',
            'fechadevolucion' => 'sometimes|date|after_or_equal:fechaprestamo',
            'estadoprestamo' => 'sometimes|string|max:255',
        ]);

        // Actualizar el préstamo
        $prestamo->update($validated);

        return response()->json($prestamo);
    }

    /**
     * Eliminar un préstamo.
     */
    public function destroy($id)
    {
        $prestamo = Prestamo::find($id);

        if (!$prestamo) {
            return response()->json(['message' => 'Préstamo no encontrado'], 404);
        }

        $prestamo->delete();

        return response()->json(['message' => 'Préstamo eliminado correctamente']);
    }
}
