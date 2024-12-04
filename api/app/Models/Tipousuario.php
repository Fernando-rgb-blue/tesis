<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tipousuario extends Model
{
    use HasFactory;

    /**
     * Campos que se pueden asignar masivamente.
     */
    protected $fillable = ['tipousuario'];
}
