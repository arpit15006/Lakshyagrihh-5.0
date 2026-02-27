import { create } from 'zustand';
import type {
    Vehicle, Driver, Trip, ServiceLog, Expense,
    VehicleStatus, DriverStatus, ServiceLogStatus,
    MonthlyFinancial, FuelEfficiencyEntry,
} from '../types/models';

import { collection, doc, addDoc, updateDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    vehicles: [],
    drivers: [],
    trips: [],
    serviceLogs: [],
    expenses: [],
    monthlyFinancials: [],
    fuelEfficiency: [],

    // Toast
    toasts: [],
    addToast: (toast) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 4000);
    },
    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    // Vehicles
    updateVehicleStatus: async (vehicleId, status) => {
        try {
            await updateDoc(doc(db, 'vehicles', vehicleId), { status });
            get().addToast({ title: 'Vehicle status updated', description: `Status changed to ${status}`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    // Service Logs
    addServiceLog: async (log) => {
        try {
            await addDoc(collection(db, 'serviceLogs'), { ...log, status: 'In Shop' });
            await updateDoc(doc(db, 'vehicles', log.vehicleId), { status: 'In Shop' });
            get().addToast({ title: 'Service log created', description: `${log.vehiclePlate} moved to "In Shop"`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    updateServiceLogStatus: async (logId, status) => {
        const log = get().serviceLogs.find((l) => l.id === logId);
        try {
            await updateDoc(doc(db, 'serviceLogs', logId), { status });
            if (status === 'Completed' && log) {
                await updateDoc(doc(db, 'vehicles', log.vehicleId), { status: 'Available' });
            }
            get().addToast({ title: 'Status updated', description: `Service log updated`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    // Expenses
    addExpense: async (expense) => {
        const totalCost = expense.fuelCost + expense.miscExpense;
        const costPerKm = expense.distance > 0 ? totalCost / expense.distance : 0;
        try {
            await addDoc(collection(db, 'expenses'), { ...expense, totalCost, costPerKm });
            const v = get().vehicles.find(v => v.id === expense.vehicleId);
            if (v) {
                await updateDoc(doc(db, 'vehicles', expense.vehicleId), { totalFuelCost: (v.totalFuelCost || 0) + expense.fuelCost });
            }
            get().addToast({ title: 'Expense recorded', description: `Operational cost updated`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    // Drivers
    addDriver: async (driver) => {
        try {
            await addDoc(collection(db, 'drivers'), {
                ...driver, complaints: [], performanceHistory: [], tripsCompleted: 0
            });
            get().addToast({ title: 'Driver added', description: `${driver.name} registered successfully`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    updateDriverStatus: async (driverId, status) => {
        try {
            await updateDoc(doc(db, 'drivers', driverId), { status });
            get().addToast({ title: 'Driver status updated', description: `Status changed to ${status}`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },

    // Trips
    addTrip: async (trip) => {
        try {
            await addDoc(collection(db, 'trips'), trip);
            get().addToast({ title: 'Trip dispatched', description: `Trip created successfully`, variant: 'success' });
        } catch (e) {
            console.error(e);
        }
    },
}));

export const initFleetListeners = () => {
    const unsubs = [
        onSnapshot(collection(db, 'vehicles'), (snapshot) => {
            useFleetStore.setState({ vehicles: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as Vehicle) });
        }),
        onSnapshot(collection(db, 'drivers'), async (snapshot) => {
            const drivers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as Driver);
            await Promise.all(drivers.map(async (driver) => {
                const cSnap = await getDocs(collection(db, `drivers/${driver.id}/complaints`));
                const pSnap = await getDocs(collection(db, `drivers/${driver.id}/performanceHistory`));
                driver.complaints = cSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any;
                driver.performanceHistory = pSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any;
            }));
            useFleetStore.setState({ drivers });
        }),
        onSnapshot(collection(db, 'trips'), (snapshot) => {
            useFleetStore.setState({ trips: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as Trip) });
        }),
        onSnapshot(collection(db, 'serviceLogs'), (snapshot) => {
            useFleetStore.setState({ serviceLogs: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as ServiceLog) });
        }),
        onSnapshot(collection(db, 'expenses'), (snapshot) => {
            useFleetStore.setState({ expenses: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as Expense) });
        }),
        onSnapshot(collection(db, 'monthlyFinancials'), (snapshot) => {
            useFleetStore.setState({ monthlyFinancials: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as MonthlyFinancial) });
        }),
        onSnapshot(collection(db, 'fuelEfficiency'), (snapshot) => {
            useFleetStore.setState({ fuelEfficiency: snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as unknown as FuelEfficiencyEntry) });
        })
    ];
    return () => unsubs.forEach(unsub => unsub());
};

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
