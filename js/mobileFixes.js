/**
 * Mobile UI Fix Utility
 * Ensures mobile interactions work correctly by providing fallback handlers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add emergency close handlers for mobile filter panel
    setupEmergencyCloseHandlers();
    
    // Run this fix immediately and on any DOM changes
    fixFilterPanelCloseButton();
    
    // Watch for DOM changes that might affect the filter panel
    const observer = new MutationObserver(function(mutations) {
        fixFilterPanelCloseButton();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

/**
 * Fix Filter Panel Close Button
 * Ensures the close button on the mobile filter panel works correctly
 */
function fixFilterPanelCloseButton() {
    const mobileFilterPanel = document.getElementById('mobileFilterPanel');
    if (!mobileFilterPanel) return;
    
    const closeBtn = mobileFilterPanel.querySelector('.panel-close-btn');
    if (!closeBtn) return;
    
    // Check if this button already has our emergency handler
    if (closeBtn.getAttribute('data-has-emergency-handler')) return;
    
    // Mark the button as having our handler
    closeBtn.setAttribute('data-has-emergency-handler', 'true');
    
    // Add a direct, no-nonsense close handler that takes priority
    closeBtn.addEventListener('click', function emergencyClose(e) {
        console.log('EMERGENCY: Filter panel close button clicked');
        
        // Stop event from potentially being captured elsewhere
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Force close with multiple techniques
        mobileFilterPanel.style.transform = 'translate(-50%, 100%)';
        mobileFilterPanel.classList.remove('show');
        
        // Extra insurance with a small delay
        setTimeout(() => {
            mobileFilterPanel.classList.remove('show');
            mobileFilterPanel.style.display = 'none';
            
            // Reset after animation would have completed
            setTimeout(() => {
                mobileFilterPanel.style.display = '';
            }, 300);
        }, 50);
    }, true); // Use capturing phase for highest priority
}

/**
 * Setup Emergency Close Handlers
 * Add redundant ways to close the mobile filter panel
 */
function setupEmergencyCloseHandlers() {
    // Add a global click handler to detect clicks on the panel close button
    document.body.addEventListener('click', function(e) {
        // Check if the clicked element is the panel close button or a child of it
        if (e.target.closest('.panel-close-btn')) {
            const mobileFilterPanel = document.getElementById('mobileFilterPanel');
            if (mobileFilterPanel) {
                console.log('Global detection: Filter close button clicked');
                mobileFilterPanel.classList.remove('show');
            }
        }
    }, true); // Use capturing phase
    
    // Add an emergency CSS class that ensures the close button is always clickable
    const style = document.createElement('style');
    style.textContent = `
        .panel-close-btn {
            position: relative;
            z-index: 9999 !important;
            pointer-events: all !important;
            cursor: pointer !important;
            min-width: 44px !important;
            min-height: 44px !important;
            touch-action: manipulation !important;
        }
        
        .panel-close-btn::after {
            content: '';
            position: absolute;
            top: -10px;
            right: -10px;
            bottom: -10px;
            left: -10px;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);
}
