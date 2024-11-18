<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ejemplar extends Model
{
    use HasFactory;
    // Definir la relación con el modelo Libro
    public function libro()
    {
        return $this->belongsTo(Libro::class, 'codigolibroID', 'codigolibroID');
    }
}
