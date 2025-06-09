<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AutorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\EditorialController;
use App\Http\Controllers\Api\EjemplarController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\EstadoUsuarioController;
use App\Http\Controllers\Api\FotoController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\LibroController;
use App\Http\Controllers\Api\TipousuarioController;
use App\Http\Controllers\Api\AutorLibroController;
use App\Http\Controllers\Api\PrestamoController;
use App\Http\Controllers\Api\FotoEjemplarController;
use App\Models\Editorial;
use App\Models\Prestamo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Psy\VarDumper\Presenter;

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
Route::controller(LibroController::class)->group(function () {
    Route::get('/libros', 'index');
    Route::get('/libros2', 'search');
    Route::post('/libro', 'store');
    Route::get('/libro/{id}', 'show');
    Route::put('/libro/{id}', 'update')->where('id', '.*');
    Route::delete('/libro/{id}', 'destroy');
    Route::get('/booksexport', 'export');
});


//RUTAS PARA FORANEAS A LIBRO

//AUTOR

Route::controller(AutorController::class)->group(function () {
    Route::get('/autors', 'index');
    Route::post('/autor', 'store');
    Route::get('/autor/{id}', 'show');
    Route::put('/autor/{id}', 'update');
    Route::delete('/autor/{id}', 'destroy');
});

//EDITORIAL

Route::controller(EditorialController::class)->group(function () {
    Route::get('/editorials', 'index');
    Route::post('/editorial', 'store');
    Route::get('/editorial/{id}', 'show');
    Route::put('/editorial/{id}', 'update');
    Route::delete('/editorial/{id}', 'destroy');
});

//CATEGORIA

Route::controller(CategoriaController::class)->group(function () {
    Route::get('/categorias', 'index');
    Route::post('/categoria', 'store');
    Route::get('/categoria/{id}', 'show');
    Route::put('/categoria/{id}', 'update');
    Route::delete('/categoria/{id}', 'destroy');
});

//EJEMPLAR

Route::controller(EjemplarController::class)->group(function () {
    Route::get('/ejemplars', 'index');
    Route::post('/ejemplar', 'store');
    Route::post('/ejemplar/{codigolibro}', 'store2')->where('codigolibro', '.*');
    Route::get('/ejemplar/{codigolibro}', 'show')->where('codigolibro', '.*');
    Route::get('/ejemplar/{codigolibro}/{ningresoID}', 'show2')->where(['codigolibro' => '.*', 'ningresoID' => '.*']);
    Route::put('/ejemplar/{codigolibroID}/{ningresoID}', 'update')
        ->where(['codigolibroID' => '.*', 'ningresoID' => '.*']);
    Route::delete('/ejemplar/{codigolibroID}/{ningresoID}', 'destroy')
        ->where(['codigolibroID' => '.*', 'ningresoID' => '.*']);
    // Route::get('/ejemplar/{codigolibro}/{ningresoID}','show2')->where(['codigolibro' => '.*', 'ningresoID' => '.*']);
    // Route::put('/ejemplar/{codigolibro}/{ningresoID}','update')->where(['codigolibro' => '.*', 'ningresoID' => '.*']);
    // Route::delete('/ejemplar/{codigolibro}/{ningresoID}','destroy')->where(['codigolibro' => '.*', 'ningresoID' => '.*']);
});

// AUTOR LIBRO 

Route::controller(AutorLibroController::class)->group(function () {
    Route::get('/autores-con-libros', 'indexConLibros'); // Listar autores por libro
    Route::get('/autorlibros/{libro}', 'index'); // Listar autores por libro
    Route::post('/autorlibro/{libro}', 'store'); // Agregar autores a un libro
    Route::get('/autorlibro/{libro}/{autor}', 'show'); // Mostrar un autor específico de un libro
    Route::put('/autorlibro/{libro}', 'update'); // Reemplazar todos los autores de un libro
    Route::delete('/autorlibro/{libro}/{autor}', 'destroy'); // Quitar un autor del libro
});


//FOTO EJEMPLAR

Route::controller(FotoEjemplarController::class)->group(function () {
    Route::get('/fotoejemplars', 'index');
    Route::post('/fotoejemplar', 'store');
    Route::get('/fotoejemplar/{ningresoID}', 'show');
    Route::put('/fotoejemplar/{ningresoID}', 'update');
    Route::delete('/fotoejemplar/{id}', 'destroy');
});

// SESION 

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::put('/usersupdate/{id}', [AuthController::class, 'update']);  // <-- Aquí sin middleware

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'allUsers']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
    Route::put('/users/{id}', [AuthController::class, 'update']);
});


// USUARIOS

Route::controller(EstadoUsuarioController::class)->group(function () {
    Route::get('/estadousuarios', 'index');
    Route::post('/estadousuario', 'store');
});

Route::controller(TipousuarioController::class)->group(function () {
    Route::get('/tipousuarios', 'index');
    Route::post('/tipousuario', 'store');
});

Route::controller(EmpleadoController::class)->group(function () {
    Route::get('/empleados', 'index');
    Route::post('/empleado', 'store');
});
/// PRESTAMO

Route::controller(PrestamoController::class)->group(function () {
    Route::get('/prestamos', 'index');
    Route::post('/prestamo', 'store');
});
