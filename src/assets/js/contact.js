// Contact Form JavaScript for form validation and formatting
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cs-form-1601');
    const phoneInput = document.getElementById('phone-1601');
    const emailInput = document.getElementById('email-1601');
    const stateInput = document.getElementById('state-1601');

    // US States with abbreviations
    const states = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
        'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
        'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
        'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
        'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
        'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
        'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
        'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
        'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
        'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
        'Wisconsin': 'WI', 'Wyoming': 'WY'
    };

    // Phone input event listeners
    if (phoneInput) {
        phoneInput.addEventListener('keydown', function(e) {
            // Allow backspace, delete, tab, escape, enter, arrow keys
            if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = e.target.value.trim();
            if (email && !validateEmail(email)) {
                e.target.setCustomValidity('Please enter a valid email address');
                e.target.classList.add('cs-error');
            } else {
                e.target.setCustomValidity('');
                e.target.classList.remove('cs-error');
            }
        });

        emailInput.addEventListener('input', function(e) {
            e.target.classList.remove('cs-error');
            e.target.setCustomValidity('');
        });
    }

    // State autocomplete functionality
    if (stateInput) {
        let stateDropdown = null;

        function createStateDropdown() {
            stateDropdown = document.createElement('div');
            stateDropdown.className = 'cs-state-dropdown';
            stateDropdown.style.display = 'none';
            stateInput.parentNode.appendChild(stateDropdown);
        }

        function showStateOptions(filter) {
            if (!stateDropdown) createStateDropdown();

            stateDropdown.innerHTML = '';
            const filterLower = filter.toLowerCase();
            let matches = [];
            
            // Priority states (service area)
            const priorityStates = ['NJ', 'PA', 'DE', 'MD', 'NY'];

            // Find matches in state names and abbreviations
            for (const [fullName, abbrev] of Object.entries(states)) {
                if (fullName.toLowerCase().includes(filterLower) || 
                    abbrev.toLowerCase().includes(filterLower)) {
                    matches.push({ fullName, abbrev, isPriority: priorityStates.includes(abbrev) });
                }
            }

            // Sort matches: priority states first, then alphabetically
            matches.sort((a, b) => {
                if (a.isPriority && !b.isPriority) return -1;
                if (!a.isPriority && b.isPriority) return 1;
                if (a.isPriority && b.isPriority) {
                    // Sort priority states by their order in the priority array
                    return priorityStates.indexOf(a.abbrev) - priorityStates.indexOf(b.abbrev);
                }
                return a.fullName.localeCompare(b.fullName);
            });

            if (matches.length > 0 && filter.length > 0) {
                matches.slice(0, 5).forEach(state => {
                    const option = document.createElement('div');
                    option.className = 'cs-state-option';
                    if (state.isPriority) {
                        option.classList.add('cs-priority-state');
                    }
                    option.textContent = `${state.fullName} (${state.abbrev})`;
                    option.addEventListener('click', function() {
                        stateInput.value = state.abbrev;
                        stateDropdown.style.display = 'none';
                    });
                    stateDropdown.appendChild(option);
                });
                stateDropdown.style.display = 'block';
            } else {
                stateDropdown.style.display = 'none';
            }
        }

        stateInput.addEventListener('input', function(e) {
            showStateOptions(e.target.value);
        });

        stateInput.addEventListener('focus', function(e) {
            if (e.target.value) {
                showStateOptions(e.target.value);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (stateDropdown && !stateInput.contains(e.target) && !stateDropdown.contains(e.target)) {
                stateDropdown.style.display = 'none';
            }
        });
    }

    // Form validation on submit
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            let errorMessage = '';

            // Validate phone number (must be 9-10 digits)
            if (phoneInput) {
                const phoneDigits = phoneInput.value.replace(/\D/g, '');
                if (phoneDigits.length < 9 || phoneDigits.length > 10) {
                    isValid = false;
                    errorMessage += 'Phone number must contain 9-10 digits.\n';
                    phoneInput.classList.add('cs-error');
                } else {
                    phoneInput.classList.remove('cs-error');
                }
            }

            // Validate email
            if (emailInput) {
                const email = emailInput.value.trim();
                if (!validateEmail(email)) {
                    isValid = false;
                    errorMessage += 'Please enter a valid email address.\n';
                    emailInput.classList.add('cs-error');
                } else {
                    emailInput.classList.remove('cs-error');
                }
            }

            // Validate state (should be a valid abbreviation)
            if (stateInput) {
                const stateValue = stateInput.value.trim().toUpperCase();
                const validAbbrevs = Object.values(states);
                if (stateValue && !validAbbrevs.includes(stateValue)) {
                    isValid = false;
                    errorMessage += 'Please enter a valid state abbreviation.\n';
                    stateInput.classList.add('cs-error');
                } else {
                    stateInput.classList.remove('cs-error');
                    stateInput.value = stateValue; // Ensure uppercase
                }
            }

            if (!isValid) {
                e.preventDefault();
                alert(errorMessage);
            }
        });
    }
});