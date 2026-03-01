import { cn } from '@/lib/utils';

export function StatCard({ title, value, change, icon: Icon, trend, className }) {
    return (
        <div className={cn('group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5', className)}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {change && (
                        <p className={cn('flex items-center gap-1 text-xs font-medium', trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground')}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}
