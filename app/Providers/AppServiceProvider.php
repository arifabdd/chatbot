<?php

namespace App\Providers;

use App\Services\AI\AIManager;
use App\Services\Channel\ChannelManager;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register ChannelManager as singleton
        $this->app->singleton(ChannelManager::class, function ($app) {
            return new ChannelManager();
        });

        // Register AIManager as singleton
        $this->app->singleton(AIManager::class, function ($app) {
            return new AIManager();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
