import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { Settings, Globe, Bot, Key, Sparkles, Save, CheckCircle } from 'lucide-react';

export default function Index() {
    const { auth, tenant } = usePage().props;

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        is_enabled: tenant?.ai_config?.is_enabled ?? false,
        api_key: tenant?.ai_config?.api_key ?? '',
        model: tenant?.ai_config?.model ?? 'gpt-3.5-turbo',
        system_prompt: tenant?.ai_config?.system_prompt ?? '',
        provider: tenant?.ai_config?.provider ?? 'openai',
    });

    const submitAi = (e) => {
        e.preventDefault();
        post('/panel/settings/ai', {
            preserveScroll: true,
        });
    };

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

                {/* AI Config */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <Bot className="h-5 w-5" />
                            <h2 className="text-lg font-semibold text-foreground">AI Tənzimləmələri</h2>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={data.is_enabled} onChange={e => setData('is_enabled', e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                            <span className="ml-3 text-sm font-medium text-muted-foreground">{data.is_enabled ? 'Aktiv' : 'Deaktiv'}</span>
                        </label>
                    </div>

                    <form onSubmit={submitAi} className={`space-y-6 transition-opacity duration-300 ${!data.is_enabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Provider</label>
                                <select className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={data.provider} onChange={e => setData('provider', e.target.value)}>
                                    <option value="openai">OpenAI</option>
                                    <option value="claude" disabled>Claude (Tezliklə)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Model</label>
                                <select className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={data.model} onChange={e => setData('model', e.target.value)}>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="gpt-4o">GPT-4o (Tövsiyə olunur)</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">API Key (OpenAI)</label>
                            <Input type="password" value={data.api_key} onChange={e => setData('api_key', e.target.value)} placeholder="sk-..." />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Açar bit-to-bit şifrələnmiş şəkildə saxlanılır</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">System Prompt</label>
                            <textarea
                                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px]"
                                value={data.system_prompt}
                                onChange={e => setData('system_prompt', e.target.value)}
                                placeholder="Botun özünü necə aparması barədə təlimatlar (məs: Sən dostcasına cavab verən satış asistentisən)..."
                            />
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                                {recentlySuccessful && <><CheckCircle className="h-3 w-3 text-green-500" /> Dəyişikliklər yadda saxlanıldı</>}
                            </div>
                            <Button type="submit" disabled={processing} size="sm" className="px-8 shadow-lg shadow-primary/20">
                                {processing ? 'Yadda saxlanılır...' : <><Save className="h-4 w-4" /> Yadda Saxla</>}
                            </Button>
                        </div>
                    </form>
                </div>

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
