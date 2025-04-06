/**
 * Bio Revive Scroll Utilities
 * Provides scroll-related utility functions:
 * - Smooth scrolling to elements
 * - Scroll direction detection
 * - Scroll position tracking
 */

const BioReviveScroll = (function() {
    // Variables to track scroll state
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    let ticking = false;
    
    // Public API
    return {
        /**
         * Initialize scroll event listeners
         */
        init: function() {
            // Track scroll direction
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        
                        // Determine scroll direction
                        if (currentScrollTop > lastScrollTop) {
                            scrollDirection = 'down';
                        } else {
                            scrollDirection = 'up';
                        }
                        
                        // Update last scroll position
                        lastScrollTop = currentScrollTop;
                        ticking = false;
                    });
                    
                    ticking = true;
                }
            });
        },
        
        /**
         * Get current scroll direction
         * @returns {string} 'up' or 'down'
         */
        getScrollDirection: function() {
            return scrollDirection;
        },
        
        /**
         * Get current scroll position
         * @returns {number} Current scroll position in pixels
         */
        getScrollPosition: function() {
            return window.pageYOffset || document.documentElement.scrollTop;
        },
        
        /**
         * Smooth scroll to a specific element
         * @param {string|HTMLElement} target - Element or selector to scroll to
         * @param {number} offset - Offset from the top in pixels
         * @param {number} duration - Animation duration in ms
         */
        scrollToElement: function(target, offset = 0, duration = 500) {
            const targetElement = typeof target === 'string' 
                ? document.querySelector(target) 
                : target;
                
            if (!targetElement) return;
            
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easeInOutCubic = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        },
        
        /**
         * Check if an element is in the viewport
         * @param {HTMLElement} element - The element to check
         * @param {number} offset - Offset from the viewport edges
         * @returns {boolean} True if element is in viewport
         */
        isInViewport: function(element, offset = 0) {
            const rect = element.getBoundingClientRect();
            
            return (
                rect.bottom >= 0 + offset &&
                rect.right >= 0 + offset &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
                rect.left <= (window.innerWidth || document.documentElement.clientWidth) - offset
            );
        }
    };
})();

// Initialize scroll utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    BioReviveScroll.init();
});