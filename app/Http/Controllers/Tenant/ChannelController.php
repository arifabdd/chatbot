<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use App\Services\Channel\ChannelManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChannelController extends Controller
{
    public function index(ChannelManager $channelManager)
    {
        $tenant = app('currentTenant');
        $channels = Channel::where('tenant_id', $tenant->id)->latest()->get();

        return Inertia::render('Tenant/Channels/Index', [
            'channels' => $channels,
            'availableDrivers' => $channelManager->getAvailableDrivers(),
        ]);
    }

    public function create()
    {
        $channelManager = app(ChannelManager::class);
        return Inertia::render('Tenant/Channels/Create', [
            'availableDrivers' => $channelManager->getAvailableDrivers(),
        ]);
    }

    public function store(Request $request)
    {
        $tenant = app('currentTenant');

        $validated = $request->validate([
            'driver' => 'required|string',
            'name' => 'required|string|max:255',
            'credentials' => 'required|array',
            'settings' => 'nullable|array',
        ]);

        $validated['tenant_id'] = $tenant->id;
        $validated['is_active'] = false;
        $validated['webhook_secret'] = bin2hex(random_bytes(16));

        Channel::create($validated);
        return redirect()->route('panel.channels.index')->with('success', 'Kanal yaradıldı.');
    }

    public function toggle(Channel $channel)
    {
        $tenant = app('currentTenant');
        abort_if($channel->tenant_id !== $tenant->id, 403);

        $channel->update(['is_active' => !$channel->is_active]);
        return redirect()->back()->with('success', $channel->is_active ? 'Kanal aktivləşdirildi.' : 'Kanal deaktiv edildi.');
    }

    public function destroy(Channel $channel)
    {
        $tenant = app('currentTenant');
        abort_if($channel->tenant_id !== $tenant->id, 403);
        $channel->delete();

        return redirect()->route('panel.channels.index')->with('success', 'Kanal silindi.');
    }
}
