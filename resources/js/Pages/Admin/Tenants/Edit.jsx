import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ tenant, plans }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name || '',
        slug: tenant.slug || '',
        plan_type: tenant.plan_type || 'free',
        status: tenant.status || 'trial',
        ai_config: tenant.ai_config || {
            provider: 'openai',
            model: 'gpt-4o',
            system_prompt: '',
        },
        settings: tenant.settings || {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/tenants/${tenant.id}`);
    };

    return (
        <AdminLayout title={`Redaktə: ${tenant.name}`}>
            <Head title={`Redaktə: ${tenant.name}`} />

            <div className="mb-6">
                <Link href={`/admin/tenants/${tenant.id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Geri qayıt
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Əsas Məlumatlar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Ad</label>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Slug</label>
                            <Input
                                value={data.slug}
                                onChange={e => setData('slug', e.target.value)}
                            />
                            {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Plan</label>
                                <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.plan_type}
                                    onChange={e => setData('plan_type', e.target.value)}
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                                {errors.plan_type && <p className="text-xs text-destructive">{errors.plan_type}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="trial">Trial</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Konfiqurasiyası</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Provider</label>
                                <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={data.ai_config.provider}
                                    onChange={e => setData('ai_config', { ...data.ai_config, provider: e.target.value })}
                                >
                                    <option value="openai">OpenAI</option>
                                    <option value="claude">Claude</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Model</label>
                                <Input
                                    value={data.ai_config.model}
                                    onChange={e => setData('ai_config', { ...data.ai_config, model: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">System Prompt</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={data.ai_config.system_prompt}
                                onChange={e => setData('ai_config', { ...data.ai_config, system_prompt: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Link href={`/admin/tenants/${tenant.id}`}>
                        <Button variant="ghost">Ləğv et</Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" /> Yadda saxla
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
