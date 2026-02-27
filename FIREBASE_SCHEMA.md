# Firebase Database Schema - FleetFlow

## 🔥 Firebase Services Required
- **Firestore Database** - Main data storage
- **Firebase Authentication** - User management
- **Firebase Storage** - Document/image uploads (optional)
- **Firebase Realtime Database** - Live GPS tracking (optional for real-time updates)

---

## 📊 Firestore Collections Structure

### 1. **users** Collection
```typescript
users/{userId}
{
  uid: string;                    // Firebase Auth UID
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'viewer';
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}
```

**Indexes:**
- `email` (ascending)
- `role` (ascending)

---

### 2. **vehicles** Collection
```typescript
vehicles/{vehicleId}
{
  id: string;                     // Auto-generated or custom
  plate: string;                  // Unique vehicle plate number
  model: string;
  type: 'Truck' | 'Trailer' | 'Van' | 'Other';
  capacityTon: number;
  odometer: number;               // Current odometer reading
  status: 'Available' | 'On Trip' | 'In Shop' | 'Idle';
  
  // Financial tracking
  acquisitionCost: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalRevenue: number;
  
  // Carbon tracking
  fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
  totalCO2Emissions: number;      // in kg
  avgEmissionsPerKm: number;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;              // userId
  
  // Optional
  registrationDate?: string;
  insuranceExpiry?: string;
  lastServiceDate?: string;
}
```

**Indexes:**
- `plate` (ascending) - UNIQUE
- `status` (ascending)
- `type` (ascending)
- `fuelType` (ascending)

**Composite Indexes:**
- `status` (ascending) + `type` (ascending)

---

### 3. **drivers** Collection
```typescript
drivers/{driverId}
{
  id: string;
  name: string;
  licenseNumber: string;          // Unique
  licenseExpiry: string;          // ISO date
  phone: string;
  email?: string;
  status: 'On Duty' | 'Off Duty' | 'Suspended';
  
  // Performance metrics
  completionRate: number;         // 0-100
  safetyScore: number;            // 0-100
  tripsCompleted: number;
  totalDistanceDriven: number;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  hireDate?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}
```

**Sub-collection: complaints**
```typescript
drivers/{driverId}/complaints/{complaintId}
{
  id: string;
  date: string;                   // ISO date
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved' | 'Dismissed';
  reportedBy: string;             // userId
  resolvedBy?: string;            // userId
  resolvedAt?: Timestamp;
  notes?: string;
}
```

**Sub-collection: performanceHistory**
```typescript
drivers/{driverId}/performanceHistory/{monthYear}
{
  month: string;                  // e.g., "Feb 2026"
  completionRate: number;
  safetyScore: number;
  tripsCompleted: number;
  distanceDriven: number;
  timestamp: Timestamp;
}
```

**Indexes:**
- `licenseNumber` (ascending) - UNIQUE
- `status` (ascending)
- `licenseExpiry` (ascending)

---

### 4. **trips** Collection
```typescript
trips/{tripId}
{
  id: string;                     // e.g., "TRP-001"
  vehicleId: string;              // Reference to vehicles
  vehiclePlate: string;           // Denormalized for quick access
  driverId: string;               // Reference to drivers
  driverName: string;             // Denormalized
  
  // Route details
  origin: string;
  destination: string;
  distance: number;               // in km
  
  // Cargo details
  cargoWeight: number;            // in kg
  cargoDescription?: string;
  
  // Financial
  estimatedCost: number;
  actualCost?: number;
  revenue?: number;
  
  // Status tracking
  status: 'Preparing' | 'On Way' | 'Completed' | 'Cancelled';
  
  // Timestamps
  date: string;                   // Trip start date (ISO)
  startTime?: Timestamp;
  endTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Carbon tracking
  fuelConsumed?: number;          // in liters
  co2Emissions?: number;          // in kg
  
  // Route optimization (if applied)
  routeOptimized: boolean;
  optimizationSavings?: {
    distance: number;
    time: number;
    cost: number;
    co2: number;
  };
  
  // Additional
  notes?: string;
  customerName?: string;
  customerContact?: string;
}
```

**Indexes:**
- `vehicleId` (ascending)
- `driverId` (ascending)
- `status` (ascending)
- `date` (descending)

**Composite Indexes:**
- `status` (ascending) + `date` (descending)
- `vehicleId` (ascending) + `date` (descending)
- `driverId` (ascending) + `date` (descending)

---

### 5. **serviceLogs** Collection
```typescript
serviceLogs/{serviceLogId}
{
  id: string;                     // e.g., "SVC-001"
  vehicleId: string;              // Reference to vehicles
  vehiclePlate: string;           // Denormalized
  
  // Service details
  serviceType: 'Oil Change' | 'Brake Replacement' | 'Engine Overhaul' | 
               'Tire Replacement' | 'General Inspection' | 'Other';
  issueDescription: string;
  
  // Cost and technician
  cost: number;
  technicianName: string;
  workshopName?: string;
  
  // Status tracking
  status: 'New' | 'In Progress' | 'Completed';
  
  // Timestamps
  date: string;                   // Service date (ISO)
  scheduledDate?: string;
  completedDate?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Parts and labor
  partsUsed?: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
  laborHours?: number;
  
  // Odometer reading at service
  odometerReading?: number;
  
  // Additional
  notes?: string;
  invoiceUrl?: string;            // Firebase Storage URL
  nextServiceDue?: string;
}
```

**Indexes:**
- `vehicleId` (ascending)
- `status` (ascending)
- `date` (descending)

**Composite Indexes:**
- `vehicleId` (ascending) + `date` (descending)
- `status` (ascending) + `date` (descending)

---

### 6. **expenses** Collection
```typescript
expenses/{expenseId}
{
  id: string;                     // e.g., "EXP-001"
  tripId: string;                 // Reference to trips
  vehicleId: string;              // Reference to vehicles
  vehiclePlate: string;           // Denormalized
  driverId: string;               // Reference to drivers
  driverName: string;             // Denormalized
  
  // Expense breakdown
  distance: number;               // in km
  fuelLiters: number;
  fuelCost: number;
  miscExpense: number;
  tollCharges?: number;
  parkingFees?: number;
  otherExpenses?: number;
  
  // Calculated
  totalCost: number;              // Auto-calculated
  costPerKm: number;              // Auto-calculated
  
  // Status
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;            // userId
  approvedAt?: Timestamp;
  rejectionReason?: string;
  
  // Timestamps
  date: string;                   // Expense date (ISO)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Additional
  notes?: string;
  receiptUrls?: string[];         // Firebase Storage URLs
  category?: 'Fuel' | 'Maintenance' | 'Toll' | 'Other';
}
```

**Indexes:**
- `tripId` (ascending)
- `vehicleId` (ascending)
- `status` (ascending)
- `date` (descending)

**Composite Indexes:**
- `status` (ascending) + `date` (descending)
- `vehicleId` (ascending) + `date` (descending)

---

### 7. **monthlyFinancials** Collection
```typescript
monthlyFinancials/{monthYear}    // e.g., "2026-02"
{
  month: string;                  // e.g., "Feb 2026"
  year: number;
  monthNumber: number;            // 1-12
  
  // Financial metrics
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  otherExpenses: number;
  netProfit: number;              // Auto-calculated
  
  // Trip metrics
  totalTrips: number;
  completedTrips: number;
  totalDistance: number;
  
  // Carbon metrics
  totalCO2Emissions: number;      // in kg
  
  // Calculated at month end
  calculatedAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `year` (descending) + `monthNumber` (descending)

---

### 8. **fuelEfficiency** Collection
```typescript
fuelEfficiency/{monthYear}       // e.g., "2026-02"
{
  month: string;                  // e.g., "Feb"
  year: number;
  monthNumber: number;
  
  // Efficiency metrics
  kmPerLiter: number;
  totalFuelConsumed: number;      // in liters
  totalDistanceCovered: number;   // in km
  
  // By vehicle type
  byVehicleType: {
    Truck: { kmPerLiter: number; count: number; };
    Trailer: { kmPerLiter: number; count: number; };
    Van: { kmPerLiter: number; count: number; };
  };
  
  // Timestamps
  calculatedAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 9. **carbonEmissions** Collection
```typescript
carbonEmissions/{emissionId}
{
  id: string;
  type: 'trip' | 'vehicle' | 'monthly';
  
  // If type === 'trip'
  tripId?: string;
  vehicleId: string;
  vehiclePlate: string;
  distance: number;
  fuelConsumed: number;
  co2Emissions: number;           // in kg
  date: string;
  
  // If type === 'vehicle' (aggregated)
  totalCO2?: number;
  avgEmissionsPerKm?: number;
  fuelType?: 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
  
  // If type === 'monthly' (aggregated)
  month?: string;
  co2Tons?: number;
  target?: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- `type` (ascending)
- `tripId` (ascending)
- `vehicleId` (ascending)
- `date` (descending)

---

### 10. **routeOptimizations** Collection
```typescript
routeOptimizations/{optimizationId}
{
  id: string;
  tripId?: string;                // If linked to a trip
  
  // Route details
  origin: string;
  destination: string;
  waypoints?: string[];
  
  // Standard route
  standardRoute: {
    distance: number;             // in km
    duration: number;             // in minutes
    co2: number;                  // in kg
    cost: number;
  };
  
  // Optimized route
  optimizedRoute: {
    distance: number;
    duration: number;
    co2: number;
    cost: number;
    algorithm?: string;           // e.g., "Dijkstra", "A*"
  };
  
  // Savings
  savings: {
    distance: number;             // km saved
    time: number;                 // minutes saved
    co2: number;                  // kg CO2 saved
    cost: number;                 // ₹ saved
  };
  
  // Status
  applied: boolean;               // Whether optimization was used
  appliedAt?: Timestamp;
  
  // Timestamps
  date: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;              // userId
}
```

**Indexes:**
- `tripId` (ascending)
- `applied` (ascending)
- `date` (descending)

---

### 11. **liveTracking** Collection (or Realtime Database)
```typescript
liveTracking/{vehicleId}
{
  id: string;
  vehicleId: string;
  plate: string;
  
  // GPS coordinates
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
  
  // Status
  status: 'Moving' | 'Idle' | 'Stopped';
  speed: number;                  // in km/h
  heading?: number;               // 0-360 degrees
  
  // Trip info
  currentTripId?: string;
  destination?: string;
  eta?: string;                   // ISO timestamp
  distanceRemaining?: number;
  
  // Timestamps
  lastUpdated: Timestamp;
  
  // Driver info
  driverId?: string;
  driverName?: string;
}
```

**Note:** For real-time updates, consider using **Firebase Realtime Database** instead of Firestore for this collection.

**Indexes:**
- `status` (ascending)
- `lastUpdated` (descending)

---

### 12. **emissionTrends** Collection
```typescript
emissionTrends/{monthYear}       // e.g., "2026-02"
{
  month: string;                  // e.g., "Feb"
  year: number;
  monthNumber: number;
  
  // Emission data
  co2Tons: number;
  target: number;
  achievement: number;            // Percentage
  
  // Breakdown by fuel type
  byFuelType: {
    Diesel: number;
    Petrol: number;
    CNG: number;
    Electric: number;
  };
  
  // Comparison
  previousMonth?: {
    co2Tons: number;
    change: number;               // Percentage change
  };
  
  // Timestamps
  calculatedAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 13. **notifications** Collection
```typescript
notifications/{notificationId}
{
  id: string;
  userId: string;                 // Recipient
  type: 'license_expiry' | 'maintenance_due' | 'trip_completed' | 
        'expense_pending' | 'target_exceeded' | 'other';
  
  // Content
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  
  // Status
  read: boolean;
  readAt?: Timestamp;
  
  // Action link
  actionUrl?: string;
  actionLabel?: string;
  
  // Related entities
  relatedEntityType?: 'vehicle' | 'driver' | 'trip' | 'expense';
  relatedEntityId?: string;
  
  // Timestamps
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}
```

**Indexes:**
- `userId` (ascending) + `read` (ascending) + `createdAt` (descending)

---

### 14. **settings** Collection
```typescript
settings/appSettings
{
  // Carbon calculation
  carbonFactors: {
    diesel: number;               // kg CO2 per liter (default: 2.64)
    petrol: number;
    cng: number;
    electric: number;
  };
  
  // Cost calculation
  costFactors: {
    fuelPricePerLiter: {
      diesel: number;
      petrol: number;
      cng: number;
    };
    laborCostPerHour: number;
    defaultTollRate: number;
  };
  
  // Targets
  monthlyTargets: {
    co2EmissionsTons: number;
    revenue: number;
    fuelEfficiency: number;       // km per liter
  };
  
  // Alerts
  alerts: {
    licenseExpiryDays: number;    // Alert X days before expiry
    maintenanceDueDays: number;
    lowFuelEfficiencyThreshold: number;
  };
  
  // Updated
  updatedAt: Timestamp;
  updatedBy: string;              // userId
}
```

---

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isManagerOrAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Vehicles collection
    match /vehicles/{vehicleId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // Drivers collection
    match /drivers/{driverId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
      
      match /complaints/{complaintId} {
        allow read: if isAuthenticated();
        allow write: if isManagerOrAdmin();
      }
      
      match /performanceHistory/{monthYear} {
        allow read: if isAuthenticated();
        allow write: if isManagerOrAdmin();
      }
    }
    
    // Trips collection
    match /trips/{tripId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // Service logs
    match /serviceLogs/{serviceLogId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // Expenses
    match /expenses/{expenseId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isManagerOrAdmin();
      allow delete: if isAdmin();
    }
    
    // Financial data (read-only for non-admins)
    match /monthlyFinancials/{monthYear} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /fuelEfficiency/{monthYear} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Carbon emissions
    match /carbonEmissions/{emissionId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    match /emissionTrends/{monthYear} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Route optimizations
    match /routeOptimizations/{optimizationId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // Live tracking
    match /liveTracking/{vehicleId} {
      allow read: if isAuthenticated();
      allow write: if isManagerOrAdmin();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
                    resource.data.userId == request.auth.uid;
      allow write: if isManagerOrAdmin();
    }
    
    // Settings (admin only)
    match /settings/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## 📱 Firebase Realtime Database Structure (for Live Tracking)

```json
{
  "liveTracking": {
    "v1": {
      "vehicleId": "v1",
      "plate": "MH-01-AB-1234",
      "lat": 19.0760,
      "lng": 72.8777,
      "status": "Moving",
      "speed": 65,
      "heading": 180,
      "currentTripId": "TRP-001",
      "destination": "Delhi",
      "eta": "2026-02-20T18:30:00Z",
      "lastUpdated": 1708456789000,
      "driverId": "d1",
      "driverName": "Rajesh Kumar"
    },
    "v2": { ... }
  }
}
```

**Security Rules (Realtime Database):**
```json
{
  "rules": {
    "liveTracking": {
      "$vehicleId": {
        ".read": "auth != null",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() == 'admin' || root.child('users').child(auth.uid).child('role').val() == 'manager')"
      }
    }
  }
}
```

---

## 🔄 Data Relationships

```
users (1) ──────────> (N) trips [createdBy]
users (1) ──────────> (N) notifications [userId]

vehicles (1) ───────> (N) trips [vehicleId]
vehicles (1) ───────> (N) serviceLogs [vehicleId]
vehicles (1) ───────> (N) expenses [vehicleId]
vehicles (1) ───────> (1) liveTracking [vehicleId]
vehicles (1) ───────> (N) carbonEmissions [vehicleId]

drivers (1) ────────> (N) trips [driverId]
drivers (1) ────────> (N) expenses [driverId]
drivers (1) ────────> (N) complaints [sub-collection]
drivers (1) ────────> (N) performanceHistory [sub-collection]

trips (1) ──────────> (N) expenses [tripId]
trips (1) ──────────> (1) carbonEmissions [tripId]
trips (1) ──────────> (1) routeOptimizations [tripId]
```

---

## 📊 Aggregation Strategy

### Cloud Functions for Aggregations:
1. **onTripCompleted** - Update vehicle stats, driver stats, monthly financials
2. **onExpenseApproved** - Update vehicle costs, monthly financials
3. **onServiceCompleted** - Update vehicle maintenance costs
4. **calculateMonthlyMetrics** - Scheduled function (runs monthly)
5. **updateLiveTracking** - Real-time updates from GPS devices
6. **calculateCarbonEmissions** - On trip completion

---

## 🚀 Implementation Priority

### Phase 1 (Core):
1. users
2. vehicles
3. drivers
4. trips
5. expenses

### Phase 2 (Operations):
6. serviceLogs
7. monthlyFinancials
8. fuelEfficiency
9. notifications

### Phase 3 (Advanced):
10. carbonEmissions
11. emissionTrends
12. routeOptimizations
13. liveTracking
14. settings

---

## 📝 Notes

- Use **Firestore Timestamps** for all date/time fields
- Implement **denormalization** for frequently accessed data (e.g., vehiclePlate, driverName)
- Use **composite indexes** for complex queries
- Consider **Cloud Functions** for data aggregation and calculations
- Use **Firebase Storage** for file uploads (receipts, invoices, documents)
- Implement **batch writes** for related updates
- Use **transactions** for financial operations
- Set up **backup strategy** for critical data
