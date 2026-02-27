import * as React from "react"

export function Dialog({
    children,
    open,
    onOpenChange
}: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50 bg-white dark:bg-card rounded-lg shadow-lg w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
    return children;
}

export function DialogContent({
    children,
    className = ""
}: {
    children: React.ReactNode,
    className?: string
}) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col space-y-1 text-center sm:text-left pb-4 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <h2 className={`text-lg font-semibold tracking-tight text-foreground ${className}`}>{children}</h2>
}

export function DialogDescription({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <p className={`text-xs text-gray-500 mt-0.5 ${className}`}>{children}</p>
}

export function DialogFooter({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 bg-gray-50/50 border-t border-gray-100 ${className}`}>{children}</div>
}
