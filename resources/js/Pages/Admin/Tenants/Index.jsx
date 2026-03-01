import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Input } from '@/Components/ui/Input';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ tenants, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/tenants', { search }, { preserveState: true });
    }

    return (
        <AdminLayout title="Tenantlar">
            <Head title="Tenantlar" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Tenant axtar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 pl-9" />
                    </div>
                    <Button type="submit" variant="secondary" size="sm">Axtar</Button>
                </form>
                <Link href="/admin/tenants/create">
                    <Button><Plus className="h-4 w-4" /> Yeni Tenant</Button>
                </Link>
            </div>

            <DataTable
                headers={['Ad', 'Plan', 'Status', 'İstifadəçilər', 'Kanallar', 'Əməliyyatlar']}
                rows={(tenants?.data ?? []).map((tenant) => [
                    <div>
                        <span className="font-medium">{tenant.name}</span>
                        <p className="text-xs text-muted-foreground">{tenant.slug}</p>
                    </div>,
                    <Badge variant={tenant.plan_type === 'enterprise' ? 'default' : tenant.plan_type === 'pro' ? 'success' : 'secondary'}>
                        {tenant.plan_type}
                    </Badge>,
                    <Badge variant={tenant.status === 'active' ? 'success' : tenant.status === 'trial' ? 'warning' : 'destructive'}>
                        {tenant.status}
                    </Badge>,
                    <span className="text-sm">{tenant.users_count ?? 0}</span>,
                    <span className="text-sm">{tenant.channels_count ?? 0}</span>,
                    <div className="flex items-center gap-1">
                        <Link href={`/admin/tenants/${tenant.id}`}>
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => {
                            if (confirm('Bu tenantı silmək istədiyinizdən əminsiniz?')) router.delete(`/admin/tenants/${tenant.id}`);
                        }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>,
                ])}
                emptyMessage="Hələ tenant yaradılmayıb."
            />

            {tenants?.links && (
                <div className="mt-4 flex items-center justify-center gap-1">
                    {tenants.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'}
                            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-primary text-primary-foreground' : link.url ? 'text-muted-foreground hover:bg-accent' : 'text-muted-foreground/30'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
