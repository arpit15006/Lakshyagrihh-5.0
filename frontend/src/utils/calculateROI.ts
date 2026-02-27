/**
 * Fleet ROI = (Revenue - (Maintenance + Fuel)) / Acquisition * 100
 * Returns percentage as a number, 0 if acquisitionCost is 0.
 */
export function calculateROI(
    revenue: number,
    maintenanceCost: number,
    fuelCost: number,
    acquisitionCost: number,
): number {
    if (acquisitionCost === 0) return 0;
    return ((revenue - (maintenanceCost + fuelCost)) / acquisitionCost) * 100;
}
