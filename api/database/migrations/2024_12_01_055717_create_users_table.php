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
            $table->string('name');
            $table->integer('dni');

            // Clave foránea para `tipousuario`
            $table->string('tipousuario');
            $table->foreign('tipousuario')
                ->references('tipousuario')
                ->on('tipousuarios');

            // Otros campos
            $table->string('estadousuario');
            $table->foreign('estadousuario')
                ->references('estadousuario')
                ->on('estadousuarios');
            
            $table->string('domicilio');
            $table->integer('telefono');
            $table->date('fechanacimiento');  
            $table->string('email')->unique();
            $table->string('password');
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
