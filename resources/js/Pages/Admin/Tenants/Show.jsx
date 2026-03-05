import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card';
import { StatCard } from '@/Components/ui/StatCard';
import { DataTable } from '@/Components/ui/DataTable';
import { ArrowLeft, Edit, Users, MessageSquare, Bot, Settings } from 'lucide-react';

export default function Show({ tenant }) {
    return (
        <AdminLayout title={tenant.name}>
            <Head title={tenant.name} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/tenants" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Siyahıya qayıt
                </Link>
                <Link href={`/admin/tenants/${tenant.id}/edit`}>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Redaktə et</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <StatCard title="İstifadəçilər" value={tenant.users_count} icon={Users} />
                <StatCard title="Kanallar" value={tenant.channels_count} icon={MessageSquare} />
                <StatCard title="Status" value={tenant.status.toUpperCase()} icon={Settings} />
                <StatCard title="Plan" value={tenant.plan_type.toUpperCase()} icon={Bot} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kanallar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                headers={['Ad', 'Platforma', 'Status']}
                                rows={tenant.channels.map(channel => [
                                    <span className="font-medium">{channel.name}</span>,
                                    <Badge variant="secondary">{channel.driver}</Badge>,
                                    <Badge variant={channel.is_active ? 'success' : 'destructive'}>
                                        {channel.is_active ? 'Aktiv' : 'Passiv'}
                                    </Badge>
                                ])}
                                emptyMessage="Bu tenantın hələ kanalı yoxdur."
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>İstifadəçilər</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                headers={['Ad', 'Email', 'Rol']}
                                rows={tenant.users.map(user => [
                                    user.name,
                                    user.email,
                                    <Badge variant="outline">{user.role}</Badge>
                                ])}
                                emptyMessage="Bu tenantın hələ istifadəçisi yoxdur."
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Məlumatları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Provider</p>
                                <p className="font-medium uppercase">{tenant.ai_config?.provider ?? 'Default'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Model</p>
                                <p className="font-medium underline decoration-primary/30">{tenant.ai_config?.model ?? 'gpt-4o'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">System Prompt</p>
                                <p className="mt-1 text-sm text-balance bg-muted/50 p-3 rounded-lg border border-border italic">
                                    {tenant.ai_config?.system_prompt || 'Təyin edilməyib'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tenant Detalları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">ID</p>
                                <p className="font-mono text-sm">{tenant.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Slug</p>
                                <p className="font-mono text-sm">{tenant.slug}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Yaradılıb</p>
                                <p className="text-sm">{new Date(tenant.created_at).toLocaleDateString('az-AZ')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
