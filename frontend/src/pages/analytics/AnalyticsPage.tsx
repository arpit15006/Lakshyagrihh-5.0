import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFleetStore } from '../../store/useFleetStore';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateROI } from '../../utils/calculateROI';
import { AnalyticsCharts } from './AnalyticsCharts';
import { FinancialTable } from './FinancialTable';
import { DollarSign, TrendingUp, Activity, BarChart3, Download, FileText, Loader2 } from 'lucide-react';

export function AnalyticsPage() {
    const { vehicles, monthlyFinancials, fuelEfficiency } = useFleetStore();

    const [isExportingCSV, setIsExportingCSV] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    // KPIs — derived
    const totalFuelCost = vehicles.reduce((sum, v) => sum + v.totalFuelCost, 0);
    const totalRevenue = vehicles.reduce((sum, v) => sum + v.totalRevenue, 0);
    const totalMaintenance = vehicles.reduce((sum, v) => sum + v.totalMaintenanceCost, 0);
    const totalAcquisition = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);

    const fleetROI = calculateROI(totalRevenue, totalMaintenance, totalFuelCost, totalAcquisition).toFixed(1);

    const utilizationRate = vehicles.length > 0
        ? Math.round(vehicles.filter(v => v.status === 'On Trip' || v.status === 'Available').length / vehicles.length * 100)
        : 0;

    const revenueThisMonth = monthlyFinancials.length > 0 ? monthlyFinancials[monthlyFinancials.length - 1].revenue : 0;

    // Export
    const handleExportCSV = useCallback(() => {
        setIsExportingCSV(true);
        setTimeout(() => {
            const header = 'Month,Revenue,Fuel Cost,Maintenance,Net Profit\n';
            const rows = monthlyFinancials.map(m => `${m.month},${m.revenue},${m.fuelCost},${m.maintenanceCost},${m.netProfit}`).join('\n');
            const blob = new Blob([header + rows], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fleetflow-financial-report.csv';
            a.click();
            URL.revokeObjectURL(url);
            setIsExportingCSV(false);
        }, 1500);
    }, [monthlyFinancials]);

    const handleExportPDF = useCallback(() => {
        setIsExportingPDF(true);
        setTimeout(() => {
            setIsExportingPDF(false);
            alert('PDF export is a mock implementation. In production, use a library like jsPDF or server-side rendering.');
        }, 2000);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Operational Analytics"
                subtitle="Fuel efficiency, ROI, fleet utilization and financial reports."
                actions={[
                    { label: isExportingCSV ? 'Exporting...' : 'Export CSV', icon: isExportingCSV ? Loader2 : Download, onClick: handleExportCSV, variant: 'outline' as const },
                    { label: isExportingPDF ? 'Exporting...' : 'Export PDF', icon: isExportingPDF ? Loader2 : FileText, onClick: handleExportPDF, variant: 'outline' as const },
                ]}
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="">
                    <MetricCard title="Total Fuel Cost" value={formatCurrency(totalFuelCost)} icon={DollarSign} trend={{ value: 2.4, isPositive: false }} iconColor="text-amber-600 bg-amber-50" />
                </div>
                <div className="">
                    <MetricCard title="Fleet ROI" value={`${fleetROI}%`} icon={TrendingUp} trend={{ value: 5.2, isPositive: true }} />
                </div>
                <div className="">
                    <MetricCard title="Utilization Rate" value={`${utilizationRate}%`} icon={Activity} trend={{ value: 8, isPositive: true }} iconColor="text-blue-600 bg-blue-50" />
                </div>
                <div className="">
                    <MetricCard title="Revenue This Month" value={formatCurrency(revenueThisMonth)} icon={BarChart3} trend={{ value: 12, isPositive: true }} iconColor="text-purple-400 bg-purple-500/10" />
                </div>
            </div>

            {/* Charts */}
            <AnalyticsCharts vehicles={vehicles} monthlyFinancials={monthlyFinancials} fuelEfficiency={fuelEfficiency} />

            {/* Financial Table */}
            <FinancialTable data={monthlyFinancials} />
        </motion.div>
    );
}
