import * as React from "react"

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
    return (
        <div className={className} data-value={value}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { activeValue: value, onValueChange });
                }
                return child;
            })}
        </div>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
    activeValue?: string;
    onValueChange?: (value: string) => void;
}

export function TabsList({ children, className = "", activeValue, onValueChange }: TabsListProps) {
    return (
        <div className={`inline-flex items-center gap-1 rounded-xl bg-muted p-1 ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { activeValue, onValueChange });
                }
                return child;
            })}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    activeValue?: string;
    onValueChange?: (value: string) => void;
}

export function TabsTrigger({ value, children, className = "", activeValue, onValueChange }: TabsTriggerProps) {
    const isActive = activeValue === value;
    return (
        <button
            onClick={() => onValueChange?.(value)}
            className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                } ${className}`}
        >
            {children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    activeValue?: string;
}

export function TabsContent({ value, children, className = "", activeValue }: TabsContentProps) {
    if (activeValue !== value) return null;
    return <div className={`mt-4 ${className}`}>{children}</div>;
}
