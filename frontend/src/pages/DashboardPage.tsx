import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import type { UserRole } from '../constants/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Car, AlertTriangle, Activity, Package, Plus } from 'lucide-react';

const KPI_DATA = [
    { title: "Active Fleet", value: "220", trend: { value: 12, isPositive: true }, icon: Car, valueColor: "text-blue-600" },
    { title: "Maintenance Alerts", value: "15", trend: { value: 2, isPositive: false }, icon: AlertTriangle, valueColor: "text-red-500" },
    { title: "Utilization Rate", value: "75%", trend: { value: 5, isPositive: true }, icon: Activity, valueColor: "text-green-600" },
    { title: "Pending Cargo", value: "20", trend: { value: 8, isPositive: true }, icon: Package, valueColor: "text-amber-600" }
];

const RECENT_TRIPS = [
    { trip: "TRP-001", vehicle: "Truck-01", driver: "John Doe", status: "On Trip" },
    { trip: "TRP-002", vehicle: "Van-02", driver: "Alex", status: "Idle" },
    { trip: "TRP-003", vehicle: "Truck-03", driver: "Rahul", status: "On Trip" },
    { trip: "TRP-004", vehicle: "Mini-01", driver: "Amit", status: "Idle" },
    { trip: "TRP-005", vehicle: "Trailer-02", driver: "Karan", status: "On Trip" },
    { trip: "TRP-006", vehicle: "Van-05", driver: "Suresh", status: "Idle" }
];

export function DashboardPage() {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { role: 'guest' };
    const role = user.role as UserRole;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Fleet Overview</h1>
                    <p className="text-xs text-muted-foreground">Live operational status of your fleet.</p>
                </div>
                <div className="flex items-center gap-3">
                    {(role === 'admin' || role === 'manager') && (
                        <Button className="rounded-lg h-10 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 border border-border text-foreground hover:bg-muted transition-all duration-200 bg-background shadow-sm active:scale-95" onClick={() => navigate('/vehicles')}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Vehicle
                        </Button>
                    )}
                    {(role === 'admin' || role === 'manager' || role === 'dispatcher') && (
                        <Button className="rounded-lg h-10 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200 shadow-sm active:scale-95" onClick={() => navigate('/trips')}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Trip
                        </Button>
                    )}
                </div>
            </div >

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_DATA.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={idx} className="p-4 rounded-xl border-border transition-all bg-card cursor-default group">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-muted-foreground">{kpi.title}</span>
                                <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className={`text-2xl font-semibold tracking-tight ${kpi.valueColor}`}>{kpi.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{kpi.trend.value > 0 ? '+' : ''}{kpi.trend.value}%</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card mt-4">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">Recent Trips</h2>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Trip ID</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Vehicle</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Driver</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {RECENT_TRIPS.map((trip) => (
                                <TableRow key={trip.trip} className="border-b border-border hover:bg-muted/50 transition-colors group">
                                    <TableCell className="font-medium text-foreground px-6 py-3">{trip.trip}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.vehicle}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">{trip.driver}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${trip.status === "On Trip"
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
            </div>
        </motion.div >
    );
}
