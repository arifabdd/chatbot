<?php

namespace App\Contracts;

interface AIProviderContract
{
    /**
     * Get the provider identifier (e.g., 'openai', 'claude').
     */
    public function getIdentifier(): string;

    /**
     * Get the display name for this provider.
     */
    public function getDisplayName(): string;

    /**
     * Generate a chat response.
     *
     * @param array $messages Conversation history [{role: 'user'|'assistant'|'system', content: string}]
     * @param array $config   Provider config (model, temperature, max_tokens, etc.)
     * @return array{content: string, model: string, tokens_used: int, raw: array}
     */
    public function chat(array $messages, array $config = []): array;

    /**
     * Generate embeddings for text (used by FAQ matching).
     *
     * @return array<float> Vector embedding
     */
    public function embed(string $text, array $config = []): array;

    /**
     * Get available models for this provider.
     *
     * @return array<array{id: string, name: string, description: ?string}>
     */
    public function getAvailableModels(): array;

    /**
     * Get the configuration fields for admin panel.
     *
     * @return array<array{name: string, label: string, type: string, required: bool}>
     */
    public function getConfigFields(): array;

    /**
     * Validate that the API key/credentials are correct.
     */
    public function validateApiKey(string $apiKey): bool;
}
