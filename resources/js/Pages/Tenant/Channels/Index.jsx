import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Bot, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Index({ channels, availableDrivers }) {
    return (
        <AdminLayout title="Kanal İdarəsi">
            <Head title="Kanallar" />
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Kanallarınızı idarə edin</p>
                <Link href="/panel/channels/create"><Button><Plus className="h-4 w-4" /> Yeni Kanal</Button></Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(channels ?? []).length === 0 ? (
                    <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center">
                        <Bot className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Heç bir kanal yoxdur</h3>
                        <p className="mt-1 text-sm text-muted-foreground">İlk kanalınızı əlavə edib mesajlaşmağa başlayın.</p>
                        <Link href="/panel/channels/create" className="mt-4 inline-block"><Button variant="secondary"><Plus className="h-4 w-4" /> Kanal Əlavə Et</Button></Link>
                    </div>
                ) : channels.map((channel) => (
                    <div key={channel.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Bot className="h-5 w-5 text-primary" /></div>
                                    <div><h3 className="font-semibold">{channel.name}</h3><p className="text-xs text-muted-foreground">{channel.driver}</p></div>
                                </div>
                                <Badge variant={channel.is_active ? 'success' : 'secondary'}>{channel.is_active ? 'Aktiv' : 'Deaktiv'}</Badge>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => router.patch(`/panel/channels/${channel.id}/toggle`)}>
                                    {channel.is_active ? <><ToggleRight className="h-4 w-4" /> Deaktiv Et</> : <><ToggleLeft className="h-4 w-4" /> Aktiv Et</>}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { if (confirm('Kanalı silmək istədiyinizdən əminsiniz?')) router.delete(`/panel/channels/${channel.id}`); }}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
