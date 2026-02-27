import { useState, useMemo } from 'react';
import { useFleetStore } from '../../store/useFleetStore';
import { Combobox } from '../../components/ui/combobox';
import { DatePicker } from '../../components/ui/date-picker';
import { Field, FieldLabel } from '../../components/ui/field';
import { Input } from '../../components/ui/input';

const SERVICE_TYPES = ['Oil Change', 'Brake Replacement', 'Engine Overhaul', 'Tire Rotation', 'Transmission Repair', 'Battery Replacement', 'General Inspection'];

interface MaintenanceFormProps {
    open: boolean;
    onClose: () => void;
}

export function MaintenanceForm({ open, onClose }: MaintenanceFormProps) {
    const { vehicles, addServiceLog } = useFleetStore();
    const availableVehicles = useMemo(() => vehicles.filter(v => v.status !== 'In Shop'), [vehicles]);

    const [vehicleId, setVehicleId] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [cost, setCost] = useState('');
    const [technician, setTechnician] = useState('');

    if (!open) return null;

    const resetForm = () => {
        setVehicleId(''); setServiceType(''); setDescription(''); setDate(new Date().toISOString().split('T')[0]); setCost(''); setTechnician('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vehicle = availableVehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;
        addServiceLog({
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.plate,
            serviceType,
            issueDescription: description,
            date,
            cost: parseFloat(cost) || 0,
            technicianName: technician,
            status: 'New',
        });
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-50 w-full max-w-lg rounded-lg bg-card border border-border shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Create Service Log</h2>
                    <p className="text-sm text-muted-foreground mt-1">The vehicle will be marked as "In Shop".</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        <Field>
                            <FieldLabel>Vehicle</FieldLabel>
                            <Combobox
                                options={availableVehicles.map(v => ({ value: v.id, label: `${v.plate} — ${v.model}` }))}
                                value={vehicleId}
                                onValueChange={setVehicleId}
                                placeholder="Select a vehicle"
                                searchPlaceholder="Search vehicles..."
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Service Type</FieldLabel>
                            <Combobox
                                options={SERVICE_TYPES.map(t => ({ value: t, label: t }))}
                                value={serviceType}
                                onValueChange={setServiceType}
                                placeholder="Select type"
                                searchPlaceholder="Search service types..."
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Issue Description</FieldLabel>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none" placeholder="Describe the issue..." />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Date</FieldLabel>
                                <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
                            </Field>
                            <Field>
                                <FieldLabel>Cost (₹)</FieldLabel>
                                <Input type="number" placeholder="0" value={cost} onChange={e => setCost(e.target.value)} />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel>Technician Name</FieldLabel>
                            <Input placeholder="Enter technician name" value={technician} onChange={e => setTechnician(e.target.value)} />
                        </Field>
                    </div>
                    <div className="p-6 border-t border-border flex justify-end gap-2">
                        <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" disabled={!vehicleId || !serviceType} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Create Log</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
