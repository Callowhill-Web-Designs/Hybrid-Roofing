// Contact form functionality - removed Google Maps API dependencies

// Form validation and enhancement
function enhanceForm() {
    const form = document.getElementById('cs-form-1601');
    const addressField = document.getElementById('address-1601');
    const cityField = document.getElementById('city-1601');
    const stateField = document.getElementById('state-1601');
    const zipField = document.getElementById('zip-1601');

    // Add input formatting for phone number
    const phoneField = document.getElementById('phone-1601');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Add ZIP code formatting
    if (zipField) {
        zipField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5);
            }
            e.target.value = value;
        });
    }

    // Add state formatting (convert to uppercase)
    if (stateField) {
        stateField.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const addressField = document.getElementById('address-1601');
    
    if (addressField) {
        // Add visual feedback for form fields
        const formFields = document.querySelectorAll('.cs-input');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 2px var(--primary)';
            });
            
            field.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });
        });
    }

    // Enhance form functionality
    enhanceForm();
});
