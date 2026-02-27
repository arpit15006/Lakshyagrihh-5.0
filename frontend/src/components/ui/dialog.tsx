import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Dialog({
    children
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
    return children;
}

export function DialogContent({
    children,
    className = "",
    open,
    onOpenChange
}: {
    children: React.ReactNode,
    className?: string,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col space-y-1 text-center sm:text-left p-5 pb-1 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <h2 className={`text-lg font-semibold tracking-tight text-gray-900 ${className}`}>{children}</h2>
}

export function DialogDescription({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <p className={`text-xs text-gray-500 mt-0.5 ${className}`}>{children}</p>
}

export function DialogFooter({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 bg-gray-50/50 border-t border-gray-100 ${className}`}>{children}</div>
}
