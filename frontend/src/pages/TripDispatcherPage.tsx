import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { UserRole } from '../constants/auth';

const INITIAL_TRIPS = [
    { id: 1, type: "Trailer Truck", origin: "Mumbai", destination: "Delhi", status: "On Way" },
    { id: 2, type: "Mini Truck", origin: "Ahmedabad", destination: "Surat", status: "On Way" },
    { id: 3, type: "Van", origin: "Pune", destination: "Mumbai", status: "Idle" },
    { id: 4, type: "Trailer", origin: "Delhi", destination: "Jaipur", status: "On Way" }
];

const MOCK_VEHICLES = [
    { id: "v1", plate: "MH00AB1234", capacityKg: 5000, label: "MH00AB1234 (5000kg max)" },
    { id: "v2", plate: "DL01YZ5678", capacityKg: 500, label: "DL01YZ5678 (500kg max)" }
];

const MOCK_DRIVERS = [
    { id: "d1", name: "John Doe" },
    { id: "d2", name: "Alex Smith" }
];

export function TripDispatcherPage() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { role: 'guest' };
    const role = user.role as UserRole;

    const [trips, setTrips] = useState(INITIAL_TRIPS);

    // Form state
    const [vehicleId, setVehicleId] = useState(MOCK_VEHICLES[0].id);
    const [driverId, setDriverId] = useState(MOCK_DRIVERS[0].id);
    const [weight, setWeight] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [estCost, setEstCost] = useState('');
    const [error, setError] = useState('');

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const cargoWeight = parseFloat(weight);
        if (cargoWeight > vehicle.capacityKg) {
            setError(`Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.capacityKg}kg).`);
            return;
        }

        const newTrip = {
            id: trips.length + 1,
            type: "Truck",
            origin: origin,
            destination: destination,
            status: "Preparing"
        };

        setTrips([...trips, newTrip]);
        // Reset
        setWeight(''); setOrigin(''); setDestination(''); setEstCost('');
        alert('Trip Dispatched successfully!');
    };

    const selectedVehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
    const isOverweight = selectedVehicle && weight && parseFloat(weight) > selectedVehicle.capacityKg;

    const canSchedule = role !== 'safety_officer';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Trip Dispatcher</h1>
                    <p className="text-sm text-muted-foreground">Monitor active routes and assign new trips.</p>
                </div>
            </div>

            <Card className="rounded-xl border-border bg-card overflow-hidden mb-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Trip No</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Fleet Type</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Origin</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Destination</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trips.map((trip) => (
                                <TableRow key={trip.id} className="border-b border-border hover:bg-muted/50 transition-colors group">
                                    <TableCell className="font-medium text-muted-foreground px-6 py-3 text-sm">#{trip.id}</TableCell>
                                    <TableCell className="text-foreground font-medium px-6 py-3 text-sm">{trip.type}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.origin}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.destination}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${trip.status === "On Way"
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                : trip.status === "On Trip"
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {trip.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {canSchedule ? (
                <Card className="p-6 rounded-xl border border-border bg-card mt-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Schedule New Trip
                        </h2>
                    </div>
                    <div className="border-t border-border my-4"></div>
                    <form onSubmit={handleDispatch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Select Vehicle</Label>
                                <Select value={vehicleId} onValueChange={setVehicleId}>
                                    <SelectTrigger className="w-full h-10 border-border focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-lg transition-all duration-150">
                                        <SelectValue placeholder="Select a vehicle" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-md border-border bg-popover">
                                        {MOCK_VEHICLES.map(v => (
                                            <SelectItem key={v.id} value={v.id} className="hover:bg-muted transition-colors text-popover-foreground">{v.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Select Driver</Label>
                                <Select value={driverId} onValueChange={setDriverId}>
                                    <SelectTrigger className="w-full h-10 border-border focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-lg transition-all duration-150">
                                        <SelectValue placeholder="Select a driver" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-md border-border bg-popover">
                                        {MOCK_DRIVERS.map(d => (
                                            <SelectItem key={d.id} value={d.id} className="hover:bg-muted transition-colors text-popover-foreground">{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Cargo Weight (kg)</Label>
                                <Input required type="number" placeholder="Enter weight" className="h-10 rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150" value={weight} onChange={e => setWeight(e.target.value)} />
                                {isOverweight && <p className="text-destructive text-xs mt-1">Cargo weight exceeds vehicle capacity ({selectedVehicle?.capacityKg}kg).</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Estimated Fuel Cost</Label>
                                <Input required type="number" placeholder="$0.00" className="h-10 rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150" value={estCost} onChange={e => setEstCost(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Origin Address</Label>
                                <Input required placeholder="Ex: Warehouse A" className="h-10 rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150" value={origin} onChange={e => setOrigin(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">Destination</Label>
                                <Input required placeholder="Ex: Client Site B" className="h-10 rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150" value={destination} onChange={e => setDestination(e.target.value)} />
                            </div>
                        </div>

                        {error && !isOverweight && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">{error}</div>}

                        <div className="pt-2">
                            <Button type="submit" disabled={!!isOverweight} className="w-full py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150 active:scale-95">Confirm & Dispatch Trip</Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <Card className="p-12 rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center text-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-medium text-foreground">Trip Scheduling Restricted</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1">Operational actions are restricted for your current role ({role}). Contact a manager for access.</p>
                </Card>
            )}
        </motion.div>
    );
}
