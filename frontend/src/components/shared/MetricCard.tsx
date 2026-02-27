import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    iconColor?: string;
    className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, iconColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30', className = '' }: MetricCardProps) {
    return (
        <div className={`h-full rounded-xl border border-border bg-card p-5 flex flex-col justify-between transition-all ${className}`}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                            <span className="text-muted-foreground/70">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
