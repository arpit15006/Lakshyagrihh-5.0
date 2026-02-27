import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Leaf, TrendingDown, Target, TreePine, Download } from 'lucide-react';
import type { TripEmission, VehicleEmission, EmissionTrend } from '../../types/carbon';

// Mock Data
const TRIP_EMISSIONS: TripEmission[] = [
    { tripId: 'TRP-001', vehiclePlate: 'MH-01-AB-1234', distance: 840, fuelConsumed: 120, co2Emissions: 316.8, date: '2026-02-15' },
    { tripId: 'TRP-002', vehiclePlate: 'DL-01-YZ-5678', distance: 1400, fuelConsumed: 210, co2Emissions: 554.4, date: '2026-02-18' },
    { tripId: 'TRP-003', vehiclePlate: 'KA-05-CD-9012', distance: 630, fuelConsumed: 85, co2Emissions: 224.4, date: '2026-02-10' },
    { tripId: 'TRP-004', vehiclePlate: 'TN-07-GH-7890', distance: 670, fuelConsumed: 65, co2Emissions: 171.6, date: '2026-02-05' },
    { tripId: 'TRP-005', vehiclePlate: 'GJ-03-EF-3456', distance: 920, fuelConsumed: 145, co2Emissions: 382.8, date: '2026-02-12' },
];

const VEHICLE_EMISSIONS: VehicleEmission[] = [
    { vehicleId: 'v1', plate: 'MH-01-AB-1234', totalCO2: 2450, avgEmissionsPerKm: 0.377, fuelType: 'Diesel' },
    { vehicleId: 'v2', plate: 'DL-01-YZ-5678', totalCO2: 4820, avgEmissionsPerKm: 0.396, fuelType: 'Diesel' },
    { vehicleId: 'v3', plate: 'KA-05-CD-9012', totalCO2: 1890, avgEmissionsPerKm: 0.356, fuelType: 'Diesel' },
    { vehicleId: 'v4', plate: 'GJ-03-EF-3456', totalCO2: 3210, avgEmissionsPerKm: 0.385, fuelType: 'Diesel' },
    { vehicleId: 'v5', plate: 'TN-07-GH-7890', totalCO2: 980, avgEmissionsPerKm: 0.274, fuelType: 'CNG' },
    { vehicleId: 'v6', plate: 'RJ-14-IJ-2345', totalCO2: 1650, avgEmissionsPerKm: 0.368, fuelType: 'Diesel' },
];

const EMISSION_TRENDS: EmissionTrend[] = [
    { month: 'Sep', co2Tons: 12.5, target: 15 },
    { month: 'Oct', co2Tons: 13.8, target: 14.5 },
    { month: 'Nov', co2Tons: 11.2, target: 14 },
    { month: 'Dec', co2Tons: 10.8, target: 13.5 },
    { month: 'Jan', co2Tons: 14.2, target: 13 },
    { month: 'Feb', co2Tons: 12.1, target: 12.5 },
];

export function CarbonDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const totalCO2 = VEHICLE_EMISSIONS.reduce((sum, v) => sum + v.totalCO2, 0);
    const avgEmissions = totalCO2 / VEHICLE_EMISSIONS.length;
    const currentMonthCO2 = EMISSION_TRENDS[EMISSION_TRENDS.length - 1].co2Tons;
    const targetCO2 = EMISSION_TRENDS[EMISSION_TRENDS.length - 1].target;
    const treesEquivalent = Math.round(totalCO2 / 21.77);

    const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Carbon Footprint Dashboard"
                subtitle="Track and reduce CO₂ emissions across your fleet."
                actions={[
                    { label: 'Export Report', icon: Download, onClick: () => alert('Exporting carbon report...'), variant: 'outline' as const },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total CO₂ Emissions" value={`${(totalCO2 / 1000).toFixed(2)} tons`} icon={Leaf} trend={{ value: 8.2, isPositive: false }} iconColor="text-green-600 bg-green-50" />
                <MetricCard title="Avg Emissions/Vehicle" value={`${avgEmissions.toFixed(0)} kg`} icon={TrendingDown} trend={{ value: 3.5, isPositive: true }} iconColor="text-blue-600 bg-blue-50" />
                <MetricCard title="Monthly Target" value={`${((currentMonthCO2 / targetCO2) * 100).toFixed(0)}%`} icon={Target} trend={{ value: 12, isPositive: true }} iconColor="text-amber-600 bg-amber-50" />
                <MetricCard title="Trees Equivalent" value={`${treesEquivalent}`} icon={TreePine} iconColor="text-emerald-600 bg-emerald-50" />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
                    <TabsTrigger value="trips">By Trip</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="p-6 rounded-xl border border-border bg-card">
                            <h3 className="text-sm font-semibold text-foreground mb-4">CO₂ Emissions Trend</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={EMISSION_TRENDS}>
                                        <defs>
                                            <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                        <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} unit=" tons" />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Area type="monotone" dataKey="co2Tons" stroke="#10b981" strokeWidth={2} fill="url(#co2Grad)" name="CO₂ Emissions" />
                                        <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6 rounded-xl border border-border bg-card">
                            <h3 className="text-sm font-semibold text-foreground mb-4">Emissions by Fuel Type</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { fuel: 'Diesel', co2: VEHICLE_EMISSIONS.filter(v => v.fuelType === 'Diesel').reduce((s, v) => s + v.totalCO2, 0) / 1000 },
                                        { fuel: 'CNG', co2: VEHICLE_EMISSIONS.filter(v => v.fuelType === 'CNG').reduce((s, v) => s + v.totalCO2, 0) / 1000 },
                                        { fuel: 'Petrol', co2: VEHICLE_EMISSIONS.filter(v => v.fuelType === 'Petrol').reduce((s, v) => s + v.totalCO2, 0) / 1000 },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                        <XAxis dataKey="fuel" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} unit=" tons" />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="co2" fill="#10b981" radius={[8, 8, 0, 0]} name="CO₂ (tons)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="vehicles">
                    <Card className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="border-b border-border hover:bg-transparent">
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Vehicle</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Fuel Type</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Total CO₂ (kg)</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Avg kg/km</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Rating</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {VEHICLE_EMISSIONS.map((v) => (
                                        <TableRow key={v.vehicleId} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium text-foreground px-6 py-3">{v.plate}</TableCell>
                                            <TableCell className="px-6 py-3">
                                                <Badge variant={v.fuelType === 'Electric' ? 'success' : v.fuelType === 'CNG' ? 'warning' : 'outline'}>
                                                    {v.fuelType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3">{v.totalCO2.toFixed(1)}</TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3">{v.avgEmissionsPerKm.toFixed(3)}</TableCell>
                                            <TableCell className="px-6 py-3">
                                                <Badge variant={v.avgEmissionsPerKm < 0.3 ? 'success' : v.avgEmissionsPerKm < 0.38 ? 'warning' : 'destructive'}>
                                                    {v.avgEmissionsPerKm < 0.3 ? 'Excellent' : v.avgEmissionsPerKm < 0.38 ? 'Good' : 'High'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="trips">
                    <Card className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="border-b border-border hover:bg-transparent">
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Trip ID</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Vehicle</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Distance (km)</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Fuel (L)</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">CO₂ (kg)</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {TRIP_EMISSIONS.map((trip) => (
                                        <TableRow key={trip.tripId} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium text-foreground px-6 py-3">{trip.tripId}</TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3">{trip.vehiclePlate}</TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3">{trip.distance}</TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3">{trip.fuelConsumed}</TableCell>
                                            <TableCell className="font-medium text-foreground px-6 py-3">{trip.co2Emissions.toFixed(1)}</TableCell>
                                            <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
