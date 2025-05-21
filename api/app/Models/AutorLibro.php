<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class AutorLibro extends Pivot
{
    protected $table = 'autor_libro';

    public $timestamps = false;

    protected $fillable = [
        'libro_id',
        'autor_id',
    ];
}
