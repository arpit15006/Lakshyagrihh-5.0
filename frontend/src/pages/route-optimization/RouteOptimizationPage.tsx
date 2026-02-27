import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Route, Clock, DollarSign, Leaf, Navigation, CheckCircle } from 'lucide-react';
import type { RouteOptimization } from '../../types/carbon';

const OPTIMIZED_ROUTES: RouteOptimization[] = [
    {
        tripId: 'TRP-001',
        origin: 'Mumbai',
        destination: 'Delhi',
        standardRoute: { distance: 1450, duration: 24, co2: 560 },
        optimizedRoute: { distance: 1380, duration: 22, co2: 532 },
        savings: { distance: 70, time: 2, co2: 28, cost: 2800 }
    },
    {
        tripId: 'TRP-002',
        origin: 'Pune',
        destination: 'Bangalore',
        standardRoute: { distance: 850, duration: 14, co2: 328 },
        optimizedRoute: { distance: 820, duration: 13, co2: 316 },
        savings: { distance: 30, time: 1, co2: 12, cost: 1200 }
    },
    {
        tripId: 'TRP-003',
        origin: 'Chennai',
        destination: 'Hyderabad',
        standardRoute: { distance: 640, duration: 11, co2: 247 },
        optimizedRoute: { distance: 615, duration: 10, co2: 237 },
        savings: { distance: 25, time: 1, co2: 10, cost: 1000 }
    },
];

export function RouteOptimizationPage() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [optimizing, setOptimizing] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState<any>(null);

    const totalDistanceSaved = OPTIMIZED_ROUTES.reduce((sum, r) => sum + r.savings.distance, 0);
    const totalCO2Saved = OPTIMIZED_ROUTES.reduce((sum, r) => sum + r.savings.co2, 0);
    const totalCostSaved = OPTIMIZED_ROUTES.reduce((sum, r) => sum + r.savings.cost, 0);
    const totalTimeSaved = OPTIMIZED_ROUTES.reduce((sum, r) => sum + r.savings.time, 0);

    const handleOptimize = () => {
        setOptimizing(true);
        setTimeout(() => {
            const result = {
                origin,
                destination,
                distanceSaved: 45,
                timeSaved: 1.5,
                costSaved: 1800,
                co2Saved: 17
            };
            setOptimizationResult(result);
            setOptimizing(false);
            setShowResultModal(true);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <PageHeader
                title="Route Optimization"
                subtitle="Optimize delivery routes to reduce distance, time, and emissions."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Distance Saved" value={`${totalDistanceSaved} km`} icon={Route} trend={{ value: 15, isPositive: true }} iconColor="text-blue-600 bg-blue-50" />
                <MetricCard title="Time Saved" value={`${totalTimeSaved} hrs`} icon={Clock} trend={{ value: 8, isPositive: true }} iconColor="text-purple-600 bg-purple-50" />
                <MetricCard title="Cost Saved" value={`₹${totalCostSaved.toLocaleString()}`} icon={DollarSign} trend={{ value: 12, isPositive: true }} iconColor="text-green-600 bg-green-50" />
                <MetricCard title="CO₂ Reduced" value={`${totalCO2Saved} kg`} icon={Leaf} trend={{ value: 10, isPositive: true }} iconColor="text-emerald-600 bg-emerald-50" />
            </div>

            <Card className="p-6 rounded-xl border border-border bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2 mb-4">
                    <Navigation className="w-5 h-5" /> Optimize New Route
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Origin</Label>
                        <Input placeholder="Enter origin address" value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-10 rounded-lg border-border" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Destination</Label>
                        <Input placeholder="Enter destination address" value={destination} onChange={(e) => setDestination(e.target.value)} className="h-10 rounded-lg border-border" />
                    </div>
                </div>
                <Button onClick={handleOptimize} disabled={!origin || !destination || optimizing} className="mt-4 w-full md:w-auto rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200">
                    {optimizing ? 'Optimizing...' : 'Find Optimal Route'}
                </Button>
            </Card>

            <Card className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">Optimized Routes History</h3>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Trip</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Route</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Standard</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Optimized</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Savings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {OPTIMIZED_ROUTES.map((route) => (
                                <TableRow key={route.tripId} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium text-foreground px-6 py-3">{route.tripId}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">
                                        {route.origin} → {route.destination}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">
                                        {route.standardRoute.distance}km, {route.standardRoute.duration}h
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3 text-sm">
                                        {route.optimizedRoute.distance}km, {route.optimizedRoute.duration}h
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="success" className="text-xs">-{route.savings.distance}km</Badge>
                                            <Badge variant="success" className="text-xs">-{route.savings.time}h</Badge>
                                            <Badge variant="success" className="text-xs">-{route.savings.co2}kg CO₂</Badge>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Route Optimized Successfully!</DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">Your optimized route is ready</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {optimizationResult && (
                        <div className="space-y-6 py-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Origin</p>
                                        <p className="font-semibold text-foreground">{optimizationResult.origin}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Destination</p>
                                        <p className="font-semibold text-foreground">{optimizationResult.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-3">Optimization Savings</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Distance Saved</p>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{optimizationResult.distanceSaved} km</p>
                                    </div>

                                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Time Saved</p>
                                        </div>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{optimizationResult.timeSaved} hrs</p>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Cost Saved</p>
                                        </div>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{optimizationResult.costSaved.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">CO₂ Reduced</p>
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{optimizationResult.co2Saved} kg</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setShowResultModal(false)} className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
