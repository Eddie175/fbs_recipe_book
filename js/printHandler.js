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
        
        // Complete isolation - use a dedicated print method that doesn't affect the DOM
        this.printWithIsolatedFrame(recipe);
        
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
     * This is the key to preventing the ingredients header from disappearing
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
            const timeout = this.isIOS() ? 800 : (this.isAndroid() ? 400 : 200);
            
            // Listen for print completion in the iframe
            frameDoc.addEventListener('afterprint', handlePrintComplete);
            
            // Trigger print after content has loaded
            const printTimeout = setTimeout(() => {
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
            const cleanupTimeout = setTimeout(() => {
                this.isPrintingInProgress = false;
                this.cleanupPrintFrames();
                clearTimeout(printTimeout);
            }, 10000);
        } catch (error) {
            console.error("Error in print preparation:", error);
            this.isPrintingInProgress = false;
            this.cleanupPrintFrames();
        }
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
                        <div class="category">Category: ${getCategoryName(recipe.category)}</div>
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
    }
};

/**
 * Expose PrintHandler globally
 */
window.PrintHandler = PrintHandler;