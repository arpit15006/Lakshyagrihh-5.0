export function Separator({ className = "", orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
    return (
        <div
            role="separator"
            className={`shrink-0 bg-zinc-800 ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} ${className}`}
        />
    );
}
