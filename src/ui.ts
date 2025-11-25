import type { Device, CalculationResults } from './types';
import { calculateCosts, formatCurrency, formatNumber, calculateCostForMinutes } from './calculations';
import { initMap, updateMap } from './map';
import { deviceManager } from './deviceManager';

/**
 * Render calculation results for a device
 */
export function renderCalculations(deviceId: string, results: CalculationResults): void {
    const container = document.getElementById(`${deviceId}-results`);
    if (!container) return;

    container.innerHTML = `
        <div class="calc-item">
            <div class="calc-item-label">Min kWh/hr</div>
            <div class="calc-item-value">${formatNumber(results.minKwhPerHour, 4)}<span class="calc-item-unit">kWh</span></div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Max kWh/hr</div>
            <div class="calc-item-value">${formatNumber(results.maxKwhPerHour, 4)}<span class="calc-item-unit">kWh</span></div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/hr (min)</div>
            <div class="calc-item-value">${formatCurrency(results.minCostPerHour)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/hr (max)</div>
            <div class="calc-item-value">${formatCurrency(results.maxCostPerHour)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/day (min)</div>
            <div class="calc-item-value">${formatCurrency(results.minCostPerDay)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/day (max)</div>
            <div class="calc-item-value">${formatCurrency(results.maxCostPerDay)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/week (min)</div>
            <div class="calc-item-value">${formatCurrency(results.minCostPerWeek)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/week (max)</div>
            <div class="calc-item-value">${formatCurrency(results.maxCostPerWeek)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/month (min)</div>
            <div class="calc-item-value">${formatCurrency(results.minCostPerMonth)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">Cost/month (max)</div>
            <div class="calc-item-value">${formatCurrency(results.maxCostPerMonth)}</div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">CO₂/hr (min)</div>
            <div class="calc-item-value">${formatNumber(results.minCo2PerHour, 2)}<span class="calc-item-unit">g</span></div>
        </div>
        <div class="calc-item">
            <div class="calc-item-label">CO₂/hr (max)</div>
            <div class="calc-item-value">${formatNumber(results.maxCo2PerHour, 2)}<span class="calc-item-unit">g</span></div>
        </div>
    `;
}

/**
 * Render comparison table
 */
export function renderComparison(qnap: Device, pc: Device): void {
    const qnapResults = calculateCosts(qnap);
    const pcResults = calculateCosts(pc);

    const container = document.getElementById('comparison-table');
    if (!container) return;

    container.innerHTML = `
        <div class="formula-section">
            <h3>Formula</h3>
            <div class="formula-content">
                <p class="formula-text">
                    <strong>Cost per hour</strong> = (Wattage ÷ 1000) × Electricity Rate
                </p>
                <p class="formula-note">
                    Where Wattage is in watts and Electricity Rate is $/kWh
                </p>
                <div class="formula-extended">
                    <p>For longer periods:</p>
                    <ul>
                        <li>Cost per day = Cost per hour × 24</li>
                        <li>Cost per week = Cost per day × 7</li>
                        <li>Cost per month = Cost per day × 30</li>
                    </ul>
                </div>
            </div>
        </div>
        <table class="comparison-table" role="table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>QNAP Server</th>
                    <th>PC</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Min Wattage</td>
                    <td>${qnap.minWattage}W</td>
                    <td>${pc.minWattage}W</td>
                </tr>
                <tr>
                    <td>Max Wattage</td>
                    <td>${qnap.maxWattage}W</td>
                    <td>${pc.maxWattage}W</td>
                </tr>
                <tr>
                    <td>Min Cost/hr</td>
                    <td>${formatCurrency(qnapResults.minCostPerHour)}</td>
                    <td>${formatCurrency(pcResults.minCostPerHour)}</td>
                </tr>
                <tr>
                    <td>Max Cost/hr</td>
                    <td>${formatCurrency(qnapResults.maxCostPerHour)}</td>
                    <td>${formatCurrency(pcResults.maxCostPerHour)}</td>
                </tr>
                <tr>
                    <td>Min Cost/day</td>
                    <td>${formatCurrency(qnapResults.minCostPerDay)}</td>
                    <td>${formatCurrency(pcResults.minCostPerDay)}</td>
                </tr>
                <tr>
                    <td>Max Cost/day</td>
                    <td>${formatCurrency(qnapResults.maxCostPerDay)}</td>
                    <td>${formatCurrency(pcResults.maxCostPerDay)}</td>
                </tr>
                <tr>
                    <td>Min Cost/month</td>
                    <td>${formatCurrency(qnapResults.minCostPerMonth)}</td>
                    <td>${formatCurrency(pcResults.minCostPerMonth)}</td>
                </tr>
                <tr>
                    <td>Max Cost/month</td>
                    <td>${formatCurrency(qnapResults.maxCostPerMonth)}</td>
                    <td>${formatCurrency(pcResults.maxCostPerMonth)}</td>
                </tr>
                <tr>
                    <td>Min CO₂/hr</td>
                    <td>${formatNumber(qnapResults.minCo2PerHour, 2)}g</td>
                    <td>${formatNumber(pcResults.minCo2PerHour, 2)}g</td>
                </tr>
                <tr>
                    <td>Max CO₂/hr</td>
                    <td>${formatNumber(qnapResults.maxCo2PerHour, 2)}g</td>
                    <td>${formatNumber(pcResults.maxCo2PerHour, 2)}g</td>
                </tr>
            </tbody>
        </table>
    `;
}

/**
 * Render usage calculator results
 */
export function renderUsageResults(deviceId: string, device: Device, minutes: number): void {
    const container = document.getElementById(`${deviceId}-usage-results`);
    if (!container) return;

    if (!minutes || minutes <= 0) {
        container.innerHTML = '<p class="usage-placeholder">Enter usage duration above to calculate cost</p>';
        return;
    }

    const usage = calculateCostForMinutes(device, minutes);
    const hours = minutes / 60;
    const hoursDisplay = hours < 1
        ? `${minutes} minutes`
        : hours === 1
            ? '1 hour'
            : `${formatNumber(hours, 2)} hours`;

    container.innerHTML = `
        <div class="usage-summary">
            <div class="usage-duration">For ${hoursDisplay}:</div>
        </div>
        <div class="calc-results">
            <div class="calc-item">
                <div class="calc-item-label">Energy Used (min)</div>
                <div class="calc-item-value">${formatNumber(usage.minKwh, 4)}<span class="calc-item-unit">kWh</span></div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">Energy Used (max)</div>
                <div class="calc-item-value">${formatNumber(usage.maxKwh, 4)}<span class="calc-item-unit">kWh</span></div>
            </div>
            <div class="calc-item highlight">
                <div class="calc-item-label">Cost (min)</div>
                <div class="calc-item-value">${formatCurrency(usage.minCost)}</div>
            </div>
            <div class="calc-item highlight">
                <div class="calc-item-label">Cost (max)</div>
                <div class="calc-item-value">${formatCurrency(usage.maxCost)}</div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">CO₂ Emissions (min)</div>
                <div class="calc-item-value">${formatNumber(usage.minCo2, 2)}<span class="calc-item-unit">g</span></div>
            </div>
            <div class="calc-item">
                <div class="calc-item-label">CO₂ Emissions (max)</div>
                <div class="calc-item-value">${formatNumber(usage.maxCo2, 2)}<span class="calc-item-unit">g</span></div>
            </div>
        </div>
    `;
}

/**
 * Update UI for a device
 */
export function updateDeviceUI(deviceId: string, device: Device): void {
    const results = calculateCosts(device);
    renderCalculations(deviceId, results);
    updateMap(deviceId, device);

    // Update usage calculator if there's a value
    const usageInput = document.getElementById(`${deviceId}-usage-minutes`) as HTMLInputElement;
    if (usageInput && usageInput.value) {
        const minutes = parseFloat(usageInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            renderUsageResults(deviceId, device, minutes);
        }
    }

    // Update comparison if both devices exist
    const qnap = deviceManager.getDevice('qnap');
    const pc = deviceManager.getDevice('pc');
    if (qnap && pc) {
        renderComparison(qnap, pc);
    }
}

/**
 * Initialize device UI
 */
export function initDeviceUI(deviceId: string, device: Device): void {
    initMap(deviceId, `${deviceId}-map`, device);
    updateDeviceUI(deviceId, device);

    // Initialize usage calculator placeholder
    const usageResults = document.getElementById(`${deviceId}-usage-results`);
    if (usageResults) {
        usageResults.innerHTML = '<p class="usage-placeholder">Enter usage duration above to calculate cost</p>';
    }
}

