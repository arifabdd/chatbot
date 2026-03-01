<?php

namespace Tests\Feature;

use App\Models\Channel;
use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Faq;
use App\Models\Tenant;
use App\Jobs\ProcessIncomingMessage;
use App\Jobs\SendOutgoingMessage;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class IntelligenceTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Bus::fake([SendOutgoingMessage::class]);
    }

    public function test_faq_match_dispatches_outgoing_message(): void
    {
        // 1. Setup
        $tenant = Tenant::create(['name' => 'Test', 'slug' => 'test-faq', 'status' => 'active']);
        $channel = Channel::create([
            'tenant_id' => $tenant->id,
            'driver' => 'telegram',
            'name' => 'Bot',
            'is_active' => true,
        ]);

        $faq = Faq::create([
            'tenant_id' => $tenant->id,
            'question' => 'What is your opening hours?',
            'answer' => 'We are open 24/7!',
            'is_active' => true,
        ]);

        $parsedMessage = [
            'sender_id' => '123',
            'sender_name' => 'John',
            'message' => 'Opening hours?', // Partial match
            'type' => 'text',
        ];

        // 2. Run Job
        $job = new ProcessIncomingMessage($channel, $parsedMessage);
        $job->handle();

        // 3. Assert
        Bus::assertDispatched(SendOutgoingMessage::class, function ($job) use ($faq) {
            return $job->content === $faq->answer && $job->source === 'faq';
        });
    }

    public function test_ai_fallback_dispatches_outgoing_message(): void
    {
        // 1. Setup
        $tenant = Tenant::create([
            'name' => 'Test',
            'slug' => 'test-ai',
            'status' => 'active',
            'ai_config' => [
                'is_enabled' => true,
                'provider' => 'openai',
                'model' => 'gpt-3.5-turbo',
                'api_key' => 'sk-test-key',
                'system_prompt' => 'Be a helpful assistant.',
            ]
        ]);

        $channel = Channel::create([
            'tenant_id' => $tenant->id,
            'driver' => 'telegram',
            'name' => 'Bot',
            'is_active' => true,
        ]);

        $parsedMessage = [
            'sender_id' => '123',
            'sender_name' => 'John',
            'message' => 'Tell me a joke.',
            'type' => 'text',
        ];

        // 2. Mock OpenAI API
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Why did the chicken cross the road?']]
                ],
                'model' => 'gpt-3.5-turbo',
                'usage' => ['total_tokens' => 15]
            ], 200),
        ]);

        // 3. Run Job
        $job = new ProcessIncomingMessage($channel, $parsedMessage);
        $job->handle();

        // 4. Assert
        Bus::assertDispatched(SendOutgoingMessage::class, function ($job) {
            return str_contains($job->content, 'chicken') && $job->source === 'ai';
        });
    }
}
