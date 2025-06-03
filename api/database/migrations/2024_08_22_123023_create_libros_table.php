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
            $table->string('isbn')->nullable();
            $table->string('titulo')->nullable();
            $table->integer('numeropaginas')->nullable();
            $table->integer('ejemplaresdisponibles')->nullable();
            $table->text('resumen')->nullable();
            $table->string('voltomejemp')->nullable();
            $table->string('edicion')->nullable();
            $table->unsignedBigInteger('editorialID');
            $table->foreign('editorialID')->references('editorialID')->on('editorials');
            $table->string('pais')->nullable();
            $table->string('idioma')->nullable();
            $table->integer('aniopublicacion')->nullable();
            $table->string('formadeadquisicion')->nullable();
            $table->string('procedenciaproovedor')->nullable();
            $table->string('rutafoto')->nullable();
            $table->integer('habilitacion')->nullable();
            $table->timestamps();
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('libros');
    }
}
