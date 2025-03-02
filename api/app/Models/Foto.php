<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    use HasFactory;

    protected $table = 'fotos'; // Asegúrate de que sea el nombre correcto de tu tabla
    protected $fillable = ['ningresoID', 'rutafoto']; // Agrega ningresoID aquí
}
