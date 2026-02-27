import { AlertTriangle } from 'lucide-react';

interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
}

export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    variant = 'default',
}: AlertDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
            <div className="relative z-50 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${variant === 'destructive' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                        <AlertTriangle className={`h-5 w-5 ${variant === 'destructive' ? 'text-red-400' : 'text-amber-400'}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{description}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 border-t border-zinc-800 pt-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onOpenChange(false); }}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${variant === 'destructive'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
