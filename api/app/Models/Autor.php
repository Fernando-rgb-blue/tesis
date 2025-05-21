<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Autor extends Model
{
    use HasFactory;

    protected $primaryKey = 'autorID';
    
    /**
     * Relación muchos a muchos con Libro
     */
    public function libros()
    {
        return $this->belongsToMany(Libro::class, 'autor_libro', 'autor_id', 'libro_id')
                    ->using(AutorLibro::class);
    }
}
