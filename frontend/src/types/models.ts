// ── Status Enums ──────────────────────────────────────────────
export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Idle';
export type DriverStatus = 'On Duty' | 'Off Duty' | 'Suspended';
export type ServiceLogStatus = 'New' | 'In Progress' | 'Completed';
export type TripStatus = 'Preparing' | 'On Way' | 'Completed' | 'Cancelled';
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected';

// ── Core Models ───────────────────────────────────────────────
export interface Vehicle {
    id: string;
    plate: string;
    model: string;
    type: string;
    capacityTon: number;
    odometer: number;
    status: VehicleStatus;
    acquisitionCost: number;
    totalFuelCost: number;
    totalMaintenanceCost: number;
    totalRevenue: number;
}

export interface Driver {
    id: string;
    name: string;
    licenseNumber: string;
    licenseExpiry: string; // ISO date
    phone: string;
    status: DriverStatus;
    completionRate: number; // 0-100
    safetyScore: number; // 0-100
    complaints: Complaint[];
    tripsCompleted: number;
    performanceHistory: PerformanceEntry[];
}

export interface Complaint {
    id: string;
    date: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
}

export interface PerformanceEntry {
    month: string;
    completionRate: number;
    safetyScore: number;
}

export interface Trip {
    id: string;
    vehicleId: string;
    vehiclePlate: string;
    driverId: string;
    driverName: string;
    origin: string;
    destination: string;
    distance: number;
    cargoWeight: number;
    estimatedCost: number;
    status: TripStatus;
    date: string;
}

export interface ServiceLog {
    id: string;
    vehicleId: string;
    vehiclePlate: string;
    serviceType: string;
    issueDescription: string;
    date: string;
    cost: number;
    technicianName: string;
    status: ServiceLogStatus;
}

export interface Expense {
    id: string;
    tripId: string;
    vehicleId: string;
    vehiclePlate: string;
    driverName: string;
    distance: number;
    fuelLiters: number;
    fuelCost: number;
    miscExpense: number;
    totalCost: number;
    costPerKm: number;
    date: string;
    notes: string;
    status: ExpenseStatus;
}

// ── Analytics Models ──────────────────────────────────────────
export interface MonthlyFinancial {
    month: string;
    revenue: number;
    fuelCost: number;
    maintenanceCost: number;
    netProfit: number;
}

export interface FuelEfficiencyEntry {
    month: string;
    kmPerLiter: number;
}
