import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
    let variantStyles = "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent";

    if (variant === "secondary") {
        variantStyles = "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent";
    } else if (variant === "outline") {
        variantStyles = "text-foreground border border-border";
    } else if (variant === "success") {
        variantStyles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    } else if (variant === "warning") {
        variantStyles = "bg-amber-500/10 text-amber-500 border-amber-500/20";
    } else if (variant === "destructive") {
        variantStyles = "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent";
    }

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className}`}
            {...props}
        />
    )
}
