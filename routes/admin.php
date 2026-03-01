<?php

use App\Http\Middleware\SuperAdminOnly;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Super Admin Routes
|--------------------------------------------------------------------------
|
| These routes are for the super admin panel. They require authentication
| and super_admin role.
|
*/

Route::middleware(['auth', 'verified', SuperAdminOnly::class])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return response()->json(['page' => 'Admin Dashboard', 'message' => 'Inertia.js will be configured in Phase 2']);
    })->name('dashboard');

    // Tenants
    // Route::resource('tenants', \App\Http\Controllers\Admin\TenantController::class);

    // AI Provider Management
    // Route::get('/ai-providers', [\App\Http\Controllers\Admin\AIProviderController::class, 'index'])->name('ai-providers.index');
    // Route::put('/ai-providers', [\App\Http\Controllers\Admin\AIProviderController::class, 'update'])->name('ai-providers.update');

    // Plans
    // Route::resource('plans', \App\Http\Controllers\Admin\PlanController::class);

    // System Logs
    // Route::get('/logs', [\App\Http\Controllers\Admin\LogController::class, 'index'])->name('logs.index');
});
