/**
 * Tisha Mahato Portfolio - Core JS Functionality
 * Manages theme toggle, projects filter, smooth scroll animations, contact forms, and accordion FAQs.
 * Includes warm human touches like console easter-eggs and dynamic greetings.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbarScroll();
    initMobileNav();
    initThemeToggle();
    initScrollAnimations();
    initProjectFilter();
    initTestimonials();
    initFaqAccordion();
    initContactForm();
    setDynamicGreeting();
    logRecruiterConsole();
});

/* ==========================================
   1. Scroll Progress Bar
   ========================================== */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progress) {
            progress.style.width = scrolled + '%';
        }
    });
}

/* ==========================================
   2. Sticky Header / Navbar on Scroll
   ========================================== */
function initNavbarScroll() {
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case user loads page scrolled down
}

/* ==========================================
   3. Mobile Navigation Drawer
   ========================================== */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (toggle && navLinks) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });

        // Close when clicking any link
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }
}

/* ==========================================
   4. Dark/Light Theme Handler
   ========================================== */
function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle-btn');
    
    // Default theme check
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
    }
}

/* ==========================================
   5. Intersection Observer Scroll Animations
   ========================================== */
function initScrollAnimations() {
    // Classes we want to animate when they enter viewport
    const animateSelectors = [
        '.section-header',
        '.about-details',
        '.about-content',
        '.skills-category',
        '.project-card',
        '.resume-info-panel',
        '.timeline',
        '.achievement-card',
        '.cert-card',
        '.testimonials-wrapper',
        '.faq-list',
        '.contact-info-panel',
        '.contact-form-panel'
    ];

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of element is in view
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    });

    // Active Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(navLinks).map(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            return document.querySelector(href);
        }
        return null;
    }).filter(el => el !== null);

    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section covers middle of viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));
}

/* ==========================================
   6. Project Filtering System
   ========================================== */
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                // Remove animation triggers to re-run animations
                card.classList.remove('active');
                
                // Show/hide logic
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    // Small timeout to allow browser display re-rendering before opacity transition
                    setTimeout(() => card.classList.add('active'), 50);
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                        setTimeout(() => card.classList.add('active'), 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

/* ==========================================
   7. Testimonials Scroller/Carousel
   ========================================== */
function initTestimonials() {
    const carousel = document.querySelector('.testimonials-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let autoPlayTimer;

    if (!carousel || slides.length === 0) return;

    function goToSlide(index) {
        currentIndex = index;
        const translateX = -currentIndex * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update active dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetAutoplay();
        });
    });

    function nextSlide() {
        let next = currentIndex + 1;
        if (next >= slides.length) {
            next = 0;
        }
        goToSlide(next);
    }

    function startAutoplay() {
        autoPlayTimer = setInterval(nextSlide, 6000); // 6 seconds slide duration
    }

    function resetAutoplay() {
        clearInterval(autoPlayTimer);
        startAutoplay();
    }

    startAutoplay();
}

/* ==========================================
   8. FAQ Accordion Dropdowns
   ========================================== */
function initFaqAccordion() {
    const headers = document.querySelectorAll('.faq-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Check if it's already open
            const isOpen = item.classList.contains('open');

            // Close all FAQ items (Accordion style)
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-content').style.maxHeight = null;
            });

            // If it was closed, open it
            if (!isOpen) {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        // Accessibility Support (keyboard press)
        header.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

/* ==========================================
   9. Contact Form Simulation & Feedback
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple front-end validation
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                showFeedback('All fields are required. Please check your input.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                return;
            }

            // Real form submission via FormSubmit.co AJAX
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending Message...';

                fetch("https://formsubmit.co/ajax/tishaamahato10@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success === "true" || data.success === true) {
                        showFeedback('Thank you! Your message was sent successfully. Tisha will reply shortly! ⚡', 'success');
                        form.reset();
                    } else {
                        showFeedback('Oops! Something went wrong. Please try again later.', 'error');
                    }
                })
                .catch(error => {
                    showFeedback('Failed to send message. Please check your connection and try again.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showFeedback(msg, type) {
        if (feedback) {
            feedback.innerHTML = msg;
            feedback.className = `form-feedback ${type}`;
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Automatically hide success notification after 7s
            if (type === 'success') {
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 7000);
            }
        }
    }
}

/* ==========================================
   10. Dynamic Greeting & Console Easter Egg
   ========================================== */
function setDynamicGreeting() {
    const greetingEl = document.getElementById('dynamic-greeting');
    if (!greetingEl) return;
    const hour = new Date().getHours();
    let greeting = "Hey there! 👋";
    if (hour < 12) greeting = "Good morning! ☕";
    else if (hour < 18) greeting = "Good afternoon! ☀️";
    else greeting = "Good evening! 🌌";
    
    greetingEl.innerHTML = `${greeting} I'm a Full-Stack &amp; AI Developer`;
}

function logRecruiterConsole() {
    console.log("%cHey curious developer! 👋", "color: #8375ff; font-size: 20px; font-weight: bold; font-family: sans-serif;");
    console.log("%cThanks for checking out my console. Let's build something secure & scalable together!", "color: #ffcca3; font-size: 14px; font-family: sans-serif;");
    console.log("Feel free to drop me a line at tishaamahato10@gmail.com!");
}

