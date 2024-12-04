<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Empleado::all(), 200);
    }
   /**
     * Crear un nuevo empleado.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'codigoempleado' => 'required|string|max:255|unique:empleados',
            'nombre' => 'required|string|max:255',
            'turno' => 'required|string|max:255',
            'tipousuario' => 'required|string|exists:tipousuarios,tipousuario',
            'estadousuario' => 'required|string|exists:estadousuarios,estadousuario',
        ]);

        $empleado = Empleado::create($validatedData);
        return response()->json($empleado, 201);
    }

    /**
     * Mostrar los detalles de un empleado específico.
     */
    
    public function show($id)
    {
        $empleado = Empleado::with(['tipoUsuario', 'estadoUsuario'])->findOrFail($id);
        return response()->json($empleado);
    }

    /**
     * Actualizar un empleado existente.
     */
    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $validatedData = $request->validate([
            'codigoempleado' => 'sometimes|string|max:255|unique:empleados,codigoempleado,' . $id,
            'nombre' => 'sometimes|string|max:255',
            'turno' => 'sometimes|string|max:255',
            'tipousuario' => 'sometimes|string|exists:tipousuarios,tipousuario',
            'estadousuario' => 'sometimes|string|exists:estadousuarios,estadousuario',
        ]);

        $empleado->update($validatedData);
        return response()->json($empleado);
    }

    /**
     * Eliminar un empleado.
     */
    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->delete();
        return response()->json(['message' => 'Empleado eliminado con éxito']);
    }
}