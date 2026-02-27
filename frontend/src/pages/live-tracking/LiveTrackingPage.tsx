import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table, TableBody, TableCell, TableRow } from '../../components/ui/table';
import { MapPin, Navigation, Truck, Clock } from 'lucide-react';
import type { LiveVehicle } from '../../types/carbon';
import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '../../lib/firebase';
import { useFleetStore } from '../../store/useFleetStore';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function LiveTrackingPage() {
    const { vehicles } = useFleetStore();
    const [liveData, setLiveData] = useState<Record<string, Partial<LiveVehicle>>>({});
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

    useEffect(() => {
        const liveTrackingRef = ref(rtdb, 'liveTracking');

        const listener = onValue(liveTrackingRef, (snapshot) => {
            if (snapshot.exists()) {
                setLiveData(snapshot.val());
            } else {
                setLiveData({});
            }
        });

        return () => off(liveTrackingRef, 'value', listener);
    }, []);

    const activeVehicles = useMemo(() => {
        return vehicles.map(v => {
            const live = liveData[v.id] || {};
            // Default center of India if no GPS data
            return {
                id: v.id,
                plate: v.plate,
                status: live.status || (v.status === 'On Trip' ? 'Moving' : 'Idle'),
                lat: live.lat || 20.5937 + (Math.random() - 0.5) * 5,
                lng: live.lng || 78.9629 + (Math.random() - 0.5) * 5,
                speed: live.speed || 0,
                destination: live.destination || 'N/A',
                eta: live.eta || 'N/A'
            } as LiveVehicle;
        });
    }, [vehicles, liveData]);

    const selectedVehicle = useMemo(() => activeVehicles.find(v => v.id === selectedVehicleId) || null, [activeVehicles, selectedVehicleId]);

    const movingVehicles = activeVehicles.filter(v => v.status === 'Moving').length;
    const idleVehicles = activeVehicles.filter(v => v.status === 'Idle').length;
    const avgSpeed = activeVehicles.filter(v => v.status === 'Moving').reduce((sum, v) => sum + v.speed, 0) / (movingVehicles || 1);

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
                            {activeVehicles.map((vehicle) => (
                                <Marker
                                    key={vehicle.id}
                                    position={[vehicle.lat, vehicle.lng]}
                                    eventHandlers={{
                                        click: () => setSelectedVehicleId(vehicle.id),
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
                                {activeVehicles.map((vehicle) => (
                                    <TableRow
                                        key={vehicle.id}
                                        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedVehicleId(vehicle.id)}
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
