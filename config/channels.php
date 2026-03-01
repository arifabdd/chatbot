<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Channel Drivers
    |--------------------------------------------------------------------------
    |
    | Register messaging channel drivers here. Each driver must implement
    | the App\Contracts\ChannelDriverContract interface.
    |
    | To add a new platform:
    | 1. Create a driver class implementing ChannelDriverContract
    | 2. Add it to the 'drivers' array below
    | 3. Use the admin panel to add a channel with the new driver
    |
    */

    'drivers' => [
        'whatsapp' => \App\Services\Channel\Drivers\WhatsAppDriver::class,
        'telegram' => \App\Services\Channel\Drivers\TelegramDriver::class,
    ],

];
