import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Building2, Brain, CreditCard, FileText, Users, Settings, ChevronLeft, LogOut, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const superAdminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Tenantlar', href: '/admin/tenants', icon: Building2 },
    { name: 'AI Provider', href: '/admin/ai-providers', icon: Brain },
];

const tenantAdminNav = [
    { name: 'Dashboard', href: '/panel/dashboard', icon: LayoutDashboard },
    { name: 'FAQ', href: '/panel/faqs', icon: FileText },
    { name: 'Kanallar', href: '/panel/channels', icon: Bot },
    { name: 'Tənzimləmələr', href: '/panel/settings', icon: Settings },
];

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const user = auth?.user;
    const isSuperAdmin = user?.role === 'super_admin';
    const navItems = isSuperAdmin ? superAdminNav : tenantAdminNav;
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen overflow-hidden">
            <aside className={cn('flex flex-col border-r border-border bg-card transition-all duration-300', collapsed ? 'w-16' : 'w-64')}>
                <div className="flex h-16 items-center border-b border-border px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {!collapsed && <span className="text-lg font-bold tracking-tight">ChatBot</span>}
                    </div>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const isActive = currentPath.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-border p-3">
                    {!collapsed && user && (
                        <div className="mb-3 rounded-lg bg-secondary px-3 py-2">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                        <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
                        {!collapsed && <span>Daralt</span>}
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <div className="flex items-center gap-4">
                        {isSuperAdmin && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Super Admin</span>}
                        <Link href="/logout" method="post" as="button"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                            <LogOut className="h-4 w-4" /><span>Çıxış</span>
                        </Link>
                    </div>
                </header>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
