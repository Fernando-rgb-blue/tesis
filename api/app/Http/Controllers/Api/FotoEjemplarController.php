<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Foto;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FotoEjemplarController extends Controller
{
    // Obtener todas las fotos
    public function index()
    {
        return response()->json(Foto::all());
    }

    // Guardar una nueva foto asociada a un ejemplar

    public function store(Request $request)
    {
        // Validar que 'rutafoto' sea un array y contenga imágenes
        $request->validate([
            'ningresoID' => 'required|exists:ejemplars,ningresoID',
            'rutafoto.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validar cada imagen
        ]);

        // Verificar cuántas imágenes ya tiene el ejemplar
        $fotoCount = Foto::where('ningresoID', $request->ningresoID)->count();
        $newFotos = $request->file('rutafoto'); // Obtener imágenes enviadas

        // Asegurar que 'rutafoto' sea un array
        if (!is_array($newFotos)) {
            $newFotos = [$newFotos]; // Convertir a array si solo hay una imagen
        }

        $newFotoCount = count($newFotos);

        // Validar si se supera el límite de 5 imágenes
        if (($fotoCount + $newFotoCount) > 5) {
            return response()->json(['message' => 'No se pueden subir más de 5 imágenes por ejemplar'], 400);
        }

        $fotosGuardadas = [];

        // Guardar cada imagen en uploads/fotosejemplares/
        foreach ($newFotos as $foto) {
            $path = $foto->store('uploads/fotosejemplares', 'public');

            $fotoGuardada = Foto::create([
                'ningresoID' => $request->ningresoID,
                'rutafoto' => $path,
            ]);

            $fotosGuardadas[] = $fotoGuardada;
        }

        return response()->json(['message' => 'Fotos guardadas correctamente', 'fotos' => $fotosGuardadas], 201);
    }


    // Obtener todas las fotos de un ejemplar específico
    public function show($ningresoID)
    {
        $fotos = Foto::where('ningresoID', $ningresoID)->get();
        if ($fotos->isEmpty()) {
            return response()->json(['message' => 'Fotos no encontradas'], 404);
        }
        return response()->json($fotos);
    }

    // Actualizar una foto
    public function update(Request $request, $id)
    {
        $request->validate([
            'rutafoto' => 'nullable|file|image|max:5000',
        ]);

        $foto = Foto::find($id);
        if (!$foto) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }

        Log::info('Datos de la solicitud:', $request->all());

        if ($request->hasFile('rutafoto')) {
            Log::info('Archivo recibido:', [$request->file('rutafoto')->getClientOriginalName()]);

            // Eliminar la imagen anterior si existe
            if ($foto->rutafoto && Storage::exists('uploads/fotosejemplares/' . $foto->rutafoto)) {
                Storage::delete('uploads/books/' . $foto->rutafoto);
                Log::info('Imagen anterior eliminada:', [$foto->rutafoto]);
            }

            // Obtener la extensión y guardar con un nuevo nombre
            $extension = $request->file('rutafoto')->getClientOriginalExtension();
            $fileName = $foto->ningresoID . '_' . time() . '.' . $extension;

            $imagePath = $request->file('rutafoto')->storeAs('uploads/books', $fileName, 'public');
            Log::info('Imagen guardada en:', [$imagePath]);

            // Actualizar la ruta en la base de datos
            $foto->rutafoto = $imagePath;
            $foto->save();
        }

        return response()->json(['message' => 'Foto actualizada correctamente', 'foto' => $foto]);
    }

    // Eliminar una foto usando su ID
    public function destroy($id)
    {
        $foto = Foto::find($id);
        if (!$foto) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }

        Storage::disk('public')->delete($foto->rutafoto);
        $foto->delete();

        return response()->json(['message' => 'Foto eliminada correctamente']);
    }
}
