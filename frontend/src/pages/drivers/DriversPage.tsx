import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFleetStore } from '../../store/useFleetStore';
import type { Driver } from '../../types/models';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { ConfirmAction } from '../../components/shared/ConfirmAction';
import { DriversTable } from './DriversTable';
import { DriverProfile } from './DriverProfile';
import { DriverForm } from './DriverForm';
import { Plus, Users, Shield, AlertCircle, Award } from 'lucide-react';

export function DriversPage() {
    const { drivers, updateDriverStatus } = useFleetStore();

    const activeDrivers = useMemo(() => drivers.filter(d => d.status === 'On Duty'), [drivers]);
    const expiredLicenses = useMemo(() => drivers.filter(d => new Date(d.licenseExpiry) < new Date()), [drivers]);

    const [statusFilter, setStatusFilter] = useState('all');
    const [viewDriverId, setViewDriverId] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [suspendConfirm, setSuspendConfirm] = useState<string | null>(null);

    const viewedDriver = viewDriverId ? drivers.find(d => d.id === viewDriverId) ?? null : null;

    const avgSafetyScore = useMemo(() => {
        if (drivers.length === 0) return 0;
        return Math.round(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length);
    }, [drivers]);

    const avgCompletionRate = useMemo(() => {
        if (drivers.length === 0) return 0;
        return Math.round(drivers.reduce((sum, d) => sum + d.completionRate, 0) / drivers.length);
    }, [drivers]);

    const handleToggleStatus = (driver: Driver) => {
        if (driver.status === 'Suspended') return;
        updateDriverStatus(driver.id, driver.status === 'On Duty' ? 'Off Duty' : 'On Duty');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Driver Performance & Safety"
                subtitle="Monitor performance, safety scores, and license compliance."
                actions={[{ label: 'Add Driver', icon: Plus, onClick: () => setIsCreateOpen(true) }]}
            />

            {/* Expired License Alert */}
            {expiredLicenses.length > 0 && (
                <div className=" rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">
                        <span className="font-semibold">{expiredLicenses.length} driver(s)</span> have expired licenses:{' '}
                        {expiredLicenses.map(d => d.name).join(', ')}
                    </p>
                </div>
            )}

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="">
                    <MetricCard title="Active Drivers" value={activeDrivers.length} icon={Users} trend={{ value: 2, isPositive: true }} />
                </div>
                <div className="">
                    <MetricCard title="Avg Safety Score" value={avgSafetyScore} icon={Shield} trend={{ value: 3, isPositive: true }} iconColor="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30" />
                </div>
                <div className="">
                    <MetricCard title="Avg Completion Rate" value={`${avgCompletionRate}%`} icon={Award} trend={{ value: 1.5, isPositive: true }} iconColor="text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30" />
                </div>
                <div className="">
                    <MetricCard title="Expired Licenses" value={expiredLicenses.length} icon={AlertCircle} trend={{ value: expiredLicenses.length, isPositive: false }} iconColor="text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30" />
                </div>
            </div>

            {/* Table */}
            <DriversTable
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onViewDriver={setViewDriverId}
                onToggleStatus={handleToggleStatus}
                onCreateDriver={() => setIsCreateOpen(true)}
            />

            {/* Driver Profile Sheet */}
            <DriverProfile
                driver={viewedDriver}
                onClose={() => setViewDriverId(null)}
                onSuspend={() => { if (viewDriverId) setSuspendConfirm(viewDriverId); }}
            />

            {/* Create Form */}
            <DriverForm open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

            {/* Suspend Confirmation */}
            <ConfirmAction
                open={!!suspendConfirm}
                onOpenChange={() => setSuspendConfirm(null)}
                title="Suspend Driver?"
                description="This driver will be removed from all active schedules and cannot be assigned new trips."
                confirmLabel="Suspend Driver"
                variant="destructive"
                onConfirm={() => {
                    if (suspendConfirm) {
                        updateDriverStatus(suspendConfirm, 'Suspended');
                        setViewDriverId(null);
                    }
                }}
            />
        </motion.div>
    );
}
