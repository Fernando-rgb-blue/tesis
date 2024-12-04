<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Estadousuario;


class EstadoUsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            ['estadousuario' => 'Inhabilitado', 'descripcion' => 'Usuario que no puede acceder a los servicios de la biblioteca debido a restricciones administrativas o técnicas.'],
            ['estadousuario' => 'En mora', 'descripcion' => 'Usuario con libros no devueltos a tiempo o con multas pendientes.'],
            ['estadousuario' => 'Activo', 'descripcion' => 'Usuario en pleno uso de los servicios de la biblioteca.'],
            ['estadousuario' => 'Vacaciones', 'descripcion' => 'Usuario o personal que está temporalmente fuera por vacaciones, con acceso limitado o restringido.'],
            ['estadousuario' => 'Licencia médica', 'descripcion' => 'Usuario o personal con acceso suspendido debido a una licencia médica.'],
            ['estadousuario' => 'Permiso especial', 'descripcion' => 'Usuario con acceso limitado o condicionado por un permiso especial temporal.'],
            ['estadousuario' => 'Suspendido', 'descripcion' => 'Usuario que ha violado las políticas de la biblioteca y tiene acceso suspendido temporalmente.'],
            ['estadousuario' => 'Expulsado', 'descripcion' => 'Usuario que ha sido eliminado permanentemente del sistema de la biblioteca.'],
            ['estadousuario' => 'En revisión', 'descripcion' => 'Usuario cuya cuenta está bajo revisión administrativa.'],
            ['estadousuario' => 'Nuevo', 'descripcion' => 'Usuario recién registrado con acceso pendiente de activación.'],
            ['estadousuario' => 'Retirado', 'descripcion' => 'Usuario que ya no forma parte de la comunidad de la biblioteca (ej. exalumnos).'],
            ['estadousuario' => 'Visitante', 'descripcion' => 'Usuario temporal con permisos limitados para acceder a recursos de la biblioteca.'],
            ['estadousuario' => 'En entrenamiento', 'descripcion' => 'Personal que está en proceso de capacitación para el uso del sistema de la biblioteca.']
        ];

        foreach ($estados as $estado) {
            Estadousuario::create($estado);
        }
    }
}
