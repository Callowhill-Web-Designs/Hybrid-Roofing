document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.cs-slide');
    let currentSlide = 0;
    
    if (slides.length > 0) {
        // Show first slide initially
        slides[0].classList.add('active');
        
        function showNextSlide() {
            // Get current image and set it to maintain the zoomed state
            const currentImg = slides[currentSlide].querySelector('img');
            if (currentImg) {
                currentImg.style.transform = 'scale(1.1)'; // Maintain zoom
                currentImg.style.animation = 'none'; // Stop animation
            }
            
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next slide
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Reset the previous image after transition
            setTimeout(() => {
                if (currentImg) {
                    currentImg.style.transform = '';
                    currentImg.style.animation = '';
                }
            }, 1000); // Wait for opacity transition to complete
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        }
        
        // Change slide every 5 seconds
        setInterval(showNextSlide, 5000);
    }
});