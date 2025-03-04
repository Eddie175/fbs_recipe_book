/**
 * PrintHandler - Manages recipe printing functionality
 * Works with the modular CSS structure, particularly print.css
 */
const PrintHandler = {
    /**
     * Prepares a recipe for printing by creating a structured DOM element
     * @param {Object} recipe - The recipe object to be printed
     * @returns {HTMLElement} - The prepared print content element
     */
    prepareRecipeForPrint: function(recipe) {
        const printContent = document.createElement('div');
        printContent.className = 'print-content';
        printContent.setAttribute('data-print-container', 'true');
        
        printContent.innerHTML = `
            <div class="print-content-inner">
                <h1 class="recipe-title">${recipe.title}</h1>
                <div class="recipe-meta">By ${recipe.author}</div>
                
                <div class="recipe-preview">${recipe.preview || ''}</div>
                
                <div class="ingredients-section">
                    <h2 class="ingredients-title">Ingredients</h2>
                    <ul class="ingredients-list print-ingredients">
                        ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>

                <div class="instructions-section">
                    <h2 class="instructions-title">Instructions</h2>
                    <ol class="instructions-list print-instructions">
                        ${recipe.instructions.map(i => `<li>${i}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;

        return printContent;
    },

    /**
     * Triggers the print dialog for a recipe
     * @param {Object} recipe - The recipe object to print
     */
    printRecipe: function(recipe) {
        if (!recipe) return;

        // Remove any existing print content
        const existing = document.querySelector('.print-content');
        if (existing) existing.remove();

        // Create and append print content
        const printContent = this.prepareRecipeForPrint(recipe);
        document.body.appendChild(printContent);

        // Add a class to body so print.css can target it
        document.body.classList.add('printing');

        // Print after a short delay to ensure content is rendered
        setTimeout(() => {
            window.print();
            // Cleanup after printing
            setTimeout(() => {
                printContent.remove();
                document.body.classList.remove('printing');
            }, 100);
        }, 100);
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrintHandler;
}