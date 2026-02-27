import { useMemo } from 'react';
import type { Vehicle, MonthlyFinancial, FuelEfficiencyEntry } from '../../types/models';
import { formatCurrencyCompact } from '../../utils/formatCurrency';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface AnalyticsChartsProps {
    vehicles: Vehicle[];
    monthlyFinancials: MonthlyFinancial[];
    fuelEfficiency: FuelEfficiencyEntry[];
}

export function AnalyticsCharts({ vehicles, monthlyFinancials, fuelEfficiency }: AnalyticsChartsProps) {
    const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' };

    const top5Costliest = useMemo(() => {
        return [...vehicles]
            .sort((a, b) => (b.totalFuelCost + b.totalMaintenanceCost) - (a.totalFuelCost + a.totalMaintenanceCost))
            .slice(0, 5)
            .map(v => ({
                name: v.plate,
                fuel: v.totalFuelCost,
                maintenance: v.totalMaintenanceCost,
            }));
    }, [vehicles]);

    const utilizationData = useMemo(() => {
        const statusCounts: Record<string, number> = {};
        vehicles.forEach(v => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [vehicles]);

    const revenueVsCost = useMemo(() => {
        return monthlyFinancials.map(m => ({
            month: m.month.split(' ')[0],
            revenue: m.revenue,
            cost: m.fuelCost + m.maintenanceCost,
        }));
    }, [monthlyFinancials]);

    const chartCard = (title: string, children: React.ReactNode) => (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>
            <div className="p-6">
                <div className="h-64">{children}</div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Fuel Efficiency Trend */}
            {chartCard('Fuel Efficiency Trend',
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fuelEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} unit=" km/L" />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="kmPerLiter" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#064e3b' }} activeDot={{ r: 6 }} name="km/L" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {/* Top 5 Costliest Vehicles */}
            {chartCard('Top 5 Costliest Vehicles',
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5Costliest} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#d1d5db' }} width={120} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number | undefined) => value != null ? `₹${value.toLocaleString('en-IN')}` : ''} />
                        <Bar dataKey="fuel" fill="#f59e0b" stackId="cost" name="Fuel" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="maintenance" fill="#ef4444" stackId="cost" name="Maintenance" radius={[0, 4, 4, 0]} />
                        <Legend wrapperStyle={{ color: '#6b7280' }} />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {/* Fleet Utilization */}
            {chartCard('Fleet Utilization',
                <div className="h-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={utilizationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={{ stroke: '#71717a' }}
                            >
                                {utilizationData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Revenue vs Cost */}
            {chartCard('Revenue vs Cost',
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueVsCost}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} tickFormatter={(v: number) => formatCurrencyCompact(v)} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(value: number | undefined) => value != null ? `₹${value.toLocaleString('en-IN')}` : ''} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                        <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#costGrad)" name="Cost" />
                        <Legend wrapperStyle={{ color: '#6b7280' }} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
