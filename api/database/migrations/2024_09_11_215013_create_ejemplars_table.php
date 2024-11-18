<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEjemplarsTable extends Migration
{
    public function up()
    {
        Schema::create('ejemplars', function (Blueprint $table) {
            $table->id();
            
            $table->string('ningresoID');
    
            $table->string('codigolibroID'); // Tipo de dato `string` para `codigolibroID`
            $table->foreign('codigolibroID')
                  ->references('codigolibroID') // Referencia a la columna `codigolibroID` en `libros`
                  ->on('libros') // Tabla `libros`
                  ->onDelete('cascade') // Elimina los ejemplares relacionados si se elimina un libro
                  ->onUpdate('cascade'); // Actualiza el `codigolibroID` en ejemplars si se actualiza en libros
            
            $table->string('estadolibro');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('ejemplars');
    }
}
