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
        Schema::create('fotos', function (Blueprint $table) {
            $table->id(); // Crea la columna id (clave primaria)

            $table->string('ningresoID');
            $table->foreign('ningresoID')
                ->references('ningresoID')
                ->on('ejemplars')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->string('rutafoto'); // Ruta de la foto
            $table->timestamps(); // Crea las columnas 'created_at' y 'updated_at'
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fotos'); // Elimina la tabla 'fotos' si se revierte la migración
    }
};
