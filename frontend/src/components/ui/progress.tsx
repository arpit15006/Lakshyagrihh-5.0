export function Progress({ value, max = 100, className = "", indicatorClassName = "" }: { value: number; max?: number; className?: string; indicatorClassName?: string }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div
            className={`relative h-2 w-full overflow-hidden rounded-full bg-zinc-800 ${className}`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
        >
            <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${indicatorClassName || 'bg-emerald-500'}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
