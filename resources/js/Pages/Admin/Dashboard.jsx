import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { StatCard } from '@/Components/ui/StatCard';
import { DataTable } from '@/Components/ui/DataTable';
import { Badge } from '@/Components/ui/Badge';
import { Building2, MessageSquare, Brain, Users, TrendingUp, Zap } from 'lucide-react';

export default function Dashboard({ stats, recentTenants }) {
    return (
        <AdminLayout title="Super Admin Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Aktiv Tenantlar" value={stats?.totalTenants ?? 0} change={stats?.tenantGrowth} trend="up" icon={Building2} />
                <StatCard title="Ümumi Mesajlar" value={stats?.totalMessages ?? 0} change={stats?.messageGrowth} trend="up" icon={MessageSquare} />
                <StatCard title="AI Sorğuları" value={stats?.aiRequests ?? 0} change={stats?.aiGrowth} trend="up" icon={Brain} />
                <StatCard title="Aktiv İstifadəçilər" value={stats?.totalUsers ?? 0} change={stats?.userGrowth} trend="up" icon={Users} />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Son Tenantlar</h2>
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <DataTable headers={['Ad', 'Plan', 'Status']}
                        rows={(recentTenants ?? []).map((t) => [
                            <span className="font-medium">{t.name}</span>,
                            <Badge variant={t.plan_type === 'pro' ? 'success' : 'secondary'}>{t.plan_type}</Badge>,
                            <Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status}</Badge>,
                        ])} />
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">AI İstifadəsi</h2>
                        <Zap className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">Aktiv Provider</span>
                            <span className="font-medium text-primary">{stats?.activeProvider ?? '—'}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">Aktiv Model</span>
                            <span className="font-medium">{stats?.activeModel ?? '—'}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">FAQ Uyğunluq</span>
                            <span className="font-medium text-success">{stats?.faqMatchRate ?? '0%'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
