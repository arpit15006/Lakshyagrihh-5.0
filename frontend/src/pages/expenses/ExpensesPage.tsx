import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFleetStore } from '../../store/useFleetStore';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { ExpensesTable } from './ExpensesTable';
import { ExpenseForm } from './ExpenseForm';
import { Plus, Fuel, DollarSign, TrendingUp, Truck } from 'lucide-react';

export function ExpensesPage() {
    const { expenses, vehicles } = useFleetStore();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [vehicleFilter, setVehicleFilter] = useState('all');

    // KPIs
    const totalFuelSpend = expenses.reduce((sum, e) => sum + e.fuelCost, 0);
    const totalMaintenanceCost = vehicles.reduce((sum, v) => sum + v.totalMaintenanceCost, 0);
    const avgCostPerKm = expenses.length > 0
        ? expenses.reduce((sum, e) => sum + e.costPerKm, 0) / expenses.length
        : 0;

    const mostExpensiveVehicle = useMemo(() => {
        const costMap = new Map<string, number>();
        expenses.forEach(e => costMap.set(e.vehiclePlate, (costMap.get(e.vehiclePlate) || 0) + e.totalCost));
        let maxPlate = '—';
        let maxCost = 0;
        costMap.forEach((cost, plate) => { if (cost > maxCost) { maxCost = cost; maxPlate = plate; } });
        return maxPlate;
    }, [expenses]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Trip Expenses & Fuel Logging"
                subtitle="Track fuel, cost, and compute total operational cost per vehicle."
                actions={[{ label: 'Add Expense', icon: Plus, onClick: () => setIsSheetOpen(true) }]}
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="">
                    <MetricCard title="Total Fuel Spend" value={formatCurrency(totalFuelSpend)} icon={Fuel} trend={{ value: 3.2, isPositive: false }} iconColor="text-amber-600 bg-amber-50" />
                </div>
                <div className="">
                    <MetricCard title="Total Maintenance Cost" value={formatCurrency(totalMaintenanceCost)} icon={DollarSign} trend={{ value: 1.8, isPositive: false }} iconColor="text-red-600 bg-red-50" />
                </div>
                <div className="">
                    <MetricCard title="Avg Cost per KM" value={`₹${avgCostPerKm.toFixed(2)}`} icon={TrendingUp} trend={{ value: 4.5, isPositive: true }} />
                </div>
                <div className="">
                    <MetricCard title="Most Expensive Vehicle" value={mostExpensiveVehicle} icon={Truck} iconColor="text-blue-600 bg-blue-50" />
                </div>
            </div>

            {/* Table */}
            <ExpensesTable vehicleFilter={vehicleFilter} onVehicleFilterChange={setVehicleFilter} onCreateExpense={() => setIsSheetOpen(true)} />

            {/* Sheet Drawer */}
            <ExpenseForm open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
        </motion.div>
    );
}
