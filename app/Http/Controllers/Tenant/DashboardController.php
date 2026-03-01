<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $tenant = app('currentTenant');

        $stats = [
            'monthlyMessages' => 0,
            'aiResponses' => 0,
            'faqResponses' => 0,
            'activeConversations' => 0,
            'channels' => $tenant ? $tenant->channels()->select('id', 'name', 'driver', 'is_active')->get() : [],
            'messageGrowth' => '+0%',
            'aiGrowth' => '+0%',
            'faqMatchRate' => '0%',
        ];

        return Inertia::render('Tenant/Dashboard', [
            'stats' => $stats,
            'topFaqs' => [],
            'recentConversations' => [],
        ]);
    }
}
