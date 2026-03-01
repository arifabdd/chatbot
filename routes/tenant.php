<?php

use App\Http\Middleware\TenantScope;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenant Admin Routes
|--------------------------------------------------------------------------
|
| These routes are for tenant admin panel. They require authentication
| and apply tenant scope middleware.
|
*/

Route::middleware(['auth', 'verified', TenantScope::class])->prefix('panel')->name('panel.')->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return response()->json(['page' => 'Tenant Dashboard', 'message' => 'Inertia.js will be configured in Phase 2']);
    })->name('dashboard');

    // FAQ Management
    // Route::resource('faq-categories', \App\Http\Controllers\Tenant\FaqCategoryController::class);
    // Route::resource('faqs', \App\Http\Controllers\Tenant\FaqController::class);

    // Channel Management
    // Route::resource('channels', \App\Http\Controllers\Tenant\ChannelController::class);
    // Route::post('channels/{channel}/test', [\App\Http\Controllers\Tenant\ChannelController::class, 'test'])->name('channels.test');
    // Route::patch('channels/{channel}/toggle', [\App\Http\Controllers\Tenant\ChannelController::class, 'toggle'])->name('channels.toggle');

    // AI Settings
    // Route::get('/ai-settings', [\App\Http\Controllers\Tenant\AISettingsController::class, 'index'])->name('ai-settings.index');
    // Route::put('/ai-settings', [\App\Http\Controllers\Tenant\AISettingsController::class, 'update'])->name('ai-settings.update');

    // Conversations
    // Route::get('/conversations', [\App\Http\Controllers\Tenant\ConversationController::class, 'index'])->name('conversations.index');
    // Route::get('/conversations/{conversation}', [\App\Http\Controllers\Tenant\ConversationController::class, 'show'])->name('conversations.show');

    // Contacts
    // Route::resource('contacts', \App\Http\Controllers\Tenant\ContactController::class)->only(['index', 'show']);

    // Analytics
    // Route::get('/analytics', [\App\Http\Controllers\Tenant\AnalyticsController::class, 'index'])->name('analytics.index');

    // API Tokens
    // Route::get('/api-tokens', [\App\Http\Controllers\Tenant\ApiTokenController::class, 'index'])->name('api-tokens.index');
});
