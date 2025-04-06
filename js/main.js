/**
 * Bio Revive Main JavaScript
 * Coordinates all JavaScript functionality for the website
 */

(function() {
    /**
     * Initialize all components and utilities
     */
    function initializeComponents() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    BioReviveScroll.scrollToElement(targetElement, 100);
                }
            });
        });

        // Create fixed spacing for fixed header with precise measurements
        function updateHeaderSpacing() {
            const header = document.getElementById('site-header');
            const heroSection = document.querySelector('.hero-section');
            
            if (heroSection) {
                // Homepage with hero section - zero margins
                document.body.style.paddingTop = '0';
                document.body.style.marginTop = '0';
                
                // Remove all spacing between header and hero
                heroSection.style.paddingTop = '0';
                heroSection.style.marginTop = '0';
                heroSection.style.height = '100vh';
                
                // Place video behind the header
                const heroBackground = document.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.top = '0';
                    heroBackground.style.height = '100vh';
                }
                
                // Only set header to translucent if no menu is visible
                if (!header.classList.contains('menu-visible')) {
                    header.style.backgroundColor = 'rgba(26, 26, 26, 0.7)';
                    header.style.backdropFilter = 'blur(5px)';
                }
                
                // Adjust hero height for mobile
                if (window.innerWidth <= 767) {
                    heroSection.style.height = '90vh';
                } else if (window.innerWidth <= 480) {
                    heroSection.style.height = '85vh';
                }
            } else {
                // Other pages
                const headerHeight = header.offsetHeight;
                document.body.style.paddingTop = `${headerHeight}px`;
            }
        }
        
        // Control header background when mega menu is visible
        function setupMenuHoverEffects() {
            const header = document.getElementById('site-header');
            const megaMenuItems = document.querySelectorAll('.nav-item.has-mega-menu');
            const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
            
            // Function to check if any menu is visible
            function checkMenuVisibility() {
                const anyMenuVisible = document.querySelector('.has-mega-menu:hover .mega-menu') || 
                                      document.querySelector('.has-dropdown:hover .dropdown-menu');
                
                if (anyMenuVisible) {
                    // Make header background solid cream when menu is visible
                    header.classList.add('menu-visible');
                } else {
                    // Return to translucent when no menu is visible
                    header.classList.remove('menu-visible');
                }
            }
            
            // Add event listeners to menu items
            [...megaMenuItems, ...dropdownItems].forEach(item => {
                item.addEventListener('mouseenter', checkMenuVisibility);
                item.addEventListener('mouseleave', checkMenuVisibility);
            });
            
            // Initial check
            checkMenuVisibility();
        }
        
        // Mobile menu functionality
        function setupMobileMenu() {
            const header = document.getElementById('site-header');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const mobileNavItems = document.querySelectorAll('.nav-item.has-mega-menu, .nav-item.has-dropdown');
            
            if (menuToggle) {
                // Define the toggle function outside event listener
                function toggleMobileMenu(e) {
                    if (e) e.preventDefault(); // Prevent default behavior
                    console.log('Menu toggle clicked'); // Debug log
                    
                    header.classList.toggle('menu-open');
                    document.body.classList.toggle('menu-active');
                    
                    // Prevent body scrolling when menu is open
                    if (header.classList.contains('menu-open')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
                
                // Remove existing listeners and add new ones
                menuToggle.removeEventListener('click', toggleMobileMenu);
                
                // iOS sometimes requires touchstart for reliability
                menuToggle.addEventListener('touchstart', function(e) {
                    e.preventDefault(); // Prevent any default touch behavior
                    toggleMobileMenu();
                }, {passive: false});
                
                // Keep click for non-touch devices
                menuToggle.addEventListener('click', toggleMobileMenu);
                
                // Also add keyboard accessibility
                menuToggle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleMobileMenu();
                    }
                });
                
                // Add touch event to the button's spans
                menuToggle.querySelectorAll('span').forEach(span => {
                    span.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMobileMenu();
                    }, {passive: false});
                });
            }
            
            // Add click handler for mobile submenu toggles
            mobileNavItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                
                if (link) {
                    function toggleSubmenu(e) {
                        // Only for mobile
                        if (window.innerWidth < 992) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Submenu toggle clicked'); // Debug log
                            
                            // Toggle the specific submenu
                            const subMenu = item.querySelector('.mega-menu') || item.querySelector('.dropdown-menu');
                            if (subMenu) {
                                if (subMenu.style.maxHeight === '1000px') {
                                    subMenu.style.maxHeight = '0';
                                    subMenu.style.padding = '0 0 0 20px';
                                    item.classList.remove('submenu-open');
                                } else {
                                    subMenu.style.maxHeight = '1000px';
                                    subMenu.style.padding = '15px 0 15px 20px';
                                    item.classList.add('submenu-open');
                                }
                            }
                        }
                    }
                    
                    // Remove any existing listeners
                    link.removeEventListener('click', toggleSubmenu);
                    link.removeEventListener('touchstart', toggleSubmenu);
                    
                    // Add both click and touch events
                    link.addEventListener('click', toggleSubmenu);
                    link.addEventListener('touchstart', toggleSubmenu, {passive: false});
                }
            });
            
            // Make sure styles reflect the current state
            if (header.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Initialize menu hover effects
        setupMenuHoverEffects();
        
        // Initialize mobile menu
        setupMobileMenu();
        
        // Update spacing immediately and on load/resize
        updateHeaderSpacing();
        window.addEventListener('DOMContentLoaded', updateHeaderSpacing);
        window.addEventListener('load', updateHeaderSpacing);
        window.addEventListener('resize', updateHeaderSpacing);

        // Initialize animations for elements as they scroll into view
        function initScrollAnimations() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            
            function checkScroll() {
                animatedElements.forEach(el => {
                    if (BioReviveScroll.isInViewport(el, 100)) {
                        el.classList.add('animated');
                    }
                });
            }
            
            // Check elements on load
            window.addEventListener('load', checkScroll);
            
            // Check elements on scroll
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        checkScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
        
        // Only initialize animations if there are elements to animate
        if (document.querySelectorAll('.animate-on-scroll').length > 0) {
            let ticking = false;
            initScrollAnimations();
        }

        // Add active class to current page in navigation
        function highlightCurrentPage() {
            const currentPath = window.location.pathname;
            
            document.querySelectorAll('.nav-link').forEach(link => {
                const linkPath = link.getAttribute('href');
                
                // Skip anchor links and empty links
                if (linkPath === '#' || linkPath === '') return;
                
                if (currentPath === linkPath || 
                    (currentPath === '/' && linkPath === 'index.html') ||
                    (currentPath !== '/' && linkPath !== 'index.html' && currentPath.includes(linkPath))) {
                    link.classList.add('active');
                    
                    // If link is in a dropdown, also highlight parent
                    const parentItem = link.closest('.has-dropdown, .has-mega-menu');
                    if (parentItem) {
                        const parentLink = parentItem.querySelector('.nav-link');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            });
        }
        
        // Initialize current page highlighting
        highlightCurrentPage();
        
        // Hero section video fallback handling
        function handleHeroVideo() {
            const heroVideo = document.querySelector('.hero-video');
            
            if (heroVideo) {
                // Check if video can play
                heroVideo.addEventListener('canplay', function() {
                    // Video can play, hide the fallback image
                    const heroImage = document.querySelector('.hero-image');
                    if (heroImage) {
                        heroImage.style.opacity = '0';
                    }
                });
                
                // Error handling - show image if video fails
                heroVideo.addEventListener('error', function() {
                    const heroImage = document.querySelector('.hero-image');
                    if (heroImage) {
                        heroImage.style.opacity = '1';
                    }
                    // Hide the video element
                    this.style.display = 'none';
                });
                
                // Stop video loading on mobile to save bandwidth
                function handleVideoForDeviceSize() {
                    if (window.innerWidth < 768 && heroVideo.getAttribute('data-mobile-paused') !== 'true') {
                        // On mobile, pause the video to save bandwidth, use image instead
                        heroVideo.pause();
                        heroVideo.setAttribute('data-mobile-paused', 'true');
                        
                        const heroImage = document.querySelector('.hero-image');
                        if (heroImage) {
                            heroImage.style.opacity = '1';
                        }
                    } else if (window.innerWidth >= 768 && heroVideo.getAttribute('data-mobile-paused') === 'true') {
                        // On desktop, play the video
                        heroVideo.play();
                        heroVideo.removeAttribute('data-mobile-paused');
                        
                        const heroImage = document.querySelector('.hero-image');
                        if (heroImage) {
                            heroImage.style.opacity = '0';
                        }
                    }
                }
                
                // Check on load and resize
                handleVideoForDeviceSize();
                window.addEventListener('resize', handleVideoForDeviceSize);
            }
        }
        
        // Initialize hero video handling
        handleHeroVideo();
        
        // Scroll indicator click handler
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                // Get the next section after the hero
                const heroSection = document.querySelector('.hero-section');
                if (heroSection && heroSection.nextElementSibling) {
                    BioReviveScroll.scrollToElement(heroSection.nextElementSibling, 80);
                }
            });
        }
    }

    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }
})();