import type { MonthlyFinancial } from '../../types/models';
import { formatCurrency } from '../../utils/formatCurrency';

interface FinancialTableProps {
    data: MonthlyFinancial[];
}

export function FinancialTable({ data }: FinancialTableProps) {
    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Financial Summary</h3>
                <span className="text-xs text-muted-foreground px-2.5 py-0.5 rounded-full border border-border cursor-help" title="ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost">
                    ROI Formula
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            {['Month', 'Revenue', 'Fuel Cost', 'Maintenance', 'Net Profit', 'Margin'].map(h => (
                                <th key={h} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => {
                            const margin = row.revenue > 0 ? ((row.netProfit / row.revenue) * 100).toFixed(1) : '0';
                            const isPositive = row.netProfit > 0;
                            return (
                                <tr key={row.month} className="border-b border-border transition-colors hover:bg-muted/50 text-foreground">
                                    <td className="p-4 font-medium">{row.month}</td>
                                    <td className="p-4 text-emerald-600">{formatCurrency(row.revenue)}</td>
                                    <td className="p-4 text-amber-600">{formatCurrency(row.fuelCost)}</td>
                                    <td className="p-4 text-red-600">{formatCurrency(row.maintenanceCost)}</td>
                                    <td className={`p-4 font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {formatCurrency(row.netProfit)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200'
                                            }`}>
                                            {margin}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
