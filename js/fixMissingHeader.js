/**
 * Fix for missing ingredients header and buttons
 * This script ensures the ingredients header and buttons are properly displayed
 */

(function() {
  // Initialize immediately
  let headerFixInitialized = false;
  
  function initHeaderFix() {
    if (headerFixInitialized) return;
    headerFixInitialized = true;
    
    // Run on page load
    document.addEventListener('DOMContentLoaded', function() {
      setupHeaderFixing();
      
      // Also check periodically in case the modal content changes
      setInterval(verifyIngredientsHeader, 300);
    });
    
    // Monitor for DOM changes to catch when the modal is opened
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          // If modal body content has changed, check for header
          if (document.querySelector('.modal-body')) {
            verifyIngredientsHeader();
          }
        }
      });
    });
    
    // Start observing after DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      // Start observing the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  function setupHeaderFixing() {
    // Watch for when the modal is opened by monitoring display style changes
    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
      // Create a mutation observer to watch for display changes
      const modalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            if (recipeModal.style.display === 'flex' || recipeModal.classList.contains('show')) {
              // Modal was opened, check for ingredients header
              setTimeout(verifyIngredientsHeader, 50);
            }
          }
        });
      });
      
      // Watch for attribute changes on the modal
      modalObserver.observe(recipeModal, { 
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    // Override UI.openRecipeModal to check for ingredients header after modal opens
    if (window.UI && UI.openRecipeModal) {
      const originalOpenRecipeModal = UI.openRecipeModal;
      UI.openRecipeModal = function(recipe) {
        originalOpenRecipeModal.call(this, recipe);
        // Check for ingredients header after a slight delay to ensure modal content is rendered
        setTimeout(verifyIngredientsHeader, 50);
      };
    }

    // Override PrintHandler to check for headers after printing
    if (window.PrintHandler && PrintHandler.printRecipe) {
      const originalPrintRecipe = PrintHandler.printRecipe;
      PrintHandler.printRecipe = function(recipe) {
        // Call original function
        originalPrintRecipe.call(this, recipe);
        
        // Check for headers after printing is complete
        setTimeout(verifyIngredientsHeader, 500);
      };
    }
  }
  
  // Verify ingredients header exists and fix if missing
  function verifyIngredientsHeader() {
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) return;
    
    // Only proceed if we're in an open modal
    const modal = document.getElementById('recipeModal');
    if (!modal || (modal.style.display !== 'flex' && !modal.classList.contains('show'))) {
      return;
    }
    
    // If the currentRecipe is not available, we can't proceed
    if (!window.AppState || !AppState.currentRecipe) {
      console.error('Cannot fix ingredients header: no current recipe');
      return;
    }
    
    // First check if ingredients list exists
    const ingredientsList = modalBody.querySelector('.ingredients-list');
    
    // Check if ingredients title container exists
    let ingredientsTitleContainer = modalBody.querySelector('.ingredients-title-container');
    
    if (!ingredientsTitleContainer && ingredientsList) {
      console.log('Ingredients title container missing - restoring');
      
      // Create new header
      ingredientsTitleContainer = document.createElement('div');
      ingredientsTitleContainer.className = 'ingredients-title-container';
      
      const ingredientsTitle = document.createElement('h3');
      ingredientsTitle.className = 'ingredients-title';
      ingredientsTitle.textContent = 'Ingredients';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'modal-action-buttons';
      
      // Create copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-ingredients-btn';
      copyBtn.setAttribute('aria-label', 'Copy ingredients to clipboard');
      copyBtn.setAttribute('title', 'Copy ingredients');
      copyBtn.textContent = 'Copy';
      
      // Create print button
      const printBtn = document.createElement('button');
      printBtn.className = 'mobile-print-btn';
      printBtn.setAttribute('aria-label', 'Print recipe');
      printBtn.textContent = '🖨️';
      
      // Add event listeners to buttons
      copyBtn.addEventListener('click', function() {
        if (AppState && AppState.currentRecipe) {
          const ingredientsText = AppState.currentRecipe.ingredients.join('\n');
          navigator.clipboard.writeText(ingredientsText)
            .then(() => {
              // Show a temporary tooltip or feedback
              const tooltip = document.querySelector('.copy-tooltip');
              if (tooltip) {
                tooltip.textContent = 'Copied!';
                tooltip.classList.add('show');
                setTimeout(() => {
                  tooltip.classList.remove('show');
                  setTimeout(() => tooltip.textContent = 'Copy ingredients', 300);
                }, 1500);
              }
            })
            .catch(err => console.error('Failed to copy ingredients:', err));
        }
      });
      
      printBtn.addEventListener('click', function() {
        if (AppState && AppState.currentRecipe) {
          PrintHandler.printRecipe(AppState.currentRecipe);
        }
      });
      
      // Assemble header
      buttonContainer.appendChild(copyBtn);
      buttonContainer.appendChild(printBtn);
      ingredientsTitleContainer.appendChild(ingredientsTitle);
      ingredientsTitleContainer.appendChild(buttonContainer);
      
      // Insert at correct position - before ingredients list
      modalBody.insertBefore(ingredientsTitleContainer, ingredientsList);
    }
    
    // If no ingredients list exists, we need to add both the header and the list
    if (!ingredientsList && AppState.currentRecipe) {
      console.log('Full ingredients section missing - restoring');
      
      // Create ingredients title container
      if (!ingredientsTitleContainer) {
        ingredientsTitleContainer = document.createElement('div');
        ingredientsTitleContainer.className = 'ingredients-title-container';
        
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.className = 'ingredients-title';
        ingredientsTitle.textContent = 'Ingredients';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-action-buttons';
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-ingredients-btn';
        copyBtn.setAttribute('aria-label', 'Copy ingredients to clipboard');
        copyBtn.setAttribute('title', 'Copy ingredients');
        copyBtn.textContent = 'Copy';
        
        // Create print button
        const printBtn = document.createElement('button');
        printBtn.className = 'mobile-print-btn';
        printBtn.setAttribute('aria-label', 'Print recipe');
        printBtn.textContent = '🖨️';
        
        // Add event listeners as before
        copyBtn.addEventListener('click', function() {
          if (AppState && AppState.currentRecipe) {
            const ingredientsText = AppState.currentRecipe.ingredients.join('\n');
            navigator.clipboard.writeText(ingredientsText);
          }
        });
        
        printBtn.addEventListener('click', function() {
          if (AppState && AppState.currentRecipe) {
            PrintHandler.printRecipe(AppState.currentRecipe);
          }
        });
        
        // Assemble header
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(printBtn);
        ingredientsTitleContainer.appendChild(ingredientsTitle);
        ingredientsTitleContainer.appendChild(buttonContainer);
        
        // Find insertion point - after preview or at top
        const previewContainer = modalBody.querySelector('.recipe-preview-container');
        if (previewContainer) {
          modalBody.insertBefore(ingredientsTitleContainer, previewContainer.nextSibling);
        } else {
          modalBody.insertBefore(ingredientsTitleContainer, modalBody.firstChild);
        }
      }
      
      // Create ingredients list
      const newIngredientsList = document.createElement('ul');
      newIngredientsList.className = 'ingredients-list';
      
      AppState.currentRecipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        newIngredientsList.appendChild(li);
      });
      
      // Insert list after the title container
      modalBody.insertBefore(newIngredientsList, ingredientsTitleContainer.nextSibling);
      
      // Also check if we need to add instructions
      const instructionsTitle = modalBody.querySelector('.instructions-title');
      const instructionsList = modalBody.querySelector('.instructions-list');
      
      // If no instructions title exists, add it
      if (!instructionsTitle) {
        const newInstructionsTitle = document.createElement('h3');
        newInstructionsTitle.className = 'instructions-title';
        newInstructionsTitle.textContent = 'Instructions';
        modalBody.appendChild(newInstructionsTitle);
      }
      
      // If no instructions list exists, add it
      if (!instructionsList && AppState.currentRecipe) {
        const newInstructionsList = document.createElement('ol');
        newInstructionsList.className = 'instructions-list';
        
        AppState.currentRecipe.instructions.forEach(instruction => {
          const li = document.createElement('li');
          li.textContent = instruction;
          newInstructionsList.appendChild(li);
        });
        
        modalBody.appendChild(newInstructionsList);
      }
    }
    
    // Always verify buttons exist in the ingredients title container
    if (ingredientsTitleContainer) {
      const actionButtons = ingredientsTitleContainer.querySelector('.modal-action-buttons');
      if (!actionButtons || actionButtons.children.length < 2) {
        console.log('Action buttons missing - restoring');
        
        // Remove existing buttons container if it exists but is incomplete
        if (actionButtons) {
          actionButtons.remove();
        }
        
        // Create new buttons container
        const newButtonContainer = document.createElement('div');
        newButtonContainer.className = 'modal-action-buttons';
        
        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-ingredients-btn';
        copyBtn.setAttribute('aria-label', 'Copy ingredients to clipboard');
        copyBtn.textContent = 'Copy';
        
        // Print button
        const printBtn = document.createElement('button');
        printBtn.className = 'mobile-print-btn';
        printBtn.setAttribute('aria-label', 'Print recipe');
        printBtn.textContent = '🖨️';
        
        // Add event listeners
        copyBtn.addEventListener('click', function() {
          if (AppState && AppState.currentRecipe) {
            const ingredientsText = AppState.currentRecipe.ingredients.join('\n');
            navigator.clipboard.writeText(ingredientsText);
          }
        });
        
        printBtn.addEventListener('click', function() {
          if (AppState && AppState.currentRecipe) {
            PrintHandler.printRecipe(AppState.currentRecipe);
          }
        });
        
        // Add buttons to container
        newButtonContainer.appendChild(copyBtn);
        newButtonContainer.appendChild(printBtn);
        
        // Add container to header
        ingredientsTitleContainer.appendChild(newButtonContainer);
      }
    }
  }

  // Initialize the fix
  initHeaderFix();
})();
