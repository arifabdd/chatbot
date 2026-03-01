<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Plans Configuration
    |--------------------------------------------------------------------------
    |
    | Define the features and limits for each plan type.
    |
    */

    'free' => [
        'name' => 'Free',
        'features' => ['faqs', 'channels', 'conversations'],
        'limits' => [
            'max_faqs' => 50,
            'max_channels' => 1,
            'max_messages_per_month' => 500,
            'ai_enabled' => false,
        ],
    ],

    'pro' => [
        'name' => 'Pro',
        'features' => ['faqs', 'channels', 'conversations', 'ai', 'analytics', 'templates', 'contacts'],
        'limits' => [
            'max_faqs' => 500,
            'max_channels' => 5,
            'max_messages_per_month' => 10000,
            'ai_enabled' => true,
        ],
    ],

    'enterprise' => [
        'name' => 'Enterprise',
        'features' => ['faqs', 'channels', 'conversations', 'ai', 'analytics', 'templates', 'contacts', 'api_access', 'webhooks'],
        'limits' => [
            'max_faqs' => -1, // unlimited
            'max_channels' => -1,
            'max_messages_per_month' => -1,
            'ai_enabled' => true,
        ],
    ],

];
