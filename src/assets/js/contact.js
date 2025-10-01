/**
 * Enhanced Contact Form with Validation and Security
 * Features: reCAPTCHA, Honeypot, Phone formatting, State autocomplete
 */

class ContactForm {
    constructor() {
        this.form = null;
        this.allowedStates = ['PA', 'MD', 'DE', 'NJ'];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.form = document.getElementById('cs-form-1601');
            if (this.form) {
                this.setupFormHandlers();
                this.setupPhoneFormatting();
                this.setupStateAutocomplete();
                this.setupFormValidation();
            }
        });
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
            { code: 'MD', name: 'Maryland' },
            { code: 'DE', name: 'Delaware' },
            { code: 'NJ', name: 'New Jersey' }
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
        const serviceStates = ['PA', 'MD', 'DE', 'NJ'];
        const upperValue = value.toUpperCase();
        
        if (!upperValue) {
            return {
                isValid: false,
                message: 'Please select a state'
            };
        }
        
        if (!serviceStates.includes(upperValue)) {
            return {
                isValid: false,
                message: 'Sorry, Hybrid Roofing PA does not operate in your area. We serve PA, MD, DE, and NJ.'
            };
        }
        
        return {
            isValid: true,
            message: ''
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
            // Check honeypot
            const honeypot = document.querySelector('input[name="bot-field"]');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected');
                e.preventDefault();
                return;
            }

            // Validate all fields before submission
            const isValid = this.validateAllFields();
            if (!isValid) {
                e.preventDefault();
                return;
            }

            // Let Netlify handle the rest - no preventDefault
        });
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



}

// Initialize the contact form
new ContactForm();
