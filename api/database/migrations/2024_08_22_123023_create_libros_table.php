<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLibrosTable extends Migration
{
    public function up()
    {
        Schema::create('libros', function (Blueprint $table) {
            $table->unsignedBigInteger('codigolibroID');
            $table->string('isbn');
            $table->string('titulo');

            // Si las claves primarias en las otras tablas no son 'id'
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
            $table->timestamps();
            
            $table->primary('codigolibroID'); // Clave primaria
            $table->index('codigolibroID');   // Agregar un índice a codigolibroID
        });
    }

    public function down()
    {
        Schema::dropIfExists('libros');
    }
}
