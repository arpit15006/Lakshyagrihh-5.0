import { Button } from '../ui/button';
import type { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon = PackageOpen, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-zinc-500" />
            </div>
            <h3 className="text-base font-semibold text-zinc-300 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500 text-center max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <Button className="mt-4" onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}
