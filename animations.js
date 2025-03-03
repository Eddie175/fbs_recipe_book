/**
 * Recipe Book Animation System
 * Minimal version that works with GSAP
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile filter toggle - a basic necessity
    const filterButton = document.getElementById('mobileFilterBtn');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            const mobileFilterPanel = document.getElementById('mobileFilterPanel');
            if (mobileFilterPanel) {
                mobileFilterPanel.classList.toggle('show');
            }
        });
    }
});

/**
 * Animate cards in with smooth entrances
 */
function animateCardsIn(cards = document.querySelectorAll('.recipe-card')) {
    if (!cards.length) return;
    
    // Set initial state - batch for performance
    gsap.set([...cards], { 
        opacity: 0,
        scale: 0.95, // Less scale variance for smoother motion
        y: 20, // Reduced distance
        transformOrigin: "center center",
        clearProps: "transform,scale",
        animation: "none"
    });
    
    // Even faster animation with optimized values
    gsap.to([...cards], {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4, // Faster animation
        stagger: {
            amount: 0.25, // Tighter stagger
            ease: "power1.out"
        },
        ease: "power2.out", // Smoother easing
        clearProps: "opacity,scale,y"
    });
}

/**
 * Simple transition between card sets
 */
function transitionCards(callback) {
    const container = document.getElementById('recipesContainer');
    if (!container) {
        if (callback) callback();
        return;
    }
    
    // Faster fade out
    const existingCards = container.querySelectorAll('.recipe-card');
    if (existingCards.length) {
        gsap.to(existingCards, {
            opacity: 0,
            scale: 0.98, // Less scale change for smoother transition
            duration: 0.15, // Faster fade out
            onComplete: () => {
                container.innerHTML = '';
                if (callback) callback();
                
                // Immediate animation of new cards
                const newCards = container.querySelectorAll('.recipe-card');
                if (newCards.length) {
                    animateCardsIn(newCards);
                }
            }
        });
    } else {
        container.innerHTML = '';
        if (callback) callback();
        
        // Animate new cards immediately if no existing cards
        const newCards = container.querySelectorAll('.recipe-card');
        if (newCards.length) {
            animateCardsIn(newCards);
        }
    }
}

/**
 * Modal open animation
 */
function animateModalOpen(modal, content) {
    if (!modal) return;
    
    gsap.set(modal, { display: 'flex', opacity: 0 });
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    document.body.classList.add('modal-open');
}

/**
 * Modal close animation with proper blur cleanup
 */
function animateModalClose(modal, content) {
    if (!modal) return;
    
    const mainContent = document.querySelector('.cards-container');
    if (mainContent) gsap.to(mainContent, { filter: 'none', duration: 0.3 });
    
    gsap.to(modal, { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => {
            gsap.set(modal, { display: 'none' });
            document.body.classList.remove('modal-open');
        }
    });
}

/**
 * Recipe navigation animations with proper blur handling
 */
function animateNextRecipe(modal, content) {
    if (!modal || !content) return;
    
    const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" }
    });
    
    // Apply blur only to background content
    const mainContent = document.querySelector('.cards-container');
    if (mainContent) gsap.to(mainContent, { filter: 'blur(8px)', duration: 0.3 });
    
    timeline
        .to(content, {
            opacity: 0,
            x: '-30%',
            duration: 0.4
        })
        .call(() => {
            if (window.RecipeAnimations?.onNextRecipe) {
                window.RecipeAnimations.onNextRecipe();
            }
        })
        .set(content, { x: '30%' })
        .to(content, {
            opacity: 1,
            x: '0%',
            duration: 0.4
        });
}

function animatePrevRecipe(modal, content) {
    if (!modal || !content) return;
    
    const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" }
    });
    
    // Apply blur only to background content
    const mainContent = document.querySelector('.cards-container');
    if (mainContent) gsap.to(mainContent, { filter: 'blur(8px)', duration: 0.3 });
    
    timeline
        .to(content, {
            opacity: 0,
            x: '30%',
            duration: 0.4
        })
        .call(() => {
            if (window.RecipeAnimations?.onPrevRecipe) {
                window.RecipeAnimations.onPrevRecipe();
            }
        })
        .set(content, { x: '-30%' })
        .to(content, {
            opacity: 1,
            x: '0%',
            duration: 0.4
        });
}

/**
 * Animate no results message with lighting sweep effect
 */
function animateNoResults(container) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.style.cssText = `
        position: relative;
        overflow: hidden;
        width: 100%;
        text-align: center;
        padding: 2rem;
        font-size: 1.2rem;
        color: #666;
        margin: 2rem auto;
    `;
    
    noResults.innerHTML = `
        <div class="no-results-content" style="position: relative; z-index: 2;">
            No recipes found. Try adjusting your search or filters.
        </div>
        <div class="sweep-effect" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,0.3),
                transparent
            );
            z-index: 1;
        "></div>
    `;
    
    // Clear container and add no results message
    container.innerHTML = '';
    container.appendChild(noResults);
    
    // Force a reflow to ensure animation plays
    noResults.offsetHeight;
    
    // Enhanced bounce animation sequence
    const timeline = gsap.timeline({
        defaults: { ease: "power2.out" }
    });
    
    // Kill any existing animations on the container
    gsap.killTweensOf(noResults);
    
    timeline
        .fromTo(noResults, {
            opacity: 0,
            scale: 0.5,
            y: -30
        }, {
            opacity: 1,
            scale: 1.1,
            y: 0,
            duration: 0.3,
            immediate: true
        })
        .to(noResults, {
            scale: 0.95,
            duration: 0.1
        })
        .to(noResults, {
            scale: 1,
            duration: 0.1
        })
        .fromTo(noResults.querySelector('.sweep-effect'), {
            x: '-100%',
            opacity: 0.5
        }, {
            x: '200%',
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.2");
    
    return timeline;
}

// Export public animation methods
window.RecipeAnimations = {
    animateCardsIn,
    animateModalOpen,
    animateModalClose,
    transitionCards,
    animateNextRecipe,
    animatePrevRecipe,
    animateNoResults,
    onNextRecipe: null,
    onPrevRecipe: null
};