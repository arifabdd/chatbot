<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $stats = [
            'totalTenants' => Tenant::count(),
            'totalMessages' => Message::count(),
            'aiRequests' => Message::where('source', 'ai')->count(),
            'totalUsers' => User::where('role', '!=', 'super_admin')->count(),
            'activeProvider' => config('ai.default', 'Not configured'),
            'activeModel' => config('ai.settings.default_model', '—'),
            'monthlyTokens' => 0,
            'faqMatchRate' => '0%',
            'tenantGrowth' => '+0%',
            'messageGrowth' => '+0%',
            'aiGrowth' => '+0%',
            'userGrowth' => '+0%',
        ];

        $recentTenants = Tenant::latest()->take(5)->get(['id', 'name', 'plan_type', 'status']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentTenants' => $recentTenants,
        ]);
    }
}
