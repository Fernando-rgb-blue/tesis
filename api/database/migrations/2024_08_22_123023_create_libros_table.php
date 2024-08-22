<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLibrosTable extends Migration
{
    public function up()
    {
        Schema::create('libros', function (Blueprint $table) {
            $table->id('libroID');
            $table->string('isbn');
            $table->string('codigo');
            $table->string('titulo');
            $table->foreignId('autorID')->constrained('autors');
            $table->foreignId('categoriaID')->constrained('categorias');
            $table->foreignId('editorialID')->constrained('editorials');
            $table->integer('aniopublicacion');
            $table->integer('ejemplaresdisponibles');
            $table->string('edicion');
            $table->integer('numeropaginas');
            $table->string('estadolibro');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('libros');
    }
}