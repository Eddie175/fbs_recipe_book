const PrintHandler = {
    prepareRecipeForPrint: function(recipe) {
        const printContent = document.createElement('div');
        printContent.className = 'print-content';
        printContent.style.display = 'block'; // Ensure visibility
        
        printContent.innerHTML = `
            <div class="print-content-inner">
                <h1 class="recipe-title">${recipe.title}</h1>
                <div class="recipe-meta">By ${recipe.author}</div>
                
                <div class="recipe-preview">${recipe.preview}</div>
                
                <h2>Ingredients</h2>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>

                <h2>Instructions</h2>
                <ol class="instructions-list">
                    ${recipe.instructions.map(i => `<li>${i}</li>`).join('')}
                </ol>
            </div>
        `;

        return printContent;
    },

    printRecipe: function(recipe) {
        if (!recipe) return;

        // Remove any existing print content
        const existing = document.querySelector('.print-content');
        if (existing) existing.remove();

        // Create and append print content
        const printContent = this.prepareRecipeForPrint(recipe);
        document.body.appendChild(printContent);

        // Print after a short delay to ensure content is rendered
        setTimeout(() => {
            window.print();
            // Cleanup after printing
            setTimeout(() => printContent.remove(), 100);
        }, 100);
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrintHandler;
}
