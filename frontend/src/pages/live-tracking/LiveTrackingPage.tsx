import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table, TableBody, TableCell, TableRow } from '../../components/ui/table';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';
import type { LiveVehicle } from '../../types/carbon';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LIVE_VEHICLES: LiveVehicle[] = [
    { id: 'v1', plate: 'MH-01-AB-1234', lat: 19.0760, lng: 72.8777, status: 'Moving', speed: 65, destination: 'Delhi', eta: '22:30' },
    { id: 'v2', plate: 'DL-01-YZ-5678', lat: 28.7041, lng: 77.1025, status: 'Idle', speed: 0, destination: 'Jaipur', eta: '18:45' },
    { id: 'v3', plate: 'KA-05-CD-9012', lat: 12.9716, lng: 77.5946, status: 'Moving', speed: 72, destination: 'Chennai', eta: '20:15' },
    { id: 'v4', plate: 'TN-07-GH-7890', lat: 13.0827, lng: 80.2707, status: 'Stopped', speed: 0, destination: 'Bangalore', eta: '23:00' },
    { id: 'v5', plate: 'GJ-03-EF-3456', lat: 23.0225, lng: 72.5714, status: 'Moving', speed: 58, destination: 'Mumbai', eta: '19:30' },
];

export function LiveTrackingPage() {
    const [vehicles, setVehicles] = useState(LIVE_VEHICLES);
    const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles(prev => prev.map(v => ({
                ...v,
                lat: v.status === 'Moving' ? v.lat + (Math.random() - 0.5) * 0.01 : v.lat,
                lng: v.status === 'Moving' ? v.lng + (Math.random() - 0.5) * 0.01 : v.lng,
                speed: v.status === 'Moving' ? Math.max(45, Math.min(80, v.speed + (Math.random() - 0.5) * 10)) : 0,
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const movingVehicles = vehicles.filter(v => v.status === 'Moving').length;
    const idleVehicles = vehicles.filter(v => v.status === 'Idle').length;
    const avgSpeed = vehicles.filter(v => v.status === 'Moving').reduce((sum, v) => sum + v.speed, 0) / movingVehicles || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Live GPS Tracking"
                subtitle="Real-time vehicle location and status monitoring."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Active Vehicles" value={`${movingVehicles}`} icon={Truck} iconColor="text-green-600 bg-green-50" />
                <MetricCard title="Idle Vehicles" value={`${idleVehicles}`} icon={MapPin} iconColor="text-amber-600 bg-amber-50" />
                <MetricCard title="Avg Speed" value={`${avgSpeed.toFixed(0)} km/h`} icon={Navigation} iconColor="text-blue-600 bg-blue-50" />
                <MetricCard title="On-Time Delivery" value="94%" icon={Clock} iconColor="text-purple-600 bg-purple-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Live Map View</h3>
                    <div className="h-96 rounded-lg overflow-hidden">
                        <MapContainer
                            center={[20.5937, 78.9629]}
                            zoom={5}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {vehicles.map((vehicle) => (
                                <Marker
                                    key={vehicle.id}
                                    position={[vehicle.lat, vehicle.lng]}
                                    eventHandlers={{
                                        click: () => setSelectedVehicle(vehicle),
                                    }}
                                >
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-semibold">{vehicle.plate}</p>
                                            <p>Status: {vehicle.status}</p>
                                            <p>Speed: {vehicle.speed} km/h</p>
                                            <p>Destination: {vehicle.destination}</p>
                                            <p>ETA: {vehicle.eta}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                    {selectedVehicle && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-foreground">{selectedVehicle.plate}</p>
                                    <p className="text-sm text-muted-foreground">Destination: {selectedVehicle.destination}</p>
                                    <p className="text-sm text-muted-foreground">Speed: {selectedVehicle.speed} km/h</p>
                                    <p className="text-sm text-muted-foreground">ETA: {selectedVehicle.eta}</p>
                                </div>
                                <Badge variant={selectedVehicle.status === 'Moving' ? 'success' : selectedVehicle.status === 'Idle' ? 'warning' : 'outline'}>
                                    {selectedVehicle.status}
                                </Badge>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">Vehicle Status</h3>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                        <Table>
                            <TableBody>
                                {vehicles.map((vehicle) => (
                                    <TableRow
                                        key={vehicle.id}
                                        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedVehicle(vehicle)}
                                    >
                                        <TableCell className="px-6 py-3">
                                            <div className="space-y-1">
                                                <p className="font-medium text-foreground text-sm">{vehicle.plate}</p>
                                                <p className="text-xs text-muted-foreground">{vehicle.destination}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={vehicle.status === 'Moving' ? 'success' : vehicle.status === 'Idle' ? 'warning' : 'outline'} className="text-xs">
                                                        {vehicle.status}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{vehicle.speed} km/h</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
