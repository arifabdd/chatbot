import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Input } from '@/Components/ui/Input';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

export default function Index({ faqs, categories, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function handleSearch(e) {
        e.preventDefault();
        router.get('/panel/faqs', { search }, { preserveState: true });
    }

    return (
        <AdminLayout title="FAQ İdarəsi">
            <Head title="FAQ" />
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="FAQ axtar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 pl-9" />
                    </div>
                    <Button type="submit" variant="secondary" size="sm">Axtar</Button>
                </form>
                <Link href="/panel/faqs/create">
                    <Button><Plus className="h-4 w-4" /> Yeni FAQ</Button>
                </Link>
            </div>
            <DataTable
                headers={['Sual', 'Kateqoriya', 'İstifadə', 'Status', 'Əməliyyatlar']}
                rows={(faqs?.data ?? []).map((faq) => [
                    <span className="max-w-sm truncate font-medium">{faq.question}</span>,
                    <Badge variant="outline">{faq.category?.name ?? '—'}</Badge>,
                    <span className="text-sm">{faq.usage_count}x</span>,
                    <Badge variant={faq.is_active ? 'success' : 'secondary'}>{faq.is_active ? 'Aktiv' : 'Deaktiv'}</Badge>,
                    <div className="flex items-center gap-1">
                        <Link href={`/panel/faqs/${faq.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                        <Button variant="ghost" size="icon" onClick={() => { if (confirm('Silmək istədiyinizdən əminsiniz?')) router.delete(`/panel/faqs/${faq.id}`); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>,
                ])}
                emptyMessage="Hələ FAQ yaradılmayıb."
            />
            {faqs?.links && (
                <div className="mt-4 flex items-center justify-center gap-1">
                    {faqs.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'}
                            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-primary text-primary-foreground' : link.url ? 'text-muted-foreground hover:bg-accent' : 'text-muted-foreground/30'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
