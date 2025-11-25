export interface Device {
    name: string;
    description: string;
    address: string;
    cpu: string;
    gpu: string;
    ram: string;
    type: string;
    minWattage: number;
    maxWattage: number;
    rate: number;
    carbonIntensity: number;
    lat?: number;
    lng?: number;
}

export interface CalculationResults {
    minKwhPerHour: number;
    maxKwhPerHour: number;
    minCostPerHour: number;
    maxCostPerHour: number;
    minCostPerDay: number;
    maxCostPerDay: number;
    minCostPerWeek: number;
    maxCostPerWeek: number;
    minCostPerMonth: number;
    maxCostPerMonth: number;
    minCo2PerHour: number;
    maxCo2PerHour: number;
}

