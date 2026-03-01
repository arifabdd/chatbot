<?php

namespace App\Services\Intelligence;

use App\Models\Faq;
use App\Models\Tenant;
use Illuminate\Support\Collection;

class FaqMatcher
{
    /**
     * Find the best matching FAQ for the given query and tenant.
     * Returns null if no match is found above the threshold.
     */
    public function match(Tenant $tenant, string $query): ?Faq
    {
        $query = trim(mb_strtolower($query));

        if (empty($query)) {
            return null;
        }

        // 1. Exact match (case-insensitive)
        $exactMatch = Faq::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->whereRaw('LOWER(question) = ?', [$query])
            ->first();

        if ($exactMatch) {
            return $exactMatch;
        }

        // 2. Keyword/Partial match
        // We look for FAQs where the question contains the query or vice-versa
        $partialMatch = Faq::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->whereRaw('LOWER(question) LIKE ?', ["%{$query}%"])
                    ->orWhereRaw('? LIKE CONCAT("%", LOWER(question), "%")', [$query]);
            })
            ->first();

        return $partialMatch;
    }

    /**
     * Get a list of potential matches (for suggestions).
     */
    public function suggest(Tenant $tenant, string $query, int $limit = 3): Collection
    {
        $query = trim(mb_strtolower($query));

        return Faq::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->whereRaw('LOWER(question) LIKE ?', ["%{$query}%"])
            ->limit($limit)
            ->get();
    }
}
