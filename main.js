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
    isMobile: window.innerWidth <= 768
};

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
        modalBody.innerHTML = '';

        // Create ingredients title container with copy button
        const ingredientsTitleContainer = document.createElement('div');
        ingredientsTitleContainer.className = 'ingredients-title-container';

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.className = 'ingredients-title';
        ingredientsTitle.textContent = 'Ingredients';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-ingredients-btn';
        copyBtn.setAttribute('aria-label', 'Copy ingredients to clipboard');
        copyBtn.setAttribute('title', 'Copy ingredients');
        copyBtn.textContent = 'Copy';

        const printBtn = document.createElement('button');
        printBtn.className = 'mobile-print-btn';
        printBtn.setAttribute('aria-label', 'Print recipe');
        printBtn.textContent = '🖨️';
        printBtn.onclick = () => PrintHandler.printRecipe(AppState.currentRecipe);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-action-buttons';
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(printBtn);

        ingredientsTitleContainer.appendChild(ingredientsTitle);
        ingredientsTitleContainer.appendChild(buttonContainer);
        modalBody.appendChild(ingredientsTitleContainer);

        // Add tooltip for copy function
        const tooltip = document.createElement('span');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Copy ingredients';
        modalBody.appendChild(tooltip);

        // Create ingredients list
        const ingredientsList = document.createElement('ul');
        ingredientsList.className = 'ingredients-list';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        modalBody.appendChild(ingredientsList);

        // Create instructions section
        const instructionsTitle = document.createElement('h3');
        instructionsTitle.className = 'instructions-title';
        instructionsTitle.textContent = 'Instructions';
        modalBody.appendChild(instructionsTitle);

        const instructionsList = document.createElement('ol');
        instructionsList.className = 'instructions-list';
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        modalBody.appendChild(instructionsList);

        // Set up copy ingredients functionality
        copyBtn.addEventListener('click', () => {
            const ingredientsText = recipe.ingredients.join('\n');
            navigator.clipboard.writeText(ingredientsText).then(() => {
                tooltip.classList.add('show');
                tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => tooltip.textContent = 'Copy ingredients', 300);
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                tooltip.classList.add('show');
                tooltip.textContent = 'Copy failed!';
                setTimeout(() => tooltip.classList.remove('show'), 1500);
            });
        });
    }
};

// UI controller
const UI = {
    /**
     * Initialize the UI
     */
    init: function() {
        this.displayRecipes();
        this.updateCategoryCounters();
        this.setupEventListeners();
        this.createMobileFilterButton();
        this.setupMobileFilters();
        this.setupCondensedView();
        this.checkMobileView();

        // Set up navigation buttons
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateRecipes('next'));
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateRecipes('prev'));
    },

    /**
     * Check if we're in mobile view and set appropriate defaults
     */
    checkMobileView: function() {
        if (AppState.isMobile) {
            const condensedViewToggle = document.getElementById('condensedViewToggle');
            if (condensedViewToggle) {
                condensedViewToggle.checked = true;
                AppState.isCondensedView = true;
                document.getElementById('recipesContainer').classList.add('compact-view');
            }
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

        if (!modal || !modalTitle || !modalAuthor || !modalBody) return;

        // Set modal content
        modalTitle.textContent = recipe.title;
        modalAuthor.textContent = `By ${recipe.author}`;
        DOMManager.buildRecipeModalContent(recipe, modalBody);

        // Show modal with animation if available
        if (window.RecipeAnimations) {
            window.RecipeAnimations.animateModalOpen(modal, modal.querySelector('.modal-content'));
        } else {
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }

        // Setup swipe navigation for touch devices
        this.setupSwipeNavigation(modal.querySelector('.modal-content'));

        // Focus close button for accessibility
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) setTimeout(() => closeBtn.focus(), 100);

        // Setup modal scroll indication
        this.setupModalScroll();
    },

    /**
     * Close the recipe modal
     */
    closeModal: function() {
        const modal = document.getElementById('recipeModal');
        if (!modal) return;

        // Reset swipe hint state for next modal open
        localStorage.removeItem('swipeHintShown');

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
    },

    /**
     * Navigate between recipes in the modal
     */
    navigateRecipes: function(direction) {
        if (!AppState.currentRecipe) return;

        const currentIndex = recipes.findIndex(r => 
            r.title === AppState.currentRecipe.title && 
            r.author === AppState.currentRecipe.author
        );
        
        if (currentIndex === -1) return;

        // Calculate new index with wrap-around
        const newIndex = direction === 'next' 
            ? (currentIndex + 1) % recipes.length 
            : (currentIndex - 1 + recipes.length) % recipes.length;

        const modal = document.getElementById('recipeModal');
        const content = modal.querySelector('.modal-content');

        // Animate transition
        if (direction === 'next') {
            window.RecipeAnimations.onNextRecipe = () => this.openRecipeModal(recipes[newIndex]);
            window.RecipeAnimations.animateNextRecipe(modal, content);
        } else {
            window.RecipeAnimations.onPrevRecipe = () => this.openRecipeModal(recipes[newIndex]);
            window.RecipeAnimations.animatePrevRecipe(modal, content);
        }
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
        const panelCloseBtn = document.querySelector('.panel-close-btn');

        if (mobileFilterPanel) {
            // Setup close button
            if (panelCloseBtn) {
                panelCloseBtn.addEventListener('click', function() {
                    mobileFilterPanel.classList.remove('show');
                });
            }

            // Close panel when clicking outside
            document.addEventListener('click', function(e) {
                const mobileFilterBtn = document.getElementById('mobileFilterBtn');
                if (mobileFilterPanel.classList.contains('show') && 
                    !mobileFilterPanel.contains(e.target) && 
                    e.target !== mobileFilterBtn && 
                    !mobileFilterBtn.contains(e.target)) {
                    mobileFilterPanel.classList.remove('show');
                }
            });
        }
    },

    /**
     * Set up condensed view toggle
     */
    setupCondensedView: function() {
        const condensedViewToggle = document.getElementById('condensedViewToggle');
        const recipesContainer = document.getElementById('recipesContainer');

        if (condensedViewToggle && recipesContainer) {
            // Initialize state from toggle
            if (condensedViewToggle.checked) {
                recipesContainer.classList.add('compact-view');
                AppState.isCondensedView = true;
            }

            // Update on change
            condensedViewToggle.addEventListener('change', function() {
                AppState.isCondensedView = this.checked;

                if (this.checked) {
                    recipesContainer.classList.add('compact-view');
                } else {
                    recipesContainer.classList.remove('compact-view');
                }
            });
        }
    },

    /**
     * Set up touch swipe navigation for mobile
     */
    setupSwipeNavigation: function(element) {
        if (!element) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const leftIndicator = document.querySelector('.touch-indicator-left');
        const rightIndicator = document.querySelector('.touch-indicator-right');

        // Capture touch start position
        element.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        // Show directional indicator during swipe
        element.addEventListener('touchmove', function(e) {
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;

            if (diff > 50 && leftIndicator) {
                leftIndicator.classList.add('show');
                if (rightIndicator) rightIndicator.classList.remove('show');
            } else if (diff < -50 && rightIndicator) {
                rightIndicator.classList.add('show');
                if (leftIndicator) leftIndicator.classList.remove('show');
            } else {
                if (leftIndicator) leftIndicator.classList.remove('show');
                if (rightIndicator) rightIndicator.classList.remove('show');
            }
        }, { passive: true });

        // Handle swipe completion
        element.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;

            // Hide indicators
            if (leftIndicator) leftIndicator.classList.remove('show');
            if (rightIndicator) rightIndicator.classList.remove('show');

            // Calculate swipe distance and direction
            const diff = touchEndX - touchStartX;

            // Navigate if swipe distance exceeds threshold
            if (Math.abs(diff) > 100) {
                UI.navigateRecipes(diff > 0 ? 'prev' : 'next');
            }
        }, { passive: true });
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
        const mobilePrintBtn = document.querySelector('.mobile-print-btn');
        
        const handlePrint = function(e) {
            e.preventDefault();
            if (AppState.currentRecipe) {
                PrintHandler.printRecipe(AppState.currentRecipe);
            }
        };

        if (printBtn) {
            printBtn.addEventListener('click', handlePrint);
        }
        
        if (mobilePrintBtn) {
            mobilePrintBtn.addEventListener('click', handlePrint);
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

        // Mobile sort options
        const mobileSortOptions = document.querySelectorAll('.mobile-sort-option');
        if (mobileSortOptions.length) {
            mobileSortOptions.forEach(option => {
                option.addEventListener('click', function() {
                    if (!this.classList.contains('active')) {
                        // Update UI
                        mobileSortOptions.forEach(opt => opt.classList.remove('active'));
                        this.classList.add('active');

                        // Update sort state
                        AppState.sortMethod = this.dataset.sort;

                        // Sync with desktop dropdown
                        if (sortSelect) {
                            sortSelect.value = AppState.sortMethod;
                        }

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

        // Handle window resize
        window.addEventListener('resize', Utilities.debounce(function() {
            const isSmallScreen = window.innerWidth <= 768;
            AppState.isMobile = isSmallScreen;
            const condensedViewToggle = document.getElementById('condensedViewToggle');

            // Force compact view on mobile
            if (isSmallScreen && condensedViewToggle && !condensedViewToggle.checked) {
                condensedViewToggle.checked = true;
                document.getElementById('recipesContainer').classList.add('compact-view');
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
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UI.init();
});