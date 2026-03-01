<?php

namespace App\Services\Channel\Drivers;

use App\Contracts\ChannelDriverContract;
use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppDriver implements ChannelDriverContract
{
    protected string $baseUrl = 'https://graph.facebook.com/v20.0';

    public function getIdentifier(): string
    {
        return 'whatsapp';
    }

    public function getDisplayName(): string
    {
        return 'WhatsApp (Meta Cloud API)';
    }

    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array
    {
        $credentials = $channel->credentials;
        $phoneNumberId = $credentials['phone_number_id'] ?? null;
        $accessToken = $credentials['access_token'] ?? null;

        if (!$phoneNumberId || !$accessToken) {
            throw new \Exception("WhatsApp credentials missing (phone_number_id or access_token).");
        }

        $response = Http::withToken($accessToken)
            ->post("{$this->baseUrl}/{$phoneNumberId}/messages", [
                'messaging_product' => 'whatsapp',
                'recipient_type' => 'individual',
                'to' => $to,
                'type' => 'text',
                'text' => [
                    'preview_url' => $options['preview_url'] ?? false,
                    'body' => $message,
                ],
            ]);

        if ($response->failed()) {
            Log::error("WhatsApp API Error: " . $response->body());
            throw new \Exception("WhatsApp API Error: " . ($response->json('error.message') ?? 'Unknown error'));
        }

        return $response->json();
    }

    public function parseWebhook(Request $request): array
    {
        $body = $request->all();

        // Basic WhatsApp Business API webhook parsing
        $entry = $body['entry'][0] ?? [];
        $change = $entry['changes'][0] ?? [];
        $value = $change['value'] ?? [];
        $message = $value['messages'][0] ?? null;

        if (!$message) {
            return [];
        }

        $contact = $value['contacts'][0] ?? [];

        return [
            'sender_id' => $message['from'],
            'sender_name' => $contact['profile']['name'] ?? $message['from'],
            'message' => $message['text']['body'] ?? '',
            'type' => $message['type'] ?? 'text',
            'external_id' => $message['id'],
            'raw' => $body,
        ];
    }

    public function verifyWebhook(Request $request, Channel $channel): Response
    {
        $verifyToken = $channel->credentials['verify_token'] ?? null;

        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        if ($mode === 'subscribe' && $token === $verifyToken) {
            return response($challenge, 200);
        }

        return response('Forbidden', 403);
    }

    public function getCredentialFields(): array
    {
        return [
            [
                'name' => 'phone_number_id',
                'label' => 'Phone Number ID',
                'type' => 'text',
                'required' => true,
                'help' => 'Found in App Dashboard > WhatsApp > Configuration',
            ],
            [
                'name' => 'waba_id',
                'label' => 'WhatsApp Business Account ID',
                'type' => 'text',
                'required' => true,
                'help' => 'Found in App Dashboard > WhatsApp > Configuration',
            ],
            [
                'name' => 'access_token',
                'label' => 'Permanent Access Token',
                'type' => 'password',
                'required' => true,
                'help' => 'System User Access Token with whatsapp_business_messaging permission',
            ],
            [
                'name' => 'verify_token',
                'label' => 'Webhook Verify Token',
                'type' => 'text',
                'required' => true,
                'help' => 'Any string you choose. Must match the one in Meta App Dashboard.',
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
            [
                'name' => 'welcome_message',
                'label' => 'Welcome Message',
                'type' => 'textarea',
                'default' => 'Salam! Sizə necə kömək edə bilərəm?',
            ],
        ];
    }

    public function validateCredentials(array $credentials): bool
    {
        return !empty($credentials['phone_number_id']) &&
            !empty($credentials['access_token']) &&
            !empty($credentials['verify_token']);
    }
}
