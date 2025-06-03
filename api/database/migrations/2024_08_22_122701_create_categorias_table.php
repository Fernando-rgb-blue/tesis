<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriasTable extends Migration
{
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id('categoriaID');
            $table->string('nombre');
            $table->text('descripcion');
            $table->timestamps();
        });
    }
// ELIMINADO EL 2/06/2025
    public function down()
    {
        Schema::dropIfExists('categorias');
    }
}