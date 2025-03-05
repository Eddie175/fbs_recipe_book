/**
 * Fix for desktop navigation buttons and compact view
 * Ensures desktop-specific behaviors work correctly
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix desktop navigation buttons in modal
    fixDesktopModalNavigation();
    
    // Monitor for modal open events to reapply fixes
    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    if (recipeModal.classList.contains('show') || recipeModal.style.display === 'flex') {
                        // Modal opened - fix navigation
                        fixDesktopModalNavigation();
                    }
                }
            });
        });
        
        observer.observe(recipeModal, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    
    // Fix compact view grid layout when toggle changes
    const desktopCompactToggle = document.getElementById('desktopCompactToggle');
    const recipesContainer = document.getElementById('recipesContainer');
    
    if (desktopCompactToggle && recipesContainer) {
        desktopCompactToggle.addEventListener('change', function() {
            // Force grid layout update when compact view changes
            if (this.checked) {
                recipesContainer.classList.add('compact-view');
                
                // Force layout recalculation for desktop grid
                if (window.innerWidth >= 768) {
                    recipesContainer.style.display = 'none';
                    setTimeout(() => {
                        recipesContainer.style.display = '';
                    }, 1);
                }
            }
        });
    }
});

/**
 * Fix desktop modal navigation buttons
 */
function fixDesktopModalNavigation() {
    // Only run on desktop
    if (window.innerWidth < 768) return;
    
    const nextBtn = document.querySelector('.modal-footer .next-btn');
    const prevBtn = document.querySelector('.modal-footer .prev-btn');
    
    if (!nextBtn || !prevBtn) return;
    
    // Direct click handlers that bypass the UI object
    nextBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Navigate directly using the established logic
        navigateToAdjacentRecipe('next');
    };
    
    prevBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Navigate directly using the established logic
        navigateToAdjacentRecipe('prev');
    };
}

/**
 * Navigate to adjacent recipe directly
 * This function uses the existing AppState and UI patterns
 */
function navigateToAdjacentRecipe(direction) {
    // Ensure we have data to work with
    if (!window.AppState || !AppState.currentRecipe || !AppState.filteredRecipes) {
        console.error('Missing required state for navigation');
        return;
    }
    
    // Find current recipe index
    const currentIndex = AppState.filteredRecipes.findIndex(r => 
        r.title === AppState.currentRecipe.title && 
        r.author === AppState.currentRecipe.author
    );
    
    if (currentIndex === -1) return;
    
    // Calculate target index with wrap-around
    let targetIndex;
    if (direction === 'next') {
        targetIndex = (currentIndex + 1) % AppState.filteredRecipes.length;
    } else {
        targetIndex = (currentIndex - 1 + AppState.filteredRecipes.length) % AppState.filteredRecipes.length;
    }
    
    // Get target recipe
    const targetRecipe = AppState.filteredRecipes[targetIndex];
    
    // Navigate to target recipe using UI if available
    if (window.UI && UI.openRecipeModal) {
        UI.openRecipeModal(targetRecipe);
    } else {
        // Fallback if UI object not available
        const modal = document.getElementById('recipeModal');
        const modalTitle = document.querySelector('.modal-title');
        const modalAuthor = document.querySelector('.modal-author');
        const modalBody = document.querySelector('.modal-body');
        
        if (modalTitle && modalAuthor && modalBody) {
            // Update modal content
            modalTitle.textContent = targetRecipe.title;
            modalAuthor.textContent = `By ${targetRecipe.author}`;
            
            // Update app state
            AppState.currentRecipe = targetRecipe;
            
            // Build recipe content
            if (window.DOMManager && DOMManager.buildRecipeModalContent) {
                DOMManager.buildRecipeModalContent(targetRecipe, modalBody);
            } else {
                // Basic fallback for content building
                buildBasicRecipeContent(targetRecipe, modalBody);
            }
        }
    }
}

/**
 * Basic fallback recipe content builder
 */
function buildBasicRecipeContent(recipe, container) {
    // Clear container
    container.innerHTML = '';
    
    // Add ingredients section
    const ingredientsTitleContainer = document.createElement('div');
    ingredientsTitleContainer.className = 'ingredients-title-container';
    
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.className = 'ingredients-title';
    ingredientsTitle.textContent = 'Ingredients';
    
    ingredientsTitleContainer.appendChild(ingredientsTitle);
    container.appendChild(ingredientsTitleContainer);
    
    // Add ingredients list
    const ingredientsList = document.createElement('ul');
    ingredientsList.className = 'ingredients-list';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    container.appendChild(ingredientsList);
    
    // Add instructions section
    const instructionsTitle = document.createElement('h3');
    instructionsTitle.className = 'instructions-title';
    instructionsTitle.textContent = 'Instructions';
    container.appendChild(instructionsTitle);
    
    // Add instructions list
    const instructionsList = document.createElement('ol');
    instructionsList.className = 'instructions-list';
    recipe.instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsList.appendChild(li);
    });
    container.appendChild(instructionsList);
}
