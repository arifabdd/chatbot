<?php

namespace App\Jobs;

use App\Models\Channel;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\Channel\ChannelManager;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendOutgoingMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Conversation $conversation,
        public string $content,
        public string $source = 'faq',
        public array $options = []
    ) {
    }

    public function handle(ChannelManager $channelManager): void
    {
        $contact = $this->conversation->contact;
        $channel = $contact->channel;

        if (!$channel) {
            Log::error("Cannot send outgoing message: Channel not found for conversation {$this->conversation->id}");
            return;
        }

        try {
            $driver = $channelManager->forChannel($channel);

            // Send via driver
            $result = $driver->sendMessage($channel, $contact->identifier, $this->content, $this->options);

            // Record message in DB
            Message::create([
                'conversation_id' => $this->conversation->id,
                'tenant_id' => $this->conversation->tenant_id,
                'direction' => 'outgoing',
                'content' => $this->content,
                'type' => 'text',
                'source' => $this->source,
                'sent_at' => now(),
            ]);

            // Update conversation
            $this->conversation->update(['last_message_at' => now()]);

            Log::info("Outgoing message sent: [{$this->source}] to {$contact->identifier} through {$channel->driver}");
        } catch (\Exception $e) {
            Log::error("Failed to send outgoing message: {$e->getMessage()}", [
                'conversation_id' => $this->conversation->id,
                'content' => $this->content,
            ]);
        }
    }
}
