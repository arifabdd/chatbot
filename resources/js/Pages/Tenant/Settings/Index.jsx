import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { Settings, Globe, Bot, Key, Sparkles } from 'lucide-react';

export default function Index() {
    const { auth, tenant } = usePage().props;

    return (
        <AdminLayout title="Tənzimləmələr">
            <Head title="Tənzimləmələr" />

            <div className="mx-auto max-w-3xl space-y-6">
                {/* Account Info */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Hesab Məlumatları</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">Ad</span>
                            <span className="font-medium">{auth?.user?.name}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="font-medium">{auth?.user?.email}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="text-sm text-muted-foreground">Rol</span>
                            <Badge variant="default">{auth?.user?.role}</Badge>
                        </div>
                    </div>
                </div>

                {/* Tenant Info */}
                {tenant && (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Şirkət Məlumatları</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                <span className="text-sm text-muted-foreground">Şirkət adı</span>
                                <span className="font-medium">{tenant.name}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                <span className="text-sm text-muted-foreground">Plan</span>
                                <Badge variant="success">{tenant.plan_type}</Badge>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Token */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">API Token</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        API tokeniniz ilə xarici inteqrasiyalar qura bilərsiniz. Token yaradıldıqdan sonra bir dəfə göstərilir.
                    </p>
                    <Button variant="secondary" disabled>
                        <Sparkles className="h-4 w-4" /> Token Yarat (Tezliklə)
                    </Button>
                </div>

                {/* AI Config */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">AI Tənzimləmələri</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        AI tənzimləmələri (system prompt, temperatur, model seçimi) gələcək versiyalarda bu bölmədən idarə olunacaq. Hal-hazırda super admin tərəfindən qlobal tənzimlənir.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
