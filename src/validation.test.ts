import { describe, it, expect } from 'vitest';
import { validateDevice, validateField } from './validation';

describe('validateDevice', () => {
    it('should validate a valid device', () => {
        const result = validateDevice({
            name: 'Test Device',
            address: '123 Main St',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result.valid).toBe(true);
        expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should require device name', () => {
        const result = validateDevice({
            address: '123 Main St',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.name).toBe('Device name is required');
    });

    it('should require address', () => {
        const result = validateDevice({
            name: 'Test Device',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.address).toBe('Address is required');
    });

    it('should validate string fields are strings', () => {
        const result = validateDevice({
            name: 123 as any,
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.name).toBe('Device name must be text');
    });

    it('should validate min wattage range', () => {
        const result1 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: -10,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result1.valid).toBe(false);
        expect(result1.errors.minWattage).toBe('Min wattage must be between 0 and 2000W');

        const result2 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 2500,
            maxWattage: 3000,
            rate: 0.23
        });

        expect(result2.valid).toBe(false);
        expect(result2.errors.minWattage).toBe('Min wattage must be between 0 and 2000W');
    });

    it('should validate min wattage is a number', () => {
        const result = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 'not a number' as any,
            maxWattage: 200,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.minWattage).toBe('Min wattage must be a number');
    });

    it('should validate max wattage range', () => {
        const result = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 2500,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.maxWattage).toBe('Max wattage must be between 0 and 2000W');
    });

    it('should validate min wattage is not greater than max wattage', () => {
        const result = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 200,
            maxWattage: 100,
            rate: 0.23
        });

        expect(result.valid).toBe(false);
        expect(result.errors.maxWattage).toBe('Max wattage must be greater than or equal to min wattage');
    });

    it('should validate electricity rate range', () => {
        const result1 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: -0.1
        });

        expect(result1.valid).toBe(false);
        expect(result1.errors.rate).toBe('Electricity rate must be between 0 and 1 $/kWh');

        const result2 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: 1.5
        });

        expect(result2.valid).toBe(false);
        expect(result2.errors.rate).toBe('Electricity rate must be between 0 and 1 $/kWh');
    });

    it('should validate electricity rate is a number', () => {
        const result = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: 'not a number' as any
        });

        expect(result.valid).toBe(false);
        expect(result.errors.rate).toBe('Electricity rate must be a number');
    });

    it('should validate carbon intensity', () => {
        const result1 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23,
            carbonIntensity: -10
        });

        expect(result1.valid).toBe(false);
        expect(result1.errors.carbonIntensity).toBe('Carbon intensity must be 0 or greater');

        const result2 = validateDevice({
            name: 'Test',
            address: 'Test',
            minWattage: 50,
            maxWattage: 200,
            rate: 0.23,
            carbonIntensity: 'not a number' as any
        });

        expect(result2.valid).toBe(false);
        expect(result2.errors.carbonIntensity).toBe('Carbon intensity must be a number');
    });
});

describe('validateField', () => {
    it('should validate string fields', () => {
        const result1 = validateField('name', 'Test Name', 'string');
        expect(result1.valid).toBe(true);

        const result2 = validateField('name', '', 'string');
        expect(result2.valid).toBe(false);
        expect(result2.error).toBe('name is required');

        const result3 = validateField('name', 123, 'string');
        expect(result3.valid).toBe(false);
        expect(result3.error).toBe('name must be text');
    });

    it('should validate number fields', () => {
        const result1 = validateField('minWattage', 50, 'number');
        expect(result1.valid).toBe(true);

        const result2 = validateField('minWattage', 'not a number', 'number');
        expect(result2.valid).toBe(false);
        expect(result2.error).toBe('minWattage must be a number');
    });
});

