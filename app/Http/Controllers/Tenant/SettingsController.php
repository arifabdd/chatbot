<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $tenant = $user->tenant;

        return Inertia::render('Tenant/Settings/Index', [
            'tenant' => $tenant ? [
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'plan_type' => $tenant->plan_type,
                'status' => $tenant->status,
            ] : null,
        ]);
    }
}
