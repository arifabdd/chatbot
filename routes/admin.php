<?php

use App\Http\Middleware\SuperAdminOnly;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\Admin\AIProviderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', SuperAdminOnly::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::resource('tenants', TenantController::class);
    Route::get('/ai-providers', [AIProviderController::class, 'index'])->name('ai-providers.index');
    Route::put('/ai-providers', [AIProviderController::class, 'update'])->name('ai-providers.update');
});
