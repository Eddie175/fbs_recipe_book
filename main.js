/**
 * Recipe Book Application
 * Main application logic for the FBS Employee Recipe Book
 */

// Application state management
const AppState = {
    currentFilter: 'all',
    searchTerm: '',
    currentRecipe: null,
    sortMethod: 'default',
    isCondensedView: false,
    isMobile: window.innerWidth <= 768,
    filteredRecipes: [] // Add this to track filtered recipes
};

// Make AppState globally available for animations.js
window.AppState = AppState;

// Utility functions
const Utilities = {
    /**
     * Debounce function for performance optimization
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    /**
     * Get readable category name from category code
     */
    getCategoryName: function(categoryCode) {
        const categories = {
            'main': 'Main Dish',
            'side': 'Side Dish',
            'dessert': 'Dessert',
            'breakfast': 'Breakfast',
            'drink': 'Drink',
            'soup': 'Soup'
        };
        return categories[categoryCode] || categoryCode;
    },

    /**
     * Get emoji for category
     */
    getCategoryEmoji: function(categoryCode) {
        const emojis = {
            'all': '📋',
            'main': '🍲',
            'dessert': '🍰',
            'side': '🥗',
            'breakfast': '🍳',
            'soup': '🍜',
            'drink': '🍹'
        };
        return emojis[categoryCode] || '🍽️';
    }
};

// DOM manipulation functions
const DOMManager = {
    /**
     * Create a recipe card element
     */
    createRecipeCard: function(recipe, container) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${recipe.title} by ${recipe.author}`);
        card.setAttribute('data-category', recipe.category);

        // Card header with title, author, category
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const recipeTitle = document.createElement('h3');
        recipeTitle.className = 'recipe-title';
        recipeTitle.textContent = recipe.title;

        const author = document.createElement('p');
        author.className = 'author';
        author.textContent = `By ${recipe.author}`;

        const categoryTag = document.createElement('span');
        categoryTag.className = 'category-tag';
        categoryTag.textContent = Utilities.getCategoryName(recipe.category);

        cardHeader.appendChild(recipeTitle);
        cardHeader.appendChild(author);
        cardHeader.appendChild(categoryTag);

        // Card preview with description and button
        const cardPreview = document.createElement('div');
        cardPreview.className = 'card-preview';

        const previewText = document.createElement('p');
        previewText.className = 'preview-text';
        previewText.textContent = recipe.preview;

        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.textContent = 'View Recipe';
        viewBtn.setAttribute('aria-label', `View ${recipe.title} recipe`);

        cardPreview.appendChild(previewText);
        cardPreview.appendChild(viewBtn);

        // Build the complete card
        card.appendChild(cardHeader);
        card.appendChild(cardPreview);
        container.appendChild(card);

        // Add event listeners
        card.addEventListener('click', () => UI.openRecipeModal(recipe));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                UI.openRecipeModal(recipe);
            }
        });
    },

    /**
     * Create "no results" message when filters return empty
     */
    createNoResultsMessage: function(container) {
        // Remove any existing no-results message
        const existingNoResults = container.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No recipes found. Try adjusting your search or filters.';
        container.appendChild(noResults);
    },

    /**
     * Build modal content for a recipe
     */
    buildRecipeModalContent: function(recipe, modalBody) {
        if (!recipe || !modalBody) return;
        
        // Clear the modal body first
        modalBody.innerHTML = '';
        
        // Add preview text section
        if (recipe.preview) {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'recipe-preview-container';
            previewContainer.style.marginTop = '10px';
            previewContainer.style.padding = '0 5px 10px 5px';
            previewContainer.style.borderBottom = '1px solid rgba(0, 119, 217, 0.15)';
            
            const previewText = document.createElement('p');
            previewText.className = 'recipe-preview-text';
            previewText.textContent = recipe.preview;
            previewText.style.fontStyle = 'italic';
            previewText.style.color = 'var(--text-light)';
            previewText.style.lineHeight = '1.6';
            previewText.style.fontSize = '1.05rem';
            
            previewContainer.appendChild(previewText);
            modalBody.appendChild(previewContainer);
        }

        // CRITICAL: Create ingredients title container with proper structure
        const ingredientsTitleContainer = document.createElement('div');
        ingredientsTitleContainer.className = 'ingredients-title-container';
        ingredientsTitleContainer.setAttribute('data-section', 'ingredients-header');

        // Create the title element
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.className = 'ingredients-title';
        ingredientsTitle.textContent = 'Ingredients';
        ingredientsTitle.setAttribute('data-section', 'ingredients-title');

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-action-buttons';
        buttonContainer.setAttribute('data-purpose', 'ingredient-actions');

        // Create copy button with a more reliable structure
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-ingredients-btn';
        copyBtn.setAttribute('aria-label', 'Copy ingredients to clipboard');
        copyBtn.setAttribute('title', 'Copy ingredients');
        copyBtn.setAttribute('type', 'button');
        copyBtn.textContent = 'Copy';

        // Create print button with improved isolation
        const printBtn = document.createElement('button');
        printBtn.className = 'mobile-print-btn';
        printBtn.setAttribute('aria-label', 'Print recipe');
        printBtn.setAttribute('type', 'button');
        printBtn.textContent = '🖨️';
        
        // Use an isolated debounced print handler that doesn't interfere with DOM
        let printClickInProgress = false;
        const debouncedPrint = function(e) {
            // Prevent any default behaviors and stop propagation
            e.preventDefault(); 
            e.stopPropagation();
            
            // Prevent double-triggering
            if (printClickInProgress) return;
            printClickInProgress = true;
            
            // Visual feedback
            this.style.opacity = '0.7';
            
            // Use a direct reference to the current recipe to avoid DOM manipulation
            const recipeToPrint = Object.assign({}, AppState.currentRecipe);
            
            // Trigger print with slight delay for visual feedback
            setTimeout(() => {
                // Use the isolated print method that doesn't affect DOM
                PrintHandler.printRecipe(recipeToPrint);
                
                // Reset visual state
                this.style.opacity = '1';
                
                // Reset click state after a reasonable delay
                setTimeout(() => {
                    printClickInProgress = false;
                }, 1000);
            }, 50);
        };

        // Add event listeners with proper isolation
        printBtn.addEventListener('click', debouncedPrint);
        
        // Add special handling for touch events
        printBtn.addEventListener('touchstart', function(e) {
            // Just provide feedback
            printBtn.style.opacity = '0.7';
        });
        
        printBtn.addEventListener('touchend', debouncedPrint);

        // Assemble button container
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(printBtn);

        // Assemble ingredients header
        ingredientsTitleContainer.appendChild(ingredientsTitle);
        ingredientsTitleContainer.appendChild(buttonContainer);
        
        // Add to modal
        modalBody.appendChild(ingredientsTitleContainer);

        // Add tooltip for copy function
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Copy ingredients';
        modalBody.appendChild(tooltip);

        // Create ingredients list
        const ingredientsList = document.createElement('ul');
        ingredientsList.className = 'ingredients-list';
        ingredientsList.setAttribute('data-section', 'ingredients-list');
        
        // Add each ingredient as a list item
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Add ingredients list to modal
        modalBody.appendChild(ingredientsList);

        // Create instructions section
        const instructionsTitle = document.createElement('h3');
        instructionsTitle.className = 'instructions-title';
        instructionsTitle.textContent = 'Instructions';
        instructionsTitle.setAttribute('data-section', 'instructions-title');
        modalBody.appendChild(instructionsTitle);

        // Create instructions list
        const instructionsList = document.createElement('ol');
        instructionsList.className = 'instructions-list';
        instructionsList.setAttribute('data-section', 'instructions-list');
        
        // Add each instruction as a list item
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        
        // Add instructions list to modal
        modalBody.appendChild(instructionsList);

        // Set up copy ingredients functionality - with improved error handling
        copyBtn.addEventListener('click', () => {
            try {
                const ingredientsText = recipe.ingredients.join('\n');
                navigator.clipboard.writeText(ingredientsText)
                    .then(() => {
                        // Show success feedback
                        tooltip.classList.add('show');
                        tooltip.textContent = 'Copied!';
                        setTimeout(() => {
                            tooltip.classList.remove('show');
                            setTimeout(() => tooltip.textContent = 'Copy ingredients', 300);
                        }, 1500);
                    })
                    .catch(err => {
                        // Show error feedback
                        console.error('Failed to copy: ', err);
                        tooltip.classList.add('show');
                        tooltip.textContent = 'Copy failed!';
                        setTimeout(() => tooltip.classList.remove('show'), 1500);
                    });
            } catch (e) {
                console.error('Copy operation error:', e);
            }
        });
    }
};

// UI controller
const UI = {
    /**
     * Expose the UI object globally for animations to use
     */
    exposeGlobally: function() {
        window.UI = this;
    },
    
    /**
     * Initialize the UI
     */
    init: function() {
        this.exposeGlobally(); // Expose UI globally
        
        // Setup compact view first to ensure it's ready before displaying recipes
        this.setupCondensedView();
        
        // Then continue with other initialization
        this.displayRecipes();
        this.updateCategoryCounters();
        this.setupEventListeners();
        this.createMobileFilterButton();
        this.setupMobileFilters();
        this.checkMobileView();

        // Set up navigation buttons
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateRecipes('next'));
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateRecipes('prev'));
        
        // Log initialization complete
        console.log('UI initialization complete');
    },

    /**
     * Check if we're in mobile view and set appropriate defaults
     */
    checkMobileView: function() {
        const isSmallScreen = window.innerWidth <= 768;
        AppState.isMobile = isSmallScreen;
        
        // Get toggles
        const desktopCompactToggle = document.getElementById('desktopCompactToggle');
        const condensedViewToggle = document.getElementById('condensedViewToggle');
        const recipesContainer = document.getElementById('recipesContainer');
        
        // Force compact view on mobile
        if (isSmallScreen) {
            AppState.isCondensedView = true;
            
            // Update the UI toggles
            if (condensedViewToggle) condensedViewToggle.checked = true;
            if (desktopCompactToggle) desktopCompactToggle.checked = true;
            
            // Update the container class
            if (recipesContainer) recipesContainer.classList.add('compact-view');
        } else if (!AppState.userChangedCompactSetting) {
            // If on desktop and user hasn't manually changed the setting, use expanded view
            AppState.isCondensedView = false;
            
            // Update the UI toggles
            if (condensedViewToggle) condensedViewToggle.checked = false;
            if (desktopCompactToggle) desktopCompactToggle.checked = false;
            
            // Update the container class
            if (recipesContainer) recipesContainer.classList.remove('compact-view');
        }
    },

    /**
     * Display recipes based on current filters and sort options
     */
    displayRecipes: function() {
        const container = document.getElementById('recipesContainer');
        if (!container) return;

        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'none';

        // Apply current sorting method
        this.applySorting();

        // Filter recipes based on current criteria
        const filteredRecipes = recipes.filter(recipe => {
            const categoryMatch = AppState.currentFilter === 'all' || recipe.category === AppState.currentFilter;
            const searchMatch = !AppState.searchTerm || 
                recipe.title.toLowerCase().includes(AppState.searchTerm) || 
                recipe.author.toLowerCase().includes(AppState.searchTerm) || 
                (recipe.ingredients && recipe.ingredients.some(ing => ing.toLowerCase().includes(AppState.searchTerm))) ||
                (recipe.preview && recipe.preview.toLowerCase().includes(AppState.searchTerm));
            return categoryMatch && searchMatch;
        });

        // Store filtered recipes in app state for modal navigation
        AppState.filteredRecipes = filteredRecipes;

        // Clear existing content
        container.innerHTML = '';

        if (filteredRecipes.length === 0) {
            if (window.RecipeAnimations?.animateNoResults) {
                window.RecipeAnimations.animateNoResults(container);
            } else {
                container.innerHTML = '<div class="no-results">No recipes found. Try adjusting your search or filters.</div>';
            }
            return;
        }

        // Create and animate recipe cards
        filteredRecipes.forEach(recipe => DOMManager.createRecipeCard(recipe, container));
        if (window.RecipeAnimations?.animateCardsIn) {
            window.RecipeAnimations.animateCardsIn();
        }
    },

    /**
     * Apply selected sorting method to recipes array
     */
    applySorting: function() {
        switch(AppState.sortMethod) {
            case 'alpha-asc':
                recipes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'alpha-desc':
                recipes.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'author':
                recipes.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'category':
                recipes.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }
    },

    /**
     * Open recipe modal with details
     */
    openRecipeModal: function(recipe) {
        AppState.currentRecipe = recipe;

        const modal = document.getElementById('recipeModal');
        const modalTitle = document.querySelector('.modal-title');
        const modalAuthor = document.querySelector('.modal-author');
        const modalBody = document.querySelector('.modal-body');
        const modalContent = modal.querySelector('.modal-content');

        if (!modal || !modalTitle || !modalAuthor || !modalBody) return;

        // Set modal content
        modalTitle.textContent = recipe.title;
        modalAuthor.textContent = `By ${recipe.author}`;
        DOMManager.buildRecipeModalContent(recipe, modalBody);

        // Preload adjacent recipes for seamless swiping
        this.preloadAdjacentRecipes(recipe);
        
        // Add swipe indicators if we have multiple recipes
        this.addSwipeIndicatorsToModal(modalContent);

        // Prevent body scrolling when modal is open
        preventBodyScroll(true);

        // Show modal with animation if available
        if (window.RecipeAnimations) {
            window.RecipeAnimations.animateModalOpen(modal, modalContent);
        } else {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }

        // Setup swipe navigation for touch devices
        this.setupSwipeNavigation(modalContent);

        // Focus close button for accessibility
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);

        // Setup modal scroll indication
        this.setupModalScroll();
        
        // Setup navigation buttons for desktop
        this.setupDesktopNavButtons(recipe);

        // Set accessibility attributes
        modal.setAttribute('aria-hidden', 'false');
    },

    /**
     * Add swipe hint to the modal if multiple recipes are available
     */
    addSwipeIndicatorsToModal: function(modalContent) {
        if (!modalContent) return;
        
        // Remove any existing indicators first
        const existingIndicators = modalContent.querySelectorAll('.swipe-indicator, .swipe-hint');
        existingIndicators.forEach(el => el.remove());
        
        // Only show hint if multiple recipes are available
        if (AppState.filteredRecipes.length <= 1) {
            modalContent.classList.remove('can-swipe');
            return;
        }
        
        // Add the can-swipe class to the modal content
        modalContent.classList.add('can-swipe');
        
        // Only show the swipe hint on mobile devices
        if (AppState.isMobile) {
            // Create swipe hint message
            const swipeHint = document.createElement('div');
            swipeHint.className = 'swipe-hint';
            swipeHint.textContent = `Swipe to browse ${AppState.filteredRecipes.length} recipes`;
            
            // Add hint to modal
            modalContent.appendChild(swipeHint);
            
            // Show hint every time now
            setTimeout(() => {
                swipeHint.classList.add('show');
                
                // Auto-hide after a delay
                setTimeout(() => {
                    swipeHint.classList.remove('show');
                }, 3000); // Increased from 2000 to give more time to read
            }, 500);
        }
    },

    /**
     * Preload adjacent recipes for faster swiping
     */
    preloadAdjacentRecipes: function(currentRecipe) {
        if (!currentRecipe) return;
        
        // Use filtered recipes array
        const filteredRecipes = AppState.filteredRecipes;
        
        if (filteredRecipes.length <= 1) {
            if (window.RecipePreload) {
                window.RecipePreload.prevIndex = null;
                window.RecipePreload.nextIndex = null;
                window.RecipePreload.isReady = false;
            }
            return;
        }
        
        const currentIndex = filteredRecipes.findIndex(r => 
            r.title === currentRecipe.title && 
            r.author === currentRecipe.author
        );
        
        if (currentIndex === -1) return;
        
        // Calculate adjacent indices with wrap-around
        const prevIndex = (currentIndex - 1 + filteredRecipes.length) % filteredRecipes.length;
        const nextIndex = (currentIndex + 1) % filteredRecipes.length;
        
        // Initialize preload structures if they don't exist
        if (!window.RecipePreload) {
            window.RecipePreload = {
                prev: document.createElement('div'),
                next: document.createElement('div'),
                scrollPositions: {}, // Store scroll positions by recipe title
                isReady: false
            };
            
            window.RecipePreload.prev.className = 'preload-container prev';
            window.RecipePreload.next.className = 'preload-container next';
            window.RecipePreload.prev.style.display = 'none';
            window.RecipePreload.next.style.display = 'none';
            
            document.body.appendChild(window.RecipePreload.prev);
            document.body.appendChild(window.RecipePreload.next);
        }
        
        // Preload in the background but don't block the UI
        setTimeout(() => {
            // Preload content for both directions
            DOMManager.buildRecipeModalContent(filteredRecipes[prevIndex], window.RecipePreload.prev);
            DOMManager.buildRecipeModalContent(filteredRecipes[nextIndex], window.RecipePreload.next);
            
            // Store indices and recipes for fast access
            window.RecipePreload.prevIndex = prevIndex;
            window.RecipePreload.nextIndex = nextIndex;
            window.RecipePreload.prevRecipe = filteredRecipes[prevIndex];
            window.RecipePreload.nextRecipe = filteredRecipes[nextIndex];
            window.RecipePreload.isReady = true;
            
            // Pre-create HTML content for even faster swapping
            window.RecipePreload.prevHTML = window.RecipePreload.prev.innerHTML;
            window.RecipePreload.nextHTML = window.RecipePreload.next.innerHTML;
        }, 10);
    },

    /**
     * Navigate between recipes in the modal with optimized performance
     */
    navigateRecipes: function(direction) {
        if (!AppState.currentRecipe) return;
        
        const filteredRecipes = AppState.filteredRecipes;
        
        if (filteredRecipes.length <= 1) return;
        
        // Store current scroll position before navigation
        const modalBody = document.querySelector('.modal-body');
        if (modalBody && AppState.currentRecipe) {
            const currentKey = AppState.currentRecipe.title + '-' + AppState.currentRecipe.author;
            if (!window.RecipePreload) window.RecipePreload = { scrollPositions: {} };
            if (!window.RecipePreload.scrollPositions) window.RecipePreload.scrollPositions = {};
            window.RecipePreload.scrollPositions[currentKey] = modalBody.scrollTop;
        }
        
        let targetIndex;
        let targetRecipe;
        
        // Use preloaded content when available
        if (window.RecipePreload && window.RecipePreload.isReady) {
            if (direction === 'next') {
                targetIndex = window.RecipePreload.nextIndex;
                targetRecipe = window.RecipePreload.nextRecipe;
            } else {
                targetIndex = window.RecipePreload.prevIndex;
                targetRecipe = window.RecipePreload.prevRecipe;
            }
        } else {
            // Fallback to regular index calculation
            const currentIndex = filteredRecipes.findIndex(r => 
                r.title === AppState.currentRecipe.title && 
                r.author === AppState.currentRecipe.author
            );
            
            if (currentIndex === -1) return;
            
            targetIndex = direction === 'next' 
                ? (currentIndex + 1) % filteredRecipes.length 
                : (currentIndex - 1 + filteredRecipes.length) % filteredRecipes.length;
                
            targetRecipe = filteredRecipes[targetIndex];
        }

        const modal = document.getElementById('recipeModal');
        const modalContent = modal.querySelector('.modal-content');
        const modalTitle = document.querySelector('.modal-title');
        const modalAuthor = document.querySelector('.modal-author');
        
        // Apply instantaneous transition using preloaded content
        if (window.RecipePreload && window.RecipePreload.isReady) {
            // Update modal header immediately
            modalTitle.textContent = targetRecipe.title;
            modalAuthor.textContent = `By ${targetRecipe.author}`;
            
            // Direct content swap without animation for better performance
            if (direction === 'next' && window.RecipePreload.nextHTML) {
                modalBody.innerHTML = window.RecipePreload.nextHTML;
            } else if (direction === 'prev' && window.RecipePreload.prevHTML) {
                modalBody.innerHTML = window.RecipePreload.prevHTML;
            } else {
                // Fallback if preloaded HTML isn't available
                DOMManager.buildRecipeModalContent(targetRecipe, modalBody);
            }
            
            // Update app state
            AppState.currentRecipe = targetRecipe;
            
            // Restore scroll position if we've visited this recipe before
            const targetKey = targetRecipe.title + '-' + targetRecipe.author;
            if (window.RecipePreload.scrollPositions && 
                window.RecipePreload.scrollPositions[targetKey] !== undefined) {
                modalBody.scrollTop = window.RecipePreload.scrollPositions[targetKey];
            } else {
                modalBody.scrollTop = 0; // Start at top for new recipes
            }
            
            // Start preloading the next recipes immediately
            this.preloadAdjacentRecipes(targetRecipe);
            
            // Update swipe indicators
            this.addSwipeIndicatorsToModal(modalContent);
            
            // Set up swipe navigation again
            this.setupSwipeNavigation(modalContent);
            
        } else {
            // Fallback to old navigation method
            this.openRecipeModal(targetRecipe);
        }
    },

    /**
     * Close the recipe modal
     */
    closeModal: function() {
        const modal = document.getElementById('recipeModal');
        if (!modal) return;

        // Re-enable body scrolling
        preventBodyScroll(false);

        if (window.RecipeAnimations) {
            window.RecipeAnimations.animateModalClose(modal, modal.querySelector('.modal-content'));
        } else {
            document.body.classList.remove('modal-open');
            modal.classList.add('hide');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('hide');
            }, 300);
        }

        // Update accessibility attribute
        modal.setAttribute('aria-hidden', 'true');
    },

    /**
     * Update category counter badges
     */
    updateCategoryCounters: function() {
        // Count recipes in each category
        const categoryCounts = {
            all: recipes.length,
            main: recipes.filter(r => r.category === 'main').length,
            dessert: recipes.filter(r => r.category === 'dessert').length,
            side: recipes.filter(r => r.category === 'side').length,
            breakfast: recipes.filter(r => r.category === 'breakfast').length,
            soup: recipes.filter(r => r.category === 'soup').length,
            drink: recipes.filter(r => r.category === 'drink').length
        };

        // Update desktop filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const category = btn.dataset.category;
            const count = categoryCounts[category] || 0;

            btn.innerHTML = '';

            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = Utilities.getCategoryEmoji(category);

            const textSpan = document.createElement('span');
            textSpan.textContent = category === 'all' ? 'All' : Utilities.getCategoryName(category);

            const countSpan = document.createElement('span');
            countSpan.className = 'count';
            countSpan.textContent = count;

            btn.appendChild(emojiSpan);
            btn.appendChild(textSpan);
            btn.appendChild(countSpan);
        });

        // Update mobile filter panel
        const mobilePanel = document.querySelector('.mobile-filter-options');
        if (mobilePanel) {
            mobilePanel.innerHTML = '';

            Object.keys(categoryCounts).forEach(category => {
                const btn = document.createElement('button');
                btn.className = category === AppState.currentFilter 
                    ? 'mobile-filter-btn-item active' 
                    : 'mobile-filter-btn-item';
                btn.dataset.category = category;

                // Get category display name
                let categoryName;
                switch(category) {
                    case 'all': categoryName = 'All Recipes'; break;
                    case 'main': categoryName = 'Main Dishes'; break;
                    case 'dessert': categoryName = 'Desserts'; break;
                    case 'side': categoryName = 'Side Dishes'; break;
                    case 'breakfast': categoryName = 'Breakfast'; break;
                    case 'soup': categoryName = 'Soups'; break;
                    case 'drink': categoryName = 'Drinks'; break;
                    default: categoryName = category;
                }

                const icon = Utilities.getCategoryEmoji(category);

                btn.innerHTML = `
                    <div class="mobile-filter-item-content">
                        <div class="filter-emoji">${icon}</div>
                        <div class="filter-text">${categoryName}</div>
                        <div class="mobile-count">${categoryCounts[category]}</div>
                    </div>
                `;

                // Add event listener
                btn.addEventListener('click', function() {
                    // Update mobile UI
                    mobilePanel.querySelectorAll('.mobile-filter-btn-item').forEach(b => {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Update filter state
                    AppState.currentFilter = this.dataset.category;

                    // Update desktop UI
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        const isActive = btn.dataset.category === AppState.currentFilter;
                        btn.classList.toggle('active', isActive);
                        btn.setAttribute('aria-pressed', isActive);
                    });

                    // Refresh recipe display with animation if available
                    if (window.RecipeAnimations) {
                        window.RecipeAnimations.transitionCards(() => {
                            const container = document.getElementById('recipesContainer');
                            container.innerHTML = '';
                            UI.displayRecipes();
                        });
                    } else {
                        const container = document.getElementById('recipesContainer');
                        container.innerHTML = '';
                        UI.displayRecipes();
                    }

                    // Close mobile filter panel
                    document.getElementById('mobileFilterPanel').classList.remove('show');
                });

                mobilePanel.appendChild(btn);
            });
        }
    },

    /**
     * Create the mobile filter button if it doesn't exist
     */
    createMobileFilterButton: function() {
        if (document.getElementById('mobileFilterBtn')) return;

        const mobileFilterBtn = document.createElement('button');
        mobileFilterBtn.id = 'mobileFilterBtn';
        mobileFilterBtn.className = 'mobile-filter-btn';
        mobileFilterBtn.innerHTML = '<span class="filter-icon">🔍</span>';
        mobileFilterBtn.setAttribute('aria-label', 'Show filter options');
        document.body.appendChild(mobileFilterBtn);

        mobileFilterBtn.addEventListener('click', function() {
            const mobileFilterPanel = document.getElementById('mobileFilterPanel');
            if (mobileFilterPanel) {
                mobileFilterPanel.classList.toggle('show');
            }
        });
    },

    /**
     * Set up mobile filters panel
     */
    setupMobileFilters: function() {
        const mobileFilterPanel = document.getElementById('mobileFilterPanel');
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        
        // Make sure we have the panel first
        if (!mobileFilterPanel) return;
        
        // Find the close button directly inside the panel for reliability
        const panelCloseBtn = mobileFilterPanel.querySelector('.panel-close-btn');
        
        // Clean up any existing handlers to prevent duplication
        if (this._mobileFilterCloseHandler) {
            document.removeEventListener('click', this._mobileFilterCloseHandler);
        }
        
        // 1. Set up the close button with a direct, simple handler
        if (panelCloseBtn) {
            // Remove any existing listeners by cloning and replacing
            const oldBtn = panelCloseBtn;
            const newBtn = document.createElement('button');
            newBtn.className = oldBtn.className;
            newBtn.innerHTML = oldBtn.innerHTML;
            newBtn.setAttribute('aria-label', 'Close filter panel');
            
            // Replace the old button
            if (oldBtn.parentNode) {
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);
            }
            
            // Add a clean click handler focused on just closing the panel
            newBtn.addEventListener('click', function closeFilterPanel(e) {
                // Stop event from bubbling up and triggering other handlers
                e.preventDefault();
                e.stopPropagation();
                
                // Log to confirm handler is running
                console.log('Filter close button clicked - closing panel');
                
                // Force close the panel by removing the show class
                mobileFilterPanel.classList.remove('show');
            });
        }
        
        // 2. Setup global click handler for clicks outside the panel
        this._mobileFilterCloseHandler = function(e) {
            // Only continue if panel is shown
            if (!mobileFilterPanel.classList.contains('show')) return;
            
            // Close if clicked outside panel and not on filter button
            if (!mobileFilterPanel.contains(e.target) && 
                e.target !== mobileFilterBtn && 
                !mobileFilterBtn.contains(e.target)) {
                console.log('Clicked outside filter panel, closing');
                mobileFilterPanel.classList.remove('show');
            }
        };
        
        // Use capturing phase for better event handling
        document.addEventListener('click', this._mobileFilterCloseHandler, true);
        
        // 3. Set up toggle button with improved handling
        if (mobileFilterBtn) {
            // Replace existing listeners with a fresh one
            const oldBtn = mobileFilterBtn;
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile filter button clicked - toggling panel');
                mobileFilterPanel.classList.toggle('show');
            });
        }
        
        // 4. Add a failsafe mechanism - close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileFilterPanel.classList.contains('show')) {
                console.log('Escape key pressed - closing filter panel');
                mobileFilterPanel.classList.remove('show');
            }
        });
    },

    /**
     * Set up condensed view toggle with improved reliability
     */
    setupCondensedView: function() {
        const desktopCompactToggle = document.getElementById('desktopCompactToggle');
        const condensedViewToggle = document.getElementById('condensedViewToggle');
        const recipesContainer = document.getElementById('recipesContainer');

        // Reset tracking flag
        AppState.userChangedCompactSetting = false;

        // Helper function to update the UI based on state
        const updateCompactUI = (isCompact) => {
            console.log('Setting compact view:', isCompact);
            
            // Update app state
            AppState.isCondensedView = isCompact;
            
            // Update toggle states
            if (desktopCompactToggle) desktopCompactToggle.checked = isCompact;
            if (condensedViewToggle) condensedViewToggle.checked = isCompact;
            
            // Update container class
            if (recipesContainer) {
                if (isCompact) {
                    recipesContainer.classList.add('compact-view');
                } else {
                    recipesContainer.classList.remove('compact-view');
                }
            }
        };
        
        // Initialize based on screen size
        const isSmallScreen = window.innerWidth <= 768;
        if (isSmallScreen) {
            // Always use compact view on mobile
            updateCompactUI(true);
        } else {
            // Otherwise use the saved preference or default to expanded
            updateCompactUI(AppState.isCondensedView || false);
        }

        // Desktop toggle event handler
        if (desktopCompactToggle) {
            desktopCompactToggle.addEventListener('click', function() {
                AppState.userChangedCompactSetting = true;
                updateCompactUI(this.checked);
            });
        }

        // Mobile toggle event handler
        if (condensedViewToggle) {
            condensedViewToggle.addEventListener('click', function() {
                AppState.userChangedCompactSetting = true;
                updateCompactUI(this.checked);
            });
        }
    },

    /**
     * Set up touch swipe navigation for mobile with improved detection
     */
    setupSwipeNavigation: function(element) {
        if (!element) return;

        // First, remove any existing touch handlers to avoid duplication
        const oldHandlers = element._swipeHandlers;
        if (oldHandlers) {
            element.removeEventListener('touchstart', oldHandlers.start);
            element.removeEventListener('touchmove', oldHandlers.move);
            element.removeEventListener('touchend', oldHandlers.end);
        }

        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let touchCurrentY = 0;
        let swipeInitiated = false;
        let isSwipeGesture = false; // Track if this is an actual swipe, not just a tap
        const modalBody = element.querySelector('.modal-body');
        let currentXTransform = 0;
        let isScrolling = false;
        let swipeIgnored = false;
        const threshold = 80; 
        const minSwipeDistance = 50; // Increased to better distinguish from taps
        const resistanceFactor = 0.4;
        let touchStartTime = 0;
        let initialScrollTop = 0;
        
        function handleTouchStart(e) {
            // Don't initiate swipe on interactive elements
            const target = e.target;
            
            // Check for interactive elements more thoroughly
            if (target.closest('button') || 
                target.closest('a') || 
                target.closest('.copy-ingredients-btn') || 
                target.closest('.mobile-print-btn') ||
                target.closest('.print-btn') ||
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.getAttribute('role') === 'button') {
                swipeIgnored = true;
                return;
            }
            
            // Reset state for new touch
            swipeIgnored = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            currentXTransform = 0;
            swipeInitiated = true;
            isSwipeGesture = false; // Start by assuming it's a tap, not a swipe
            isScrolling = false;
            touchStartTime = Date.now();
            
            // Remember scroll position
            if (modalBody) {
                initialScrollTop = modalBody.scrollTop;
            }
            
            // Use hardware acceleration for smoother animations
            element.style.willChange = 'transform';
        }
        
        function handleTouchMove(e) {
            if (!swipeInitiated || swipeIgnored) return;
            
            touchCurrentX = e.touches[0].clientX;
            touchCurrentY = e.touches[0].clientY;
            
            const diffX = touchCurrentX - touchStartX;
            const diffY = touchCurrentY - touchStartY;
            
            // If horizontal movement is significant, consider it a swipe gesture
            if (Math.abs(diffX) > minSwipeDistance) {
                isSwipeGesture = true;
            }
            
            // Check for vertical scrolling intent with improved detection
            if (modalBody && modalBody.contains(e.target)) {
                // Consider it scrolling if:
                // 1. Vertical movement is significantly greater than horizontal
                // 2. OR if we've moved vertically in the scrollable area
                const verticalDominant = Math.abs(diffY) > Math.abs(diffX) * 1.2; // Increased ratio
                const hasScrolled = modalBody.scrollTop !== initialScrollTop;
                
                if (verticalDominant || hasScrolled) {
                    isScrolling = true;
                    
                    // Reset any transform we might have started
                    if (element.style.transform) {
                        element.style.transform = '';
                        element.style.transition = 'transform 0.2s ease';
                        setTimeout(() => {
                            element.style.transition = '';
                        }, 200);
                    }
                    
                    return; // Allow default scroll behavior
                }
            }
            
            // If we've determined this is a scroll, don't interfere
            if (isScrolling) return;
            
            // For clear horizontal swipes, prevent default to avoid page scrolling
            if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
                e.preventDefault();
                
                // Apply resistance for natural feel
                const restrictedDiffX = diffX * resistanceFactor;
                currentXTransform = restrictedDiffX;
                
                // Apply transform for direct manipulation feel
                element.style.transform = `translateX(${restrictedDiffX}px)`;
                element.style.transition = '';
            }
        }
        
        function handleTouchEnd(e) {
            // Skip processing if touch was ignored or already scrolling
            if (swipeIgnored || isScrolling) {
                // Reset transformations
                element.style.transform = '';
                element.style.willChange = 'auto';
                return;
            }
            
            // Calculate swipe velocity for more natural feel
            const touchEndTime = Date.now();
            const swipeTime = touchEndTime - touchStartTime;
            const diffX = touchCurrentX - touchStartX;
            const swipeVelocity = Math.abs(diffX) / swipeTime;
            const isQuickSwipe = swipeVelocity > 0.5 && Math.abs(diffX) > 30;
            
            // Only navigate if it was an actual swipe gesture (not just a tap)
            // We use both the isSwipeGesture flag and check threshold/velocity
            if (swipeInitiated && isSwipeGesture && (Math.abs(currentXTransform) > threshold || isQuickSwipe)) {
                const direction = currentXTransform > 0 ? 'prev' : 'next';
                
                // Navigate to next/previous recipe
                UI.navigateRecipes(direction);
                
                // Reset transform immediately
                element.style.transform = '';
                
            } else if (swipeInitiated && (Math.abs(currentXTransform) > 0)) {
                // Not enough movement, spring back to center
                element.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                element.style.transform = '';
                
                setTimeout(() => {
                    element.style.transition = '';
                    element.style.willChange = 'auto';
                }, 300);
            }
            
            // Reset state
            swipeInitiated = false;
        }

        // Store handlers for future cleanup
        element._swipeHandlers = {
            start: handleTouchStart,
            move: handleTouchMove,
            end: handleTouchEnd
        };
        
        // Attach event listeners with appropriate passive settings
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
    },

    /**
     * Set up modal scroll indication
     */
    setupModalScroll: function() {
        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) return;

        updateScrollClasses();

        function updateScrollClasses() {
            const canScrollUp = modalBody.scrollTop > 0;
            const canScrollDown = modalBody.scrollTop < (modalBody.scrollHeight - modalBody.clientHeight - 5);

            modalBody.classList.toggle('can-scroll-up', canScrollUp);
            modalBody.classList.toggle('can-scroll-down', canScrollDown);
        }

        function handleScroll() {
            updateScrollClasses();
        }

        modalBody.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * Setup desktop navigation buttons
     */
    setupDesktopNavButtons: function(recipe) {
        // Get the next and previous buttons
        const nextBtn = document.querySelector('.modal-footer .next-btn');
        const prevBtn = document.querySelector('.modal-footer .prev-btn');
        
        if (!nextBtn || !prevBtn) return;
        
        // Remove any existing event listeners to avoid duplicates
        const newNextBtn = nextBtn.cloneNode(true);
        const newPrevBtn = prevBtn.cloneNode(true);
        
        if (nextBtn.parentNode) {
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        }
        
        if (prevBtn.parentNode) {
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        }
        
        // Add event listeners for navigation
        newNextBtn.addEventListener('click', () => this.navigateRecipes('next'));
        newPrevBtn.addEventListener('click', () => this.navigateRecipes('prev'));
        
        // Show or hide buttons based on available recipes
        const shouldShowNavButtons = AppState.filteredRecipes.length > 1;
        newNextBtn.style.display = shouldShowNavButtons ? 'block' : 'none';
        newPrevBtn.style.display = shouldShowNavButtons ? 'block' : 'none';
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners: function() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                themeToggle.title = `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`;
                themeToggle.setAttribute('aria-label', `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`);

                // Sync with mobile toggle
                const darkModeToggle = document.getElementById('darkModeToggle');
                if (darkModeToggle) {
                    darkModeToggle.checked = newTheme === 'dark';
                }
            });
        }

        // Mobile dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // Initialize state
            darkModeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';

            // Handle changes
            darkModeToggle.addEventListener('change', function() {
                const newTheme = this.checked ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);

                // Sync with main toggle
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                    themeToggle.title = `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`;
                    themeToggle.setAttribute('aria-label', `Toggle ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
                }
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search');
        const searchClear = document.getElementById('searchClear');

        if (searchInput) {
            // Debounce search input for performance
            const debouncedSearch = Utilities.debounce(function() {
                AppState.searchTerm = searchInput.value.toLowerCase();
                
                // Show/hide clear button
                if (searchClear) {
                    searchClear.style.display = AppState.searchTerm ? 'block' : 'none';
                }

                // Update recipe display
                if (window.RecipeAnimations) {
                    window.RecipeAnimations.transitionCards(() => UI.displayRecipes());
                } else {
                    UI.displayRecipes();
                }
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
        }

        // Search clear button
        if (searchClear) {
            searchClear.addEventListener('click', function() {
                if (searchInput) {
                    searchInput.value = '';
                    AppState.searchTerm = '';
                    this.style.display = 'none';

                    // Update recipe display
                    if (window.RecipeAnimations) {
                        window.RecipeAnimations.transitionCards(() => UI.displayRecipes());
                    } else {
                        UI.displayRecipes();
                    }

                    searchInput.focus();
                }
            });
        }

        // Category filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (!this.classList.contains('active')) {
                        // Update UI
                        filterButtons.forEach(btn => {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-pressed', 'false');
                        });

                        this.classList.add('active');
                        this.setAttribute('aria-pressed', 'true');

                        // Update filter state
                        AppState.currentFilter = this.dataset.category;

                        // Update recipe display
                        if (window.RecipeAnimations) {
                            window.RecipeAnimations.transitionCards(() => UI.displayRecipes());
                        } else {
                            UI.displayRecipes();
                        }
                    }
                });
            });
        }

        // Modal close button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeModal);
        }

        // Modal background click to close
        const modal = document.getElementById('recipeModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    UI.closeModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                UI.closeModal();
            }
        });

        // Print buttons
        const printBtn = document.querySelector('.print-btn');
        
        // Track if click is in progress to prevent duplicate firing
        let printClickInProgress = false;
        
        const debouncedPrint = function(e) {
            // Prevent default behaviors
            e.preventDefault();
            e.stopPropagation();
            
            // If already handling a click, ignore
            if (printClickInProgress) return;
            
            // Set flag to prevent duplicate firing
            printClickInProgress = true;
            
            // Visual feedback for the button
            if (this.classList) {
                this.classList.add('button-pressed');
            }
            
            // Trigger print with small delay
            setTimeout(() => {
                if (AppState.currentRecipe) {
                    PrintHandler.printRecipe(AppState.currentRecipe);
                }
                
                // Reset button appearance
                if (this.classList) {
                    this.classList.remove('button-pressed');
                }
                
                // Allow another click after a delay
                setTimeout(() => {
                    printClickInProgress = false;
                }, 1000);
            }, 50);
        };

        if (printBtn) {
            // Remove any existing listeners first
            printBtn.removeEventListener('click', handlePrint);
            
            // Add single event listener for all clicks
            printBtn.addEventListener('click', debouncedPrint);
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                AppState.sortMethod = this.value;

                // Sync with mobile sort buttons
                document.querySelectorAll('.mobile-sort-option').forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.sort === AppState.sortMethod);
                });

                // Update recipe display
                if (window.RecipeAnimations) {
                    window.RecipeAnimations.transitionCards(() => UI.displayRecipes());
                } else {
                    UI.displayRecipes();
                }
            });
        }

        // Mobile sort options - FIX EVENT HANDLERS
        const mobileSortOptions = document.querySelectorAll('.mobile-sort-option');
        if (mobileSortOptions.length) {
            // First remove any existing event handlers to prevent duplication
            mobileSortOptions.forEach(option => {
                const newOption = option.cloneNode(true);
                if (option.parentNode) {
                    option.parentNode.replaceChild(newOption, option);
                }
                
                // Add fresh event listener with proper scope
                newOption.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (!newOption.classList.contains('active')) {
                        // Update UI
                        mobileSortOptions.forEach(opt => opt.classList.remove('active'));
                        newOption.classList.add('active');
                        
                        // Get the sort method directly from the clicked button
                        const sortMethod = newOption.dataset.sort;
                        console.log('Mobile sort button clicked:', sortMethod);
                        
                        // Update AppState
                        AppState.sortMethod = sortMethod;
                        
                        // Sync with desktop dropdown
                        const sortSelect = document.getElementById('sort-select');
                        if (sortSelect) {
                            sortSelect.value = sortMethod;
                        }
                        
                        // Force recipe display update
                        this.displayRecipes();
                    }
                });
            });
        }

        // Handle window resize
        window.addEventListener('resize', Utilities.debounce(function() {
            const isSmallScreen = window.innerWidth <= 768;
            const wasSmallScreen = AppState.isMobile;
            AppState.isMobile = isSmallScreen;
            
            // Get UI elements
            const desktopCompactToggle = document.getElementById('desktopCompactToggle');
            const condensedViewToggle = document.getElementById('condensedViewToggle');
            const recipesContainer = document.getElementById('recipesContainer');
            
            // Only update view mode if screen size category changed (mobile <-> desktop)
            if (isSmallScreen !== wasSmallScreen) {
                // If switching TO mobile
                if (isSmallScreen) {
                    // Force compact view on mobile
                    AppState.isCondensedView = true;
                    
                    // Update the toggles
                    if (desktopCompactToggle) desktopCompactToggle.checked = true;
                    if (condensedViewToggle) condensedViewToggle.checked = true;
                    
                    // Apply the class
                    if (recipesContainer) recipesContainer.classList.add('compact-view');
                } 
                // If switching TO desktop and the user hasn't manually set the compact mode
                else if (!AppState.userChangedCompactSetting) {
                    // Default to expanded view on desktop
                    AppState.isCondensedView = false;
                    
                    // Update the toggles
                    if (desktopCompactToggle) desktopCompactToggle.checked = false;
                    if (condensedViewToggle) condensedViewToggle.checked = false;
                    
                    // Remove the class
                    if (recipesContainer) recipesContainer.classList.remove('compact-view');
                }
                
                // Add a temporary visual indicator for the mode change
                if (recipesContainer) {
                    recipesContainer.classList.add('view-mode-changed');
                    setTimeout(() => {
                        recipesContainer.classList.remove('view-mode-changed');
                    }, 500);
                }
            }
        }, 250));

        // Desktop compact view toggle
        const desktopCompactToggle = document.getElementById('desktopCompactToggle');
        const condensedViewToggle = document.getElementById('condensedViewToggle');
        const recipesContainer = document.getElementById('recipesContainer');

        if (desktopCompactToggle && recipesContainer) {
            // Initialize state
            desktopCompactToggle.checked = AppState.isCondensedView;

            // Handle changes
            desktopCompactToggle.addEventListener('change', function() {
                AppState.isCondensedView = this.checked;

                // Sync with mobile toggle
                if (condensedViewToggle) {
                    condensedViewToggle.checked = this.checked;
                }

                // Update UI
                if (this.checked) {
                    recipesContainer.classList.add('compact-view');
                } else {
                    recipesContainer.classList.remove('compact-view');
                }
            });
        }

        // Navigation buttons in modal footer - ensure they work
        document.addEventListener('click', function(e) {
            // Next button handling
            if (e.target.matches('.next-btn') || e.target.closest('.next-btn')) {
                UI.navigateRecipes('next');
            }
            
            // Previous button handling
            if (e.target.matches('.prev-btn') || e.target.closest('.prev-btn')) {
                UI.navigateRecipes('prev');
            }
        });
    }
};

// Fix for sorting functionality
function initSortingControls() {
    // Desktop sorting
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortRecipes(this.value);
        });
    }

    // Mobile sorting
    const mobileSortOptions = document.querySelectorAll('.mobile-sort-option');
    mobileSortOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            mobileSortOptions.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get sort value and trigger sort
            const sortValue = this.getAttribute('data-sort');
            
            // Update desktop dropdown to match if it exists
            if (sortSelect) {
                sortSelect.value = sortValue;
            }
            
            sortRecipes(sortValue);
        });
    });
}

// Sort recipes based on selected sort option
function sortRecipes(sortOption) {
    const container = document.getElementById('recipesContainer');
    const recipeCards = Array.from(container.querySelectorAll('.recipe-card'));
    
    if (recipeCards.length === 0) return;
    
    // Remove any loading or no results elements from the array
    const filteredCards = recipeCards.filter(card => !card.classList.contains('loading-state') && !card.classList.contains('no-results-wrapper'));
    
    filteredCards.sort((a, b) => {
        // Default sort returns to original order based on data-index
        if (sortOption === 'default') {
            return parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index'));
        }
        
        // Sort by recipe name (A-Z)
        else if (sortOption === 'alpha-asc') {
            const titleA = a.querySelector('.recipe-title').textContent.toLowerCase();
            const titleB = b.querySelector('.recipe-title').textContent.toLowerCase();
            return titleA.localeCompare(titleB);
        }
        
        // Sort by recipe name (Z-A)
        else if (sortOption === 'alpha-desc') {
            const titleA = a.querySelector('.recipe-title').textContent.toLowerCase();
            const titleB = b.querySelector('.recipe-title').textContent.toLowerCase();
            return titleB.localeCompare(titleA);
        }
        
        // Sort by author
        else if (sortOption === 'author') {
            const authorA = a.querySelector('.author').textContent.replace('By ', '').toLowerCase();
            const authorB = b.querySelector('.author').textContent.replace('By ', '').toLowerCase();
            return authorA.localeCompare(authorB);
        }
        
        // Sort by category
        else if (sortOption === 'category') {
            const categoryA = a.getAttribute('data-category').toLowerCase();
            const categoryB = b.getAttribute('data-category').toLowerCase();
            return categoryA.localeCompare(categoryB);
        }
        
        return 0;
    });
    
    // Update the DOM with sorted cards
    const loadingState = container.querySelector('#loadingState');
    const noResults = container.querySelector('#noResultsContainer');
    
    // Clear the container
    container.innerHTML = '';
    
    // Re-add the cards in sorted order
    filteredCards.forEach(card => {
        container.appendChild(card);
    });
    
    // Re-add loading and no results elements if they existed
    if (loadingState) container.appendChild(loadingState);
    if (noResults) container.appendChild(noResults);
}

// Make sure to call this function during initialization
document.addEventListener('DOMContentLoaded', function() {
    // ...existing DOMContentLoaded code...
    
    // Initialize sorting controls
    initSortingControls();
    
    // ...rest of existing code...
});

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UI.init();

    // Get the modal element
    const recipeModal = document.getElementById('recipeModal');
    const modalContent = recipeModal.querySelector('.modal-content');

    // Apply scroll fixes to modal content
    enableModalScroll(modalContent);

    // Remove duplicated modal event handling since it's now in UI.closeModal
});