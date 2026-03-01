import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Bot, Lock, Mail } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Daxil ol" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                            <Bot className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">ChatBot</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Admin panelinə daxil olun</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="admin@example.com" className="pl-9" autoFocus />
                                </div>
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Şifrə</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="••••••••" className="pl-9" />
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="h-4 w-4 rounded border-border" />
                                <span className="text-sm text-muted-foreground">Məni xatırla</span>
                            </label>
                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Daxil olunur...' : 'Daxil ol'}
                            </Button>
                        </form>
                    </div>
                    <p className="mt-6 text-center text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ChatBot Platform</p>
                </div>
            </div>
        </>
    );
}
