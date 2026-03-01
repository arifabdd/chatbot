<?php

namespace App\Contracts;

use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

interface ChannelDriverContract
{
    /**
     * Get the driver identifier (e.g., 'whatsapp', 'telegram').
     */
    public function getIdentifier(): string;

    /**
     * Get the display name for this driver.
     */
    public function getDisplayName(): string;

    /**
     * Send a message through this channel.
     */
    public function sendMessage(Channel $channel, string $to, string $message, array $options = []): array;

    /**
     * Parse an incoming webhook request into a standardized message format.
     *
     * @return array{
     *     sender_id: string,
     *     sender_name: ?string,
     *     message: string,
     *     type: string,
     *     external_id: string,
     *     raw: array
     * }
     */
    public function parseWebhook(Request $request): array;

    /**
     * Verify a webhook request (e.g., WhatsApp verification challenge).
     */
    public function verifyWebhook(Request $request, Channel $channel): Response;

    /**
     * Get the credential fields required by this driver.
     * Used by admin panel to render dynamic forms.
     *
     * @return array<array{name: string, label: string, type: string, required: bool, help: ?string}>
     */
    public function getCredentialFields(): array;

    /**
     * Get the settings fields for this driver.
     *
     * @return array<array{name: string, label: string, type: string, default: mixed}>
     */
    public function getSettingsFields(): array;

    /**
     * Validate that the channel credentials are correct.
     */
    public function validateCredentials(array $credentials): bool;
}
