<?php

use App\Http\Middleware\TenantScope;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\SettingsController;
use App\Http\Controllers\Tenant\FaqController;
use App\Http\Controllers\Tenant\ChannelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', TenantScope::class])->prefix('panel')->name('panel.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::get('/ai-settings', [SettingsController::class, 'aiSettings'])->name('ai-settings');
    Route::post('/settings/ai', [SettingsController::class, 'updateAi'])->name('settings.ai.update');

    Route::get('/conversations', [\App\Http\Controllers\Tenant\ConversationController::class, 'index'])->name('conversations.index');
    Route::get('/contacts', [\App\Http\Controllers\Tenant\ContactController::class, 'index'])->name('contacts.index');

    Route::resource('faqs', FaqController::class);
    Route::resource('channels', ChannelController::class)->except(['edit', 'update', 'show']);
    Route::patch('channels/{channel}/toggle', [ChannelController::class, 'toggle'])->name('channels.toggle');
});
