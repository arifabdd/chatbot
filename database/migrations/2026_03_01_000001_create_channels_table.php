<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('driver')->comment('Driver identifier: whatsapp, telegram, etc.');
            $table->string('name')->comment('Display name for admin panel');
            $table->json('credentials')->nullable()->comment('Driver-specific credentials (encrypted)');
            $table->json('settings')->nullable()->comment('Driver-specific settings');
            $table->boolean('is_active')->default(false);
            $table->string('webhook_secret')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'driver']);
            $table->index(['driver', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
};
