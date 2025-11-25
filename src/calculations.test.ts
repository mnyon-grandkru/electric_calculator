import { describe, it, expect } from 'vitest';
import { calculateCosts, formatCurrency, formatNumber, calculateCostForMinutes } from './calculations';
import type { Device } from './types';

describe('calculateCosts', () => {
    it('should calculate costs correctly for QNAP device', () => {
        const device: Device = {
            name: 'QNAP Server',
            description: 'Test',
            address: 'Test',
            cpu: 'Test',
            gpu: 'None',
            ram: '8GB',
            type: 'Server/NAS',
            minWattage: 21.1,
            maxWattage: 35.3,
            rate: 0.23,
            carbonIntensity: 185
        };

        const results = calculateCosts(device);

        expect(results.minKwhPerHour).toBeCloseTo(0.0211, 4);
        expect(results.maxKwhPerHour).toBeCloseTo(0.0353, 4);
        expect(results.minCostPerHour).toBeCloseTo(0.004853, 6);
        expect(results.maxCostPerHour).toBeCloseTo(0.008119, 6);
        expect(results.minCostPerDay).toBeCloseTo(0.116472, 6);
        expect(results.maxCostPerDay).toBeCloseTo(0.194856, 6);
        expect(results.minCostPerWeek).toBeCloseTo(0.815304, 6);
        expect(results.maxCostPerWeek).toBeCloseTo(1.363992, 6);
        expect(results.minCostPerMonth).toBeCloseTo(3.49416, 5);
        expect(results.maxCostPerMonth).toBeCloseTo(5.84568, 5);
        expect(results.minCo2PerHour).toBeCloseTo(3.9035, 4);
        expect(results.maxCo2PerHour).toBeCloseTo(6.5305, 4);
    });

    it('should calculate costs correctly for PC device', () => {
        const device: Device = {
            name: 'PC',
            description: 'Test',
            address: 'Test',
            cpu: 'Test',
            gpu: 'RTX 3070',
            ram: '32GB',
            type: 'PC',
            minWattage: 65,
            maxWattage: 350,
            rate: 0.23,
            carbonIntensity: 185
        };

        const results = calculateCosts(device);

        expect(results.minKwhPerHour).toBeCloseTo(0.065, 4);
        expect(results.maxKwhPerHour).toBeCloseTo(0.35, 4);
        expect(results.minCostPerHour).toBeCloseTo(0.01495, 5);
        expect(results.maxCostPerHour).toBeCloseTo(0.0805, 4);
        expect(results.minCostPerDay).toBeCloseTo(0.3588, 4);
        expect(results.maxCostPerDay).toBeCloseTo(1.932, 3);
        expect(results.minCostPerWeek).toBeCloseTo(2.5116, 4);
        expect(results.maxCostPerWeek).toBeCloseTo(13.524, 3);
        expect(results.minCostPerMonth).toBeCloseTo(10.764, 3);
        expect(results.maxCostPerMonth).toBeCloseTo(57.96, 2);
    });
});

describe('formatCurrency', () => {
    it('should format currency with 4 decimal places', () => {
        expect(formatCurrency(0.004853)).toBe('$0.0049');
        expect(formatCurrency(1.234567)).toBe('$1.2346');
        expect(formatCurrency(100)).toBe('$100.0000');
    });
});

describe('formatNumber', () => {
    it('should format number with default 2 decimal places', () => {
        expect(formatNumber(3.14159)).toBe('3.14');
        expect(formatNumber(100)).toBe('100.00');
    });

    it('should format number with custom decimal places', () => {
        expect(formatNumber(3.14159, 4)).toBe('3.1416');
        expect(formatNumber(100, 0)).toBe('100');
    });
});

describe('calculateCostForMinutes', () => {
    const device: Device = {
        name: 'Test Device',
        description: 'Test',
        address: 'Test',
        cpu: 'Test',
        gpu: 'Test',
        ram: 'Test',
        type: 'PC',
        minWattage: 100,
        maxWattage: 200,
        rate: 0.20,
        carbonIntensity: 150
    };

    it('should calculate cost for 30 minutes', () => {
        const result = calculateCostForMinutes(device, 30);

        // 30 minutes = 0.5 hours
        // Min: 100W = 0.1kW * 0.5h = 0.05kWh
        // Max: 200W = 0.2kW * 0.5h = 0.1kWh
        expect(result.minKwh).toBeCloseTo(0.05, 4);
        expect(result.maxKwh).toBeCloseTo(0.1, 4);
        expect(result.minCost).toBeCloseTo(0.01, 4); // 0.05 * 0.20
        expect(result.maxCost).toBeCloseTo(0.02, 4); // 0.1 * 0.20
        expect(result.minCo2).toBeCloseTo(7.5, 2); // 0.05 * 150
        expect(result.maxCo2).toBeCloseTo(15, 2); // 0.1 * 150
    });

    it('should calculate cost for 60 minutes (1 hour)', () => {
        const result = calculateCostForMinutes(device, 60);

        // 60 minutes = 1 hour
        expect(result.minKwh).toBeCloseTo(0.1, 4);
        expect(result.maxKwh).toBeCloseTo(0.2, 4);
        expect(result.minCost).toBeCloseTo(0.02, 4);
        expect(result.maxCost).toBeCloseTo(0.04, 4);
    });

    it('should calculate cost for 15 minutes', () => {
        const result = calculateCostForMinutes(device, 15);

        // 15 minutes = 0.25 hours
        expect(result.minKwh).toBeCloseTo(0.025, 4);
        expect(result.maxKwh).toBeCloseTo(0.05, 4);
    });
});

