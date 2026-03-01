<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | The default AI provider used when a tenant doesn't specify one.
    | Super admin can change this at any time.
    |
    */

    'default' => env('AI_DEFAULT_PROVIDER', 'openai'),

    /*
    |--------------------------------------------------------------------------
    | AI Providers
    |--------------------------------------------------------------------------
    |
    | Register AI provider drivers here. Each provider must implement
    | the App\Contracts\AIProviderContract interface.
    |
    | To add a new AI provider:
    | 1. Create a driver class implementing AIProviderContract
    | 2. Add it to the 'providers' array below
    |
    */

    'providers' => [
        'openai' => \App\Services\AI\Drivers\OpenAIDriver::class,
        // 'claude' => \App\Services\AI\Drivers\ClaudeDriver::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Global AI Settings
    |--------------------------------------------------------------------------
    |
    | These settings can be overridden per-tenant in the admin panel.
    |
    */

    'settings' => [
        'api_key' => env('AI_API_KEY'),
        'default_model' => env('AI_DEFAULT_MODEL', 'gpt-4o'),
        'temperature' => 0.7,
        'max_tokens' => 1024,
        'faq_similarity_threshold' => 0.85,
    ],

];
