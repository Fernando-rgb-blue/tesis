<?php

use App\Http\Controllers\Api\AutorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EditorialController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\LibroController;
use App\Models\Editorial;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//RUTAS PARA LIBRO
Route::controller(LibroController::class)->group(function(){
    Route::get('/libros','index');
    Route::post('/libro','store');
    Route::get('/libro/{id}','show');
    Route::put('/libro/{id}','update');
    Route::delete('/libro/{id}','destroy');
});

//RUTAS PARA FORANEAS A LIBRO
//AUTOR

Route::controller(AutorController::class)->group(function(){
    Route::get('/autors','index');
    // Route::post('/libro','store');
    Route::get('/autor/{id}','show');
    // Route::put('/libro/{id}','update');
    // Route::delete('/libro/{id}','destroy');
});

//EDITORIAL

Route::controller(EditorialController::class)->group(function(){
    Route::get('/editorials','index');
    Route::post('/editorial','store');
    Route::get('/editorial/{id}','show');
    // Route::put('/libro/{id}','update');
    // Route::delete('/libro/{id}','destroy');
});

//CATEGORIA

Route::controller(CategoriaController::class)->group(function(){
    Route::get('/categorias','index');
    // Route::post('/libro','store');
    Route::get('/categorias/{id}','show');
    // Route::put('/libro/{id}','update');
    // Route::delete('/libro/{id}','destroy');
});