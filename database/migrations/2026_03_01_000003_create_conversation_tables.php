<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('channel_id')->constrained()->cascadeOnDelete();
            $table->string('identifier')->comment('Phone number, username, chat_id, etc.');
            $table->string('name')->nullable();
            $table->json('metadata')->nullable()->comment('Extra info: avatar, language, etc.');
            $table->json('tags')->nullable()->comment('Contact tags for segmentation');
            $table->timestamps();

            $table->unique(['tenant_id', 'channel_id', 'identifier']);
            $table->index(['tenant_id']);
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('channel_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'closed', 'archived'])->default('active');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['contact_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->enum('direction', ['incoming', 'outgoing']);
            $table->text('content')->nullable();
            $table->enum('type', ['text', 'image', 'document', 'audio', 'video', 'location', 'sticker'])->default('text');
            $table->enum('source', ['faq', 'ai', 'manual', 'system', 'template'])->nullable()->comment('How the outgoing message was generated');
            $table->json('ai_metadata')->nullable()->comment('AI model, tokens used, confidence, etc.');
            $table->json('media')->nullable()->comment('Media URL, file path, mime type');
            $table->string('external_id')->nullable()->comment('Platform message ID');
            $table->enum('status', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
            $table->index(['tenant_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('contacts');
    }
};
