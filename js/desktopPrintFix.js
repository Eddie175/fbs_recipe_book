/**
 * Desktop Print Button Fix
 * Ensures the print button works correctly on desktop without affecting mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix the desktop print button in the modal footer
    fixDesktopPrintButton();
    
    // Monitor for modal open events to reapply print button fix
    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    if (recipeModal.classList.contains('show') || 
                        recipeModal.style.display === 'flex' || 
                        recipeModal.style.display === 'block') {
                        // Modal opened - fix print button
                        setTimeout(fixDesktopPrintButton, 50);
                    }
                }
            }
        });
        
        observer.observe(recipeModal, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
});

/**
 * Fix desktop print button by applying a direct handler
 * Only affects desktop, leaves mobile handling untouched
 */
function fixDesktopPrintButton() {
    // Only apply to desktop
    if (window.innerWidth < 768) return;
    
    // Get the print button from the modal footer
    const printBtn = document.querySelector('.modal-footer .print-btn');
    if (!printBtn) return;
    
    // Check if we've already fixed this button
    if (printBtn.getAttribute('data-print-fixed') === 'true') return;
    
    // Mark the button as fixed to avoid duplicate handlers
    printBtn.setAttribute('data-print-fixed', 'true');
    
    // Add a reliable direct click handler
    printBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Clear any existing state
        console.log('Desktop print button clicked');
        
        // Visual feedback
        this.classList.add('button-pressed');
        
        // Get current recipe securely
        const currentRecipe = window.AppState?.currentRecipe;
        if (!currentRecipe) {
            console.error('No recipe found to print');
            this.classList.remove('button-pressed');
            return;
        }
        
        // Direct print with minimal delay for visual feedback
        setTimeout(() => {
            if (window.PrintHandler && typeof PrintHandler.printRecipe === 'function') {
                // Call with proper context and pass recipe object
                PrintHandler.printRecipe(currentRecipe);
            } else {
                console.error('PrintHandler not available');
            }
            
            // Reset button appearance
            this.classList.remove('button-pressed');
        }, 100);
    });
    
    // For desktop, also add the handler to the main print button for completeness
    const mainPrintBtn = document.querySelector('.print-btn:not(.mobile-print-btn)');
    if (mainPrintBtn && mainPrintBtn !== printBtn) {
        mainPrintBtn.setAttribute('data-print-fixed', 'true');
        mainPrintBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get current recipe securely
            const currentRecipe = window.AppState?.currentRecipe;
            if (!currentRecipe) return;
            
            // Direct print handling
            if (window.PrintHandler) {
                PrintHandler.printRecipe(currentRecipe);
            }
        });
    }
}
