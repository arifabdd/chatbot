<?php

use App\Http\Middleware\TenantScope;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\FaqController;
use App\Http\Controllers\Tenant\ChannelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', TenantScope::class])->prefix('panel')->name('panel.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::resource('faqs', FaqController::class);
    Route::resource('channels', ChannelController::class)->except(['edit', 'update', 'show']);
    Route::patch('channels/{channel}/toggle', [ChannelController::class, 'toggle'])->name('channels.toggle');
});
