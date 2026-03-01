<?php

namespace App\Services\Channel;

use App\Contracts\ChannelDriverContract;
use App\Models\Channel;
use InvalidArgumentException;

class ChannelManager
{
    /**
     * Registered driver instances.
     *
     * @var array<string, ChannelDriverContract>
     */
    protected array $drivers = [];

    /**
     * Register all drivers from config.
     */
    public function __construct()
    {
        $this->registerDriversFromConfig();
    }

    /**
     * Resolve a driver by its identifier.
     */
    public function driver(string $name): ChannelDriverContract
    {
        if (!isset($this->drivers[$name])) {
            throw new InvalidArgumentException("Channel driver [{$name}] is not registered.");
        }

        return $this->drivers[$name];
    }

    /**
     * Resolve the driver for a Channel model.
     */
    public function forChannel(Channel $channel): ChannelDriverContract
    {
        return $this->driver($channel->driver);
    }

    /**
     * Register a driver instance.
     */
    public function register(string $name, ChannelDriverContract $driver): void
    {
        $this->drivers[$name] = $driver;
    }

    /**
     * Get all registered drivers.
     *
     * @return array<string, ChannelDriverContract>
     */
    public function getRegisteredDrivers(): array
    {
        return $this->drivers;
    }

    /**
     * Get available drivers with their display info (for admin panel).
     *
     * @return array<array{identifier: string, name: string, credential_fields: array, settings_fields: array}>
     */
    public function getAvailableDrivers(): array
    {
        $available = [];

        foreach ($this->drivers as $identifier => $driver) {
            $available[] = [
                'identifier' => $identifier,
                'name' => $driver->getDisplayName(),
                'credential_fields' => $driver->getCredentialFields(),
                'settings_fields' => $driver->getSettingsFields(),
            ];
        }

        return $available;
    }

    /**
     * Check if a driver is registered.
     */
    public function hasDriver(string $name): bool
    {
        return isset($this->drivers[$name]);
    }

    /**
     * Register drivers from the channels config file.
     */
    protected function registerDriversFromConfig(): void
    {
        $drivers = config('channels.drivers', []);

        foreach ($drivers as $name => $driverClass) {
            if (class_exists($driverClass)) {
                $this->register($name, app($driverClass));
            }
        }
    }
}
