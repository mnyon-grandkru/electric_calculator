import L from 'leaflet';
import type { Device } from './types';

let maps: Map<string, L.Map> = new Map();
let markers: Map<string, L.Marker> = new Map();

/**
 * Initialize a Leaflet map for a device
 */
export function initMap(deviceId: string, containerId: string, device: Device): void {
    // Default center (White Plains, NY)
    const defaultCenter: [number, number] = [41.0340, -73.7629];
    const center: [number, number] = device.lat && device.lng
        ? [device.lat, device.lng]
        : defaultCenter;

    const map = L.map(containerId, {
        center,
        zoom: 13,
        zoomControl: true,
        attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    maps.set(deviceId, map);

    if (device.lat && device.lng) {
        updateMarker(deviceId, device.lat, device.lng);
    }
}

/**
 * Update map marker position
 */
export function updateMarker(deviceId: string, lat: number, lng: number): void {
    const map = maps.get(deviceId);
    if (!map) return;

    // Remove existing marker
    const existingMarker = markers.get(deviceId);
    if (existingMarker) {
        map.removeLayer(existingMarker);
    }

    // Create new marker
    const marker = L.marker([lat, lng]).addTo(map);
    markers.set(deviceId, marker);

    // Update map view
    map.setView([lat, lng], 13);
}

/**
 * Update map for a device
 */
export function updateMap(deviceId: string, device: Device): void {
    if (device.lat && device.lng) {
        updateMarker(deviceId, device.lat, device.lng);
    }
}

/**
 * Remove map for a device
 */
export function removeMap(deviceId: string): void {
    const map = maps.get(deviceId);
    if (map) {
        map.remove();
        maps.delete(deviceId);
    }
    markers.delete(deviceId);
}

