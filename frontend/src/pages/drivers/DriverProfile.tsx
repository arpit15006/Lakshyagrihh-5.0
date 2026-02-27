import type { Driver } from '../../types/models';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { X, Phone, Shield, AlertCircle } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';

interface DriverProfileProps {
    driver: Driver | null;
    onClose: () => void;
    onSuspend: () => void;
}

export function DriverProfile({ driver, onClose, onSuspend }: DriverProfileProps) {
    if (!driver) return null;

    const isExpired = new Date(driver.licenseExpiry) < new Date();

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-50 h-full w-full max-w-md bg-card border-l border-border shadow-xl" style={{ animation: 'fleet-slide-in-right 0.3s ease-out' }}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{driver.name}</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">{driver.licenseNumber}</p>
                        </div>
                        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-muted/50 border border-border p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Phone</span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{driver.phone}</p>
                            </div>
                            <div className="rounded-lg bg-muted/50 border border-border p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Status</span>
                                </div>
                                <StatusBadge status={driver.status} />
                            </div>
                        </div>

                        {/* License Warning */}
                        {isExpired && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-destructive">License Expired</p>
                                    <p className="text-xs text-destructive/70">Expired on {new Date(driver.licenseExpiry).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>
                        )}

                        {/* Safety Score */}
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Safety Score</p>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${driver.safetyScore >= 80 ? 'bg-emerald-500' : driver.safetyScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${driver.safetyScore}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">0</span>
                                <span className="text-sm font-semibold text-foreground">{driver.safetyScore}/100</span>
                                <span className="text-xs text-muted-foreground">100</span>
                            </div>
                        </div>

                        {/* Performance Chart */}
                        {driver.performanceHistory.length > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Performance History</p>
                                <div className="h-48 rounded-lg bg-muted/50 border border-border p-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={driver.performanceHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#d1d5db' }} />
                                            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#d1d5db' }} domain={[50, 100]} />
                                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                                            <Line type="monotone" dataKey="completionRate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Completion %" />
                                            <Line type="monotone" dataKey="safetyScore" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} name="Safety" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Complaints */}
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Complaints ({driver.complaints.length})</p>
                            {driver.complaints.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No complaints on record ✓</p>
                            ) : (
                                <div className="space-y-2">
                                    {driver.complaints.map(c => (
                                        <div key={c.id} className="rounded-lg bg-muted/50 border border-border p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${c.severity === 'High' ? 'text-destructive bg-destructive/10 border-destructive/20' :
                                                    c.severity === 'Medium' ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' :
                                                        'text-muted-foreground bg-muted border-border'
                                                    }`}>{c.severity}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString('en-IN')}</span>
                                            </div>
                                            <p className="text-sm text-foreground mt-1">{c.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    {driver.status !== 'Suspended' && (
                        <div className="p-6 border-t border-border">
                            <button
                                onClick={onSuspend}
                                className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors"
                            >
                                Suspend Driver
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
