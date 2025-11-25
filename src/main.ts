import { deviceManager } from './deviceManager';
import { initDeviceUI, updateDeviceUI, renderUsageResults } from './ui';
import { validateDevice, showFieldError, clearFieldError, clearAllErrors, validateField } from './validation';
import type { Device } from './types';

// Initialize devices
const qnap = deviceManager.getDevice('qnap')!;
const pc = deviceManager.getDevice('pc')!;

// Initialize UI
initDeviceUI('qnap', qnap);
initDeviceUI('pc', pc);

// Mobile tab switching
function setupMobileTabs(): void {
    const tabs = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.device-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const deviceId = tab.getAttribute('data-device');
            if (!deviceId) return;

            // Update tab states
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('active');

            // Update panel visibility
            panels.forEach(panel => {
                const panelDeviceId = panel.id.replace('-panel', '');
                if (panelDeviceId === deviceId) {
                    panel.removeAttribute('hidden');
                    panel.setAttribute('data-active', 'true');
                } else {
                    panel.setAttribute('hidden', '');
                    panel.setAttribute('data-active', 'false');
                }
            });
        });
    });
}

// Field type mapping (form field name -> type)
const FIELD_TYPES: Record<string, 'string' | 'number'> = {
    name: 'string',
    description: 'string',
    address: 'string',
    cpu: 'string',
    gpu: 'string',
    ram: 'string',
    type: 'string',
    minWattage: 'number',
    maxWattage: 'number',
    rate: 'number',
    carbon: 'number' // Maps to carbonIntensity in Device
};

// Setup form handlers
function setupFormHandlers(deviceId: string): void {
    const form = document.querySelector(`form[data-device="${deviceId}"]`) as HTMLFormElement;
    if (!form) return;

    const inputs = form.querySelectorAll('input');
    const recalculateButton = document.getElementById(`${deviceId}-recalculate`) as HTMLButtonElement;

    // Validate individual fields on blur
    inputs.forEach(input => {
        const fieldName = input.name;

        // Special handling for address field - update map immediately
        if (fieldName === 'address') {
            let geocodeTimeout: number | null = null;

            // Geocode and update map when address changes
            const updateAddressAndMap = async (value: string, showLoading: boolean = false) => {
                if (!value || value.trim() === '') {
                    return;
                }

                // Show loading state
                if (showLoading) {
                    input.setAttribute('data-geocoding', 'true');
                    input.style.borderColor = 'var(--yellow)';
                }

                try {
                    const { geocodeAddress } = await import('./geocoding');
                    const coords = await geocodeAddress(value.trim());

                    if (coords) {
                        // Update device with new coordinates
                        await deviceManager.updateDevice(deviceId, {
                            address: value.trim(),
                            lat: coords.lat,
                            lng: coords.lng
                        });
                        // Map will be updated by the subscription listener via updateDeviceUI
                        clearFieldError(input.id);
                    } else {
                        showFieldError(input.id, 'Could not find location. Please check the address.');
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    showFieldError(input.id, 'Error geocoding address. Please try again.');
                } finally {
                    // Clear loading state
                    if (showLoading) {
                        input.removeAttribute('data-geocoding');
                        input.style.borderColor = '';
                    }
                }
            };

            input.addEventListener('blur', async () => {
                const value = input.value.trim();

                // Clear any pending timeout
                if (geocodeTimeout !== null) {
                    clearTimeout(geocodeTimeout);
                    geocodeTimeout = null;
                }

                // Validate address
                const validation = validateField('address', value, 'string');
                if (!validation.valid && validation.error) {
                    showFieldError(input.id, validation.error);
                    return;
                }

                clearFieldError(input.id);

                // Geocode and update map immediately on blur (show loading indicator)
                await updateAddressAndMap(value, true);
            });

            // Debounced geocoding on input (after user stops typing for 1.5 seconds)
            input.addEventListener('input', () => {
                clearFieldError(input.id);

                // Clear existing timeout
                if (geocodeTimeout !== null) {
                    clearTimeout(geocodeTimeout);
                }

                // Set new timeout for debounced geocoding
                const value = input.value.trim();
                if (value && value.length > 5) { // Only geocode if address is substantial
                    geocodeTimeout = window.setTimeout(() => {
                        updateAddressAndMap(value).catch(error => {
                            // Silently fail on debounced geocoding, will retry on blur
                            console.error('Debounced geocoding error:', error);
                        });
                    }, 1500);
                }
            });
        } else {
            // Regular field validation
            input.addEventListener('blur', () => {
                let value: string | number;

                if (input.type === 'number') {
                    value = input.value === '' ? NaN : parseFloat(input.value);
                } else {
                    value = input.value;
                }

                const fieldType = FIELD_TYPES[fieldName] || 'string';
                const validation = validateField(fieldName, value, fieldType);

                if (!validation.valid && validation.error) {
                    showFieldError(input.id, validation.error);
                } else {
                    clearFieldError(input.id);
                }
            });

            // Clear errors on input
            input.addEventListener('input', () => {
                clearFieldError(input.id);
            });
        }
    });

    // Recalculate button handler
    if (recalculateButton) {
        recalculateButton.addEventListener('click', async () => {
            await recalculateDevice(deviceId, form);
        });
    }

    // Usage calculator handler
    const usageInput = document.getElementById(`${deviceId}-usage-minutes`) as HTMLInputElement;
    if (usageInput) {
        usageInput.addEventListener('input', () => {
            const minutes = parseFloat(usageInput.value);
            const device = deviceManager.getDevice(deviceId);
            if (device) {
                if (!isNaN(minutes) && minutes > 0) {
                    renderUsageResults(deviceId, device, minutes);
                } else {
                    const container = document.getElementById(`${deviceId}-usage-results`);
                    if (container) {
                        container.innerHTML = '<p class="usage-placeholder">Enter usage duration above to calculate cost</p>';
                    }
                }
            }
        });
    }
}

// Recalculate device from form values
async function recalculateDevice(deviceId: string, form: HTMLFormElement): Promise<void> {
    const recalculateButton = document.getElementById(`${deviceId}-recalculate`) as HTMLButtonElement;

    // Clear all previous errors
    clearAllErrors(form);

    // Collect form values
    const formData = new FormData(form);
    const updates: Partial<Device> = {};

    // Process each field with type validation
    for (const [key, value] of formData.entries()) {
        // Map form field names to device property names
        let deviceKey = key;
        if (key === 'carbon') {
            deviceKey = 'carbonIntensity';
        }

        const fieldType = FIELD_TYPES[key] || 'string';

        if (fieldType === 'number') {
            const numValue = value === '' ? NaN : parseFloat(value as string);
            if (isNaN(numValue)) {
                const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
                if (input) {
                    showFieldError(input.id, `${key} must be a number`);
                }
                if (recalculateButton) {
                    recalculateButton.disabled = false;
                }
                return;
            }
            updates[deviceKey as keyof Device] = numValue as any;
        } else {
            updates[deviceKey as keyof Device] = value as any;
        }
    }

    // Validate all fields together
    const validation = validateDevice(updates);

    if (!validation.valid) {
        // Show errors for each invalid field
        Object.entries(validation.errors).forEach(([fieldName, errorMessage]) => {
            const input = form.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
            if (input) {
                showFieldError(input.id, errorMessage);
            }
        });
        if (recalculateButton) {
            recalculateButton.disabled = false;
        }
        return;
    }

    // Disable button during update
    if (recalculateButton) {
        recalculateButton.disabled = true;
        recalculateButton.textContent = 'Calculating...';
    }

    try {
        // Update device
        await deviceManager.updateDevice(deviceId, updates);

        // Update UI will be triggered by subscription
        if (recalculateButton) {
            recalculateButton.textContent = 'Recalculated!';
            setTimeout(() => {
                recalculateButton.textContent = 'Recalculate';
                recalculateButton.disabled = false;
            }, 1000);
        }
    } catch (error) {
        console.error('Error updating device:', error);
        if (recalculateButton) {
            recalculateButton.textContent = 'Error';
            recalculateButton.disabled = false;
            setTimeout(() => {
                recalculateButton.textContent = 'Recalculate';
            }, 2000);
        }
    }
}

// Subscribe to device changes
deviceManager.subscribe(() => {
    const qnap = deviceManager.getDevice('qnap');
    const pc = deviceManager.getDevice('pc');

    if (qnap) {
        updateDeviceUI('qnap', qnap);
        // Update usage calculator if it has a value
        const qnapUsageInput = document.getElementById('qnap-usage-minutes') as HTMLInputElement;
        if (qnapUsageInput && qnapUsageInput.value) {
            const minutes = parseFloat(qnapUsageInput.value);
            if (!isNaN(minutes) && minutes > 0) {
                renderUsageResults('qnap', qnap, minutes);
            }
        }
    }
    if (pc) {
        updateDeviceUI('pc', pc);
        // Update usage calculator if it has a value
        const pcUsageInput = document.getElementById('pc-usage-minutes') as HTMLInputElement;
        if (pcUsageInput && pcUsageInput.value) {
            const minutes = parseFloat(pcUsageInput.value);
            if (!isNaN(minutes) && minutes > 0) {
                renderUsageResults('pc', pc, minutes);
            }
        }
    }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileTabs();
    setupFormHandlers('qnap');
    setupFormHandlers('pc');

    // Set initial active panel for mobile
    const isMobile = window.innerWidth < 960;
    if (isMobile) {
        const qnapPanel = document.getElementById('qnap-panel');
        const pcPanel = document.getElementById('pc-panel');
        if (qnapPanel) {
            qnapPanel.setAttribute('data-active', 'true');
        }
        if (pcPanel) {
            pcPanel.setAttribute('data-active', 'false');
            pcPanel.setAttribute('hidden', '');
        }
    }
});

// Handle window resize for mobile/desktop switching
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 960;
    const qnapPanel = document.getElementById('qnap-panel');
    const pcPanel = document.getElementById('pc-panel');

    if (isMobile) {
        // Mobile: show only active panel
        const activeTab = document.querySelector('.tab-button.active');
        const activeDeviceId = activeTab?.getAttribute('data-device');

        if (activeDeviceId === 'qnap') {
            qnapPanel?.removeAttribute('hidden');
            qnapPanel?.setAttribute('data-active', 'true');
            pcPanel?.setAttribute('hidden', '');
            pcPanel?.setAttribute('data-active', 'false');
        } else {
            pcPanel?.removeAttribute('hidden');
            pcPanel?.setAttribute('data-active', 'true');
            qnapPanel?.setAttribute('hidden', '');
            qnapPanel?.setAttribute('data-active', 'false');
        }
    } else {
        // Desktop: show both panels
        qnapPanel?.removeAttribute('hidden');
        pcPanel?.removeAttribute('hidden');
    }
});

