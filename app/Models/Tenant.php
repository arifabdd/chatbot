<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'plan_type',
        'ai_config',
        'settings',
        'status',
        'trial_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'ai_config' => 'array',
            'settings' => 'array',
            'trial_ends_at' => 'datetime',
        ];
    }

    // ── Relationships ────────────────────────────────────

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class);
    }

    public function faqCategories(): HasMany
    {
        return $this->hasMany(FaqCategory::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // ── Helpers ──────────────────────────────────────────

    public function activeChannels(): HasMany
    {
        return $this->channels()->where('is_active', true);
    }

    public function getAiProvider(): ?string
    {
        return $this->ai_config['provider'] ?? null;
    }

    public function getAiModel(): ?string
    {
        return $this->ai_config['model'] ?? null;
    }

    public function getSystemPrompt(): ?string
    {
        return $this->ai_config['system_prompt'] ?? null;
    }

    public function isActive(): bool
    {
        return $this->status === 'active' || ($this->status === 'trial' && $this->trial_ends_at?->isFuture());
    }
}
