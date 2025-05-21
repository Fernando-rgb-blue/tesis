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
            // $table->string('controltopografico')->nullable();
            $table->string('codigolibroID')->unique(); // Ya no es clave primaria
            $table->string('isbn');
            $table->string('titulo');
            // Eliminado autorID (se usará tabla pivote)
            $table->integer('numeropaginas');
            $table->integer('ejemplaresdisponibles');
            $table->text('resumen')->nullable();
            $table->string('volumen')->nullable();
            $table->string('tomo')->nullable();
            $table->unsignedBigInteger('categoriaID');
            $table->foreign('categoriaID')->references('categoriaID')->on('categorias');
            $table->string('edicion')->nullable();
            $table->unsignedBigInteger('editorialID');
            $table->foreign('editorialID')->references('editorialID')->on('editorials');
            $table->string('pais')->nullable();
            $table->string('idioma')->nullable();
            $table->integer('aniopublicacion');
            $table->string('formadeadquisicion')->nullable();
            $table->string('precio')->nullable();
            $table->string('procedenciaproovedor')->nullable();
            $table->string('rutafoto')->nullable();
            $table->timestamps();
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('libros');
    }
}
