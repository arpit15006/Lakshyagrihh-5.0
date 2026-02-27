export interface TripEmission {
    tripId: string;
    vehiclePlate: string;
    distance: number;
    fuelConsumed: number;
    co2Emissions: number;
    date: string;
}

export interface VehicleEmission {
    vehicleId: string;
    plate: string;
    totalCO2: number;
    avgEmissionsPerKm: number;
    fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
}

export interface EmissionTrend {
    month: string;
    co2Tons: number;
    target: number;
}

export interface RouteOptimization {
    tripId: string;
    origin: string;
    destination: string;
    standardRoute: {
        distance: number;
        duration: number;
        co2: number;
    };
    optimizedRoute: {
        distance: number;
        duration: number;
        co2: number;
    };
    savings: {
        distance: number;
        time: number;
        co2: number;
        cost: number;
    };
}

export interface LiveVehicle {
    id: string;
    plate: string;
    lat: number;
    lng: number;
    status: 'Moving' | 'Idle' | 'Stopped';
    speed: number;
    destination: string;
    eta: string;
}
