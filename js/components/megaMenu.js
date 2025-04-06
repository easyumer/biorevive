/**
 * Bio Revive Mega Menu JavaScript
 * Handles navigation functionality including:
 * - Header scroll state changes
 * - Mobile menu toggling
 * - Dropdown/mega menu mobile interactions
 */

(function() {
    // DOM Elements
    const header = document.getElementById('site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navItems = document.querySelectorAll('.has-mega-menu, .has-dropdown');
    
    // Scroll handling for header
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        header.classList.toggle('menu-open');
        document.body.classList.toggle('menu-active');
        
        // Toggle aria-expanded
        const isExpanded = header.classList.contains('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    }
    
    // Toggle dropdown/mega menu on mobile
    function toggleDropdown(e) {
        // Only apply this functionality on mobile
        if (window.innerWidth > 992) return;
        
        // If the clicked element is not the direct nav-link, don't do anything
        if (!e.target.classList.contains('nav-link')) return;
        
        e.preventDefault();
        
        // Toggle the open class on the parent nav-item
        this.classList.toggle('open');
        
        // Toggle aria-expanded
        const isExpanded = this.classList.contains('open');
        this.querySelector('.nav-link').setAttribute('aria-expanded', isExpanded);
    }
    
    // Close mobile menu when clicking outside
    function closeMenuOnClickOutside(e) {
        if (window.innerWidth > 992) return;
        
        // If menu is open and click is outside the navigation
        if (header.classList.contains('menu-open') && 
            !e.target.closest('.main-navigation') && 
            !e.target.closest('.mobile-menu-toggle')) {
            toggleMobileMenu();
        }
    }
    
    // Resize handler
    function handleResize() {
        if (window.innerWidth > 992) {
            // Remove mobile-specific classes when resizing to desktop
            header.classList.remove('menu-open');
            document.body.classList.remove('menu-active');
            
            // Reset aria attributes
            mobileMenuToggle.setAttribute('aria-expanded', false);
            
            // Reset all expanded dropdowns
            navItems.forEach(item => {
                item.classList.remove('open');
                const navLink = item.querySelector('.nav-link');
                if (navLink) navLink.setAttribute('aria-expanded', false);
            });
        }
    }
    
    // Initialize Intersection Observer for header
    function initHeaderObserver() {
        const options = {
            rootMargin: '-50px 0px 0px 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else if (window.scrollY < 50) {
                    header.classList.remove('scrolled');
                }
            });
        }, options);
        
        // Observe the header itself
        observer.observe(header);
    }
    
    // Set up accessibility attributes
    function setupAccessibility() {
        // Set initial ARIA attributes
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        navItems.forEach(item => {
            const navLink = item.querySelector('.nav-link');
            const menuId = `menu-${Math.random().toString(36).substr(2, 9)}`;
            
            // Set unique ID for the dropdown
            const dropdown = item.querySelector('.mega-menu, .dropdown-menu');
            if (dropdown) {
                dropdown.id = menuId;
                navLink.setAttribute('aria-controls', menuId);
                navLink.setAttribute('aria-expanded', 'false');
                navLink.setAttribute('aria-haspopup', 'true');
            }
        });
    }
    
    // Initialize all event listeners
    function init() {
        // Scroll event for header transformation
        window.addEventListener('scroll', handleScroll);
        
        // Click event for mobile menu toggle
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Click events for mobile dropdown toggles
        navItems.forEach(item => {
            item.addEventListener('click', toggleDropdown);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', closeMenuOnClickOutside);
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Initialize header observer
        initHeaderObserver();
        
        // Setup accessibility
        setupAccessibility();
        
        // Check initial scroll position
        handleScroll();
    }
    
    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();