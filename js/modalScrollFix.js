/**
 * Modal Scroll Fix Utility
 * 
 * Fixes common issues with modal scrolling on iOS and other mobile devices:
 * - Prevents body scrolling when modal is open
 * - Ensures touch events work properly
 * - Enables momentum scrolling on iOS
 */

let scrollPosition = 0;

/**
 * Prevents the background content from scrolling when modal is open
 */
function preventBodyScroll(preventScroll = true) {
  if (preventScroll) {
    // Store current scroll position
    scrollPosition = window.pageYOffset;
    
    // iOS-specific: add position fixed to body to prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
  } else {
    // Re-enable scrolling and restore position
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
  }
}

/**
 * Apply this to modal content containers to fix iOS scrolling
 */
function enableModalScroll(modalElement) {
  if (!modalElement) return;
  
  // First, remove any existing touch handlers to avoid duplication
  if (modalElement._touchMoveHandler) {
    modalElement.removeEventListener('touchmove', modalElement._touchMoveHandler);
  }
  
  // Create handler function
  const touchMoveHandler = function(e) {
    // Find the scrollable element (modal body or target if scrollable)
    const scrollableElement = e.target.closest('.modal-body') || 
                              (e.target.scrollHeight > e.target.clientHeight ? e.target : null);
    
    if (!scrollableElement) {
      // If no scrollable element found, prevent default to avoid body scroll
      e.preventDefault();
      return;
    }
    
    const isAtTop = scrollableElement.scrollTop <= 0;
    const isAtBottom = scrollableElement.scrollHeight - scrollableElement.scrollTop <= 
                       scrollableElement.clientHeight + 1;
    
    // Only prevent default if trying to scroll past boundaries
    if ((isAtTop && e.touches[0].screenY > e.touches[0].screenY) ||
        (isAtBottom && e.touches[0].screenY < e.touches[0].screenY)) {
      e.preventDefault();
    }
  };
  
  // Store handler for future cleanup
  modalElement._touchMoveHandler = touchMoveHandler;
  
  // Add event listener
  modalElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
}

/**
 * Helper to check if device is iOS
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
