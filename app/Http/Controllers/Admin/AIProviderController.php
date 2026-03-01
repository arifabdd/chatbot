<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AI\AIManager;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AIProviderController extends Controller
{
    public function index(AIManager $aiManager)
    {
        return Inertia::render('Admin/AIProviders/Index', [
            'providers' => $aiManager->getAvailableProviders(),
            'currentDefault' => config('ai.default'),
            'globalSettings' => config('ai.settings'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'default_provider' => 'required|string',
        ]);

        return redirect()->back()->with('success', 'AI tənzimləmələri yeniləndi.');
    }
}
