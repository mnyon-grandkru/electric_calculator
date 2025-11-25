import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodeAddress } from './geocoding';

// Mock fetch globally
global.fetch = vi.fn();

describe('geocodeAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should geocode a valid address', async () => {
        const mockResponse = [
            {
                lat: '41.0340',
                lon: '-73.7629',
                display_name: 'White Plains, NY, USA'
            }
        ];

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const result = await geocodeAddress('White Plains, NY, USA');

        expect(result).toEqual({
            lat: 41.0340,
            lng: -73.7629
        });
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('nominatim.openstreetmap.org'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'User-Agent': 'Electric Calculator App'
                })
            })
        );
    });

    it('should return null for invalid address', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        const result = await geocodeAddress('Invalid Address XYZ123');

        expect(result).toBeNull();
    });

    it('should handle fetch errors', async () => {
        (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

        const result = await geocodeAddress('Test Address');

        expect(result).toBeNull();
    });

    it('should handle non-ok responses', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found'
        });

        const result = await geocodeAddress('Test Address');

        expect(result).toBeNull();
    });
});

