/**
 * Format a number as Indian Rupees (₹) using en-IN locale.
 * @example formatCurrency(125000) => "₹1,25,000"
 */
export function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Compact format for chart axis labels.
 * @example formatCurrencyCompact(125000) => "₹125k"
 */
export function formatCurrencyCompact(amount: number): string {
    if (amount >= 10_00_000) return `₹${(amount / 10_00_000).toFixed(1)}M`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
    return `₹${amount}`;
}
