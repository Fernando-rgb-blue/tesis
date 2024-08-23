<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Editorial;
use Illuminate\Http\Request;

class EditorialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $editorial = Editorial::all();
        return $editorial;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $editorial= new Editorial();
        $editorial->nombre = $request->nombre;
        $editorial->pais = $request->pais;

        // Guardar el nuevo libro en la base de datos

        $editorial->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
