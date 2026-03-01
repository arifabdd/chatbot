<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        $faqs = Faq::where('tenant_id', $tenant->id)
            ->with('category:id,name')
            ->when($request->search, fn($q, $s) => $q->where('question', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = FaqCategory::where('tenant_id', $tenant->id)->orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('Tenant/Faqs/Index', [
            'faqs' => $faqs,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        $tenant = app('currentTenant');
        $categories = FaqCategory::where('tenant_id', $tenant->id)->orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('Tenant/Faqs/Create', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $tenant = app('currentTenant');

        $validated = $request->validate([
            'faq_category_id' => 'required|exists:faq_categories,id',
            'question' => 'required|string|max:1000',
            'answer' => 'required|string|max:5000',
            'keywords' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['tenant_id'] = $tenant->id;
        Faq::create($validated);

        return redirect()->route('panel.faqs.index')->with('success', 'FAQ yaradıldı.');
    }

    public function edit(Faq $faq)
    {
        $tenant = app('currentTenant');
        abort_if($faq->tenant_id !== $tenant->id, 403);
        $categories = FaqCategory::where('tenant_id', $tenant->id)->orderBy('sort_order')->get(['id', 'name']);

        return Inertia::render('Tenant/Faqs/Edit', ['faq' => $faq, 'categories' => $categories]);
    }

    public function update(Request $request, Faq $faq)
    {
        $tenant = app('currentTenant');
        abort_if($faq->tenant_id !== $tenant->id, 403);

        $validated = $request->validate([
            'faq_category_id' => 'required|exists:faq_categories,id',
            'question' => 'required|string|max:1000',
            'answer' => 'required|string|max:5000',
            'keywords' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);
        return redirect()->route('panel.faqs.index')->with('success', 'FAQ yeniləndi.');
    }

    public function destroy(Faq $faq)
    {
        $tenant = app('currentTenant');
        abort_if($faq->tenant_id !== $tenant->id, 403);
        $faq->delete();

        return redirect()->route('panel.faqs.index')->with('success', 'FAQ silindi.');
    }
}
