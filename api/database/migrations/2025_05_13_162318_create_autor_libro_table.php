<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('autor_libro', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('libro_id');
            $table->unsignedBigInteger('autor_id');

            $table->foreign('libro_id')->references('id')->on('libros')->onDelete('cascade');
            $table->foreign('autor_id')->references('autorID')->on('autors')->onDelete('cascade');

            $table->unique(['libro_id', 'autor_id']); // Evita duplicados
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autor_libro');
    }
};
