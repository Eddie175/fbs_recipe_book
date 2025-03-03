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
 * Modal open animation with blur effect
 */
function animateModalOpen(modal, content) {
    if (!modal) return;
    
    gsap.killTweensOf([modal, content]);
    
    // Ensure modal is properly sized for mobile with padding
    if (window.innerWidth <= 768) {
        gsap.set(modal, { 
            display: 'flex',
            opacity: 0,
            visibility: 'visible',
            height: '100%',
            position: 'fixed',
            overflow: 'hidden',
            padding: '20px 0'  // Add vertical padding
        });
        
        gsap.set(content, {
            opacity: 0,
            height: 'auto',
            maxHeight: '92vh',  // Slightly reduced to ensure visibility
            margin: '4vh 0',    // Percentage-based margins
            borderRadius: '12px' // Keep border radius
        });

        // Show swipe hint only on mobile/tablet
        if (!localStorage.getItem('modalHintShown')) {
            const hint = document.createElement('div');
            hint.className = 'modal-swipe-hint';
            hint.innerHTML = `
                <div class="hint-content" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: ${document.documentElement.getAttribute('data-theme') === 'dark' 
                        ? 'rgba(0, 0, 0, 0.65)' 
                        : 'rgba(0, 0, 0, 0.75)'};
                    backdrop-filter: blur(8px);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    white-space: nowrap;
                    box-shadow: ${document.documentElement.getAttribute('data-theme') === 'dark'
                        ? '0 0 0 2px rgb(49, 130, 206), 0 0 20px rgba(49, 130, 206, 0.6), 0 0 40px rgba(49, 130, 206, 0.4)'
                        : '0 2px 8px rgba(0, 0, 0, 0.25)'};
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">
                    <span class="arrow" style="font-size: 18px; opacity: 0.95;">←</span>
                    <span class="hint-text" style="font-weight: 500; letter-spacing: 0.02em;">Swipe between recipes</span>
                    <span class="arrow" style="font-size: 18px; opacity: 0.95;">→</span>
                </div>
            `;
            
            modal.querySelector('.modal-content').appendChild(hint);
            
            gsap.set(hint, { 
                opacity: 0,
                position: 'absolute',
                bottom: '10%',  // Changed from 33% to 25%
                left: '50%',
                xPercent: -50,
                width: 'auto',
                whiteSpace: 'nowrap',
                zIndex: 1000
            });

            gsap.timeline()
                .to(hint, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power1.inOut'
                })
                .to(hint, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 2.5,
                    ease: 'power1.inOut',
                    onComplete: () => hint.remove()
                });
            
            localStorage.setItem('modalHintShown', 'true');
        }
    } else {
        gsap.set(modal, { 
            display: 'flex',
            opacity: 0,
            visibility: 'visible'
        });
        
        gsap.set(content, {
            opacity: 0
        });
    }
    
    gsap.set(modal, { 
        display: 'flex',
        opacity: 0,
        visibility: 'visible'
    });
    
    gsap.set(content, {
        opacity: 0
    });

    const mainContent = document.querySelector('.cards-container');
    if (mainContent) {
        gsap.to(mainContent, {
            filter: 'blur(5px)',
            duration: 0.2
        });
    }

    gsap.timeline()
        .to(modal, {
            opacity: 1,
            duration: 0.2,
            ease: 'none'
        })
        .to(content, {
            opacity: 1,
            duration: 0.2,
            ease: 'none'
        }, '-=0.1')
        .call(() => document.body.classList.add('modal-open'));
}

/**
 * Modal close animation maintaining blur until complete
 */
function animateModalClose(modal, content) {
    if (!modal) return;
    
    gsap.killTweensOf([modal, content]);
    
    const mainContent = document.querySelector('.cards-container');
    
    gsap.timeline()
        .to(content, {
            opacity: 0,
            duration: 0.2,
            ease: 'none'
        })
        .to(modal, {
            opacity: 0,
            duration: 0.2,
            ease: 'none',
            onComplete: () => {
                gsap.set(modal, { 
                    display: 'none',
                    visibility: 'hidden'
                });
                document.body.classList.remove('modal-open');
                // Remove blur last
                if (mainContent) {
                    gsap.to(mainContent, {
                        filter: 'blur(0px)',
                        duration: 0.2
                    });
                }
            }
        }, '-=0.1');
    
    // Reset hint state when modal closes
    localStorage.removeItem('modalHintShown');
}

/**
 * Simplified recipe navigation with cross-fade
 */
function animateNextRecipe(modal, content) {
    if (!modal || !content) return;
    
    gsap.killTweensOf(content);
    
    gsap.timeline()
        .to(content, {
            opacity: 0,
            duration: 0.2,
            ease: 'none',
            onComplete: () => {
                if (window.RecipeAnimations?.onNextRecipe) {
                    window.RecipeAnimations.onNextRecipe();
                }
            }
        })
        .to(content, {
            opacity: 1,
            duration: 0.2,
            ease: 'none'
        });
}

function animatePrevRecipe(modal, content) {
    if (!modal || !content) return;
    
    gsap.killTweensOf(content);
    
    gsap.timeline()
        .to(content, {
            opacity: 0,
            duration: 0.2,
            ease: 'none',
            onComplete: () => {
                if (window.RecipeAnimations?.onPrevRecipe) {
                    window.RecipeAnimations.onPrevRecipe();
                }
            }
        })
        .to(content, {
            opacity: 1,
            duration: 0.2,
            ease: 'none'
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