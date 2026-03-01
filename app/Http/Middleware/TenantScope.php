<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantScope
{
    /**
     * Automatically scope all tenant-aware queries to the authenticated user's tenant.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || $user->isSuperAdmin()) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (!$tenant) {
            abort(403, 'No tenant associated with this user.');
        }

        if (!$tenant->isActive()) {
            abort(403, 'Your account has been suspended or your trial has expired.');
        }

        // Share tenant with the entire application
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
