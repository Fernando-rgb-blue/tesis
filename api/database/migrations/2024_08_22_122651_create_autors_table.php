<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAutorsTable extends Migration
{
    public function up()
    {
        Schema::create('autors', function (Blueprint $table) {
            $table->id('autorID');
            $table->string('nombre');
            $table->string('nacionalidad');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('autors');
    }
}