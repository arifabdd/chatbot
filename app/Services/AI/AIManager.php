<?php

namespace App\Services\AI;

use App\Contracts\AIProviderContract;
use InvalidArgumentException;

class AIManager
{
    /**
     * Registered provider instances.
     *
     * @var array<string, AIProviderContract>
     */
    protected array $providers = [];

    public function __construct()
    {
        $this->registerProvidersFromConfig();
    }

    /**
     * Resolve a provider by its identifier.
     */
    public function provider(string $name): AIProviderContract
    {
        if (!isset($this->providers[$name])) {
            throw new InvalidArgumentException("AI provider [{$name}] is not registered.");
        }

        return $this->providers[$name];
    }

    /**
     * Get the default provider from global config.
     */
    public function defaultProvider(): AIProviderContract
    {
        $default = config('ai.default');

        return $this->provider($default);
    }

    /**
     * Register a provider instance.
     */
    public function register(string $name, AIProviderContract $provider): void
    {
        $this->providers[$name] = $provider;
    }

    /**
     * Get all registered providers.
     *
     * @return array<string, AIProviderContract>
     */
    public function getRegisteredProviders(): array
    {
        return $this->providers;
    }

    /**
     * Get available providers with display info (for admin panel).
     *
     * @return array<array{identifier: string, name: string, models: array, config_fields: array}>
     */
    public function getAvailableProviders(): array
    {
        $available = [];

        foreach ($this->providers as $identifier => $provider) {
            $available[] = [
                'identifier' => $identifier,
                'name' => $provider->getDisplayName(),
                'models' => $provider->getAvailableModels(),
                'config_fields' => $provider->getConfigFields(),
            ];
        }

        return $available;
    }

    /**
     * Check if a provider is registered.
     */
    public function hasProvider(string $name): bool
    {
        return isset($this->providers[$name]);
    }

    /**
     * Register providers from the ai config file.
     */
    protected function registerProvidersFromConfig(): void
    {
        $providers = config('ai.providers', []);

        foreach ($providers as $name => $providerClass) {
            if (class_exists($providerClass)) {
                $this->register($name, app($providerClass));
            }
        }
    }
}
