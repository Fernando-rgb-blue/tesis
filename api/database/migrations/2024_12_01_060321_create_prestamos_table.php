<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prestamos', function (Blueprint $table) {
            $table->id(); // Clave primaria
            $table->string('numerodeprestamo');
            
            // Campo para referenciar a 'ejemplars'
            $table->string('ningresoID'); 
            $table->foreign('ningresoID')
                ->references('ningresoID')
                ->on('ejemplars')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Clave foránea para 'users'
            $table->unsignedBigInteger('usuarioid');
            $table->foreign('usuarioid')
                ->references('id')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // Clave foránea para 'empleados'
            // $table->unsignedBigInteger('empleadoid');
            // $table->foreign('empleadoid')
            //     ->references('id') // Asegúrate de que 'empleados' tiene un campo 'id'
            //     ->on('empleados')
            //     ->onDelete('cascade')
            //     ->onUpdate('cascade');

            $table->date('fechaprestamo'); // Usar `date` para fechas
            $table->date('fechadevolucion'); // Corregir el nombre del campo y usar `date`
            $table->string('estadoprestamo'); // Estado del préstamo

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};
