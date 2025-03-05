/**
 * Print Handler
 * Manages recipe printing functionality with mobile device support
 */

const PrintHandler = {
    // Track if a print job is already in progress
    isPrintingInProgress: false,
    
    /**
     * Print a recipe with proper formatting
     * @param {Object} recipe - The recipe object to print
     */
    printRecipe: function(recipe) {
        if (!recipe) return;
        
        // Prevent multiple simultaneous print attempts
        if (this.isPrintingInProgress) {
            console.log('Print already in progress, ignoring request');
            return;
        }
        
        this.isPrintingInProgress = true;
        
        // Show visual feedback that printing is starting
        this.showPrintingFeedback();
        
        // Detect browser environment to use appropriate print method
        if (this.isChromeOnIOS()) {
            // Special handling for Chrome on iOS
            this.printWithIOSChromeApproach(recipe);
        } else if (this.isChromeOnMobile()) {
            // Use direct approach for Chrome on other mobile platforms
            this.printWithDirectApproach(recipe);
        } else {
            // Use isolated frame for other browsers
            this.printWithIsolatedFrame(recipe);
        }
        
        // Reset the printing flag after a timeout (in case something goes wrong)
        setTimeout(() => {
            this.isPrintingInProgress = false;
        }, 5000);
    },

    /**
     * Show feedback to user that printing is starting
     */
    showPrintingFeedback: function() {
        // Create or get toast container
        let toastContainer = document.getElementById('print-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'print-toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '20px';
            toastContainer.style.left = '50%';
            toastContainer.style.transform = 'translateX(-50%)';
            toastContainer.style.zIndex = '10000';
            document.body.appendChild(toastContainer);
        }

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'print-toast';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '20px';
        toast.style.marginBottom = '10px';
        toast.style.textAlign = 'center';
        toast.style.width = '200px';
        toast.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        toast.style.animation = 'fadeIn 0.3s ease-out forwards';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.justifyContent = 'center';
        toast.style.fontWeight = '500';
        toast.style.fontSize = '14px';

        // Create spinner + text
        toast.innerHTML = `
            <div style="margin-right: 8px; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); 
                border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite;"></div>
            Opening Print Dialog...
        `;

        // Add animation keyframes
        if (!document.getElementById('print-toast-style')) {
            const style = document.createElement('style');
            style.id = 'print-toast-style';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        toastContainer.appendChild(toast);

        // Remove after 6 seconds (in case print dialog never appears)
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Print using a completely isolated iframe that won't affect the original DOM
     * This works well for desktop and Safari on iOS
     */
    printWithIsolatedFrame: function(recipe) {
        // First, clean up any existing print frames
        this.cleanupPrintFrames();
        
        // Create a printing frame with complete DOM isolation
        const printFrame = document.createElement('iframe');
        printFrame.id = 'isolated-print-frame-' + Date.now(); // Unique ID to avoid conflicts
        
        // Make the frame invisible but ensure it remains functional
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        printFrame.style.zIndex = '-9999';
        printFrame.style.opacity = '0';
        printFrame.style.pointerEvents = 'none';
        
        // Add frame to document in a way that ensures isolation
        document.body.appendChild(printFrame);

        try {
            // Write the print template to the iframe's isolated document
            const frameDoc = printFrame.contentWindow || printFrame.contentDocument.document || printFrame.contentDocument;
            frameDoc.document.open();
            frameDoc.document.write(this.generatePrintTemplate(recipe));
            frameDoc.document.close();
            
            // Clean up after printing
            const handlePrintComplete = () => {
                setTimeout(() => {
                    this.isPrintingInProgress = false;
                    this.cleanupPrintFrames();
                }, 500);
                
                // Remove afterprint listener
                try {
                    frameDoc.removeEventListener('afterprint', handlePrintComplete);
                } catch(e) {}
            };
            
            // Set timeout based on device
            const timeout = this.isIOS() ? 800 : 300;
            
            // Listen for print completion in the iframe
            frameDoc.addEventListener('afterprint', handlePrintComplete);
            
            // Trigger print after content has loaded
            setTimeout(() => {
                try {
                    if (this.isIOS()) {
                        printFrame.contentWindow.focus();
                    }
                    
                    // Trigger print in the isolated frame only
                    printFrame.contentWindow.print();
                } catch (e) {
                    console.error('Print failed:', e);
                    this.isPrintingInProgress = false;
                    this.cleanupPrintFrames();
                }
            }, timeout);
            
            // Safety cleanup timeout
            setTimeout(() => {
                this.isPrintingInProgress = false;
                this.cleanupPrintFrames();
            }, 10000);
        } catch (error) {
            console.error("Error in print preparation:", error);
            this.isPrintingInProgress = false;
            this.cleanupPrintFrames();
        }
    },

    /**
     * Print using a direct approach that works better for Chrome on mobile
     * This creates a temporary visible div that Chrome can print
     */
    printWithDirectApproach: function(recipe) {
        // Create a container to hold the print content
        let printContainer = document.getElementById('mobile-chrome-print-container');
        if (!printContainer) {
            printContainer = document.createElement('div');
            printContainer.id = 'mobile-chrome-print-container';
            printContainer.className = 'print-content';
            
            // Position it absolutely but make it visible
            printContainer.style.position = 'fixed';
            printContainer.style.top = '0';
            printContainer.style.left = '0';
            printContainer.style.width = '100%';
            printContainer.style.height = '100%';
            printContainer.style.backgroundColor = '#ffffff';
            printContainer.style.zIndex = '9999';
            printContainer.style.overflow = 'auto';
            printContainer.style.padding = '20px';
            printContainer.style.boxSizing = 'border-box';
            
            document.body.appendChild(printContainer);
        } else {
            printContainer.innerHTML = '';
        }
        
        // Create print inner container
        const printContentInner = document.createElement('div');
        printContentInner.className = 'print-content-inner';
        printContainer.appendChild(printContentInner);
        
        // Add recipe title
        const recipeTitle = document.createElement('h1');
        recipeTitle.className = 'recipe-title';
        recipeTitle.textContent = recipe.title;
        printContentInner.appendChild(recipeTitle);
        
        // Add recipe meta
        const recipeMeta = document.createElement('div');
        recipeMeta.className = 'recipe-meta';
        recipeMeta.innerHTML = `<span>By ${recipe.author}</span> • <span>${this.getCategoryName(recipe.category)}</span>`;
        printContentInner.appendChild(recipeMeta);
        
        // Add recipe preview if present
        if (recipe.preview) {
            const recipePreview = document.createElement('div');
            recipePreview.className = 'recipe-preview';
            recipePreview.textContent = recipe.preview;
            printContentInner.appendChild(recipePreview);
        }
        
        // Add ingredients section
        const ingredientsTitle = document.createElement('h2');
        ingredientsTitle.className = 'ingredients-title';
        ingredientsTitle.textContent = 'Ingredients';
        printContentInner.appendChild(ingredientsTitle);
        
        const ingredientsList = document.createElement('ul');
        ingredientsList.className = 'ingredients-list';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        printContentInner.appendChild(ingredientsList);
        
        // Add instructions section
        const instructionsTitle = document.createElement('h2');
        instructionsTitle.className = 'instructions-title';
        instructionsTitle.textContent = 'Instructions';
        printContentInner.appendChild(instructionsTitle);
        
        const instructionsList = document.createElement('ol');
        instructionsList.className = 'instructions-list';
        recipe.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
        printContentInner.appendChild(instructionsList);
        
        // Add close button for user to exit if print fails
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕ Close';
        closeButton.style.position = 'fixed';
        closeButton.style.bottom = '20px';
        closeButton.style.right = '20px';
        closeButton.style.padding = '10px 15px';
        closeButton.style.backgroundColor = '#ff4444';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '10000';
        closeButton.onclick = () => {
            this.cleanupDirectPrint();
        };
        printContainer.appendChild(closeButton);
        
        // Add print instructions for Chrome
        const printInstructions = document.createElement('div');
        printInstructions.style.position = 'fixed';
        printInstructions.style.top = '10px';
        printInstructions.style.right = '10px';
        printInstructions.style.backgroundColor = 'rgba(0,0,0,0.7)';
        printInstructions.style.color = 'white';
        printInstructions.style.padding = '10px';
        printInstructions.style.borderRadius = '5px';
        printInstructions.style.fontSize = '14px';
        printInstructions.style.zIndex = '10000';
        printInstructions.style.maxWidth = '200px';
        printInstructions.textContent = 'Tap the three dots in Chrome, then select "Share" and "Print"';
        printContainer.appendChild(printInstructions);
        
        // Try automatic printing after a delay for compatible browsers
        setTimeout(() => {
            try {
                window.print();
                
                // Some browsers will wait until print is done or canceled
                // For others, we'll provide a timeout
                setTimeout(() => {
                    this.cleanupDirectPrint();
                }, 5000);
            } catch (e) {
                console.log('Auto-print failed, waiting for manual print', e);
                // Keep the view open for manual printing
            }
        }, 1000);
    },
    
    /**
     * Clean up direct print view
     */
    cleanupDirectPrint: function() {
        const printContainer = document.getElementById('mobile-chrome-print-container');
        if (printContainer) {
            document.body.removeChild(printContainer);
        }
        this.isPrintingInProgress = false;
    },
    
    /**
     * Clean up any existing print frames
     */
    cleanupPrintFrames: function() {
        const existingFrames = document.querySelectorAll('iframe[id^="isolated-print-frame-"]');
        existingFrames.forEach(frame => {
            try {
                document.body.removeChild(frame);
            } catch (e) {
                // Ignore errors
            }
        });
    },

    /**
     * Generate HTML template for printing - completely self-contained
     */
    generatePrintTemplate: function(recipe) {
        if (!recipe) return '';
        
        // Format ingredients list
        const ingredientsList = recipe.ingredients.map(ingredient => 
            `<li>${ingredient}</li>`
        ).join('');
        
        // Format instructions list
        const instructionsList = recipe.instructions.map((instruction, index) => 
            `<li>${instruction}</li>`
        ).join('');

        // Device-specific meta tags
        const deviceMeta = this.isIOS() ? 
            `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
             <meta name="apple-mobile-web-app-capable" content="yes">
             <meta name="apple-mobile-web-app-status-bar-style" content="black">` : '';

        // Generate a completely standalone HTML document for printing
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                ${deviceMeta}
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${recipe.title} - Recipe</title>
                <style>
                    /* Base print styling */
                    * {
                        box-sizing: border-box;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        line-height: 1.5;
                        margin: 0;
                        padding: 15px;
                        color: #000;
                        background: #fff;
                        width: 100%;
                        font-size: 12pt;
                    }
                    
                    @media print {
                        body {
                            padding: 0;
                            width: 100%;
                            margin: 0;
                        }
                    }
                    
                    .print-container {
                        max-width: 100%;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                    }
                    
                    h1 {
                        font-size: 18pt;
                        margin-bottom: 5px;
                        page-break-after: avoid;
                    }
                    
                    .recipe-meta {
                        font-size: 12pt;
                        color: #555;
                        margin-bottom: 20px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        page-break-inside: avoid;
                    }
                    
                    .recipe-meta div {
                        margin-right: 15px;
                        page-break-inside: avoid;
                    }
                    
                    .preview {
                        font-style: italic;
                        border-left: 3px solid #ddd;
                        padding-left: 15px;
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    
                    h2.section-header {
                        font-size: 16pt;
                        color: #000;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                        margin-top: 25px;
                        margin-bottom: 20px;
                        page-break-after: avoid;
                        page-break-inside: avoid;
                        font-weight: bold;
                        padding: 10px;
                        background-color: #f8f8f8;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    ul, ol {
                        padding-left: 25px;
                        margin-bottom: 25px;
                        page-break-before: avoid;
                    }
                    
                    li {
                        margin-bottom: 10px;
                        page-break-inside: avoid;
                        font-size: 11pt;
                    }
                    
                    @page {
                        margin: 0.5in;
                        size: auto;
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <h1>${recipe.title}</h1>
                    <div class="recipe-meta">
                        <div class="author">By ${recipe.author}</div>
                        <div class="category">Category: ${this.getCategoryName(recipe.category)}</div>
                    </div>
                    
                    ${recipe.preview ? `<div class="preview">${recipe.preview}</div>` : ''}
                    
                    <h2 class="section-header">Ingredients</h2>
                    <ul class="ingredients-list">
                        ${ingredientsList}
                    </ul>
                    
                    <h2 class="section-header">Instructions</h2>
                    <ol class="instructions-list">
                        ${instructionsList}
                    </ol>
                </div>
            </body>
            </html>
        `;
    },
    
    /**
     * Get category name from code
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
     * Check if the current device is iOS
     */
    isIOS: function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    
    /**
     * Check if the current device is Android
     */
    isAndroid: function() {
        return /android/i.test(navigator.userAgent);
    },
    
    /**
     * Check if browser is Safari
     */
    isSafari: function() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    
    /**
     * Check if browser is Chrome
     */
    isChrome: function() {
        return /chrome|chromium|crios/i.test(navigator.userAgent);
    },
    
    /**
     * Check specifically for Chrome on mobile devices
     */
    isChromeOnMobile: function() {
        return (this.isChrome() && (this.isIOS() || this.isAndroid()));
    },

    /**
     * Check specifically for Chrome on iOS devices
     */
    isChromeOnIOS: function() {
        return this.isChrome() && this.isIOS() && 
               // Additional check for CriOS (Chrome iOS)
               (/CriOS/i.test(navigator.userAgent) || /FxiOS/i.test(navigator.userAgent));
    },

    /**
     * Special print handler for Chrome on iOS
     * iOS Chrome requires different handling due to its unique print dialog behavior
     */
    printWithIOSChromeApproach: function(recipe) {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        if (!printWindow) {
            // If popup blocked, fall back to direct approach
            console.log('Popup blocked, using fallback approach');
            this.printWithDirectApproach(recipe);
            return;
        }
        
        // Store category name to avoid 'this' context issues in template literal
        const categoryName = this.getCategoryName(recipe.category);
        
        // Ultra simple black text on white background
        const ultraSimpleContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${recipe.title} - Print</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 16px;
                        color: black;
                        background: white;
                        line-height: 1.4;
                    }
                    h1, h2 {
                        margin-top: 20px;
                        margin-bottom: 10px;
                    }
                    ul, ol {
                        padding-left: 25px;
                        margin-bottom: 20px;
                    }
                    li {
                        margin-bottom: 8px;
                    }
                    .info {
                        margin-bottom: 16px;
                    }
                    .print-message {
                        position: fixed;
                        bottom: 20px;
                        left: 0;
                        right: 0;
                        text-align: center;
                        background: #f0f0f0;
                        padding: 10px;
                        border-top: 1px solid #ccc;
                    }
                    .close-button {
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        padding: 5px 10px;
                        background: #f0f0f0;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                    @media print {
                        .print-message, .close-button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <button class="close-button" onclick="window.close()">Close</button>
                
                <div class="print-message">
                    Use the Share icon → Print option to print this recipe
                </div>
                
                <h1>${recipe.title}</h1>
                
                <div class="info">
                    By: ${recipe.author}<br>
                    Category: ${categoryName}
                </div>
                
                ${recipe.preview ? '<p>' + recipe.preview + '</p>' : ''}
                
                <h2>Ingredients</h2>
                <ul>
                    ${recipe.ingredients.map(function(ingredient) { 
                        return '<li>' + ingredient + '</li>';
                    }).join('')}
                </ul>
                
                <h2>Instructions</h2>
                <ol>
                    ${recipe.instructions.map(function(instruction) {
                        return '<li>' + instruction + '</li>';
                    }).join('')}
                </ol>
                
                <script>
                    // Auto-close the window if user comes back to this tab without printing
                    window.addEventListener('blur', function() {
                        setTimeout(function() {
                            if (document.hidden) {
                                window.close();
                            }
                        }, 5000);
                    });
                </script>
            </body>
            </html>
        `;
        
        // Write the content to the new window
        printWindow.document.open();
        printWindow.document.write(ultraSimpleContent);
        printWindow.document.close();
        
        // Reset the printing flag after a timeout
        setTimeout(() => {
            this.isPrintingInProgress = false;
        }, 5000);
    },

    /**
     * Show error toast message
     */
    showErrorToast: function(message) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(255, 68, 68, 0.9)';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '20px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        toast.style.zIndex = '10000';
        toast.style.textAlign = 'center';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
};

/**
 * Expose PrintHandler globally
 */
window.PrintHandler = PrintHandler;