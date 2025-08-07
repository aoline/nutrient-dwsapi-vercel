/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// Initialize the add-in when Office is ready
Office.onReady((info) => {
    console.log('Office.js loaded successfully');
    
    if (info.host === Office.HostType.Word) {
        console.log('Word host detected');
        
        // Hide sideload message if it exists
        const sideloadMsg = document.getElementById('sideload-msg');
        if (sideloadMsg) {
            sideloadMsg.style.display = 'none';
        }
        
        // Show app body if it exists
        const appBody = document.getElementById('app-body');
        if (appBody) {
            appBody.style.display = 'flex';
        }
        
        // Initialize the add-in
        initializeAddIn();
        
        // Set up run button if it exists
        const runButton = document.getElementById('run');
        if (runButton) {
            runButton.onclick = run;
        }
    } else {
        console.log('Word host not detected, current host:', info.host);
    }
});

// Fallback initialization for Office.js
if (typeof Office !== 'undefined') {
    Office.onReady((info) => {
        console.log('Office.js fallback initialization');
        if (info.host === Office.HostType.Word) {
            initializeAddIn();
        }
    });
}

function initializeAddIn() {
    console.log('Nutrient.io Hello World Add-in initialized');
    
    try {
        // Set up event listeners
        const insertButton = document.getElementById('insertText');
        const infoButton = document.getElementById('getDocumentInfo');
        
        if (insertButton) {
            insertButton.addEventListener('click', insertHelloWorld);
            console.log('Insert button listener added');
        }
        
        if (infoButton) {
            infoButton.addEventListener('click', getDocumentInfo);
            console.log('Info button listener added');
        }
        
        // Update status
        updateStatus('Add-in loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error initializing add-in:', error);
        updateStatus('Error initializing add-in: ' + error.message, 'error');
    }
}

async function run() {
    return Word.run(async (context) => {
        /**
         * Insert your Word code here
         */

        // insert a paragraph at the end of the document.
        const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

        // change the paragraph color to blue.
        paragraph.font.color = "blue";

        await context.sync();
    });
}

async function insertHelloWorld() {
    try {
        updateStatus('Inserting text...', 'loading');
        
        await Word.run(async (context) => {
            // Insert "Hello World from Nutrient.io!" at the cursor position
            const range = context.document.getSelection();
            range.insertText('Hello World from Nutrient.io! 🌿', Word.InsertLocation.replace);
            
            // Apply some formatting
            range.font.color = '#28a745'; // Nutrient.io green
            range.font.bold = true;
            range.font.size = 16;
            
            await context.sync();
        });
        
        updateStatus('Text inserted successfully!', 'success');
        
    } catch (error) {
        console.error('Error inserting text:', error);
        updateStatus('Error inserting text: ' + error.message, 'error');
    }
}

async function getDocumentInfo() {
    try {
        updateStatus('Getting document info...', 'loading');
        
        await Word.run(async (context) => {
            const document = context.document;
            
            // Get document properties
            const title = document.title || 'Untitled';
            const wordCount = document.body.text.trim().split(/\s+/).length;
            const charCount = document.body.text.length;
            
            // Get current selection info
            const selection = document.getSelection();
            const selectedText = selection.text || 'No text selected';
            
            await context.sync();
            
            // Display document information
            const documentInfo = document.getElementById('documentInfo');
            if (documentInfo) {
                documentInfo.innerHTML = `
                    <p><strong>Document Title:</strong> ${title}</p>
                    <p><strong>Word Count:</strong> ${wordCount}</p>
                    <p><strong>Character Count:</strong> ${charCount}</p>
                    <p><strong>Selected Text:</strong> "${selectedText}"</p>
                    <p><strong>Add-in Version:</strong> 1.0.0</p>
                    <p><strong>Powered by:</strong> Nutrient.io</p>
                `;
            }
        });
        
        updateStatus('Document info retrieved!', 'success');
        
    } catch (error) {
        console.error('Error getting document info:', error);
        updateStatus('Error getting document info: ' + error.message, 'error');
        
        // Show fallback info
        const documentInfo = document.getElementById('documentInfo');
        if (documentInfo) {
            documentInfo.innerHTML = `
                <p><strong>Error:</strong> Could not retrieve document information</p>
                <p><strong>Add-in Version:</strong> 1.0.0</p>
                <p><strong>Powered by:</strong> Nutrient.io</p>
            `;
        }
    }
}

function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    if (!statusElement) {
        console.log('Status element not found');
        return;
    }
    
    const statusContent = statusElement.querySelector('.status-content');
    if (!statusContent) {
        console.log('Status content not found');
        return;
    }
    
    // Remove existing classes
    statusContent.className = 'status-content';
    
    // Add new class based on type
    if (type === 'success') {
        statusContent.classList.add('success');
    } else if (type === 'error') {
        statusContent.classList.add('error');
    } else if (type === 'loading') {
        statusContent.classList.add('loading');
    }
    
    // Update message
    statusContent.innerHTML = `<p>${message}</p>`;
    
    // Remove loading class after a delay
    if (type === 'loading') {
        setTimeout(() => {
            statusContent.classList.remove('loading');
        }, 2000);
    }
}

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up interactions');
    
    // Add click animation to buttons
    const buttons = document.querySelectorAll('.ms-Button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add hover effect to logo
    const logo = document.querySelector('.nutrient-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
});

// Export functions for Office.js
window.insertHelloWorld = insertHelloWorld;
window.getDocumentInfo = getDocumentInfo; 