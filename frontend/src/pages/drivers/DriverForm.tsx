import { useState } from 'react';
import { useFleetStore } from '../../store/useFleetStore';
import { DatePicker } from '../../components/ui/date-picker';
import { Field, FieldLabel } from '../../components/ui/field';
import { Input } from '../../components/ui/input';

interface DriverFormProps {
    open: boolean;
    onClose: () => void;
}

export function DriverForm({ open, onClose }: DriverFormProps) {
    const { addDriver } = useFleetStore();

    const [name, setName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [phone, setPhone] = useState('');
    const [completionRate] = useState(0);
    const [safetyScore] = useState(100);

    if (!open) return null;

    const resetForm = () => {
        setName(''); setLicenseNumber(''); setLicenseExpiry(''); setPhone('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addDriver({
            name,
            licenseNumber,
            licenseExpiry,
            phone,
            status: 'Off Duty',
            completionRate,
            safetyScore,
        });
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-50 w-full max-w-md rounded-lg bg-card border border-border shadow-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Add Driver</h2>
                    <p className="text-sm text-muted-foreground mt-1">Register a new fleet driver.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input placeholder="Enter full name" value={name} onChange={e => setName(e.target.value)} required />
                        </Field>
                        <Field>
                            <FieldLabel>License Number</FieldLabel>
                            <Input placeholder="DL-0420110012345" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>License Expiry</FieldLabel>
                                <DatePicker value={licenseExpiry} onValueChange={setLicenseExpiry} placeholder="Pick expiry date" required />
                            </Field>
                            <Field>
                                <FieldLabel>Phone</FieldLabel>
                                <Input placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
                            </Field>
                        </div>
                    </div>
                    <div className="p-6 border-t border-border flex justify-end gap-2">
                        <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" disabled={!name || !licenseNumber} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Add Driver</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
