import { useState, useMemo } from 'react';
import { useFleetStore } from '../../store/useFleetStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateCostPerKM } from '../../utils/calculateCostPerKM';
import { Combobox } from '../../components/ui/combobox';
import { DatePicker } from '../../components/ui/date-picker';
import { Field, FieldLabel } from '../../components/ui/field';
import { Input } from '../../components/ui/input';

interface ExpenseFormProps {
    open: boolean;
    onClose: () => void;
}

export function ExpenseForm({ open, onClose }: ExpenseFormProps) {
    const { trips, addExpense } = useFleetStore();
    const completedTrips = useMemo(() => trips.filter(t => t.status === 'Completed'), [trips]);

    const [tripId, setTripId] = useState('');
    const [fuelLiters, setFuelLiters] = useState('');
    const [fuelCost, setFuelCost] = useState('');
    const [miscExpense, setMiscExpense] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    if (!open) return null;

    const resetForm = () => {
        setTripId(''); setFuelLiters(''); setFuelCost(''); setMiscExpense(''); setDate(new Date().toISOString().split('T')[0]); setNotes('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        addExpense({
            tripId,
            vehicleId: trip.vehicleId,
            vehiclePlate: trip.vehiclePlate,
            driverName: trip.driverName,
            distance: trip.distance,
            fuelLiters: parseFloat(fuelLiters) || 0,
            fuelCost: parseFloat(fuelCost) || 0,
            miscExpense: parseFloat(miscExpense) || 0,
            date,
            notes,
            status: 'Pending',
        });
        resetForm();
        onClose();
    };

    // Auto-calc preview
    const previewFuel = parseFloat(fuelCost) || 0;
    const previewMisc = parseFloat(miscExpense) || 0;
    const previewTotal = previewFuel + previewMisc;
    const selectedTrip = trips.find(t => t.id === tripId);
    const previewCostPerKm = selectedTrip ? calculateCostPerKM(previewTotal, selectedTrip.distance) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-50 h-full w-full max-w-md bg-card border-l border-border shadow-xl" style={{ animation: 'fleet-slide-in-right 0.3s ease-out' }}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Add Expense</h2>
                        <p className="text-sm text-muted-foreground mt-1">Record fuel and miscellaneous costs for a completed trip.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <Field>
                                <FieldLabel>Trip</FieldLabel>
                                <Combobox
                                    options={completedTrips.map(t => ({ value: t.id, label: `${t.id} — ${t.origin} → ${t.destination}` }))}
                                    value={tripId}
                                    onValueChange={setTripId}
                                    placeholder="Select a completed trip"
                                    searchPlaceholder="Search trips..."
                                    required
                                />
                            </Field>

                            <div className="h-px bg-border" />

                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>Fuel Liters</FieldLabel>
                                    <Input type="number" placeholder="0" value={fuelLiters} onChange={e => setFuelLiters(e.target.value)} />
                                </Field>
                                <Field>
                                    <FieldLabel>Fuel Cost (₹)</FieldLabel>
                                    <Input type="number" placeholder="0" value={fuelCost} onChange={e => setFuelCost(e.target.value)} />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel>Miscellaneous Expense (₹)</FieldLabel>
                                <Input type="number" placeholder="0" value={miscExpense} onChange={e => setMiscExpense(e.target.value)} />
                            </Field>

                            <Field>
                                <FieldLabel>Date</FieldLabel>
                                <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
                            </Field>

                            <Field>
                                <FieldLabel>Notes</FieldLabel>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none" placeholder="Toll charges, parking, etc..." />
                            </Field>

                            <div className="h-px bg-border" />

                            {/* Auto Calculations */}
                            <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auto Calculations</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Cost</p>
                                        <p className="text-lg font-bold text-foreground">{formatCurrency(previewTotal)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cost per KM</p>
                                        <p className="text-lg font-bold text-foreground">₹{previewCostPerKm.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-2">
                            <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">Cancel</button>
                            <button type="submit" disabled={!tripId} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Save Expense</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
