<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tipousuario;

class TipousuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposUsuarios = [
            ['tipousuario' => 'Alumno(a)'],
            ['tipousuario' => 'Externo(a)'],
            ['tipousuario' => 'Jefe(a)'],
            ['tipousuario' => 'Bibliotecario(a)'],
            ['tipousuario' => 'Investigador(a)'],
            ['tipousuario' => 'Docente'],
            ['tipousuario' => 'Administrador(a)'],
            ['tipousuario' => 'Personal de limpieza'],
            ['tipousuario' => 'Personal técnico'],
            ['tipousuario' => 'Visitante'],
        ];

        foreach ($tiposUsuarios as $tipo) {
            Tipousuario::updateOrCreate(['tipousuario' => $tipo['tipousuario']], $tipo);
        }
    }
}
