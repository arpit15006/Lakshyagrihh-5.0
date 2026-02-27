import { useFleetStore } from '../../store/useFleetStore';
import type { Driver } from '../../types/models';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { DataTable } from '../../components/shared/DataTable';
import { Combobox } from '../../components/ui/combobox';
import { Eye, Users } from 'lucide-react';

interface DriversTableProps {
    statusFilter: string;
    onStatusFilterChange: (val: string) => void;
    onViewDriver: (driverId: string) => void;
    onToggleStatus: (driver: Driver) => void;
    onCreateDriver: () => void;
}

export function DriversTable({ statusFilter, onStatusFilterChange, onViewDriver, onToggleStatus, onCreateDriver }: DriversTableProps) {
    const { drivers } = useFleetStore();

    const filtered = statusFilter === 'all'
        ? drivers
        : drivers.filter(d => d.status === statusFilter);

    return (
        <DataTable<Driver>
            data={filtered}
            rowKey={r => r.id}
            searchPlaceholder="Search by name, license number, or phone..."
            searchKeys={['name', 'licenseNumber', 'phone']}
            filterSlot={
                <Combobox
                    options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'On Duty', label: 'On Duty' },
                        { value: 'Off Duty', label: 'Off Duty' },
                        { value: 'Suspended', label: 'Suspended' },
                    ]}
                    value={statusFilter}
                    onValueChange={v => onStatusFilterChange(v || 'all')}
                    placeholder="Filter by status"
                    className="w-44"
                />
            }
            emptyState={
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center mb-4"><Users className="h-7 w-7 text-muted-foreground" /></div>
                    <p className="text-sm text-muted-foreground mb-2">No drivers found.</p>
                    <button onClick={onCreateDriver} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Add Driver</button>
                </div>
            }
            columns={[
                { key: 'name', header: 'Name', render: r => <span className="font-medium">{r.name}</span> },
                { key: 'license', header: 'License', render: r => <span className="font-mono text-xs text-muted-foreground">{r.licenseNumber}</span> },
                {
                    key: 'expiry', header: 'License Expiry', render: r => {
                        const isExpired = new Date(r.licenseExpiry) < new Date();
                        return <span className={isExpired ? 'text-destructive font-medium' : 'text-muted-foreground'}>{new Date(r.licenseExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>;
                    }
                },
                { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                {
                    key: 'completion', header: 'Completion', render: r => (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${r.completionRate}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{r.completionRate}%</span>
                        </div>
                    )
                },
                {
                    key: 'safety', header: 'Safety', render: r => (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${r.safetyScore >= 80 ? 'bg-emerald-500' : r.safetyScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${r.safetyScore}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{r.safetyScore}</span>
                        </div>
                    )
                },
                { key: 'trips', header: 'Trips', render: r => <span className="text-muted-foreground">{r.tripsCompleted}</span> },
                {
                    key: 'toggle', header: 'Active', render: r => (
                        <button
                            onClick={e => { e.stopPropagation(); onToggleStatus(r); }}
                            className={`relative h-6 w-10 rounded-full transition-colors ${r.status === 'On Duty' ? 'bg-primary' : 'bg-muted'}`}
                            title={r.status === 'On Duty' ? 'Set Off Duty' : 'Set On Duty'}
                        >
                            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${r.status === 'On Duty' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                        </button>
                    )
                },
                {
                    key: 'actions', header: '', className: 'w-10', render: r => (
                        <button onClick={e => { e.stopPropagation(); onViewDriver(r.id); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <Eye className="h-4 w-4" />
                        </button>
                    )
                },
            ]}
        />
    );
}
