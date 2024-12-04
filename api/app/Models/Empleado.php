<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    use HasFactory;

    // Nombre de la tabla asociada
    protected $table = 'empleados';

    // Clave primaria
    protected $primaryKey = 'id';

    // Los campos que pueden ser asignados masivamente
    protected $fillable = [
        'codigoempleado',
        'nombre',
        'turno',
        'tipousuario',
        'estadousuario',
    ];

    // Relaciones (asumiendo que tienes modelos `TipoUsuario` y `EstadoUsuario`)
    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class, 'tipousuario', 'tipousuario');
    }

    public function estadoUsuario()
    {
        return $this->belongsTo(EstadoUsuario::class, 'estadousuario', 'estadousuario');
    }
}
