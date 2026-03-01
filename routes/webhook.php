<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Webhook Routes
|--------------------------------------------------------------------------
|
| Generic webhook endpoint for all channel drivers.
| The {driver} parameter is used to resolve the appropriate channel driver.
| The {tenant} parameter identifies which tenant this webhook belongs to.
|
*/

Route::prefix('webhook')->name('webhook.')->group(function () {

    // POST: Incoming messages from any channel driver
    Route::post('/{driver}/{tenant:slug}', [\App\Http\Controllers\Webhook\ChannelWebhookController::class, 'handle'])
        ->name('handle');

    // GET: Webhook verification (WhatsApp, etc.)
    Route::get('/{driver}/{tenant:slug}', [\App\Http\Controllers\Webhook\ChannelWebhookController::class, 'verify'])
        ->name('verify');
});
