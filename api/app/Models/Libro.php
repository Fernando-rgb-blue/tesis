<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    use HasFactory;
    
    public function autores()
    {
        return $this->belongsToMany(Autor::class, 'autor_libro', 'libro_id', 'autor_id')
                    ->using(AutorLibro::class);
    }
}
