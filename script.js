// ===========================
// HAMBURGER MENU FUNCTIONALITY
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Toggle hamburger animation
            hamburger.classList.toggle('active');
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// ===========================
// PROJECTS CAROUSEL FUNCTIONALITY
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    
    // Get carousel elements
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Check if carousel exists on the page
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('li');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let slidesPerView = 1;
    
    // Calculate how many slides are visible at once
    function calculateSlidesPerView() {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= 768) {
            slidesPerView = 1; // Mobile: 1 card
        } else if (viewportWidth <= 1024) {
            slidesPerView = 2; // Tablet: 2 cards
        } else {
            slidesPerView = 2; // Desktop: 2 cards
        }
        
        return slidesPerView;
    }
    
    // Calculate the maximum slide index
    function getMaxSlide() {
        return Math.max(0, totalSlides - slidesPerView);
    }
    
    // Generate dots based on number of slides
    function generateDots() {
        dotsContainer.innerHTML = '';
        const maxSlide = getMaxSlide();
        
        for (let i = 0; i <= maxSlide; i++) {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-slide', i);
            
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.getAttribute('data-slide')));
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update active dot
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update button states
    function updateButtons() {
        const maxSlide = getMaxSlide();
        
        if (currentSlide === 0) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }
        
        if (currentSlide >= maxSlide) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }
    }
    
    // Show specific slide
    function goToSlide(slideIndex) {
        const maxSlide = getMaxSlide();
        
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex > maxSlide) slideIndex = maxSlide;
        
        currentSlide = slideIndex;
        
        const slideWidth = slides[0].offsetWidth;
        const gap = 30;
        const moveAmount = -(currentSlide * (slideWidth + gap));
        
        carousel.style.transform = `translateX(${moveAmount}px)`;
        
        updateButtons();
        updateDots();
    }
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        const maxSlide = getMaxSlide();
        if (currentSlide < maxSlide) {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const oldSlidesPerView = slidesPerView;
            calculateSlidesPerView();
            
            if (oldSlidesPerView !== slidesPerView) {
                generateDots();
                const maxSlide = getMaxSlide();
                if (currentSlide > maxSlide) {
                    currentSlide = maxSlide;
                }
                goToSlide(currentSlide);
            } else {
                goToSlide(currentSlide);
            }
        }, 250);
    });
    
    // Initialize carousel
    function initCarousel() {
        calculateSlidesPerView();
        generateDots();
        updateButtons();
        goToSlide(0);
    }
    
    initCarousel();
});

// ===========================
// NAVIGATION ACTIVE STATE
// ===========================
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('nav ul li');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(li => {
        li.classList.remove('active');
        
        if (li.querySelector('a').getAttribute('href').includes(current)) {
            if(current !== "") {
                li.classList.add('active');
            }
        }
    });
});

// ===========================
// CONTACT FORM FUNCTIONALITY
// ===========================

document.addEventListener('DOMContentLoaded', function() {
// ===========================
// CONTACT FORM (AJAX VERSION)
// ===========================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        
        // UI Loading State
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Thanks! Message sent successfully.";
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                formStatus.textContent = "Oops! There was a problem sending your message.";
                formStatus.className = 'form-status error';
            }
        } catch (error) {
            formStatus.textContent = "Error: Could not connect to server.";
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Clear status after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    });
}
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show status message
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
    }
    
    // Hide status message
    function hideStatus() {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }
    
    // Add input validation feedback
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#4CAF50';
            }
        });
    });
});