import { useFleetStore } from '../../store/useFleetStore';
import type { ServiceLog } from '../../types/models';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { Eye, Pencil, CheckCircle2 } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Combobox } from '../../components/ui/combobox';

interface MaintenanceTableProps {
    onViewLog: (logId: string) => void;
    onCloseLog: (logId: string) => void;
    onCreateLog: () => void;
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
}

export function MaintenanceTable({ onViewLog, onCloseLog, onCreateLog, statusFilter, onStatusFilterChange }: MaintenanceTableProps) {
    const { serviceLogs, updateServiceLogStatus } = useFleetStore();

    const filteredLogs = statusFilter === 'all'
        ? serviceLogs
        : serviceLogs.filter(l => l.status === statusFilter);

    return (
        <DataTable<ServiceLog>
            data={filteredLogs}
            rowKey={r => r.id}
            searchPlaceholder="Search by log ID, vehicle, or technician..."
            searchKeys={['id', 'vehiclePlate', 'technicianName']}
            filterSlot={
                <Combobox
                    options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'New', label: 'New' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Completed', label: 'Completed' },
                    ]}
                    value={statusFilter}
                    onValueChange={v => onStatusFilterChange(v || 'all')}
                    placeholder="Filter by status"
                    className="w-44"
                />
            }
            emptyState={
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <p className="text-sm text-muted-foreground mb-2">No service logs found.</p>
                    <button onClick={onCreateLog} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        Create Service Log
                    </button>
                </div>
            }
            columns={[
                { key: 'id', header: 'Log ID', render: r => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
                { key: 'vehicle', header: 'Vehicle', render: r => <button className="text-emerald-600 hover:text-emerald-600 font-medium hover:underline transition-colors" onClick={e => { e.stopPropagation(); onViewLog(r.id); }}>{r.vehiclePlate}</button> },
                { key: 'type', header: 'Service Type', render: r => <span>{r.serviceType}</span> },
                { key: 'date', header: 'Date', render: r => <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
                { key: 'cost', header: 'Cost', render: r => <span className="font-medium">{formatCurrency(r.cost)}</span> },
                { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                { key: 'tech', header: 'Technician', render: r => <span className="text-muted-foreground">{r.technicianName}</span> },
                {
                    key: 'actions', header: 'Actions', render: r => (
                        <div className="flex items-center gap-1">
                            <button onClick={e => { e.stopPropagation(); onViewLog(r.id); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="View Details">
                                <Eye className="h-4 w-4" />
                            </button>
                            {r.status !== 'Completed' && (
                                <>
                                    <button onClick={e => { e.stopPropagation(); updateServiceLogStatus(r.id, 'In Progress'); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Mark In Progress">
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); onCloseLog(r.id); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors" title="Complete">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    )
                },
            ]}
        />
    );
}
