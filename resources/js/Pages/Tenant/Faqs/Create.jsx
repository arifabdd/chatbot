import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        faq_category_id: categories?.[0]?.id ?? '',
        question: '', answer: '', keywords: [], is_active: true,
    });
    const [keywordInput, setKeywordInput] = useState('');

    function handleSubmit(e) { e.preventDefault(); post('/panel/faqs'); }
    function addKeyword() { if (keywordInput.trim()) { setData('keywords', [...data.keywords, keywordInput.trim()]); setKeywordInput(''); } }
    function removeKeyword(i) { setData('keywords', data.keywords.filter((_, idx) => idx !== i)); }

    return (
        <AdminLayout title="Yeni FAQ">
            <Head title="Yeni FAQ" />
            <Link href="/panel/faqs" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Geri
            </Link>
            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kateqoriya</label>
                        <select value={data.faq_category_id} onChange={(e) => setData('faq_category_id', e.target.value)}
                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {(categories ?? []).map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        {errors.faq_category_id && <p className="text-sm text-destructive">{errors.faq_category_id}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sual</label>
                        <Input value={data.question} onChange={(e) => setData('question', e.target.value)} placeholder="Müştərilərin soruşacağı sual..." />
                        {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cavab</label>
                        <textarea value={data.answer} onChange={(e) => setData('answer', e.target.value)} placeholder="Sualın cavabı..." rows={5}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                        {errors.answer && <p className="text-sm text-destructive">{errors.answer}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Açar Sözlər</label>
                        <div className="flex gap-2">
                            <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())} placeholder="Açar söz əlavə edin..." />
                            <Button type="button" variant="secondary" onClick={addKeyword}>Əlavə et</Button>
                        </div>
                        {data.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.keywords.map((kw, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {kw} <button type="button" onClick={() => removeKeyword(i)} className="hover:text-destructive">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-border" />
                        <span className="text-sm font-medium">Aktiv</span>
                    </label>
                    <Button type="submit" disabled={processing} className="w-full">{processing ? 'Yaradılır...' : 'FAQ Yarat'}</Button>
                </form>
            </div>
        </AdminLayout>
    );
}
