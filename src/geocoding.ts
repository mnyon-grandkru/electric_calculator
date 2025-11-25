/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * Returns lat/lng coordinates
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Electric Calculator App'
            }
        });

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

