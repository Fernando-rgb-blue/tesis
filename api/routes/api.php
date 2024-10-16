<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AutorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EditorialController;
use App\Http\Controllers\Api\EjemplarController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\LibroController;
use App\Models\Editorial;
use Illuminate\Support\Facades\Auth;
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
    Route::get('/libros2','search');
    Route::post('/libro','store');
    Route::get('/libro/{id}','show');
    Route::put('/libro/{id}','update');
    Route::delete('/libro/{id}','destroy');
});

//RUTAS PARA FORANEAS A LIBRO

//AUTOR

Route::controller(AutorController::class)->group(function(){
    Route::get('/autors','index');
    Route::post('/autor','store');
    Route::get('/autor/{id}','show');
    Route::put('/autor/{id}','update');
    Route::delete('/autor/{id}','destroy');
});

//EDITORIAL

Route::controller(EditorialController::class)->group(function(){
    Route::get('/editorials','index');
    Route::post('/editorial','store');
    Route::get('/editorial/{id}','show');
    Route::put('/editorial/{id}','update');
    Route::delete('/editorial/{id}','destroy');
});

//CATEGORIA

Route::controller(CategoriaController::class)->group(function(){
    Route::get('/categorias','index');
    Route::post('/categoria','store');
    Route::get('/categoria/{id}','show');
    Route::put('/categoria/{id}','update');
    Route::delete('/categoria/{id}','destroy');
});

Route::controller(EjemplarController::class)->group(function(){
    Route::get('/ejemplars','index');
    Route::post('/ejemplar','store');
    Route::get('/ejemplar/{id}','show');
    Route::put('/ejemplar/{id}','update');
    Route::delete('/ejemplar/{id}','destroy');
});

// SESION 

Route::controller(AuthController::class)->group(function(){
    Route::post('/register','register');
    Route::post('/login','login');
});

Route::group(['middleware' => ['auth:sanctum']], function(){
    Route::get('user-profile', [AuthController::class, 'userProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
});
