<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tenant = $user->tenant;

        return Inertia::render('Tenant/Settings/Index', [
            'tenant' => $tenant ? [
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'plan_type' => $tenant->plan_type,
                'status' => $tenant->status,
                'ai_config' => $tenant->ai_config,
            ] : null,
        ]);
    }

    public function aiSettings(Request $request)
    {
        $tenant = app('currentTenant');
        return Inertia::render('Tenant/Settings/AiSettings', [
            'ai_config' => $tenant->ai_config,
        ]);
    }

    public function updateAi(Request $request)
    {
        $tenant = app('currentTenant');

        $validated = $request->validate([
            'is_enabled' => 'boolean',
            'api_key' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:50',
            'system_prompt' => 'nullable|string|max:5000',
        ]);

        $currentConfig = $tenant->ai_config ?? [];
        $tenant->update([
            'ai_config' => array_merge($currentConfig, $validated)
        ]);

        return redirect()->back()->with('success', 'AI tənzimləmələri yeniləndi.');
    }
}
