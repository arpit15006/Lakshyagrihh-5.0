import type { VehicleStatus, DriverStatus, ServiceLogStatus, ExpenseStatus } from '../../types/models';

type AllStatuses = VehicleStatus | DriverStatus | ServiceLogStatus | ExpenseStatus;

interface StatusConfig {
    label: string;
    className: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
    // Vehicle
    'Available': { label: 'Available', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'On Trip': { label: 'On Trip', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'In Shop': { label: 'In Shop', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    // Driver
    'On Duty': { label: 'On Duty', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Off Duty': { label: 'Off Duty', className: 'bg-gray-50 text-gray-600 border-gray-200' },
    'Suspended': { label: 'Suspended', className: 'bg-red-50 text-red-700 border-red-200' },
    // ServiceLog
    'New': { label: 'New', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'In Progress': { label: 'In Progress', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Completed': { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    // Expense
    'Approved': { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Pending': { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Rejected': { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
};

interface StatusBadgeProps {
    status: AllStatuses;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const config = STATUS_MAP[status] ?? { label: status, className: 'bg-gray-50 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${config.className} ${className}`}>
            {config.label}
        </span>
    );
}
