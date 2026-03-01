import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Badge } from '@/Components/ui/Badge';
import { Brain, Cpu, Zap, Settings } from 'lucide-react';

export default function Index({ providers, currentDefault, globalSettings }) {
    return (
        <AdminLayout title="AI Provider İdarəsi">
            <Head title="AI Providers" />

            {/* Current Config */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3"><Brain className="h-5 w-5 text-primary" /></div>
                        <div>
                            <p className="text-sm text-muted-foreground">Aktiv Provider</p>
                            <p className="text-lg font-semibold text-primary">{currentDefault ?? 'Tənzimlənməyib'}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3"><Cpu className="h-5 w-5 text-primary" /></div>
                        <div>
                            <p className="text-sm text-muted-foreground">Default Model</p>
                            <p className="text-lg font-semibold">{globalSettings?.default_model ?? '—'}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-3"><Zap className="h-5 w-5 text-primary" /></div>
                        <div>
                            <p className="text-sm text-muted-foreground">FAQ Threshold</p>
                            <p className="text-lg font-semibold">{globalSettings?.faq_similarity_threshold ?? 0.75}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Providers List */}
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Qeydiyyatda olan Providerlər</h2>
                </div>
                <div className="space-y-3">
                    {(providers ?? []).length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Heç bir AI provider qeydiyyata alınmayıb. <code>config/ai.php</code> faylını yoxlayın.
                        </p>
                    ) : (
                        providers.map((provider) => (
                            <div key={provider.identifier} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Brain className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">{provider.name}</p>
                                        <p className="text-xs text-muted-foreground">{provider.identifier}</p>
                                    </div>
                                </div>
                                <Badge variant={provider.identifier === currentDefault ? 'success' : 'outline'}>
                                    {provider.identifier === currentDefault ? 'Aktiv' : 'Deaktiv'}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
                💡 Provider tənzimləmələrini dəyişmək üçün <code className="text-primary">config/ai.php</code> və ya <code className="text-primary">.env</code> fayllarını redaktə edin. Gələcəkdə bu UI-dan birbaşa dəyişmək mümkün olacaq.
            </p>
        </AdminLayout>
    );
}
