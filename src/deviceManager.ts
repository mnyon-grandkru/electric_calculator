import type { Device } from './types';
import { geocodeAddress } from './geocoding';

const DEFAULT_QNAP: Device = {
    name: 'QNAP Server',
    description: 'QNAP TS-464eU – Compact 1U NAS',
    address: '1 Main St, White Plains, NY, USA',
    cpu: 'Intel Celeron N5105 (4C/4T, 2.9 GHz)',
    gpu: 'None',
    ram: '8GB RAM',
    type: 'Server/NAS',
    minWattage: 21.1,
    maxWattage: 35.3,
    rate: 0.23,
    carbonIntensity: 185
};

const DEFAULT_PC: Device = {
    name: 'PC',
    description: 'Intel Core i7 Gaming PC, RTX GPU',
    address: '123 Broad St, White Plains, NY, USA',
    cpu: 'Intel Core i7-13700K (8P+8E, up to 5.4 GHz)',
    gpu: 'NVIDIA RTX 3070',
    ram: '32GB RAM / 8GB VRAM',
    type: 'PC',
    minWattage: 65,
    maxWattage: 350,
    rate: 0.23,
    carbonIntensity: 185
};

class DeviceManager {
    private devices: Map<string, Device> = new Map();
    private listeners: Set<() => void> = new Set();

    constructor() {
        this.devices.set('qnap', { ...DEFAULT_QNAP });
        this.devices.set('pc', { ...DEFAULT_PC });
    }

    getDevice(deviceId: string): Device | undefined {
        return this.devices.get(deviceId);
    }

    getAllDevices(): Device[] {
        return Array.from(this.devices.values());
    }

    async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
        const device = this.devices.get(deviceId);
        if (!device) return;

        const updatedDevice = { ...device, ...updates };

        // Geocode address if it changed
        if (updates.address && updates.address !== device.address) {
            const coords = await geocodeAddress(updates.address);
            if (coords) {
                updatedDevice.lat = coords.lat;
                updatedDevice.lng = coords.lng;
            }
        }

        this.devices.set(deviceId, updatedDevice);
        this.notifyListeners();
    }

    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener());
    }
}

export const deviceManager = new DeviceManager();

