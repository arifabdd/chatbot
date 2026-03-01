<?php

namespace App\Services\AI\Drivers;

use App\Contracts\AIProviderContract;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIDriver implements AIProviderContract
{
    protected string $baseUrl = 'https://api.openai.com/v1';

    public function getIdentifier(): string
    {
        return 'openai';
    }

    public function getDisplayName(): string
    {
        return 'OpenAI (GPT-4 / GPT-3.5)';
    }

    public function chat(array $messages, array $config = []): array
    {
        $apiKey = $config['api_key'] ?? config('ai.providers.openai.api_key');

        if (!$apiKey) {
            throw new \Exception("OpenAI API Key is missing.");
        }

        $response = Http::withToken($apiKey)->post("{$this->baseUrl}/chat/completions", [
            'model' => $config['model'] ?? 'gpt-3.5-turbo',
            'messages' => $messages,
            'temperature' => (float) ($config['temperature'] ?? 0.7),
            'max_tokens' => (int) ($config['max_tokens'] ?? 1000),
        ]);

        if ($response->failed()) {
            Log::error("OpenAI API Error: " . $response->body());
            throw new \Exception("OpenAI API Error: " . ($response->json('error.message') ?? 'Unknown error'));
        }

        $result = $response->json();

        return [
            'content' => $result['choices'][0]['message']['content'] ?? '',
            'model' => $result['model'] ?? '',
            'tokens_used' => $result['usage']['total_tokens'] ?? 0,
            'raw' => $result,
        ];
    }

    public function embed(string $text, array $config = []): array
    {
        $apiKey = $config['api_key'] ?? config('ai.providers.openai.api_key');

        $response = Http::withToken($apiKey)->post("{$this->baseUrl}/embeddings", [
            'model' => $config['embedding_model'] ?? 'text-embedding-3-small',
            'input' => $text,
        ]);

        if ($response->failed()) {
            Log::error("OpenAI Embedding Error: " . $response->body());
            return [];
        }

        return $response->json('data.0.embedding') ?? [];
    }

    public function getAvailableModels(): array
    {
        return [
            ['id' => 'gpt-4o', 'name' => 'GPT-4o (Latest)', 'description' => 'Fast and powerful'],
            ['id' => 'gpt-4-turbo', 'name' => 'GPT-4 Turbo', 'description' => 'Advanced reasoning'],
            ['id' => 'gpt-3.5-turbo', 'name' => 'GPT-3.5 Turbo', 'description' => 'Cost-effective and fast'],
        ];
    }

    public function getConfigFields(): array
    {
        return [
            [
                'name' => 'api_key',
                'label' => 'API Key',
                'type' => 'password',
                'required' => true,
            ],
            [
                'name' => 'default_model',
                'label' => 'Default Model',
                'type' => 'select',
                'options' => $this->getAvailableModels(),
                'required' => true,
            ],
            [
                'name' => 'system_prompt',
                'label' => 'System Prompt',
                'type' => 'textarea',
                'required' => false,
                'help' => 'Instructions for the AI assistant.',
            ],
        ];
    }

    public function validateApiKey(string $apiKey): bool
    {
        $response = Http::withToken($apiKey)->post("{$this->baseUrl}/chat/completions", [
            'model' => 'gpt-3.5-turbo',
            'messages' => [['role' => 'user', 'content' => 'hi']],
            'max_tokens' => 1,
        ]);

        return $response->successful();
    }
}
