import * as React from "react"
import { X } from 'lucide-react';

interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    side?: 'left' | 'right';
}

export function Sheet({ open, onOpenChange, children, side = 'right' }: SheetProps) {
    if (!open) return null;

    const sideClass = side === 'right'
        ? 'right-0 animate-in slide-in-from-right duration-300'
        : 'left-0 animate-in slide-in-from-left duration-300';

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
            <div className={`fixed top-0 ${sideClass} h-full w-full max-w-lg bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col`}>
                {children}
            </div>
        </div>
    );
}

export function SheetHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`flex flex-col space-y-2 p-6 border-b border-zinc-800 ${className}`}>{children}</div>
}

export function SheetTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <h2 className={`text-lg font-semibold text-zinc-100 ${className}`}>{children}</h2>
}

export function SheetDescription({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <p className={`text-sm text-zinc-400 ${className}`}>{children}</p>
}

export function SheetContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`flex-1 overflow-y-auto p-6 ${className}`}>{children}</div>
}

export function SheetFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-zinc-800 ${className}`}>{children}</div>
}

export function SheetClose({ onClose, className = "" }: { onClose: () => void; className?: string }) {
    return (
        <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors ${className}`}
        >
            <X className="h-4 w-4" />
        </button>
    );
}
