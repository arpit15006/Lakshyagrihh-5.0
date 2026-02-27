import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useFleetStore } from '../store/useFleetStore';

export function TripDispatcherPage() {
    const { trips, vehicles, drivers, addTrip } = useFleetStore();

    // Form state
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [weight, setWeight] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [estCost, setEstCost] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!vehicleId && vehicles.length > 0) setVehicleId(vehicles[0].id);
        if (!driverId && drivers.length > 0) setDriverId(drivers[0].id);
    }, [vehicles, drivers, vehicleId, driverId]);

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const vehicle = vehicles.find(v => v.id === vehicleId);
        const driver = drivers.find(d => d.id === driverId);
        if (!vehicle || !driver) {
            setError('Please select a valid vehicle and driver.');
            return;
        }

        const cargoWeight = parseFloat(weight);
        const vehicleCapacityKg = vehicle.capacityTon * 1000;

        if (cargoWeight > vehicleCapacityKg) {
            setError(`Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicleCapacityKg}kg).`);
            return;
        }

        const estimatedCostNum = parseFloat(estCost) || 0;

        addTrip({
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.plate,
            driverId: driver.id,
            driverName: driver.name,
            origin: origin,
            destination: destination,
            distance: 0, // In reality, calculate via API or user input
            cargoWeight: cargoWeight,
            estimatedCost: estimatedCostNum,
            status: "On Way",
            date: new Date().toISOString().split('T')[0]
        });

        // Reset
        setWeight(''); setOrigin(''); setDestination(''); setEstCost('');
    };

    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleCapacityKg = selectedVehicle ? selectedVehicle.capacityTon * 1000 : 0;
    const isOverweight = selectedVehicle && weight && parseFloat(weight) > vehicleCapacityKg;

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
                                    <TableCell className="font-medium text-muted-foreground px-6 py-3 text-sm">#{trip.id.substring(0, 8)}</TableCell>
                                    <TableCell className="text-foreground font-medium px-6 py-3 text-sm">{trip.vehiclePlate}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.origin}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.destination}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${trip.status === "On Way"
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                : trip.status === "Completed"
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
                                    {vehicles.map(v => (
                                        <SelectItem key={v.id} value={v.id} className="hover:bg-muted transition-colors text-popover-foreground">{v.plate} ({v.capacityTon * 1000}kg max)</SelectItem>
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
                                    {drivers.map(d => (
                                        <SelectItem key={d.id} value={d.id} className="hover:bg-muted transition-colors text-popover-foreground">{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Cargo Weight (kg)</Label>
                            <Input required type="number" placeholder="Enter weight" className="h-10 rounded-lg border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-150" value={weight} onChange={e => setWeight(e.target.value)} />
                            {isOverweight && <p className="text-destructive text-xs mt-1">Cargo weight exceeds vehicle capacity ({vehicleCapacityKg}kg).</p>}
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
        </motion.div>
    );
}
