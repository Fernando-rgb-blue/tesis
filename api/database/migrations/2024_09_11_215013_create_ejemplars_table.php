<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEjemplarsTable extends Migration
{
    public function up()
    {
        Schema::create('ejemplars', function (Blueprint $table) {
            $table->id('ningresoID');
            $table->unsignedBigInteger('codigolibroID'); // Relación con libros
            $table->string('estadolibro');
            $table->timestamps();

            // Relación foránea
            $table->foreign('codigolibroID')->references('codigolibroID')->on('libros')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ejemplars');
    }
}
