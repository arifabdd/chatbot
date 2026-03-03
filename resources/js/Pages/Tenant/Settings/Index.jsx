import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Settings, Globe, Key, Sparkles } from 'lucide-react';

export default function Index() {
    const { auth, tenant } = usePage().props;

    return (
        <AdminLayout title="Tənzimləmələr">
            <Head title="Tənzimləmələr" />

            <div className="mx-auto max-w-3xl space-y-6 pb-20">
                {/* Account Info */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-primary">
                        <Settings className="h-5 w-5" />
                        <h2 className="text-lg font-semibold text-foreground">Hesab Məlumatları</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                            <span className="text-sm text-muted-foreground">Ad</span>
                            <span className="font-medium">{auth?.user?.name}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="font-medium">{auth?.user?.email}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                            <span className="text-sm text-muted-foreground">Rol</span>
                            <Badge variant="outline" className="capitalize">{auth?.user?.role}</Badge>
                        </div>
                    </div>
                </div>

                {/* Tenant Info */}
                {tenant && (
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 text-primary">
                            <Globe className="h-5 w-5" />
                            <h2 className="text-lg font-semibold text-foreground">Şirkət Məlumatları</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                                <span className="text-sm text-muted-foreground">Şirkət adı</span>
                                <span className="font-medium">{tenant.name}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={tenant.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                                    {tenant.status === 'active' ? 'Aktiv' : tenant.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3 border border-border/50">
                                <span className="text-sm text-muted-foreground">Plan</span>
                                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">{tenant.plan_type}</Badge>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Token */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm border-dashed">
                    <div className="mb-4 flex items-center gap-2 text-muted-foreground/50">
                        <Key className="h-5 w-5" />
                        <h2 className="text-lg font-semibold text-foreground">Gələcək İnteqrasiyalar</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Tezliklə öz sistemlərinizi (CRM, ERP və s.) platformamıza qoşmaq üçün şəxsi API tokenlərinizi buradan idarə edə biləcəksiniz.
                    </p>
                    <Button variant="outline" disabled className="text-xs opacity-50">
                        <Sparkles className="h-3 w-3 mr-1" /> API Token Yarat
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
