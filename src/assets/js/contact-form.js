// Contact Form Handler with Zapier Integration and Thank You Popup
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cs-form-1601');
    const submitButton = form.querySelector('.cs-submit');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        
        // Send to PHP handler
        fetch('../assets/php/contact-handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showThankYouPopup();
                form.reset();
            } else {
                showErrorMessage(data.message || 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    }

    function showThankYouPopup() {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'thank-you-overlay';
        
        // Create popup content
        const popup = document.createElement('div');
        popup.className = 'thank-you-popup';
        popup.innerHTML = `
            <div class="thank-you-content">
                <div class="thank-you-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#4CAF50"/>
                        <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="thank-you-title">Thank You!</h3>
                <p class="thank-you-message">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                <button class="thank-you-close-btn" onclick="closeThankYouPopup()">Close</button>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Show popup with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeThankYouPopup();
        }, 5000);
    }

    function showErrorMessage(message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.textContent = message;
        
        // Remove existing error messages
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Insert error message before the form
        form.parentNode.insertBefore(errorDiv, form);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Make closeThankYouPopup globally accessible
    window.closeThankYouPopup = function() {
        const overlay = document.querySelector('.thank-you-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    };

    // Close popup when clicking overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('thank-you-overlay')) {
            closeThankYouPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeThankYouPopup();
        }
    });
});
