import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodeAddress } from './geocoding';

// Mock fetch globally
const globalFetch = globalThis.fetch;

describe('geocodeAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Restore original fetch
        globalThis.fetch = globalFetch;
    });

    it('should geocode a valid address', async () => {
        const mockResponse = [
            {
                lat: '41.0340',
                lon: '-73.7629',
                display_name: 'White Plains, NY, USA'
            }
        ];

        globalThis.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        }) as any;

        const result = await geocodeAddress('White Plains, NY, USA');

        expect(result).toEqual({
            lat: 41.0340,
            lng: -73.7629
        });
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('nominatim.openstreetmap.org'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'User-Agent': 'Electric Calculator App'
                })
            })
        );
    });

    it('should return null for invalid address', async () => {
        globalThis.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => []
        }) as any;

        const result = await geocodeAddress('Invalid Address XYZ123');

        expect(result).toBeNull();
    });

    it('should handle fetch errors', async () => {
        globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error')) as any;

        const result = await geocodeAddress('Test Address');

        expect(result).toBeNull();
    });

    it('should handle non-ok responses', async () => {
        globalThis.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found'
        }) as any;

        const result = await geocodeAddress('Test Address');

        expect(result).toBeNull();
    });
});

