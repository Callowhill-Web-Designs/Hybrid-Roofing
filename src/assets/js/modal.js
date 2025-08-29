// Modal functionality for Terms & Conditions
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('terms-modal');
    const openBtn = document.querySelector('.cs-button-outline');
    const closeBtn = document.querySelector('.cs-modal-close');
    const overlay = document.querySelector('.cs-modal-overlay');

    // Open modal
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            // Focus on the close button for accessibility
            closeBtn.focus();
        });
    }

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        // Return focus to the open button
        openBtn.focus();
    }

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
