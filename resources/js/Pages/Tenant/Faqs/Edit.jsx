import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ faq, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        faq_category_id: faq.faq_category_id ?? '',
        new_category_name: '',
        question: faq.question ?? '',
        answer: faq.answer ?? '',
        keywords: faq.keywords ?? [],
        is_active: faq.is_active ?? true,
    });

    const [showNewCategory, setShowNewCategory] = useState(false);
    const [keywordInput, setKeywordInput] = useState('');

    const submit = (e) => {
        e.preventDefault();
        put(`/panel/faqs/${faq.id}`);
    };

    const addKeyword = () => {
        if (keywordInput.trim()) {
            setData('keywords', [...data.keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (index) => {
        setData('keywords', data.keywords.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout title="FAQ Redaktə Et">
            <Head title="FAQ Redaktə Et" />
            <Link href="/panel/faqs" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Geri
            </Link>
            <div className="mx-auto max-w-2xl">
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kateqoriya</label>
                        <div className="flex gap-2">
                            <select
                                value={showNewCategory ? 'new' : data.faq_category_id}
                                onChange={(e) => {
                                    if (e.target.value === 'new') {
                                        setShowNewCategory(true);
                                        setData('faq_category_id', '');
                                    } else {
                                        setShowNewCategory(false);
                                        setData({ ...data, faq_category_id: e.target.value, new_category_name: '' });
                                    }
                                }}
                                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="">Seçilməyib</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                                <option value="new">+ Yeni Kateqoriya Yarat</option>
                            </select>
                        </div>

                        {showNewCategory && (
                            <div className="mt-2">
                                <Input
                                    placeholder="Yeni kateqoriya adı..."
                                    value={data.new_category_name}
                                    onChange={(e) => setData('new_category_name', e.target.value)}
                                    autoFocus
                                />
                                {errors.new_category_name && <p className="text-sm text-destructive mt-1">{errors.new_category_name}</p>}
                            </div>
                        )}
                        {errors.faq_category_id && <p className="text-sm text-destructive mt-1">{errors.faq_category_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sual</label>
                        <Input
                            value={data.question}
                            onChange={(e) => setData('question', e.target.value)}
                            placeholder="Müştərilərin soruşacağı sual..."
                        />
                        {errors.question && <p className="text-sm text-destructive mt-1">{errors.question}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cavab</label>
                        <textarea
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={data.answer}
                            onChange={(e) => setData('answer', e.target.value)}
                            placeholder="Sualın cavabı..."
                            rows={5}
                        />
                        {errors.answer && <p className="text-sm text-destructive mt-1">{errors.answer}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Açar Sözlər</label>
                        <div className="flex gap-2">
                            <Input
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                placeholder="Açar söz əlavə edin..."
                            />
                            <Button type="button" variant="secondary" onClick={addKeyword}>Əlavə et</Button>
                        </div>
                        {data.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.keywords.map((kw, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        {kw} <button type="button" onClick={() => removeKeyword(i)} className="hover:text-destructive text-lg">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm font-medium">Aktiv</span>
                    </label>

                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
