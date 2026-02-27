/**
 * Cost per KM = Total Cost / Distance
 * Returns 0 if distance is 0 to avoid division errors.
 */
export function calculateCostPerKM(totalCost: number, distance: number): number {
    if (distance === 0) return 0;
    return totalCost / distance;
}
