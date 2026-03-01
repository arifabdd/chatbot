import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { StatCard } from '@/Components/ui/StatCard';
import { Badge } from '@/Components/ui/Badge';
import { MessageSquare, Brain, HelpCircle, Users, Bot } from 'lucide-react';

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Bu ay mesajlar" value={stats?.monthlyMessages ?? 0} icon={MessageSquare} />
                <StatCard title="AI Cavabları" value={stats?.aiResponses ?? 0} icon={Brain} />
                <StatCard title="FAQ Cavabları" value={stats?.faqResponses ?? 0} icon={HelpCircle} />
                <StatCard title="Aktiv Söhbətlər" value={stats?.activeConversations ?? 0} icon={Users} />
            </div>
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Aktiv Kanallar</h2>
                {(stats?.channels ?? []).length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">Heç bir kanal qoşulmayıb. <span className="text-primary">Kanallar</span> bölməsindən əlavə edin.</p>
                ) : (stats?.channels ?? []).map((ch, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                            <Bot className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{ch.name}</span>
                        </div>
                        <Badge variant={ch.is_active ? 'success' : 'secondary'}>{ch.is_active ? 'Aktiv' : 'Deaktiv'}</Badge>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
