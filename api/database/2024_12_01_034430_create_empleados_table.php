<?php
//NO USAR
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
        Schema::create('empleados', function (Blueprint $table) {
            $table->id(); // Clave primaria
            $table->string('codigoempleado');
            $table->string('nombre');
            $table->string('turno');

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

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleados');
    }
};
