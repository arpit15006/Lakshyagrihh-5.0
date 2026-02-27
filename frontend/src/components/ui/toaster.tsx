import { useFleetStore, type Toast as ToastType } from '../../store/useFleetStore';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: () => void }) {
    const icons = {
        default: <Info className="h-4 w-4 text-blue-400" />,
        success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
        destructive: <AlertCircle className="h-4 w-4 text-red-400" />,
    };

    const borders = {
        default: 'border-blue-500/20',
        success: 'border-emerald-500/20',
        destructive: 'border-red-500/20',
    };

    const variant = toast.variant || 'default';

    return (
        <div className={`flex items-start gap-3 w-80 bg-zinc-900 border ${borders[variant]} rounded-xl p-4 shadow-2xl animate-in slide-in-from-right fade-in duration-300`}>
            <div className="flex-shrink-0 mt-0.5">{icons[variant]}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100">{toast.title}</p>
                {toast.description && <p className="text-xs text-zinc-400 mt-0.5">{toast.description}</p>}
            </div>
            <button onClick={onDismiss} className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

export function Toaster() {
    const toasts = useFleetStore((s) => s.toasts);
    const removeToast = useFleetStore((s) => s.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}
