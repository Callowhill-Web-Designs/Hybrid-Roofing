/**
 * Roofing Cost Calculator
 * Calculates estimated roofing costs based on square footage and roofing type
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roofingCalculator');
    const resultsDiv = document.getElementById('calculatorResults');
    const resetButton = document.getElementById('resetCalculator');
    const tooltipTrigger = document.querySelector('.cs-tooltip-trigger');
    const tooltip = document.querySelector('.cs-tooltip');

    // Pricing configuration per 100 sqft
    const PRICING = {
        torchdown: {
            pricePerHundred: 450,
            wasteFactor: 0.15, // 15%
            displayName: 'Torchdown'
        },
        shingles: {
            pricePerHundred: 700,
            wasteFactor: 0.15, // 15%
            displayName: 'Shingles'
        },
        tpo: {
            pricePerHundred: 1400,
            wasteFactor: 0.10, // 10%
            displayName: 'TPO'
        }
    };

    // Variation range for estimates (±10%)
    const ESTIMATE_VARIATION = 0.10;

    /**
     * Calculate roofing cost estimate
     */
    function calculateEstimate(roofType, squareFootage) {
        const config = PRICING[roofType];
        if (!config) return null;

        // Calculate square footage with waste
        const adjustedSquareFootage = squareFootage * (1 + config.wasteFactor);
        
        // Calculate base cost
        const baseCost = (adjustedSquareFootage / 100) * config.pricePerHundred;
        
        // Calculate range (±10%)
        const lowEstimate = baseCost * (1 - ESTIMATE_VARIATION);
        const highEstimate = baseCost * (1 + ESTIMATE_VARIATION);

        return {
            low: Math.round(lowEstimate),
            high: Math.round(highEstimate),
            roofType: config.displayName,
            squareFootage: squareFootage,
            adjustedSquareFootage: Math.round(adjustedSquareFootage),
            wasteFactor: config.wasteFactor
        };
    }

    /**
     * Format currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Display results
     */
    function displayResults(estimate) {
        // Update price values
        document.getElementById('lowEstimate').textContent = formatCurrency(estimate.low);
        document.getElementById('highEstimate').textContent = formatCurrency(estimate.high);
        
        // Update details
        document.getElementById('resultRoofType').textContent = estimate.roofType;
        document.getElementById('resultSquareFootage').textContent = 
            `${estimate.squareFootage.toLocaleString()} sq ft`;
        document.getElementById('resultWaste').textContent = 
            `${(estimate.wasteFactor * 100)}% (${estimate.adjustedSquareFootage.toLocaleString()} sq ft total)`;

        // Hide form and show results
        form.style.display = 'none';
        resultsDiv.style.display = 'block';

        // Smooth scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Reset calculator
     */
    function resetCalculator() {
        form.reset();
        form.style.display = 'block';
        resultsDiv.style.display = 'none';
        
        // Scroll back to form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Validate zip code
     */
    function validateZipCode(zipcode) {
        const zipPattern = /^\d{5}$/;
        return zipPattern.test(zipcode);
    }

    /**
     * Handle form submission
     */
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const address = document.getElementById('address').value.trim();
        const zipcode = document.getElementById('zipcode').value.trim();
        const roofType = document.getElementById('roofType').value;
        const squareFootage = parseInt(document.getElementById('squareFootage').value);

        // Validate inputs
        if (!address) {
            alert('Please enter a property address.');
            return;
        }

        if (!validateZipCode(zipcode)) {
            alert('Please enter a valid 5-digit zip code.');
            return;
        }

        if (!roofType) {
            alert('Please select a roofing type.');
            return;
        }

        if (!squareFootage || squareFootage < 100 || squareFootage > 50000) {
            alert('Please enter a valid square footage between 100 and 50,000.');
            return;
        }

        // Calculate estimate
        const estimate = calculateEstimate(roofType, squareFootage);
        
        if (estimate) {
            displayResults(estimate);
        } else {
            alert('Unable to calculate estimate. Please try again.');
        }
    });

    /**
     * Reset button handler
     */
    resetButton.addEventListener('click', resetCalculator);

    /**
     * Tooltip functionality
     */
    if (tooltipTrigger && tooltip) {
        tooltipTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            tooltip.classList.toggle('cs-tooltip-active');
        });

        // Close tooltip when clicking outside
        document.addEventListener('click', function(e) {
            if (!tooltipTrigger.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.classList.remove('cs-tooltip-active');
            }
        });

        // Close tooltip on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                tooltip.classList.remove('cs-tooltip-active');
            }
        });
    }

    /**
     * Format zip code input (numbers only)
     */
    const zipcodeInput = document.getElementById('zipcode');
    zipcodeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 5);
    });

    /**
     * Format square footage input (numbers only)
     */
    const squareFootageInput = document.getElementById('squareFootage');
    squareFootageInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '');
    });
});
