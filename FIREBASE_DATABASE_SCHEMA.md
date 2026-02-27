# Firebase Database Schema - FleetFlow
**Based on Complete Codebase Analysis**

## 🔥 Firebase Services
- **Firestore** - Main database
- **Firebase Auth** - Simple email/password authentication
- **Realtime Database** - Live GPS tracking
- **Storage** (Optional) - File uploads

---

## 📊 Firestore Collections

### 1. **users**
```typescript
users/{userId}
{
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```
**Indexes:** `email` (ascending)

---

### 2. **vehicles**
```typescript
vehicles/{vehicleId}
{
  id: string;
  plate: string;                  // Unique
  model: string;
  type: string;                   // "Truck", "Trailer", "Van"
  capacityTon: number;
  odometer: number;
  status: string;                 // "Available", "On Trip", "In Shop", "Idle"
  acquisitionCost: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalRevenue: number;
  fuelType: string;               // "Diesel", "Petrol", "CNG", "Electric"
  totalCO2Emissions: number;      // kg
  avgEmissionsPerKm: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```
**Indexes:**
- `plate` (ascending)
- `status` (ascending)
- `fuelType` (ascending)

---

### 3. **drivers**
```typescript
drivers/{driverId}
{
  id: string;
  name: string;
  licenseNumber: string;          // Unique
  licenseExpiry: string;          // ISO date
  phone: string;
  status: string;                 // "On Duty", "Off Duty", "Suspended"
  completionRate: number;         // 0-100
  safetyScore: number;            // 0-100
  tripsCompleted: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Sub-collection: complaints**
```typescript
drivers/{driverId}/complaints/{complaintId}
{
  id: string;
  date: string;
  description: string;
  severity: string;               // "Low", "Medium", "High"
  createdAt: Timestamp;
}
```

**Sub-collection: performanceHistory**
```typescript
drivers/{driverId}/performanceHistory/{monthYear}
{
  month: string;                  // "Feb", "Jan"
  completionRate: number;
  safetyScore: number;
  timestamp: Timestamp;
}
```

**Indexes:**
- `licenseNumber` (ascending)
- `status` (ascending)

---

### 4. **trips**
```typescript
trips/{tripId}
{
  id: string;                     // "TRP-001"
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  distance: number;               // km
  cargoWeight: number;            // kg
  estimatedCost: number;
  status: string;                 // "Preparing", "On Way", "Completed", "Cancelled"
  date: string;                   // ISO date
  fuelConsumed: number;           // liters (optional)
  co2Emissions: number;           // kg (optional)
  routeOptimized: boolean;
  optimizationSavings: {          // optional
    distance: number;
    time: number;
    cost: number;
    co2: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `vehicleId` (ascending)
- `driverId` (ascending)
- `status` (ascending)
- `date` (descending)

**Composite:** `status` + `date` (desc)

---

### 5. **serviceLogs**
```typescript
serviceLogs/{serviceLogId}
{
  id: string;                     // "SVC-001"
  vehicleId: string;
  vehiclePlate: string;
  serviceType: string;            // "Oil Change", "Brake Replacement", "Engine Overhaul"
  issueDescription: string;
  date: string;                   // ISO date
  cost: number;
  technicianName: string;
  status: string;                 // "New", "In Progress", "Completed"
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `vehicleId` (ascending)
- `status` (ascending)
- `date` (descending)

---

### 6. **expenses**
```typescript
expenses/{expenseId}
{
  id: string;                     // "EXP-001"
  tripId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  distance: number;               // km
  fuelLiters: number;
  fuelCost: number;
  miscExpense: number;
  totalCost: number;              // calculated
  costPerKm: number;              // calculated
  date: string;                   // ISO date
  notes: string;
  status: string;                 // "Pending", "Approved", "Rejected"
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `tripId` (ascending)
- `vehicleId` (ascending)
- `status` (ascending)
- `date` (descending)

---

### 7. **monthlyFinancials**
```typescript
monthlyFinancials/{monthYear}    // "2026-02"
{
  month: string;                  // "Feb 2026"
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  netProfit: number;
  calculatedAt: Timestamp;
}
```

**Indexes:** Document ID is the key

---

### 8. **fuelEfficiency**
```typescript
fuelEfficiency/{monthYear}       // "2026-02"
{
  month: string;                  // "Feb"
  kmPerLiter: number;
  calculatedAt: Timestamp;
}
```

---

### 9. **tripEmissions**
```typescript
tripEmissions/{emissionId}
{
  tripId: string;
  vehiclePlate: string;
  distance: number;
  fuelConsumed: number;
  co2Emissions: number;           // kg
  date: string;
  createdAt: Timestamp;
}
```

**Indexes:**
- `tripId` (ascending)
- `date` (descending)

---

### 10. **vehicleEmissions**
```typescript
vehicleEmissions/{vehicleId}
{
  vehicleId: string;
  plate: string;
  totalCO2: number;               // kg
  avgEmissionsPerKm: number;
  fuelType: string;               // "Diesel", "CNG", "Petrol", "Electric"
  updatedAt: Timestamp;
}
```

---

### 11. **emissionTrends**
```typescript
emissionTrends/{monthYear}       // "2026-02"
{
  month: string;                  // "Feb"
  co2Tons: number;
  target: number;
  calculatedAt: Timestamp;
}
```

---

### 12. **routeOptimizations**
```typescript
routeOptimizations/{optimizationId}
{
  tripId: string;                 // optional
  origin: string;
  destination: string;
  standardRoute: {
    distance: number;
    duration: number;             // hours
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
  date: string;
  createdAt: Timestamp;
}
```

**Indexes:**
- `tripId` (ascending)
- `date` (descending)

---

## 🔴 Firebase Realtime Database

### Live Tracking Structure
```json
{
  "liveTracking": {
    "v1": {
      "id": "v1",
      "plate": "MH-01-AB-1234",
      "lat": 19.0760,
      "lng": 72.8777,
      "status": "Moving",
      "speed": 65,
      "destination": "Delhi",
      "eta": "22:30",
      "lastUpdated": 1708456789000
    },
    "v2": { ... }
  }
}
```

---

## 🔐 Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // All collections - simple auth check
    match /{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## 🔄 Data Relationships

```
vehicles (1) ──> (N) trips
vehicles (1) ──> (N) serviceLogs
vehicles (1) ──> (N) expenses
vehicles (1) ──> (1) liveTracking
vehicles (1) ──> (1) vehicleEmissions

drivers (1) ──> (N) trips
drivers (1) ──> (N) complaints [sub-collection]
drivers (1) ──> (N) performanceHistory [sub-collection]

trips (1) ──> (N) expenses
trips (1) ──> (1) tripEmissions
trips (1) ──> (1) routeOptimizations
```

---

## 📝 Implementation Notes

### Phase 1 - Core (Week 1)
1. users
2. vehicles
3. drivers
4. trips

### Phase 2 - Operations (Week 2)
5. serviceLogs
6. expenses
7. monthlyFinancials
8. fuelEfficiency

### Phase 3 - Advanced (Week 3)
9. tripEmissions
10. vehicleEmissions
11. emissionTrends
12. routeOptimizations
13. liveTracking (Realtime DB)

---

## 🚀 Quick Start

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Initialize Firebase
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "YOUR_DATABASE_URL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
```

### 3. Example CRUD Operations

**Add Vehicle:**
```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

const addVehicle = async (vehicleData) => {
  await addDoc(collection(db, 'vehicles'), {
    ...vehicleData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};
```

**Get Vehicles:**
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';

const getVehicles = async () => {
  const q = query(collection(db, 'vehicles'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

**Update Vehicle Status:**
```typescript
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

const updateVehicleStatus = async (vehicleId, status) => {
  const vehicleRef = doc(db, 'vehicles', vehicleId);
  await updateDoc(vehicleRef, {
    status,
    updatedAt: Timestamp.now()
  });
};
```

**Live Tracking (Realtime DB):**
```typescript
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from './lib/firebase';

// Listen to live tracking
const trackVehicle = (vehicleId, callback) => {
  const vehicleRef = ref(rtdb, `liveTracking/${vehicleId}`);
  onValue(vehicleRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Update location
const updateLocation = async (vehicleId, data) => {
  const vehicleRef = ref(rtdb, `liveTracking/${vehicleId}`);
  await set(vehicleRef, {
    ...data,
    lastUpdated: Date.now()
  });
};
```

---

## 📊 Sample Data Structure

### Vehicle Document
```json
{
  "id": "v1",
  "plate": "MH-01-AB-1234",
  "model": "Tata Ace",
  "type": "Truck",
  "capacityTon": 5,
  "odometer": 70000,
  "status": "Available",
  "acquisitionCost": 800000,
  "totalFuelCost": 125000,
  "totalMaintenanceCost": 45000,
  "totalRevenue": 320000,
  "fuelType": "Diesel",
  "totalCO2Emissions": 2450,
  "avgEmissionsPerKm": 0.377,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-02-20T14:22:00Z"
}
```

### Trip Document
```json
{
  "id": "TRP-001",
  "vehicleId": "v2",
  "vehiclePlate": "DL-01-YZ-5678",
  "driverId": "d1",
  "driverName": "Rajesh Kumar",
  "origin": "Mumbai",
  "destination": "Delhi",
  "distance": 1400,
  "cargoWeight": 12000,
  "estimatedCost": 45000,
  "status": "On Way",
  "date": "2026-02-18",
  "fuelConsumed": 210,
  "co2Emissions": 554.4,
  "routeOptimized": true,
  "optimizationSavings": {
    "distance": 70,
    "time": 2,
    "cost": 2800,
    "co2": 28
  },
  "createdAt": "2026-02-18T08:00:00Z",
  "updatedAt": "2026-02-18T08:00:00Z"
}
```

---

## 🎯 Key Features

✅ **Simple Authentication** - Email/password only  
✅ **No RBAC** - All authenticated users have same access  
✅ **Denormalized Data** - vehiclePlate, driverName for performance  
✅ **Sub-collections** - complaints, performanceHistory under drivers  
✅ **Realtime Tracking** - Separate Realtime DB for GPS  
✅ **Aggregated Data** - Monthly financials, emissions, fuel efficiency  
✅ **Calculated Fields** - totalCost, costPerKm, netProfit  

---

## 💡 Best Practices

1. **Use Timestamps** - Always use Firestore Timestamp for dates
2. **Denormalize** - Store frequently accessed data (plate, name)
3. **Batch Writes** - Update related documents together
4. **Indexes** - Create composite indexes for complex queries
5. **Realtime for Live Data** - Use Realtime DB for GPS tracking
6. **Cloud Functions** - Automate calculations and aggregations
