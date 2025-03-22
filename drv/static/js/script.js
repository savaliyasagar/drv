document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function () {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (mobileMenu &&
            mobileMenu.style.display === 'block' &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ========== Set Active Navigation Link ==========
    function setActiveNavLink() {
        // Get current page path
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';
        
        // Set active class for desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === pageName || 
                (pageName === 'index.html' && href === '') || 
                (pageName === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Set active class for mobile navigation
        const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === pageName || 
                (pageName === 'index.html' && href === '') || 
                (pageName === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Call the function to set active links
    setActiveNavLink();

    // ========== Hero Slider Functionality ==========
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Handle index bounds
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // Add active class to current slide
        slides[currentSlide].classList.add('active');
    }

    // Function to go to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Function to go to previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start auto slide interval - exactly 3 seconds as requested
    function startSlideInterval() {
        // Clear any existing interval first
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 4000);
    }

    // Initialize slider if slides exist
    if (slides.length > 0) {
        // Show first slide
        showSlide(0);
        
        // Start auto sliding
        startSlideInterval();
        
        // Add click handlers for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                // Reset interval when manually changing slides
                startSlideInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                // Reset interval when manually changing slides
                startSlideInterval();
            });
        }
        
        // Pause auto sliding when hovering over slider
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', function() {
                startSlideInterval();
            });
        }
    }

    // ========== Collection Filter Functionality ==========
    const tabBtns = document.querySelectorAll('.tab-btn');
    const collectionItems = document.querySelectorAll('.collection-item');

    if (tabBtns.length > 0 && collectionItems.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const target = this.dataset.target;

                // Filter collection items
                collectionItems.forEach(item => {
                    if (target === 'all' || item.dataset.category === target) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========== Gallery Filter Functionality ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.dataset.filter;

                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========== Gallery Modal Functionality ==========
    const galleryZoomBtns = document.querySelectorAll('.gallery-zoom');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.querySelector('.modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    let currentImgIndex = 0;

    if (galleryZoomBtns.length > 0 && galleryModal) {
        galleryZoomBtns.forEach((btn, index) => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const imgSrc = this.closest('.gallery-item').querySelector('img').src;
                const imgCaption = this.closest('.gallery-item').querySelector('h3').textContent;

                modalImg.src = imgSrc;
                modalCaption.textContent = imgCaption;
                galleryModal.style.display = 'block';
                currentImgIndex = index;

                // Prevent scrolling when modal is open
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        modalClose.addEventListener('click', function () {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside the image
        galleryModal.addEventListener('click', function (e) {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Navigate to previous image
        if (modalPrev) {
            modalPrev.addEventListener('click', function () {
                currentImgIndex = (currentImgIndex === 0) ? galleryItems.length - 1 : currentImgIndex - 1;
                updateModalImage();
            });
        }

        // Navigate to next image
        if (modalNext) {
            modalNext.addEventListener('click', function () {
                currentImgIndex = (currentImgIndex === galleryItems.length - 1) ? 0 : currentImgIndex + 1;
                updateModalImage();
            });
        }

        // Update modal image
        function updateModalImage() {
            const imgSrc = galleryItems[currentImgIndex].querySelector('img').src;
            const imgCaption = galleryItems[currentImgIndex].querySelector('h3').textContent;

            modalImg.src = imgSrc;
            modalCaption.textContent = imgCaption;
        }
    }

    // ========== Featured Slider Functionality ==========
    const featuredSlides = document.querySelectorAll('.featured-slide');
    const dots = document.querySelectorAll('.dot');
    let currentFeaturedSlide = 0;
    let featuredSlideInterval;

    // Initialize featured slider
    function initFeaturedSlider() {
        if (featuredSlides.length > 0) {
            featuredSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentFeaturedSlide) {
                    slide.classList.add('active');
                }
            });

            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.remove('active');
                    if (index === currentFeaturedSlide) {
                        dot.classList.add('active');
                    }
                });
            }

            // Auto slide
            startFeaturedSlideInterval();
        }
    }

    // Start auto slide interval
    function startFeaturedSlideInterval() {
        featuredSlideInterval = setInterval(nextFeaturedSlide, 5000);
    }

    // Go to next featured slide
    function nextFeaturedSlide() {
        if (featuredSlides.length > 0) {
            currentFeaturedSlide = (currentFeaturedSlide === featuredSlides.length - 1) ? 0 : currentFeaturedSlide + 1;
            initFeaturedSlider();
        }
    }

    // Dot navigation
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                clearInterval(featuredSlideInterval);
                currentFeaturedSlide = index;
                initFeaturedSlider();
            });
        });
    }

    // ========== Project Slider Functionality ==========
    const projectSlides = document.querySelectorAll(".project-slide");
    const projectDots = document.querySelectorAll(".slider-dots .dot");
    let currentProjectSlide = 0;
    let projectSlideInterval;

    // Initialize project slider
    function initProjectSlider() {
        if (projectSlides.length > 0) {
            projectSlides.forEach((slide, index) => {
                slide.classList.remove("active");
                if (index === currentProjectSlide) {
                    slide.classList.add("active");
                }
            });

            if (projectDots.length > 0) {
                projectDots.forEach((dot, index) => {
                    dot.classList.remove("active");
                    if (index === currentProjectSlide) {
                        dot.classList.add("active");
                    }
                });
            }

            // Auto slide
            startProjectSlideInterval();
        }
    }

    // Start auto slide interval
    function startProjectSlideInterval() {
        projectSlideInterval = setInterval(nextProjectSlide, 5000);
    }

    // Reset auto slide interval
    function resetProjectSlideInterval() {
        clearInterval(projectSlideInterval);
        startProjectSlideInterval();
    }

    // Go to next project slide
    function nextProjectSlide() {
        if (projectSlides.length > 0) {
            currentProjectSlide = currentProjectSlide === projectSlides.length - 1 ? 0 : currentProjectSlide + 1;
            initProjectSlider();
        }
    }

    // Dot navigation for project slider
    if (projectDots.length > 0) {
        projectDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                clearInterval(projectSlideInterval);
                currentProjectSlide = index;
                initProjectSlider();
                resetProjectSlideInterval();
            });
        });
    }

     // ========== Contact Form Submission ==========
     const contactForm = document.getElementById('contactForm');
    
     if (contactForm) {
         contactForm.addEventListener('submit', function(e) {
             e.preventDefault();
             
             // Validate form
             let isValid = true;
             const requiredFields = contactForm.querySelectorAll('[required]');
             
             requiredFields.forEach(field => {
                 if (!field.value.trim()) {
                     isValid = false;
                     field.style.borderColor = 'red';
                 } else {
                     field.style.borderColor = '#ddd';
                 }
             });
             
             // Email validation
             const emailField = contactForm.querySelector('input[type="email"]');
             if (emailField && emailField.value.trim()) {
                 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                 if (!emailPattern.test(emailField.value.trim())) {
                     isValid = false;
                     emailField.style.borderColor = 'red';
                 }
             }
             
             if (!isValid) {
                 alert('Please fill in all required fields correctly.');
                 return;
             }
             
             // Get form data
             const formData = new FormData(contactForm);
             
             // Get CSRF token
             const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
             
             // Submit form using fetch API
             fetch(contactForm.action || window.location.href, {
                 method: 'POST',
                 body: formData,
                 headers: {
                     'X-Requested-With': 'XMLHttpRequest',
                     'X-CSRFToken': csrfToken
                 }
             })
             .then(response => response.json())
             .then(data => {
                 if (data.status === 'success') {
                     // Show success message
                     alert(data.message);
                     // Reset form
                     contactForm.reset();
                 } else {
                     // Show error message
                     alert(data.message || 'There was an error processing your request. Please try again.');
                 }
             })
             .catch(error => {
                 console.error('Error:', error);
                 alert('There was an error processing your request. Please try again.');
             });
         });
     }

    // ========== Load More Products Functionality ==========
    const loadMoreBtn = document.getElementById('load-more-btn');
    const hiddenProducts = document.querySelectorAll('.product-item.hidden');
    let currentlyShown = 10; // Initially showing 10 products (2 rows of 5)
    const productsPerLoad = 10; // Load 10 more products (2 rows of 5) on each click

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            let count = 0;

            hiddenProducts.forEach(product => {
                if (product.classList.contains('hidden') && count < productsPerLoad) {
                    product.classList.remove('hidden');
                    count++;
                }
            });

            currentlyShown += count;

            // Hide the load more button if all products are shown
            if (currentlyShown >= hiddenProducts.length + 10) {
                loadMoreBtn.style.display = 'none';
            }

            // Animate the newly visible products
            animateProducts();
        });
    }

    // ========== Quick View Modal Functionality ==========
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');
    const modalFeatures = document.getElementById('modal-features');

    // Open modal when clicking quick view button
    if (quickViewBtns.length > 0 && modal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Get the parent product item to access its data attributes
                const productItem = this.closest('.product-item');

                if (productItem) {
                    // Get data from HTML data attributes
                    const title = productItem.getAttribute('data-title');
                    const category = productItem.getAttribute('data-category');
                    const image = productItem.getAttribute('data-image');
                    const description = productItem.getAttribute('data-description');
                    const featuresString = productItem.getAttribute('data-features');
                    const features = featuresString ? featuresString.split(',') : [];

                    // Populate modal with data
                    modalImage.src = image;
                    modalTitle.textContent = title;
                    modalCategory.textContent = category;
                    modalDescription.textContent = description;

                    // Clear and populate features list
                    modalFeatures.innerHTML = '';
                    features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        modalFeatures.appendChild(li);
                    });

                    // Show modal
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                }
            });
        });

        // Close modal when clicking the close button
        if (closeModal) {
            closeModal.addEventListener('click', function () {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            });
        }

        // Close modal when clicking outside the modal content
        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ========== Animation Functions ==========
    // Combined animation function for all elements
    const animatedElements = document.querySelectorAll('.product-item, .service-item, .category-item, .value-item, .info-card, .gallery-item');

    function setupAnimations(elements) {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries, observer) => {
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

            elements.forEach(el => {
                // Only set up if not already animated
                if (el.style.opacity !== '1') {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    animationObserver.observe(el);
                }
            });
        }
    }

    // Function to animate products (for load more functionality)
    function animateProducts() {
        const productItems = document.querySelectorAll('.product-item:not(.hidden)');
        setupAnimations(productItems);
    }

    // Enhanced hover effects for product items
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(item => {
        const overlay = item.querySelector('.product-overlay');
        if (overlay) {
            item.addEventListener('mouseenter', function () {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            });

            item.addEventListener('mouseleave', function () {
                overlay.style.opacity = '0';
                overlay.style.transform = 'translateY(20px)';
            });
        }
    });

    // ========== Responsive Adjustments ==========
    function handleResize() {
        if (window.innerWidth > 992) {
            if (mainNav) mainNav.style.display = 'block';
        } else {
            if (mainNav) mainNav.style.display = 'none';
        }
    }

    window.addEventListener('resize', handleResize);

    // ========== Initialize Everything ==========
    handleResize(); // Initial responsive adjustment
    
    // Initialize all sliders
    if (slides.length > 0) {
        showSlide(0);
        startSlideInterval();
    }
    
    initFeaturedSlider(); // Featured slider
    initProjectSlider(); // Project slider
    setupAnimations(animatedElements); // Initial animations
    animateProducts(); // Product animations
});



// Improved setActiveNavLink function to keep collections link active for product pages
function setActiveNavLink() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Set active class for desktop navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        // First remove active class from all links
        link.classList.remove('active');
        
        // Get the URL from the link
        const href = link.getAttribute('href');
        
        // Special case for home page
        if (currentPath === '/' && (href === '/' || href.includes('home'))) {
            link.classList.add('active');
        }
        // Special case for product pages - keep collections active
        else if (currentPath.includes('product/') && href.includes('collections')) {
            link.classList.add('active');
        }
        // For other pages, check if the current path contains the link's path segment
        // but exclude home page link when on other pages
        else if (currentPath !== '/' && href !== '/' && !href.includes('home') && 
                 currentPath.includes(href.split('/').filter(Boolean)[0])) {
            link.classList.add('active');
        }
    });
    
    // Apply the same logic for mobile menu links
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        
        if (currentPath === '/' && (href === '/' || href.includes('home'))) {
            link.classList.add('active');
        }
        // Special case for product pages - keep collections active
        else if (currentPath.includes('product/') && href.includes('collections')) {
            link.classList.add('active');
        }
        else if (currentPath !== '/' && href !== '/' && !href.includes('home') && 
                 currentPath.includes(href.split('/').filter(Boolean)[0])) {
            link.classList.add('active');
        }
    });
}

// Make sure this function runs when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
});

