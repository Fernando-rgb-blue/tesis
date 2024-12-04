<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    use HasFactory;

    // Definimos la tabla asociada al modelo
    protected $table = 'fotos';

    // Permitimos asignación masiva para las siguientes columnas
    protected $fillable = [
        'ningresoID',
        'rutafoto',
    ];

    /**
     * Relación con el modelo Ejemplar.
     * Una foto pertenece a un ejemplar.
     */
    public function ejemplar()
    {
        return $this->belongsTo(Ejemplar::class, 'ningresoID', 'ningresoID');
    }
}
