import { create } from 'zustand';
import type {
    Vehicle, Driver, Trip, ServiceLog, Expense,
    VehicleStatus, DriverStatus, ServiceLogStatus,
    MonthlyFinancial, FuelEfficiencyEntry,
} from '../types/models';

// ── Mock Data ─────────────────────────────────────────────────
const MOCK_VEHICLES: Vehicle[] = [
    { id: 'v1', plate: 'MH-01-AB-1234', model: 'Tata Ace', type: 'Truck', capacityTon: 5, odometer: 70000, status: 'Available', acquisitionCost: 800000, totalFuelCost: 125000, totalMaintenanceCost: 45000, totalRevenue: 320000 },
    { id: 'v2', plate: 'DL-01-YZ-5678', model: 'Ashok Leyland', type: 'Trailer', capacityTon: 15, odometer: 120500, status: 'On Trip', acquisitionCost: 2500000, totalFuelCost: 380000, totalMaintenanceCost: 92000, totalRevenue: 890000 },
    { id: 'v3', plate: 'KA-05-CD-9012', model: 'Eicher Pro', type: 'Truck', capacityTon: 8, odometer: 55200, status: 'Available', acquisitionCost: 1200000, totalFuelCost: 98000, totalMaintenanceCost: 32000, totalRevenue: 410000 },
    { id: 'v4', plate: 'GJ-03-EF-3456', model: 'BharatBenz', type: 'Truck', capacityTon: 12, odometer: 145000, status: 'In Shop', acquisitionCost: 1800000, totalFuelCost: 210000, totalMaintenanceCost: 78000, totalRevenue: 560000 },
    { id: 'v5', plate: 'TN-07-GH-7890', model: 'Mahindra Bolero', type: 'Van', capacityTon: 1.5, odometer: 35800, status: 'Available', acquisitionCost: 450000, totalFuelCost: 52000, totalMaintenanceCost: 18000, totalRevenue: 180000 },
    { id: 'v6', plate: 'RJ-14-IJ-2345', model: 'Tata 407', type: 'Truck', capacityTon: 3.5, odometer: 92300, status: 'Available', acquisitionCost: 650000, totalFuelCost: 115000, totalMaintenanceCost: 42000, totalRevenue: 295000 },
];

const MOCK_DRIVERS: Driver[] = [
    { id: 'd1', name: 'Rajesh Kumar', licenseNumber: 'DL-0420110012345', licenseExpiry: '2026-08-15', phone: '+91 98765 43210', status: 'On Duty', completionRate: 94, safetyScore: 88, complaints: [{ id: 'c1', date: '2025-12-01', description: 'Late delivery to client', severity: 'Low' }], tripsCompleted: 142, performanceHistory: [{ month: 'Sep', completionRate: 90, safetyScore: 85 }, { month: 'Oct', completionRate: 92, safetyScore: 86 }, { month: 'Nov', completionRate: 91, safetyScore: 88 }, { month: 'Dec', completionRate: 94, safetyScore: 88 }, { month: 'Jan', completionRate: 95, safetyScore: 89 }, { month: 'Feb', completionRate: 94, safetyScore: 88 }] },
    { id: 'd2', name: 'Amit Sharma', licenseNumber: 'MH-0220090067890', licenseExpiry: '2026-03-10', phone: '+91 87654 32109', status: 'On Duty', completionRate: 87, safetyScore: 76, complaints: [{ id: 'c2', date: '2026-01-15', description: 'Speeding violation on highway', severity: 'High' }, { id: 'c3', date: '2025-11-28', description: 'Minor cargo damage', severity: 'Medium' }], tripsCompleted: 98, performanceHistory: [{ month: 'Sep', completionRate: 85, safetyScore: 78 }, { month: 'Oct', completionRate: 83, safetyScore: 75 }, { month: 'Nov', completionRate: 88, safetyScore: 74 }, { month: 'Dec', completionRate: 86, safetyScore: 76 }, { month: 'Jan', completionRate: 89, safetyScore: 77 }, { month: 'Feb', completionRate: 87, safetyScore: 76 }] },
    { id: 'd3', name: 'Suresh Patel', licenseNumber: 'GJ-0520150034567', licenseExpiry: '2026-01-20', phone: '+91 76543 21098', status: 'Suspended', completionRate: 72, safetyScore: 62, complaints: [{ id: 'c4', date: '2026-01-05', description: 'License expired - auto suspended', severity: 'High' }], tripsCompleted: 65, performanceHistory: [{ month: 'Sep', completionRate: 78, safetyScore: 68 }, { month: 'Oct', completionRate: 75, safetyScore: 65 }, { month: 'Nov', completionRate: 74, safetyScore: 63 }, { month: 'Dec', completionRate: 72, safetyScore: 62 }, { month: 'Jan', completionRate: 70, safetyScore: 60 }, { month: 'Feb', completionRate: 72, safetyScore: 62 }] },
    { id: 'd4', name: 'Vikram Singh', licenseNumber: 'RJ-1420120056789', licenseExpiry: '2027-05-30', phone: '+91 65432 10987', status: 'Off Duty', completionRate: 91, safetyScore: 92, complaints: [], tripsCompleted: 178, performanceHistory: [{ month: 'Sep', completionRate: 89, safetyScore: 90 }, { month: 'Oct', completionRate: 90, safetyScore: 91 }, { month: 'Nov', completionRate: 92, safetyScore: 91 }, { month: 'Dec', completionRate: 91, safetyScore: 93 }, { month: 'Jan', completionRate: 93, safetyScore: 92 }, { month: 'Feb', completionRate: 91, safetyScore: 92 }] },
    { id: 'd5', name: 'Priya Reddy', licenseNumber: 'TN-0720180012345', licenseExpiry: '2027-11-25', phone: '+91 54321 09876', status: 'On Duty', completionRate: 96, safetyScore: 95, complaints: [], tripsCompleted: 203, performanceHistory: [{ month: 'Sep', completionRate: 95, safetyScore: 94 }, { month: 'Oct', completionRate: 96, safetyScore: 95 }, { month: 'Nov', completionRate: 97, safetyScore: 95 }, { month: 'Dec', completionRate: 95, safetyScore: 96 }, { month: 'Jan', completionRate: 96, safetyScore: 95 }, { month: 'Feb', completionRate: 96, safetyScore: 95 }] },
];

const MOCK_TRIPS: Trip[] = [
    { id: 'TRP-001', vehicleId: 'v2', vehiclePlate: 'DL-01-YZ-5678', driverId: 'd1', driverName: 'Rajesh Kumar', origin: 'Mumbai', destination: 'Delhi', distance: 1400, cargoWeight: 12000, estimatedCost: 45000, status: 'On Way', date: '2026-02-18' },
    { id: 'TRP-002', vehicleId: 'v1', vehiclePlate: 'MH-01-AB-1234', driverId: 'd2', driverName: 'Amit Sharma', origin: 'Pune', destination: 'Bangalore', distance: 840, cargoWeight: 3500, estimatedCost: 28000, status: 'Completed', date: '2026-02-15' },
    { id: 'TRP-003', vehicleId: 'v3', vehiclePlate: 'KA-05-CD-9012', driverId: 'd5', driverName: 'Priya Reddy', origin: 'Chennai', destination: 'Hyderabad', distance: 630, cargoWeight: 6000, estimatedCost: 22000, status: 'Completed', date: '2026-02-10' },
    { id: 'TRP-004', vehicleId: 'v5', vehiclePlate: 'TN-07-GH-7890', driverId: 'd1', driverName: 'Rajesh Kumar', origin: 'Ahmedabad', destination: 'Jaipur', distance: 670, cargoWeight: 1200, estimatedCost: 15000, status: 'Completed', date: '2026-02-05' },
];

const MOCK_SERVICE_LOGS: ServiceLog[] = [
    { id: 'SVC-001', vehicleId: 'v4', vehiclePlate: 'GJ-03-EF-3456', serviceType: 'Engine Overhaul', issueDescription: 'Engine knocking sound, needs full overhaul', date: '2026-02-19', cost: 35000, technicianName: 'Mechanic A', status: 'In Progress' },
    { id: 'SVC-002', vehicleId: 'v1', vehiclePlate: 'MH-01-AB-1234', serviceType: 'Oil Change', issueDescription: 'Routine 10k km oil change', date: '2026-02-12', cost: 3500, technicianName: 'Mechanic B', status: 'Completed' },
    { id: 'SVC-003', vehicleId: 'v6', vehiclePlate: 'RJ-14-IJ-2345', serviceType: 'Brake Replacement', issueDescription: 'Front brake pads worn out', date: '2026-02-20', cost: 8000, technicianName: 'Mechanic A', status: 'New' },
];

const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', tripId: 'TRP-002', vehicleId: 'v1', vehiclePlate: 'MH-01-AB-1234', driverName: 'Amit Sharma', distance: 840, fuelLiters: 120, fuelCost: 12600, miscExpense: 2500, totalCost: 15100, costPerKm: 17.98, date: '2026-02-15', notes: 'Toll charges included', status: 'Approved' },
    { id: 'EXP-002', tripId: 'TRP-003', vehicleId: 'v3', vehiclePlate: 'KA-05-CD-9012', driverName: 'Priya Reddy', distance: 630, fuelLiters: 85, fuelCost: 8925, miscExpense: 1800, totalCost: 10725, costPerKm: 17.02, date: '2026-02-10', notes: 'Highway tolls', status: 'Approved' },
    { id: 'EXP-003', tripId: 'TRP-004', vehicleId: 'v5', vehiclePlate: 'TN-07-GH-7890', driverName: 'Rajesh Kumar', distance: 670, fuelLiters: 65, fuelCost: 6825, miscExpense: 1200, totalCost: 8025, costPerKm: 11.98, date: '2026-02-05', notes: '', status: 'Pending' },
];

const MOCK_MONTHLY_FINANCIALS: MonthlyFinancial[] = [
    { month: 'Sep 2025', revenue: 420000, fuelCost: 165000, maintenanceCost: 48000, netProfit: 207000 },
    { month: 'Oct 2025', revenue: 480000, fuelCost: 178000, maintenanceCost: 52000, netProfit: 250000 },
    { month: 'Nov 2025', revenue: 510000, fuelCost: 182000, maintenanceCost: 35000, netProfit: 293000 },
    { month: 'Dec 2025', revenue: 390000, fuelCost: 155000, maintenanceCost: 68000, netProfit: 167000 },
    { month: 'Jan 2026', revenue: 540000, fuelCost: 190000, maintenanceCost: 42000, netProfit: 308000 },
    { month: 'Feb 2026', revenue: 465000, fuelCost: 172000, maintenanceCost: 46500, netProfit: 246500 },
];

const MOCK_FUEL_EFFICIENCY: FuelEfficiencyEntry[] = [
    { month: 'Sep', kmPerLiter: 4.2 },
    { month: 'Oct', kmPerLiter: 4.5 },
    { month: 'Nov', kmPerLiter: 4.3 },
    { month: 'Dec', kmPerLiter: 4.1 },
    { month: 'Jan', kmPerLiter: 4.6 },
    { month: 'Feb', kmPerLiter: 4.4 },
];

// ── Store Interface ───────────────────────────────────────────
export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: 'default' | 'success' | 'destructive';
}

interface FleetStore {
    // Data
    vehicles: Vehicle[];
    drivers: Driver[];
    trips: Trip[];
    serviceLogs: ServiceLog[];
    expenses: Expense[];
    monthlyFinancials: MonthlyFinancial[];
    fuelEfficiency: FuelEfficiencyEntry[];

    // Toast state
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;

    // Vehicle actions
    updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;

    // Service Log actions
    addServiceLog: (log: Omit<ServiceLog, 'id'>) => void;
    updateServiceLogStatus: (logId: string, status: ServiceLogStatus) => void;

    // Expense actions
    addExpense: (expense: Omit<Expense, 'id' | 'totalCost' | 'costPerKm'>) => void;

    // Driver actions
    addDriver: (driver: Omit<Driver, 'id' | 'complaints' | 'performanceHistory' | 'tripsCompleted'>) => void;
    updateDriverStatus: (driverId: string, status: DriverStatus) => void;

    // Trip actions
    addTrip: (trip: Omit<Trip, 'id'>) => void;
}

// ── Store Implementation ──────────────────────────────────────
export const useFleetStore = create<FleetStore>((set, get) => ({
    vehicles: MOCK_VEHICLES,
    drivers: MOCK_DRIVERS,
    trips: MOCK_TRIPS,
    serviceLogs: MOCK_SERVICE_LOGS,
    expenses: MOCK_EXPENSES,
    monthlyFinancials: MOCK_MONTHLY_FINANCIALS,
    fuelEfficiency: MOCK_FUEL_EFFICIENCY,

    // Toast
    toasts: [],
    addToast: (toast) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 4000);
    },
    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    // Vehicles
    updateVehicleStatus: (vehicleId, status) =>
        set((s) => ({
            vehicles: s.vehicles.map((v) => (v.id === vehicleId ? { ...v, status } : v)),
        })),

    // Service Logs
    addServiceLog: (log) => {
        const id = `SVC-${String(get().serviceLogs.length + 1).padStart(3, '0')}`;
        set((s) => ({
            serviceLogs: [{ ...log, id }, ...s.serviceLogs],
            vehicles: s.vehicles.map((v) =>
                v.id === log.vehicleId ? { ...v, status: 'In Shop' as VehicleStatus } : v
            ),
        }));
        get().addToast({ title: 'Service log created', description: `${log.vehiclePlate} moved to "In Shop"`, variant: 'success' });
    },

    updateServiceLogStatus: (logId, status) => {
        const log = get().serviceLogs.find((l) => l.id === logId);
        set((s) => ({
            serviceLogs: s.serviceLogs.map((l) => (l.id === logId ? { ...l, status } : l)),
            ...(status === 'Completed' && log
                ? { vehicles: s.vehicles.map((v) => (v.id === log.vehicleId ? { ...v, status: 'Available' as VehicleStatus } : v)) }
                : {}),
        }));
        get().addToast({ title: 'Status updated', description: `Service log ${logId} → ${status}`, variant: 'success' });
    },

    // Expenses
    addExpense: (expense) => {
        const totalCost = expense.fuelCost + expense.miscExpense;
        const costPerKm = expense.distance > 0 ? totalCost / expense.distance : 0;
        const id = `EXP-${String(get().expenses.length + 1).padStart(3, '0')}`;
        set((s) => ({
            expenses: [{ ...expense, id, totalCost, costPerKm }, ...s.expenses],
            vehicles: s.vehicles.map((v) =>
                v.id === expense.vehicleId
                    ? { ...v, totalFuelCost: v.totalFuelCost + expense.fuelCost }
                    : v
            ),
        }));
        get().addToast({ title: 'Expense recorded', description: `Operational cost updated`, variant: 'success' });
    },

    // Drivers
    addDriver: (driver) => {
        const id = `d${get().drivers.length + 1}`;
        set((s) => ({
            drivers: [...s.drivers, { ...driver, id, complaints: [], performanceHistory: [], tripsCompleted: 0 }],
        }));
        get().addToast({ title: 'Driver added', description: `${driver.name} registered successfully`, variant: 'success' });
    },

    updateDriverStatus: (driverId, status) => {
        set((s) => ({
            drivers: s.drivers.map((d) => (d.id === driverId ? { ...d, status } : d)),
        }));
        get().addToast({ title: 'Driver status updated', description: `Status changed to ${status}`, variant: 'success' });
    },

    // Trips
    addTrip: (trip) => {
        const id = `TRP-${String(get().trips.length + 1).padStart(3, '0')}`;
        set((s) => ({ trips: [{ ...trip, id }, ...s.trips] }));
    },
}));

// ── Derived Selectors ─────────────────────────────────────────
// Use these with: const count = useFleetStore(selectVehiclesInShop)
export const selectVehiclesInShop = (s: { vehicles: Vehicle[] }) =>
    s.vehicles.filter((v) => v.status === 'In Shop');

export const selectAvailableVehicles = (s: { vehicles: Vehicle[] }) =>
    s.vehicles.filter((v) => v.status !== 'In Shop');

export const selectActiveDrivers = (s: { drivers: Driver[] }) =>
    s.drivers.filter((d) => d.status === 'On Duty');

export const selectSuspendedDrivers = (s: { drivers: Driver[] }) =>
    s.drivers.filter((d) => d.status === 'Suspended');

export const selectExpiredLicenses = (s: { drivers: Driver[] }) =>
    s.drivers.filter((d) => new Date(d.licenseExpiry) < new Date());

export const selectExpiringLicenses = (s: { drivers: Driver[] }) =>
    s.drivers.filter((d) => {
        const exp = new Date(d.licenseExpiry);
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        return exp > now && exp.getTime() - now.getTime() < thirtyDays;
    });

export const selectActiveServiceRequests = (s: { serviceLogs: ServiceLog[] }) =>
    s.serviceLogs.filter((l) => l.status !== 'Completed');

export const selectCompletedTrips = (s: { trips: Trip[] }) =>
    s.trips.filter((t) => t.status === 'Completed');

export const selectAvgMaintenanceCost = (s: { serviceLogs: ServiceLog[] }) => {
    if (s.serviceLogs.length === 0) return 0;
    return Math.round(s.serviceLogs.reduce((sum, l) => sum + l.cost, 0) / s.serviceLogs.length);
};
