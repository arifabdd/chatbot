<?php

namespace App\Services\Channel\Drivers;

use App\Contracts\ChannelDriverContract;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramDriver implements ChannelDriverContract
{
    protected string $baseUrl = 'https://api.telegram.org/bot';

    public function getIdentifier(): string
    {
        return 'telegram';
    }

    public function getDisplayName(): string
    {
        return 'Telegram Bot API';
    }

    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array
    {
        $credentials = $channel->credentials;
        $botToken = $credentials['bot_token'] ?? null;

        if (!$botToken) {
            throw new \Exception("Telegram credentials missing (bot_token).");
        }

        $response = Http::post("{$this->baseUrl}{$botToken}/sendMessage", [
            'chat_id' => $to,
            'text' => $message,
            'parse_mode' => $options['parse_mode'] ?? 'HTML',
        ]);

        if ($response->failed()) {
            Log::error("Telegram API Error: " . $response->body());
            throw new \Exception("Telegram API Error: " . ($response->json('description') ?? 'Unknown error'));
        }

        return $response->json();
    }

    public function parseWebhook(Request $request): array
    {
        $body = $request->all();
        $message = $body['message'] ?? null;

        if (!$message) {
            return [];
        }

        return [
            'sender_id' => (string) ($message['from']['id'] ?? ''),
            'sender_name' => trim(($message['from']['first_name'] ?? '') . ' ' . ($message['from']['last_name'] ?? '')),
            'message' => $message['text'] ?? '',
            'type' => isset($message['text']) ? 'text' : 'other',
            'external_id' => (string) ($message['message_id'] ?? ''),
            'raw' => $body,
        ];
    }

    public function verifyWebhook(Request $request, Channel $channel): Response
    {
        // Telegram doesn't have a verification challenge like WhatsApp,
        // but we can verify the bot token in the URL if we want.
        return response('OK', 200);
    }

    public function getCredentialFields(): array
    {
        return [
            [
                'name' => 'bot_token',
                'label' => 'Bot Token',
                'type' => 'password',
                'required' => true,
                'help' => 'Get it from @BotFather',
            ],
            [
                'name' => 'bot_username',
                'label' => 'Bot Username',
                'type' => 'text',
                'required' => false,
                'help' => 'e.g., @my_chatbot',
            ],
        ];
    }

    public function getSettingsFields(): array
    {
        return [
            [
                'name' => 'auto_reply_enabled',
                'label' => 'Auto-reply Enabled',
                'type' => 'boolean',
                'default' => true,
            ],
        ];
    }

    public function validateCredentials(array $credentials): bool
    {
        return !empty($credentials['bot_token']);
    }
}
