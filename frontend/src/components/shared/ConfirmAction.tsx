import { AlertTriangle } from 'lucide-react';

interface ConfirmActionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
}

export function ConfirmAction({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    variant = 'default',
    onConfirm,
}: ConfirmActionProps) {
    if (!open) return null;

    const isDestructive = variant === 'destructive';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
            <div className="relative z-50 w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl animate-in fade-in">
                <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDestructive ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                        <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-red-500' : 'text-amber-500'}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onOpenChange(false); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDestructive
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
