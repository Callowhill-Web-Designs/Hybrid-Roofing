// Contact form address autocomplete functionality
let autocomplete;

function initAutocomplete() {
    const addressField = document.getElementById('address-1601');
    
    // Check if Google Maps API is available
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.warn('Google Places API not available, using basic address functionality');
        return;
    }

    // Initialize the autocomplete object, restricting the search predictions to addresses
    autocomplete = new google.maps.places.Autocomplete(
        addressField,
        {
            types: ['address'],
            componentRestrictions: { 'country': 'us' }
        }
    );

    // When the user selects an address from the dropdown, populate the address fields
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();
    
    // Clear existing values
    document.getElementById('city-1601').value = '';
    document.getElementById('state-1601').value = '';
    document.getElementById('zip-1601').value = '';

    // Get each component of the address from the place details
    for (let i = 0; i < place.address_components.length; i++) {
        const addressType = place.address_components[i].types[0];
        
        if (addressType === 'locality') {
            document.getElementById('city-1601').value = place.address_components[i].long_name;
        } else if (addressType === 'administrative_area_level_1') {
            document.getElementById('state-1601').value = place.address_components[i].short_name;
        } else if (addressType === 'postal_code') {
            document.getElementById('zip-1601').value = place.address_components[i].long_name;
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation && autocomplete) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            if (google && google.maps && google.maps.Circle) {
                const circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            }
        });
    }
}

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

        // Call geolocate when the address field is focused (if Google Places is available)
        addressField.addEventListener('focus', geolocate);
    }

    // Enhance form functionality
    enhanceForm();

    // Initialize autocomplete (this will be called by Google Maps API callback)
    // If Google Maps fails to load, the form will still work without autocomplete
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocomplete();
    }
});
