/**
 * Print Handler
 * Manages recipe printing functionality with mobile device support
 */

const PrintHandler = {
    /**
     * Print a recipe with proper formatting
     * @param {Object} recipe - The recipe object to print
     */
    printRecipe: function(recipe) {
        if (!recipe) return;

        // Create a printing frame that will be invisible
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        
        // Add frame to document
        document.body.appendChild(printFrame);

        // Write the print template to the iframe
        const frameDoc = printFrame.contentWindow || printFrame.contentDocument.document || printFrame.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write(this.generatePrintTemplate(recipe));
        frameDoc.document.close();

        // Wait for content and images to load
        frameDoc.onload = function() {
            setTimeout(function() {
                try {
                    // iOS and Safari specific print handling
                    if (this.isIOS() || this.isSafari()) {
                        // Show the print dialog after slight delay to ensure proper loading
                        setTimeout(() => {
                            frameDoc.focus();
                            frameDoc.print();
                            // Remove iframe after printing
                            setTimeout(() => document.body.removeChild(printFrame), 500);
                        }, 250);
                    } else {
                        // Standard print handling for other browsers
                        frameDoc.focus();
                        frameDoc.print();
                        // Remove iframe after printing
                        setTimeout(() => document.body.removeChild(printFrame), 500);
                    }
                } catch (e) {
                    console.error('Printing failed:', e);
                    document.body.removeChild(printFrame);
                    
                    // Fallback for devices where iframe printing fails
                    this.printUsingWindow(recipe);
                }
            }.bind(this), 200);
        }.bind(this);
    },
    
    /**
     * Fallback print method using current window
     */
    printUsingWindow: function(recipe) {
        // Store current page content
        const originalContent = document.body.innerHTML;
        
        // Replace with print content
        document.body.innerHTML = this.generatePrintTemplate(recipe);
        
        // Print
        window.print();
        
        // Restore original content
        document.body.innerHTML = originalContent;
        
        // Re-initialize the app
        if (typeof UI !== 'undefined' && UI.init) {
            UI.init();
        }
    },

    /**
     * Generate HTML template for printing
     */
    generatePrintTemplate: function(recipe) {
        if (!recipe) return '';
        
        // Category name with proper formatting
        const getCategoryName = function(categoryCode) {
            const categories = {
                'main': 'Main Dish',
                'side': 'Side Dish',
                'dessert': 'Dessert',
                'breakfast': 'Breakfast',
                'drink': 'Drink',
                'soup': 'Soup'
            };
            return categories[categoryCode] || categoryCode;
        };

        // Format ingredients list
        const ingredientsList = recipe.ingredients.map(ingredient => 
            `<li>${ingredient}</li>`
        ).join('');
        
        // Format instructions list
        const instructionsList = recipe.instructions.map((instruction, index) => 
            `<li>${instruction}</li>`
        ).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${recipe.title} - Recipe</title>
                <style>
                    /* Print styling */
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        line-height: 1.5;
                        margin: 0;
                        padding: 15px;
                        color: #000;
                        background: #fff;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                    
                    .print-container {
                        max-width: 100%;
                    }
                    
                    h1 {
                        font-size: 24px;
                        margin-bottom: 5px;
                        page-break-after: avoid;
                    }
                    
                    .recipe-meta {
                        font-size: 16px;
                        color: #555;
                        margin-bottom: 20px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }
                    
                    .recipe-meta div {
                        margin-right: 15px;
                    }
                    
                    .preview {
                        font-style: italic;
                        border-left: 3px solid #ddd;
                        padding-left: 15px;
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    
                    h2 {
                        font-size: 18px;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                        margin-top: 25px;
                        margin-bottom: 15px;
                        page-break-after: avoid;
                    }
                    
                    ul, ol {
                        padding-left: 25px;
                        margin-bottom: 25px;
                    }
                    
                    li {
                        margin-bottom: 8px;
                    }
                    
                    @page {
                        margin: 0.5in;
                    }
                    
                    /* Mobile-specific print styles */
                    @media screen and (max-width: 768px) {
                        body {
                            padding: 10px;
                        }
                        
                        h1 {
                            font-size: 20px;
                        }
                        
                        h2 {
                            font-size: 16px;
                        }
                        
                        .recipe-meta {
                            font-size: 14px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <h1>${recipe.title}</h1>
                    <div class="recipe-meta">
                        <div class="author">By ${recipe.author}</div>
                        <div class="category">Category: ${getCategoryName(recipe.category)}</div>
                    </div>
                    
                    ${recipe.preview ? `<div class="preview">${recipe.preview}</div>` : ''}
                    
                    <h2>Ingredients</h2>
                    <ul class="ingredients-list">
                        ${ingredientsList}
                    </ul>
                    
                    <h2>Instructions</h2>
                    <ol class="instructions-list">
                        ${instructionsList}
                    </ol>
                </div>
                <script>
                    // Automatically trigger print dialog when loaded
                    window.onload = function() {
                        // Slight delay to ensure complete rendering
                        setTimeout(() => window.print(), 100);
                    };
                </script>
            </body>
            </html>
        `;
    },
    
    /**
     * Check if the current device is iOS
     */
    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    
    /**
     * Check if browser is Safari
     */
    isSafari: function() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
};

/**
 * Expose PrintHandler globally
 */
window.PrintHandler = PrintHandler;