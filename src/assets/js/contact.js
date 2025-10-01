/**
 * Enhanced Contact Form with Google Places Autocomplete, Validation, and Security
 * Features: Google Places API, reCAPTCHA, Honeypot, Phone formatting, State autocomplete
 */

class ContactForm {
    constructor() {
        this.form = null;
        this.autocomplete = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.form = document.getElementById('cs-form-1601');
            if (this.form) {
                this.setupFormHandlers();
                this.setupPhoneFormatting();
                this.setupStateAutocomplete();
                this.initializeGooglePlaces();
                this.setupFormValidation();
            }
        });
    }

    /**
     * Initialize Google Places Autocomplete
     */
    initializeGooglePlaces() {
        const addressInput = document.getElementById('address-1601');
        if (!addressInput || !window.google) {
            console.warn('Google Places API not loaded or address input not found');
            return;
        }

        try {
            // Configure autocomplete options
            const options = {
                types: ['address'],
                componentRestrictions: { country: 'us' },
                fields: ['address_components', 'formatted_address', 'geometry']
            };

            this.autocomplete = new google.maps.places.Autocomplete(addressInput, options);
            
            // Listen for place selection
            this.autocomplete.addListener('place_changed', () => {
                this.handlePlaceSelect();
            });

            // Style the Google Places dropdown
            this.styleGooglePlacesDropdown();
        } catch (error) {
            console.error('Error initializing Google Places:', error);
        }
    }

    /**
     * Handle Google Places selection and auto-fill form fields
     */
    handlePlaceSelect() {
        const place = this.autocomplete.getPlace();
        
        if (!place.address_components) {
            console.warn('No address components found');
            return;
        }

        // Clear previous values
        document.getElementById('city-1601').value = '';
        document.getElementById('state-1601').value = '';
        document.getElementById('zip-1601').value = '';

        // Parse address components
        const addressComponents = {};
        place.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('locality')) {
                addressComponents.city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                addressComponents.state = component.short_name;
            } else if (types.includes('postal_code')) {
                addressComponents.zip = component.long_name;
            }
        });

        // Fill in the form fields
        if (addressComponents.city) {
            document.getElementById('city-1601').value = addressComponents.city;
        }
        if (addressComponents.state) {
            document.getElementById('state-1601').value = addressComponents.state;
            this.hideStateDropdown();
        }
        if (addressComponents.zip) {
            document.getElementById('zip-1601').value = addressComponents.zip;
        }

        // Remove any error styling
        this.clearFieldError('address-1601');
        this.clearFieldError('city-1601');
        this.clearFieldError('state-1601');
        this.clearFieldError('zip-1601');
    }

    /**
     * Style Google Places dropdown to match site design
     */
    styleGooglePlacesDropdown() {
        const style = document.createElement('style');
        style.textContent = `
            .pac-container {
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 1px solid #e1e1e1;
                font-family: inherit;
            }
            .pac-item {
                padding: 12px 16px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
            }
            .pac-item:hover {
                background-color: #f8f9fa;
            }
            .pac-item-selected {
                background-color: var(--primary, #007bff);
                color: white;
            }
            .pac-item-query {
                font-weight: 600;
                color: inherit;
            }
            .pac-matched {
                font-weight: 700;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup phone number formatting
     */
    setupPhoneFormatting() {
        const phoneInput = document.getElementById('phone-1601');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = value.substring(0, 10);
                value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
            } else if (value.length >= 6) {
                value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
            }
            
            e.target.value = value;
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey) ||
                (e.keyCode === 67 && e.ctrlKey) ||
                (e.keyCode === 86 && e.ctrlKey) ||
                (e.keyCode === 88 && e.ctrlKey) ||
                // Allow home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    /**
     * Setup state autocomplete with dropdown
     */
    setupStateAutocomplete() {
        const stateInput = document.getElementById('state-1601');
        if (!stateInput) return;

        const states = [
            { code: 'PA', name: 'Pennsylvania', priority: true },
            { code: 'AL', name: 'Alabama' },
            { code: 'AK', name: 'Alaska' },
            { code: 'AZ', name: 'Arizona' },
            { code: 'AR', name: 'Arkansas' },
            { code: 'CA', name: 'California' },
            { code: 'CO', name: 'Colorado' },
            { code: 'CT', name: 'Connecticut' },
            { code: 'DE', name: 'Delaware' },
            { code: 'FL', name: 'Florida' },
            { code: 'GA', name: 'Georgia' },
            { code: 'HI', name: 'Hawaii' },
            { code: 'ID', name: 'Idaho' },
            { code: 'IL', name: 'Illinois' },
            { code: 'IN', name: 'Indiana' },
            { code: 'IA', name: 'Iowa' },
            { code: 'KS', name: 'Kansas' },
            { code: 'KY', name: 'Kentucky' },
            { code: 'LA', name: 'Louisiana' },
            { code: 'ME', name: 'Maine' },
            { code: 'MD', name: 'Maryland' },
            { code: 'MA', name: 'Massachusetts' },
            { code: 'MI', name: 'Michigan' },
            { code: 'MN', name: 'Minnesota' },
            { code: 'MS', name: 'Mississippi' },
            { code: 'MO', name: 'Missouri' },
            { code: 'MT', name: 'Montana' },
            { code: 'NE', name: 'Nebraska' },
            { code: 'NV', name: 'Nevada' },
            { code: 'NH', name: 'New Hampshire' },
            { code: 'NJ', name: 'New Jersey' },
            { code: 'NM', name: 'New Mexico' },
            { code: 'NY', name: 'New York' },
            { code: 'NC', name: 'North Carolina' },
            { code: 'ND', name: 'North Dakota' },
            { code: 'OH', name: 'Ohio' },
            { code: 'OK', name: 'Oklahoma' },
            { code: 'OR', name: 'Oregon' },
            { code: 'RI', name: 'Rhode Island' },
            { code: 'SC', name: 'South Carolina' },
            { code: 'SD', name: 'South Dakota' },
            { code: 'TN', name: 'Tennessee' },
            { code: 'TX', name: 'Texas' },
            { code: 'UT', name: 'Utah' },
            { code: 'VT', name: 'Vermont' },
            { code: 'VA', name: 'Virginia' },
            { code: 'WA', name: 'Washington' },
            { code: 'WV', name: 'West Virginia' },
            { code: 'WI', name: 'Wisconsin' },
            { code: 'WY', name: 'Wyoming' }
        ];

        this.createStateDropdown(stateInput, states);
    }

    /**
     * Create state dropdown functionality
     */
    createStateDropdown(input, states) {
        const container = input.parentElement;
        const dropdown = document.createElement('div');
        dropdown.className = 'cs-state-dropdown';
        dropdown.style.display = 'none';
        container.appendChild(dropdown);

        input.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            this.filterStates(dropdown, states, value);
        });

        input.addEventListener('focus', (e) => {
            const value = e.target.value.toLowerCase();
            this.filterStates(dropdown, states, value);
        });

        input.addEventListener('blur', (e) => {
            // Delay hiding to allow click on dropdown
            setTimeout(() => {
                this.hideStateDropdown();
            }, 150);
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                this.hideStateDropdown();
            }
        });
    }

    /**
     * Filter and display state options
     */
    filterStates(dropdown, states, query) {
        dropdown.innerHTML = '';
        
        let matches = states.filter(state => 
            state.code.toLowerCase().includes(query) ||
            state.name.toLowerCase().includes(query)
        );

        // Sort with priority states first
        matches.sort((a, b) => {
            if (a.priority && !b.priority) return -1;
            if (!a.priority && b.priority) return 1;
            return a.name.localeCompare(b.name);
        });

        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        matches.forEach(state => {
            const option = document.createElement('div');
            option.className = `cs-state-option ${state.priority ? 'cs-priority-state' : ''}`;
            option.textContent = `${state.name} (${state.code})`;
            option.addEventListener('click', () => {
                document.getElementById('state-1601').value = state.code;
                this.hideStateDropdown();
                this.clearFieldError('state-1601');
            });
            dropdown.appendChild(option);
        });

        dropdown.style.display = 'block';
    }

    /**
     * Hide state dropdown
     */
    hideStateDropdown() {
        const dropdown = document.querySelector('.cs-state-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    /**
     * Setup comprehensive form validation
     */
    setupFormValidation() {
        const fields = [
            { id: 'name-1601', validator: this.validateName },
            { id: 'email-1601', validator: this.validateEmail },
            { id: 'phone-1601', validator: this.validatePhone },
            { id: 'address-1601', validator: this.validateAddress },
            { id: 'city-1601', validator: this.validateCity },
            { id: 'state-1601', validator: this.validateState },
            { id: 'zip-1601', validator: this.validateZip },
            { id: 'message-1601', validator: this.validateMessage }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.addEventListener('blur', () => {
                    this.validateField(field.id, field.validator);
                });
                element.addEventListener('input', () => {
                    this.clearFieldError(field.id);
                });
            }
        });
    }

    /**
     * Validation functions
     */
    validateName(value) {
        return {
            isValid: value.trim().length >= 2,
            message: 'Please enter a valid name (at least 2 characters)'
        };
    }

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(value),
            message: 'Please enter a valid email address'
        };
    }

    validatePhone(value) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return {
            isValid: phoneRegex.test(value),
            message: 'Please enter a valid phone number'
        };
    }

    validateAddress(value) {
        return {
            isValid: value.trim().length >= 5,
            message: 'Please enter a valid address'
        };
    }

    validateCity(value) {
        return {
            isValid: value.trim().length >= 2,
            message: 'Please enter a valid city name'
        };
    }

    validateState(value) {
        const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        return {
            isValid: validStates.includes(value.toUpperCase()),
            message: 'Please enter a valid state abbreviation (e.g., PA)'
        };
    }

    validateZip(value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return {
            isValid: zipRegex.test(value),
            message: 'Please enter a valid ZIP code'
        };
    }

    validateMessage(value) {
        return {
            isValid: value.trim().length >= 10,
            message: 'Please enter a message (at least 10 characters)'
        };
    }

    /**
     * Validate individual field
     */
    validateField(fieldId, validator) {
        const element = document.getElementById(fieldId);
        if (!element) return true;

        const result = validator(element.value);
        
        if (!result.isValid) {
            this.showFieldError(fieldId, result.message);
            return false;
        } else {
            this.clearFieldError(fieldId);
            return true;
        }
    }

    /**
     * Show field error
     */
    showFieldError(fieldId, message) {
        const element = document.getElementById(fieldId);
        if (!element) return;

        element.classList.add('cs-error');
        
        // Ensure the input has a wrapper for positioning
        let wrapper = element.parentElement.querySelector('.cs-input-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'cs-input-wrapper';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        }
        
        // Remove existing error message
        const existingError = wrapper.querySelector('.cs-field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'cs-field-error';
        errorDiv.textContent = message;
        wrapper.appendChild(errorDiv);
    }

    /**
     * Clear field error
     */
    clearFieldError(fieldId) {
        const element = document.getElementById(fieldId);
        if (!element) return;

        element.classList.remove('cs-error');
        
        // Look for error in wrapper first, then fallback to parent
        const wrapper = element.parentElement;
        const errorDiv = wrapper.querySelector('.cs-field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Setup form submission handlers
     */
    setupFormHandlers() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    /**
     * Handle form submission with comprehensive validation
     */
    async handleFormSubmit() {
        if (this.isSubmitting) return;

        // Check honeypot
        const honeypot = document.querySelector('input[name="bot-field"]');
        if (honeypot && honeypot.value !== '') {
            console.warn('Bot detected');
            return;
        }

        // Validate all fields
        const isValid = this.validateAllFields();
        if (!isValid) {
            this.showErrorMessage('Please correct the errors above and try again.');
            return;
        }

        // Check if we're outside Pennsylvania
        const state = document.getElementById('state-1601').value.toUpperCase();
        if (state !== 'PA') {
            this.showServiceAreaNotification(state);
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();

        try {
            // Submit form (Netlify handles reCAPTCHA verification server-side)
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action || '/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error.message || 'There was an error submitting your form. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    /**
     * Validate all form fields
     */
    validateAllFields() {
        const validations = [
            { id: 'name-1601', validator: this.validateName },
            { id: 'email-1601', validator: this.validateEmail },
            { id: 'phone-1601', validator: this.validatePhone },
            { id: 'address-1601', validator: this.validateAddress },
            { id: 'city-1601', validator: this.validateCity },
            { id: 'state-1601', validator: this.validateState },
            { id: 'zip-1601', validator: this.validateZip },
            { id: 'message-1601', validator: this.validateMessage }
        ];

        let isValid = true;
        validations.forEach(validation => {
            if (!this.validateField(validation.id, validation.validator)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Show service area notification for out-of-state inquiries
     */
    showServiceAreaNotification(state) {
        const existingNotification = document.querySelector('.cs-service-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'cs-service-notification';
        notification.innerHTML = `
            <div class="cs-notification-content">
                <div>
                    <strong>Service Area Notice:</strong> We currently only serve Pennsylvania. 
                    We'll keep your information on file for future expansion to ${this.getStateName(state)}.
                </div>
                <button type="button" class="cs-notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        this.form.insertBefore(notification, this.form.firstChild);

        // Handle close button
        notification.querySelector('.cs-notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Get full state name from code
     */
    getStateName(code) {
        const states = {
            'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
            'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
            'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
            'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
            'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
            'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
            'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
            'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
            'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
            'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
        };
        return states[code] || code;
    }

    /**
     * Show loading state during form submission
     */
    showLoadingState() {
        const submitButton = this.form.querySelector('.cs-submit');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            submitButton.style.opacity = '0.7';
        }
    }

    /**
     * Hide loading state after form submission
     */
    hideLoadingState() {
        const submitButton = this.form.querySelector('.cs-submit');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Now';
            submitButton.style.opacity = '1';
        }
    }

    /**
     * Show success message after successful submission
     */
    showSuccessMessage() {
        this.showPopup(
            'Thank You!',
            'Your message has been sent successfully. We\'ll get back to you within 24 hours.',
            'success'
        );
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showPopup(
            'Error',
            message,
            'error'
        );
    }

    /**
     * Show popup message
     */
    showPopup(title, message, type = 'success') {
        // Remove existing popup
        const existingPopup = document.querySelector('.thank-you-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'thank-you-popup';
        
        const bgColor = type === 'success' ? '#28a745' : '#dc3545';
        
        popup.innerHTML = `
            <div class="thank-you-overlay">
                <div class="thank-you-content">
                    <div class="thank-you-header">
                        <h3 style="color: ${bgColor};">${title}</h3>
                        <button type="button" class="thank-you-close" aria-label="Close">&times;</button>
                    </div>
                    <p>${message}</p>
                    <div class="thank-you-actions">
                        <button type="button" class="cs-button-solid thank-you-ok" style="background-color: ${bgColor};">OK</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);

        // Handle close events
        const closeButtons = popup.querySelectorAll('.thank-you-close, .thank-you-ok');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closePopup(popup);
            });
        });

        // Close on overlay click
        popup.querySelector('.thank-you-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closePopup(popup);
            }
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closePopup(popup);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /**
     * Close popup with animation
     */
    closePopup(popup) {
        popup.classList.add('closing');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }

    /**
     * Reset form after successful submission
     */
    resetForm() {
        this.form.reset();
        
        // Clear any error states
        this.form.querySelectorAll('.cs-error').forEach(element => {
            element.classList.remove('cs-error');
        });
        
        this.form.querySelectorAll('.cs-field-error').forEach(error => {
            error.remove();
        });

        // Hide state dropdown
        this.hideStateDropdown();
    }
}

// Initialize the contact form
new ContactForm();
