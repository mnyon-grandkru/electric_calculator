import type { Device, CalculationResults } from './types';

/**
 * Calculate energy cost and CO2 emissions based on device wattage and rates
 */
export function calculateCosts(device: Device): CalculationResults {
    const minKwhPerHour = device.minWattage / 1000;
    const maxKwhPerHour = device.maxWattage / 1000;

    const minCostPerHour = minKwhPerHour * device.rate;
    const maxCostPerHour = maxKwhPerHour * device.rate;

    const minCostPerDay = minCostPerHour * 24;
    const maxCostPerDay = maxCostPerHour * 24;

    const minCostPerWeek = minCostPerDay * 7;
    const maxCostPerWeek = maxCostPerDay * 7;

    const minCostPerMonth = minCostPerDay * 30;
    const maxCostPerMonth = maxCostPerDay * 30;

    const minCo2PerHour = minKwhPerHour * device.carbonIntensity;
    const maxCo2PerHour = maxKwhPerHour * device.carbonIntensity;

    return {
        minKwhPerHour,
        maxKwhPerHour,
        minCostPerHour,
        maxCostPerHour,
        minCostPerDay,
        maxCostPerDay,
        minCostPerWeek,
        maxCostPerWeek,
        minCostPerMonth,
        maxCostPerMonth,
        minCo2PerHour,
        maxCo2PerHour
    };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    }).format(value);
}

/**
 * Format number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
}

/**
 * Calculate cost for a specific usage duration in minutes
 */
export function calculateCostForMinutes(device: Device, minutes: number): {
    minCost: number;
    maxCost: number;
    minKwh: number;
    maxKwh: number;
    minCo2: number;
    maxCo2: number;
} {
    // Convert minutes to hours
    const hours = minutes / 60;

    // Calculate kWh for the duration
    const minKwh = (device.minWattage / 1000) * hours;
    const maxKwh = (device.maxWattage / 1000) * hours;

    // Calculate cost
    const minCost = minKwh * device.rate;
    const maxCost = maxKwh * device.rate;

    // Calculate CO2 emissions
    const minCo2 = minKwh * device.carbonIntensity;
    const maxCo2 = maxKwh * device.carbonIntensity;

    return {
        minCost,
        maxCost,
        minKwh,
        maxKwh,
        minCo2,
        maxCo2
    };
}

