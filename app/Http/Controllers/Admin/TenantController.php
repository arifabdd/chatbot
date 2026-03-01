<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $tenants = Tenant::query()
            ->withCount(['users', 'channels'])
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'status', 'plan']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tenants/Create', ['plans' => config('plans')]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants',
            'plan_type' => 'required|in:free,pro,enterprise',
            'status' => 'required|in:active,suspended,trial',
            'ai_config' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $tenant = Tenant::create($validated);
        return redirect()->route('admin.tenants.show', $tenant)->with('success', 'Tenant yaradıldı.');
    }

    public function show(Tenant $tenant)
    {
        $tenant->loadCount(['users', 'channels']);
        $tenant->load(['channels', 'users']);

        return Inertia::render('Admin/Tenants/Show', ['tenant' => $tenant]);
    }

    public function edit(Tenant $tenant)
    {
        return Inertia::render('Admin/Tenants/Edit', [
            'tenant' => $tenant,
            'plans' => config('plans'),
        ]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug,' . $tenant->id,
            'plan_type' => 'required|in:free,pro,enterprise',
            'status' => 'required|in:active,suspended,trial',
            'ai_config' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        $tenant->update($validated);
        return redirect()->route('admin.tenants.show', $tenant)->with('success', 'Tenant yeniləndi.');
    }

    public function destroy(Tenant $tenant)
    {
        $tenant->delete();
        return redirect()->route('admin.tenants.index')->with('success', 'Tenant silindi.');
    }
}
