<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Patient\AuthController; 
use App\Http\Controllers\Patient\UserProfileController;
use App\Http\Controllers\Professional\ProfessionalAuthController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\Patient\AppointmentController;
use App\Http\Controllers\Professional\ProfessionalAppointmentController;

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
Route::post('/webhook/auth', [WebhookController::class, 'handleAuthWebhook']);


Route::prefix('patient')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});



Route::get('/professionals', [ProfessionalAuthController::class, 'index']);



Route::prefix('patient')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile Routes

    Route::get('/profiles', [UserProfileController::class, 'getAllProfiles']);
    Route::post('/profile/add', [UserProfileController::class, 'store']); 
    Route::get('/profile/show', [UserProfileController::class, 'show']); 
    Route::put('/profile/update', [UserProfileController::class, 'update']); 
    Route::delete('/profile/delete', [UserProfileController::class, 'destroy']); 

    // Appointment Routes

    Route::post('/appointments/book', [AppointmentController::class, 'bookAppointment']);
    Route::get('/appointments/my', [AppointmentController::class, 'myAppointments']);
    Route::delete('/appointments/{id}/cancel', [AppointmentController::class, 'cancelAppointment']);
});


Route::prefix('professional')->group(function () {
    Route::post('/register', [ProfessionalAuthController::class, 'register']);
    Route::post('/login', [ProfessionalAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/appointments', [ProfessionalAppointmentController::class, 'getProfessionalAppointments']);

        Route::put('/appointments/{id}/update-status', [ProfessionalAppointmentController::class, 'updateAppointmentStatus'])->where('id', '[0-9]+');
        Route::post('/logout', [ProfessionalAuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
