/**
 * Accessibility Fixes
 * Ensures proper focus management and ARIA attribute handling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Apply fixes for modal focus management
    setupAccessibilityFixes();
});

/**
 * Set up accessibility fixes for the modal dialog
 */
function setupAccessibilityFixes() {
    // Get references to the modal
    const modal = document.getElementById('recipeModal');
    if (!modal) return;
    
    // Replace the closeModal function to handle focus properly
    if (window.UI && UI.closeModal) {
        const originalCloseModal = UI.closeModal;
        
        // Override with accessibility-aware version
        UI.closeModal = function() {
            // Move focus away from any elements inside the modal before closing
            // This prevents the aria-hidden error
            moveFocusBeforeClosing(modal);
            
            // Then call the original function
            originalCloseModal.call(this);
        };
    }
    
    // Override close button handler to ensure proper focus management
    const closeButton = document.querySelector('#recipeModal .close');
    if (closeButton) {
        // Replace existing handler with improved one
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Move focus before hiding the modal
            moveFocusBeforeClosing(modal);
            
            // Then close the modal
            if (window.UI && UI.closeModal) {
                UI.closeModal();
            }
        }, true); // Use capturing to ensure this runs before other handlers
    }
}

/**
 * Move focus to a safe element before closing the modal
 * This prevents the aria-hidden accessibility error
 * 
 * @param {HTMLElement} modal - The modal element being closed
 */
function moveFocusBeforeClosing(modal) {
    // Find any focused element within the modal
    const focusedElement = document.activeElement;
    
    if (focusedElement && modal.contains(focusedElement)) {
        // Find a safe element outside the modal to focus
        const safeElement = document.querySelector('h1') || 
                           document.querySelector('.filter-btn') ||
                           document.querySelector('#search') ||
                           document.body;
        
        // Move focus to the safe element
        if (safeElement && typeof safeElement.focus === 'function') {
            safeElement.focus();
        }
    }
    
    // Ensure modal has correct ARIA state by explicitly setting
    modal.setAttribute('aria-hidden', 'true');
}

/**
 * Enhanced function to prevent body scrolling with better ARIA handling
 * 
 * @param {boolean} prevent - Whether to prevent scrolling or not
 */
function preventBodyScrollWithA11y(prevent) {
    if (prevent) {
        document.body.classList.add('modal-open');
        // Don't set aria-hidden on the body as that would hide the entire page
    } else {
        document.body.classList.remove('modal-open');
    }
}

// Replace the existing preventBodyScroll function if it exists
if (typeof window.preventBodyScroll === 'function') {
    window.preventBodyScroll = preventBodyScrollWithA11y;
}
