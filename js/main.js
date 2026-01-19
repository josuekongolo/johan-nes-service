/* =====================================================
   JOHAN NES SERVICE - Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
});

/* =====================================================
   Navigation Toggle (Mobile)
   ===================================================== */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }
}

/* =====================================================
   Smooth Scroll for Anchor Links
   ===================================================== */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* =====================================================
   Contact Form Handler
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: form.querySelector('#name').value.trim(),
                email: form.querySelector('#email').value.trim(),
                phone: form.querySelector('#phone').value.trim(),
                address: form.querySelector('#address').value.trim(),
                projectType: form.querySelector('#projectType').value,
                description: form.querySelector('#description').value.trim(),
                wantSiteVisit: form.querySelector('#siteVisit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('error', 'Ver snill og fyll ut alle påkravde felt.');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showFormMessage('error', 'Ver snill og oppgje ein gyldig e-postadresse.');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                // In production, this would send to Resend API or similar service
                await simulateFormSubmission(formData);

                // Show success message
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                formError.style.display = 'none';

                // Reset form
                form.reset();

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                formError.style.display = 'block';
                formSuccess.style.display = 'none';

                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Add input validation styling
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateInput(this);
                }
            });
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateInput(input) {
    const value = input.value.trim();

    if (input.hasAttribute('required') && !value) {
        input.classList.add('invalid');
        return false;
    }

    if (input.type === 'email' && value && !isValidEmail(value)) {
        input.classList.add('invalid');
        return false;
    }

    input.classList.remove('invalid');
    return true;
}

function showFormMessage(type, message) {
    // Create or update a message element
    let messageEl = document.querySelector('.form-message');

    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        const form = document.getElementById('contact-form');
        form.insertBefore(messageEl, form.firstChild);
    }

    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

async function simulateFormSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data (for testing)
            console.log('Form submitted:', formData);

            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Simulated submission error'));
            }
        }, 1500);
    });
}

/* =====================================================
   Scroll Animations (Intersection Observer)
   ===================================================== */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        return;
    }

    const animatedElements = document.querySelectorAll(
        '.service-card, .why-us-item, .value-card, .pricing-card, .info-card, .category-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/* =====================================================
   Header Scroll Effect
   ===================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll(header, lastScrollY);
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleHeaderScroll(header, lastScrollY) {
    const currentScrollY = window.scrollY;

    // Add shadow on scroll
    if (currentScrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Add CSS for scrolled state
    if (!document.querySelector('#header-scroll-styles')) {
        const style = document.createElement('style');
        style.id = 'header-scroll-styles';
        style.textContent = `
            .header.scrolled {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
}

/* =====================================================
   Utility Functions
   ===================================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* =====================================================
   Phone Number Click Tracking (Analytics Ready)
   ===================================================== */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone click event (can be integrated with analytics)
        console.log('Phone link clicked:', this.href);

        // Google Analytics example (uncomment when GA is set up):
        // gtag('event', 'click', {
        //     'event_category': 'Contact',
        //     'event_label': 'Phone Call',
        //     'value': 1
        // });
    });
});

/* =====================================================
   Email Link Click Tracking (Analytics Ready)
   ===================================================== */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track email click event (can be integrated with analytics)
        console.log('Email link clicked:', this.href);

        // Google Analytics example (uncomment when GA is set up):
        // gtag('event', 'click', {
        //     'event_category': 'Contact',
        //     'event_label': 'Email',
        //     'value': 1
        // });
    });
});

/* =====================================================
   Lazy Loading Images (Native Support)
   ===================================================== */
document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.src = img.dataset.src;
});

/* =====================================================
   Form Validation Styling
   ===================================================== */
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-group input.invalid,
    .form-group select.invalid,
    .form-group textarea.invalid {
        border-color: var(--color-error, #e74c3c);
    }

    .form-message {
        padding: var(--space-md, 1rem);
        border-radius: var(--radius-md, 8px);
        margin-bottom: var(--space-lg, 1.5rem);
        font-size: var(--text-sm, 0.875rem);
    }

    .form-message.error {
        background-color: rgba(231, 76, 60, 0.1);
        border: 1px solid var(--color-error, #e74c3c);
        color: var(--color-error, #e74c3c);
    }

    .form-message.success {
        background-color: rgba(39, 174, 96, 0.1);
        border: 1px solid var(--color-success, #27ae60);
        color: var(--color-success, #27ae60);
    }
`;
document.head.appendChild(validationStyles);
