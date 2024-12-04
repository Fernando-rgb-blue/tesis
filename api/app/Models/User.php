<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'dni',
        'tipousuario',
        'estadousuario',
        'domicilio',
        'telefono',
        'fechanacimiento',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password'
    ];

    public function tipoUsuario()
    {
        return $this->belongsTo(Tipousuario::class, 'tipousuario', 'tipousuario');
    }

    /**
     * Relación con el modelo `Estadousuario`.
     */
    public function estadoUsuario()
    {
        return $this->belongsTo(Estadousuario::class, 'estadousuario', 'estadousuario');
    }
}