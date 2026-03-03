<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\Channel\ChannelManager;
use App\Jobs\ProcessIncomingMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ChannelWebhookController extends Controller
{
    public function __construct(
        protected ChannelManager $channelManager
    ) {
    }

    /**
     * Handle incoming webhook messages.
     * POST /webhook/{driver}/{tenant}
     */
    public function handle(Request $request, string $driver, Tenant $tenant): Response
    {
        Log::debug("Webhook request received", [
            'driver' => $driver,
            'tenant' => $tenant->slug,
            'ip' => $request->ip(),
            'payload' => $request->all()
        ]);

        // Check if the driver is registered
        if (!$this->channelManager->hasDriver($driver)) {
            Log::warning("Webhook received for unregistered driver: {$driver}");
            return response('Unknown driver', 404);
        }

        // Find the active channel for this tenant and driver
        $channel = $tenant->channels()
            ->where('driver', $driver)
            ->where('is_active', true)
            ->first();

        if (!$channel) {
            Log::warning("Webhook received for inactive or missing channel: {$driver} / tenant: {$tenant->slug}");
            return response('Channel not found', 404);
        }

        // Check tenant is active
        if (!$tenant->isActive()) {
            Log::info("Webhook ignored for inactive tenant: {$tenant->slug}");
            return response('OK', 200);
        }

        try {
            // Parse the incoming message using the driver
            $channelDriver = $this->channelManager->driver($driver);
            $parsedMessage = $channelDriver->parseWebhook($request);

            // Dispatch to queue for processing
            ProcessIncomingMessage::dispatch($channel, $parsedMessage);

            return response('OK', 200);
        } catch (\Exception $e) {
            Log::error("Webhook processing error: {$e->getMessage()}", [
                'driver' => $driver,
                'tenant' => $tenant->slug,
                'exception' => $e,
            ]);

            return response('Error', 500);
        }
    }

    /**
     * Verify webhook (e.g., WhatsApp verification challenge).
     * GET /webhook/{driver}/{tenant}
     */
    public function verify(Request $request, string $driver, Tenant $tenant): Response
    {
        if (!$this->channelManager->hasDriver($driver)) {
            return response('Unknown driver', 404);
        }

        $channel = $tenant->channels()
            ->where('driver', $driver)
            ->first();

        if (!$channel) {
            return response('Channel not found', 404);
        }

        $channelDriver = $this->channelManager->driver($driver);

        return $channelDriver->verifyWebhook($request, $channel);
    }
}
