<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model
{
    use HasFactory;

    // Nombre de la tabla asociada
    
    protected $table = 'prestamos';

    protected $fillable = [
        'numerodeprestamo',
        'ningresoID',
        'usuarioid',
        'empleadoid',
        'fechaprestamo',
        'fechadevolucion',
        'estadoprestamo',
    ];

    // Relación con Ejemplar
    public function ejemplar()
    {
        return $this->belongsTo(Ejemplar::class, 'ningresoID', 'ningresoID');
    }

    // Relación con Usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioid');
    }

    // Relación con Empleado
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'empleadoid');
    }
}
