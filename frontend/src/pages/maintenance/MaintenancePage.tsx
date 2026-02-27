import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFleetStore } from '../../store/useFleetStore';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { ConfirmAction } from '../../components/shared/ConfirmAction';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { MaintenanceTable } from './MaintenanceTable';
import { MaintenanceForm } from './MaintenanceForm';
import { Plus, Wrench, AlertTriangle, DollarSign, CalendarClock } from 'lucide-react';

export function MaintenancePage() {
    const { vehicles, serviceLogs, updateServiceLogStatus } = useFleetStore();

    const vehiclesInShop = useMemo(() => vehicles.filter(v => v.status === 'In Shop'), [vehicles]);
    const activeRequests = useMemo(() => serviceLogs.filter(l => l.status !== 'Completed'), [serviceLogs]);
    const avgCost = useMemo(() => {
        if (serviceLogs.length === 0) return 0;
        return Math.round(serviceLogs.reduce((sum, l) => sum + l.cost, 0) / serviceLogs.length);
    }, [serviceLogs]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewLogId, setViewLogId] = useState<string | null>(null);
    const [closeConfirm, setCloseConfirm] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const selectedLog = viewLogId ? serviceLogs.find(l => l.id === viewLogId) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Maintenance & Service Logs"
                subtitle="Track and manage fleet health in real time."
                actions={[{ label: 'Create Service Log', icon: Plus, onClick: () => setIsCreateOpen(true) }]}
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="">
                    <MetricCard title="Vehicles In Shop" value={vehiclesInShop.length} icon={Wrench} trend={{ value: 12, isPositive: false }} iconColor="text-amber-600 bg-amber-50" />
                </div>
                <div className="">
                    <MetricCard title="Active Requests" value={activeRequests.length} icon={AlertTriangle} trend={{ value: 8, isPositive: false }} iconColor="text-red-600 bg-red-50" />
                </div>
                <div className="">
                    <MetricCard title="Avg Maintenance Cost" value={formatCurrency(avgCost)} icon={DollarSign} trend={{ value: 5, isPositive: true }} />
                </div>
                <div className="">
                    <MetricCard title="Upcoming Checks" value={3} icon={CalendarClock} iconColor="text-blue-600 bg-blue-50" />
                </div>
            </div>

            {/* Table */}
            <MaintenanceTable
                onViewLog={setViewLogId}
                onCloseLog={setCloseConfirm}
                onCreateLog={() => setIsCreateOpen(true)}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Create Form Dialog */}
            <MaintenanceForm open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

            {/* View Log Detail Dialog */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewLogId(null)} />
                    <div className="relative z-50 w-full max-w-md rounded-lg bg-card border border-border shadow-xl">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Service Log: {selectedLog.id}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    ['Vehicle', selectedLog.vehiclePlate],
                                    ['Service Type', selectedLog.serviceType],
                                    ['Date', new Date(selectedLog.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
                                    ['Cost', formatCurrency(selectedLog.cost)],
                                    ['Technician', selectedLog.technicianName],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                                        <p className="text-sm font-medium text-foreground mt-1">{value}</p>
                                    </div>
                                ))}
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                                    <div className="mt-1"><StatusBadge status={selectedLog.status} /></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
                                <p className="text-sm text-muted-foreground mt-1">{selectedLog.issueDescription}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end">
                            <button onClick={() => setViewLogId(null)} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Close Confirmation */}
            <ConfirmAction
                open={!!closeConfirm}
                onOpenChange={() => setCloseConfirm(null)}
                title="Complete Service Log?"
                description="This will mark the service as completed and the vehicle will become available for dispatch again."
                confirmLabel="Complete Service"
                onConfirm={() => { if (closeConfirm) updateServiceLogStatus(closeConfirm, 'Completed'); }}
            />
        </motion.div>
    );
}
