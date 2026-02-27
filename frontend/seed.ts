import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCsYX8dhGKi102Vl-_tn0pYLoA5546Zi1M",
    authDomain: "fleetflow-9e083.firebaseapp.com",
    projectId: "fleetflow-9e083",
    storageBucket: "fleetflow-9e083.firebasestorage.app",
    messagingSenderId: "1087483035188",
    appId: "1:1087483035188:web:37e74e4f4cdc729dfbd461",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

async function seed() {
    console.log("Seeding FleetFlow Database...");

    const vehicles = [
        { plate: 'MH-01-AB-1234', model: 'Truck-01', type: 'Truck', capacityTon: 15, odometer: 45000, status: 'On Trip', acquisitionCost: 55000, totalFuelCost: 2400, totalMaintenanceCost: 800, totalRevenue: 12000 },
        { plate: 'DL-01-YZ-5678', model: 'Van-02', type: 'Van', capacityTon: 5, odometer: 12000, status: 'Available', acquisitionCost: 32000, totalFuelCost: 800, totalMaintenanceCost: 200, totalRevenue: 4500 },
        { plate: 'KA-05-CD-9012', model: 'Truck-03', type: 'Trailer Truck', capacityTon: 25, odometer: 85000, status: 'On Trip', acquisitionCost: 80000, totalFuelCost: 6500, totalMaintenanceCost: 1500, totalRevenue: 28000 }
    ];

    const liveDataObj: any = {};
    const vehicleIds: string[] = [];

    // Seed Vehicles
    for (const v of vehicles) {
        const docRef = await addDoc(collection(db, 'vehicles'), v);
        console.log(`Added vehicle ${v.plate} with ID: ${docRef.id}`);
        vehicleIds.push(docRef.id);

        if (v.status === 'On Trip') {
            liveDataObj[docRef.id] = {
                status: 'Moving',
                lat: 20.5937 + (Math.random() - 0.5) * 5,
                lng: 78.9629 + (Math.random() - 0.5) * 5,
                speed: 65,
                destination: 'Mumbai',
                eta: '14:30'
            };
        } else {
            liveDataObj[docRef.id] = {
                status: 'Idle',
                lat: 28.7041,
                lng: 77.1025,
                speed: 0,
                destination: 'Delhi Hub',
                eta: 'N/A'
            };
        }
    }

    // Seed RTDB
    await set(ref(rtdb, 'liveTracking'), liveDataObj);
    console.log("Seeded RTDB Live Tracking");

    // Seed Drivers
    const drivers = [
        { name: 'John Doe', licenseNumber: 'DL-12345', licenseExpiry: '2027-05-12', phone: '9876543210', status: 'On Duty', completionRate: 98, safetyScore: 92, tripsCompleted: 45 },
        { name: 'Amit Sharma', licenseNumber: 'UP-54321', licenseExpiry: '2024-11-20', phone: '8765432109', status: 'Off Duty', completionRate: 85, safetyScore: 78, tripsCompleted: 12 }
    ];

    const driverIds: string[] = [];
    for (const d of drivers) {
        const docRef = await addDoc(collection(db, 'drivers'), d);
        console.log(`Added driver ${d.name}`);
        driverIds.push(docRef.id);
    }

    // Seed Trips
    const trips = [
        { vehicleId: vehicleIds[0], vehiclePlate: vehicles[0].plate, driverId: driverIds[0], driverName: drivers[0].name, origin: 'Delhi', destination: 'Mumbai', distance: 1400, cargoWeight: 12, estimatedCost: 1500, status: 'Preparing', date: new Date().toISOString() },
        { vehicleId: vehicleIds[2], vehiclePlate: vehicles[2].plate, driverId: driverIds[0], driverName: drivers[0].name, origin: 'Bangalore', destination: 'Chennai', distance: 350, cargoWeight: 20, estimatedCost: 450, status: 'Completed', date: new Date().toISOString() }
    ];

    for (const t of trips) {
        await addDoc(collection(db, 'trips'), t);
    }
    console.log("Seeded Trips");

    console.log("Seeding Complete!");
    process.exit(0);
}

seed().catch(console.error);
