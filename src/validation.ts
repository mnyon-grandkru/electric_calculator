/**
 * Validate device form data with type checking
 */
export function validateDevice(device: Partial<{
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
}>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // String field validations
    // Required fields: name and address - always validate
    if (device.name === undefined || device.name === null) {
        errors.name = 'Device name is required';
    } else if (typeof device.name !== 'string') {
        errors.name = 'Device name must be text';
    } else if (device.name.trim() === '') {
        errors.name = 'Device name is required';
    }

    if (device.address === undefined || device.address === null) {
        errors.address = 'Address is required';
    } else if (typeof device.address !== 'string') {
        errors.address = 'Address must be text';
    } else if (device.address.trim() === '') {
        errors.address = 'Address is required';
    }

    if (device.description !== undefined && typeof device.description !== 'string') {
        errors.description = 'Description must be text';
    }

    if (device.cpu !== undefined && typeof device.cpu !== 'string') {
        errors.cpu = 'CPU must be text';
    }

    if (device.gpu !== undefined && typeof device.gpu !== 'string') {
        errors.gpu = 'GPU must be text';
    }

    if (device.ram !== undefined && typeof device.ram !== 'string') {
        errors.ram = 'RAM/VRAM must be text';
    }

    // Number field validations
    if (device.minWattage !== undefined) {
        if (typeof device.minWattage !== 'number' || isNaN(device.minWattage)) {
            errors.minWattage = 'Min wattage must be a number';
        } else if (device.minWattage <= 0 || device.minWattage >= 2000) {
            errors.minWattage = 'Min wattage must be between 0 and 2000W';
        }
    }

    if (device.maxWattage !== undefined) {
        if (typeof device.maxWattage !== 'number' || isNaN(device.maxWattage)) {
            errors.maxWattage = 'Max wattage must be a number';
        } else if (device.maxWattage <= 0 || device.maxWattage >= 2000) {
            errors.maxWattage = 'Max wattage must be between 0 and 2000W';
        }
    }

    if (device.minWattage !== undefined && device.maxWattage !== undefined) {
        if (typeof device.minWattage === 'number' && typeof device.maxWattage === 'number') {
            if (device.minWattage > device.maxWattage) {
                errors.maxWattage = 'Max wattage must be greater than or equal to min wattage';
            }
        }
    }

    if (device.rate !== undefined) {
        if (typeof device.rate !== 'number' || isNaN(device.rate)) {
            errors.rate = 'Electricity rate must be a number';
        } else if (device.rate <= 0 || device.rate >= 1) {
            errors.rate = 'Electricity rate must be between 0 and 1 $/kWh';
        }
    }

    if (device.carbonIntensity !== undefined) {
        if (typeof device.carbonIntensity !== 'number' || isNaN(device.carbonIntensity)) {
            errors.carbonIntensity = 'Carbon intensity must be a number';
        } else if (device.carbonIntensity < 0) {
            errors.carbonIntensity = 'Carbon intensity must be 0 or greater';
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validate a single field
 */
export function validateField(fieldName: string, value: any, fieldType: 'string' | 'number'): { valid: boolean; error?: string } {
    if (fieldType === 'string') {
        if (typeof value !== 'string') {
            return { valid: false, error: `${fieldName} must be text` };
        }
        if (fieldName === 'name' || fieldName === 'address') {
            if (value.trim() === '') {
                return { valid: false, error: `${fieldName} is required` };
            }
        }
    } else if (fieldType === 'number') {
        if (typeof value !== 'number' || isNaN(value)) {
            return { valid: false, error: `${fieldName} must be a number` };
        }
    }
    return { valid: true };
}

/**
 * Show validation error on form field
 */
export function showFieldError(fieldId: string, message: string): void {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.setAttribute('aria-invalid', 'true');

    // Remove existing error message
    const existingError = field.parentElement?.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    field.parentElement?.appendChild(errorDiv);
}

/**
 * Clear validation error on form field
 */
export function clearFieldError(fieldId: string): void {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.removeAttribute('aria-invalid');

    const errorMessage = field.parentElement?.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Clear all validation errors for a form
 */
export function clearAllErrors(form: HTMLFormElement): void {
    const fields = form.querySelectorAll('input');
    fields.forEach(field => {
        clearFieldError(field.id);
    });
}

