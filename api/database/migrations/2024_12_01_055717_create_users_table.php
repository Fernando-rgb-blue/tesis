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

            // Información básica (nullable excepto email y password)
            $table->string('name')->nullable();
            $table->bigInteger('coduniversitario')->unique()->nullable(); // Campo nuevo, único y opcional
            $table->integer('dni')->unique()->nullable();
            $table->string('email')->unique(); // Requerido
            $table->string('password');        // Requerido
            $table->date('fechanacimiento')->nullable();
            $table->string('domicilio')->nullable();
            $table->integer('telefono')->unique()->nullable();

            // Relaciones foráneas (nullable y con claves foráneas)
            $table->string('tipousuario')->nullable();
            $table->foreign('tipousuario')
                ->references('tipousuario')
                ->on('tipousuarios')
                ->nullOnDelete();

            $table->string('estadousuario')->nullable();
            $table->foreign('estadousuario')
                ->references('estadousuario')
                ->on('estadousuarios')
                ->nullOnDelete();

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
