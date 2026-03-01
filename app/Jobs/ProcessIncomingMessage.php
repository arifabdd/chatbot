<?php

namespace App\Jobs;

use App\Models\Channel;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessIncomingMessage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Channel $channel,
        protected array $parsedMessage
    ) {
    }

    public function handle(): void
    {
        if (empty($this->parsedMessage)) {
            return;
        }

        $tenant = $this->channel->tenant;

        DB::transaction(function () use ($tenant) {
            // 1. Find or create Contact
            $contact = Contact::firstOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'identifier' => $this->parsedMessage['sender_id'],
                    'channel_id' => $this->channel->id,
                ],
                [
                    'name' => $this->parsedMessage['sender_name'] ?? 'Unknown',
                    'metadata' => [
                        'platform' => $this->channel->driver,
                    ],
                ]
            );

            // 2. Find or create active Conversation
            $conversation = Conversation::firstOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'contact_id' => $contact->id,
                    'channel_id' => $this->channel->id,
                    'status' => 'active',
                ],
                [
                    'last_message_at' => now(),
                ]
            );

            // 3. Save Message
            Message::create([
                'conversation_id' => $conversation->id,
                'tenant_id' => $tenant->id,
                'direction' => 'incoming',
                'content' => $this->parsedMessage['message'],
                'type' => $this->parsedMessage['type'] ?? 'text',
                'source' => 'manual',
                'sent_at' => now(),
            ]);

            // Update conversation last activity
            $conversation->update(['last_message_at' => now()]);

            // 4. Automated Response (FAQ or AI)
            $this->handleAutomatedResponse($tenant, $conversation);

            Log::info("Incoming message processed: {$this->parsedMessage['message']} from {$contact->identifier}");
        });
    }

    protected function handleAutomatedResponse($tenant, $conversation): void
    {
        // 1. Try FAQ Match
        $faqMatcher = app(\App\Services\Intelligence\FaqMatcher::class);
        $match = $faqMatcher->match($tenant, $this->parsedMessage['message']);

        if ($match) {
            SendOutgoingMessage::dispatch($conversation, $match->answer, 'faq');
            return;
        }

        // 2. Fallback to AI if enabled
        $aiConfig = $tenant->ai_config ?? [];
        $providerName = $aiConfig['provider'] ?? config('ai.default');

        if ($providerName && ($aiConfig['is_enabled'] ?? false)) {
            try {
                $aiManager = app(\App\Services\AI\AIManager::class);
                $provider = $aiManager->provider($providerName);

                $history = $conversation->getAiChatHistory(10);

                // Add system prompt if exists
                if (!empty($aiConfig['system_prompt'])) {
                    array_unshift($history, [
                        'role' => 'system',
                        'content' => $aiConfig['system_prompt']
                    ]);
                }

                $aiResponse = $provider->chat($history, [
                    'model' => $aiConfig['model'] ?? null,
                    'api_key' => $aiConfig['api_key'] ?? null,
                ]);

                if (!empty($aiResponse['content'])) {
                    SendOutgoingMessage::dispatch($conversation, $aiResponse['content'], 'ai');
                }
            } catch (\Exception $e) {
                Log::error("AI Response failed: " . $e->getMessage());
            }
        }
    }
}
