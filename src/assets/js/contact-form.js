// Contact form handler with thank you popup
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cs-form-1601');
    const submitButton = form.querySelector('.cs-submit');
    const originalButtonText = submitButton.textContent;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        
        // Submit form
        fetch('/submit-form.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showThankYouPopup();
                form.reset();
            } else {
                showErrorMessage(data.error || 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred. Please try again.');
        })
        .finally(() => {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
    
    function showThankYouPopup() {
        // Remove existing popup if any
        const existingPopup = document.querySelector('.thank-you-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup HTML
        const popup = document.createElement('div');
        popup.className = 'thank-you-popup';
        popup.innerHTML = `
            <div class="thank-you-overlay">
                <div class="thank-you-content">
                    <div class="thank-you-header">
                        <h3>Thank You!</h3>
                        <button class="thank-you-close" aria-label="Close">&times;</button>
                    </div>
                    <p>Thank you for contacting Hybrid Roofing PA! We have received your message and will get back to you within 24 hours.</p>
                    <div class="thank-you-actions">
                        <button class="cs-button-solid thank-you-ok">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(popup);
        
        // Add event listeners
        const closeBtn = popup.querySelector('.thank-you-close');
        const okBtn = popup.querySelector('.thank-you-ok');
        const overlay = popup.querySelector('.thank-you-overlay');
        
        function closePopup() {
            popup.classList.add('closing');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
        
        closeBtn.addEventListener('click', closePopup);
        okBtn.addEventListener('click', closePopup);
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePopup();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.querySelector('.thank-you-popup')) {
                closePopup();
            }
        });
        
        // Show popup with animation
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }
    
    function showErrorMessage(message) {
        // Remove existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p style="color: #dc3545; background: #f8d7da; padding: 1rem; border-radius: 8px; margin-top: 1rem; border: 1px solid #f5c6cb;">
                ${message}
            </p>
        `;
        
        // Insert after form
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
});
