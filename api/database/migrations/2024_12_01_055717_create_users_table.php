<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Información básica
            $table->string('name');
            $table->integer('dni');
            $table->string('email')->unique();
            $table->string('password');
            $table->date('fechanacimiento');
            $table->string('domicilio');
            $table->integer('telefono');

            // Relaciones foráneas
            $table->string('tipousuario');
            $table->foreign('tipousuario')
                ->references('tipousuario')
                ->on('tipousuarios');

            $table->string('estadousuario');
            $table->foreign('estadousuario')
                ->references('estadousuario')
                ->on('estadousuarios');

            // Campos opcionales
            $table->string('turno')->nullable(); // Para bibliotecarios

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
