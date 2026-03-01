<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlan
{
    /**
     * Check if the tenant's plan allows the requested action.
     * Can be extended with specific plan feature checks.
     */
    public function handle(Request $request, Closure $next, string ...$features): Response
    {
        $user = $request->user();

        if (!$user || $user->isSuperAdmin()) {
            return $next($request);
        }

        $tenant = app('currentTenant');

        if (!$tenant) {
            abort(403, 'No tenant context.');
        }

        // Check plan-specific features if needed
        foreach ($features as $feature) {
            if (!$this->tenantHasFeature($tenant, $feature)) {
                abort(403, "Your plan does not include the '{$feature}' feature. Please upgrade.");
            }
        }

        return $next($request);
    }

    protected function tenantHasFeature($tenant, string $feature): bool
    {
        $planFeatures = config("plans.{$tenant->plan_type}.features", []);

        return in_array($feature, $planFeatures);
    }
}
