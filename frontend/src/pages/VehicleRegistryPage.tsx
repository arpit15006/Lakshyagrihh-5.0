import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import type { UserRole } from '../constants/auth';

const INITIAL_VEHICLES = [
    { id: 1, plate: "MH00AB1234", model: "Mini", type: "Truck", capacity: "5 ton", odometer: "70,000 km", status: "Idle" },
    { id: 2, plate: "DL01YZ5678", model: "Maxi", type: "Trailer", capacity: "15 ton", odometer: "120,500 km", status: "On Trip" },
    { id: 3, plate: "GJ05RT9087", model: "Mini", type: "Van", capacity: "2 ton", odometer: "45,000 km", status: "Idle" },
    { id: 4, plate: "KA09PL4321", model: "Ultra", type: "Truck", capacity: "10 ton", odometer: "98,000 km", status: "On Trip" },
    { id: 5, plate: "TN11ZX6789", model: "Lite", type: "Van", capacity: "3 ton", odometer: "60,200 km", status: "Idle" },
    { id: 6, plate: "RJ14MN3456", model: "Heavy", type: "Trailer", capacity: "20 ton", odometer: "150,000 km", status: "On Trip" }
];

export function VehicleRegistryPage() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { role: 'guest' };
    const role = user.role as UserRole;

    const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [plate, setPlate] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('Truck');
    const [capacity, setCapacity] = useState('');
    const [odometer, setOdometer] = useState('');

    const openModalNew = () => {
        setEditingId(null);
        setPlate(''); setModel(''); setType('Truck'); setCapacity(''); setOdometer('');
        setIsModalOpen(true);
    };

    const handleEditVehicle = (vehicle: any) => {
        setEditingId(vehicle.id);
        setPlate(vehicle.plate);
        setModel(vehicle.model);
        setType(vehicle.type);
        setCapacity(vehicle.capacity.replace(' ton', ''));
        setOdometer(vehicle.odometer.replace(' km', '').replace(/,/g, ''));
        setIsModalOpen(true);
    };

    const handleDeleteVehicle = (id: number) => {
        setVehicles(vehicles.filter(v => v.id !== id));
    };

    const handleSaveVehicle = (e: React.FormEvent) => {
        e.preventDefault();

        let newOdoStr = "0 km";
        if (odometer) {
            newOdoStr = `${parseInt(odometer).toLocaleString()} km`;
        }

        if (editingId !== null) {
            setVehicles(vehicles.map(v => v.id === editingId ? {
                ...v,
                plate, model, type, capacity: `${capacity} ton`, odometer: newOdoStr
            } : v));
        } else {
            const newVehicle = {
                id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
                plate, model, type, capacity: `${capacity} ton`, odometer: newOdoStr, status: "Idle"
            };
            setVehicles([...vehicles, newVehicle]);
        }
        setIsModalOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-4 w-full px-6 py-4"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vehicle Registry</h1>
                    <p className="text-sm text-muted-foreground">Manage your active fleet and asset details.</p>
                </div>
                <div className="flex gap-3">
                    {role === 'manager' && (
                        <Button onClick={openModalNew} className="rounded-lg h-8 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200 shadow-sm">+ New Vehicle</Button>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card mb-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">No</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Plate Num</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Model</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Type</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Capacity</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Odometer</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Status</TableHead>
                                <TableHead className="text-xs uppercase tracking-wide text-muted-foreground py-3 px-6 h-auto">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((v) => (
                                <TableRow key={v.id} className="border-b border-border hover:bg-muted/50 transition duration-150 group">
                                    <TableCell className="text-muted-foreground px-6 py-3">{v.id}</TableCell>
                                    <TableCell className="font-medium text-foreground px-6 py-3">{v.plate}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3">{v.model}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3">{v.type}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3">{v.capacity}</TableCell>
                                    <TableCell className="text-muted-foreground px-6 py-3">{v.odometer}</TableCell>
                                    <TableCell className="px-6 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.status === "On Trip"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {v.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-3">
                                        {role === 'manager' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 hover:bg-muted rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring">
                                                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32 rounded-lg shadow-md border border-border bg-popover text-popover-foreground">
                                                    <DropdownMenuItem onClick={() => handleEditVehicle(v)} className="hover:bg-muted cursor-pointer transition-colors text-sm rounded-md px-2 py-1.5 focus:bg-muted m-1">Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteVehicle(v.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors text-sm rounded-md px-2 py-1.5 m-1">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {vehicles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No vehicles registered yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Vehicle" : "Register New Vehicle"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveVehicle}>
                    <DialogContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">License Plate</Label>
                            <Input required placeholder="Ex: ABC-1234" className="h-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg border-border" value={plate} onChange={e => setPlate(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="w-full focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-lg">
                                        <SelectValue placeholder="Select vehicle type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg shadow-md border-border bg-popover text-popover-foreground">
                                        <SelectItem value="Truck" className="hover:bg-muted transition-colors">Truck</SelectItem>
                                        <SelectItem value="Trailer Truck" className="hover:bg-muted transition-colors">Trailer Truck</SelectItem>
                                        <SelectItem value="Van" className="hover:bg-muted transition-colors">Van</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Model</Label>
                                <Input required placeholder="Ex: Mini" className="h-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg border-border" value={model} onChange={e => setModel(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Max Payload (tons)</Label>
                                <Input type="number" required placeholder="5" className="h-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg border-border" value={capacity} onChange={e => setCapacity(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Initial Odometer</Label>
                                <Input type="number" required placeholder="0" className="h-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg border-border" value={odometer} onChange={e => setOdometer(e.target.value)} />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogFooter>
                        <Button type="button" variant="outline" className="rounded-lg h-10 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 border-border hover:bg-muted" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="rounded-lg h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all">Save Vehicle</Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </motion.div>
    );
}
