document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const productImage = document.getElementById('productImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const finishOptions = document.querySelectorAll('.finish-option');
    const selectedFinishText = document.getElementById('selectedFinish');
    const inquiryBtn = document.querySelector('.inquiry-btn');
    const inquiryModal = document.getElementById('inquiryModal');
    const closeModal = document.querySelector('.close-modal');
    const inquiryForm = document.getElementById('inquiryForm');
    const productField = document.getElementById('product');
    
    // Thumbnail click handler
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update main image
            const imgSrc = this.getAttribute('data-img');
            productImage.src = imgSrc;
            
            // Add animation to main image
            productImage.classList.add('image-change');
            setTimeout(() => {
                productImage.classList.remove('image-change');
            }, 500);
        });
    });
    
    // Finish option click handler
    finishOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update selected finish text
            const finishName = this.getAttribute('data-finish');
            selectedFinishText.textContent = finishName;
            
            // Update product field in inquiry form
            const productTitle = document.querySelector('.product-title').textContent;
            productField.value = `${productTitle} - ${finishName}`;
            
            // Add pulse animation to selected finish
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 500);
        });
    });
    
    // Inquiry button click handler
    inquiryBtn.addEventListener('click', function() {
        inquiryModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    // Close modal handler
    closeModal.addEventListener('click', function() {
        inquiryModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === inquiryModal) {
            inquiryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Form submission handler
    inquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Your inquiry has been sent successfully! We will contact you soon.');
            inquiryForm.reset();
            inquiryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // Image zoom effect
    const zoomContainer = document.querySelector('.image-zoom-container');
    
    if (zoomContainer) {
        zoomContainer.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            productImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
        
        zoomContainer.addEventListener('mouseleave', function() {
            productImage.style.transformOrigin = 'center center';
        });
    }
    
    // Animate elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.product-specifications, .related-products, .related-product');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
    }
    
    // Initialize animations
    animateOnScroll();
    
    // Add CSS animation class
    document.querySelector('.product-title').classList.add('animated');
    
    // Add pulse animation to inquiry button
    setTimeout(() => {
        inquiryBtn.classList.add('pulse');
        setTimeout(() => {
            inquiryBtn.classList.remove('pulse');
        }, 1000);
    }, 2000);
});

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
    .image-change {
        animation: fadeIn 0.5s ease;
    }
    
    .pulse-animation {
        animation: pulse 0.5s ease;
    }
    
    .animated {
        animation: slideIn 0.5s ease;
    }
    
    .pulse {
        animation: pulse 1s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(-20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);