<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLibrosTable extends Migration
{
    public function up()
    {
        Schema::create('libros', function (Blueprint $table) {
            $table->id(); // Clave primaria incremental
            $table->string('codigolibroID')->unique(); // Ya no es clave primaria
            $table->string('isbn');
            $table->string('titulo');
            $table->unsignedBigInteger('autorID');
            $table->foreign('autorID')->references('autorID')->on('autors'); // Referencia a `autorID`
            $table->unsignedBigInteger('categoriaID');
            $table->foreign('categoriaID')->references('categoriaID')->on('categorias'); // Referencia a `categoriaID`
            $table->unsignedBigInteger('editorialID');
            $table->foreign('editorialID')->references('editorialID')->on('editorials'); // Referencia a `editorialID`
            $table->integer('aniopublicacion');
            $table->string('edicion')->nullable();
            $table->integer('numeropaginas');
            $table->integer('ejemplaresdisponibles');
            $table->string('volumen')->nullable();
            $table->string('tomo')->nullable();
            $table->string('idioma')->nullable();
            $table->string('resumen')->nullable();
            $table->string('rutafoto')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('libros');
    }
}
