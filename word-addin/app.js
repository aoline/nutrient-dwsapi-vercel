// Initialize the add-in when Office is ready
// FIXED: Simplified Office.js initialization to avoid conflicts
(function() {
    console.log('App.js loaded, checking Office.js status');
    
    function initializeAddIn() {
        console.log('Initializing WordAddIn...');
        try {
            window.wordAddIn = new WordAddIn();
            console.log('WordAddIn initialized successfully');
        } catch (error) {
            console.error('Error initializing WordAddIn:', error);
        }
    }
    
    function showAppBody() {
        console.log('Showing app body...');
        const sideloadMsg = document.getElementById('sideload-msg');
        const appBody = document.getElementById('app-body');
        
        if (sideloadMsg) {
            sideloadMsg.style.display = 'none';
            console.log('✅ Sideload message hidden');
        }
        
        if (appBody) {
            appBody.style.display = 'block';
            console.log('✅ App body shown');
        }
    }
    
    // Method 1: Office.onReady (primary method)
    if (typeof Office !== 'undefined') {
        console.log('Office.js detected, using Office.onReady');
        Office.onReady((info) => {
            console.log('Office.js loaded successfully:', info.host);
            showAppBody();
            initializeAddIn();
        });
    } else {
        console.log('Office.js not detected, will wait for it');
    }
    
    // Method 2: DOMContentLoaded fallback
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, checking Office.js status');
        
        if (typeof Office !== 'undefined') {
            console.log('Office.js available on DOMContentLoaded');
            showAppBody();
            initializeAddIn();
        } else {
            console.log('Office.js not available on DOMContentLoaded, waiting...');
            // Wait a bit more for Office.js to load
            setTimeout(() => {
                if (typeof Office !== 'undefined') {
                    console.log('Office.js loaded after timeout');
                    showAppBody();
                    initializeAddIn();
                } else {
                    console.log('Office.js still not available, showing app anyway');
                    showAppBody();
                    initializeAddIn();
                }
            }, 1000);
        }
    });
    
    // Method 3: Timeout fallback (last resort)
    setTimeout(() => {
        console.log('Timeout fallback - showing app body');
        showAppBody();
        initializeAddIn();
    }, 3000);
})();

class WordAddIn {
    constructor() {
        this.currentOperation = 'extract';
        this.uploadedPdf = null;
        this.apiBaseUrl = 'https://nutrient-dws-api.vercel.app'; // Updated to production URL
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        try {
            // Operation buttons
            const extractBtn = document.getElementById('extractText');
            const convertBtn = document.getElementById('convertToPdf');
            const watermarkBtn = document.getElementById('addWatermark');
            const ocrBtn = document.getElementById('performOcr');
            
            if (extractBtn) extractBtn.addEventListener('click', () => this.selectOperation('extract'));
            if (convertBtn) convertBtn.addEventListener('click', () => this.selectOperation('convert'));
            if (watermarkBtn) watermarkBtn.addEventListener('click', () => this.selectOperation('watermark'));
            if (ocrBtn) ocrBtn.addEventListener('click', () => this.selectOperation('ocr'));

            // File upload
            const uploadBtn = document.getElementById('uploadPdf');
            const pdfUpload = document.getElementById('pdfUpload');
            const removeBtn = document.getElementById('removeFile');
            
            if (uploadBtn) uploadBtn.addEventListener('click', () => {
                if (pdfUpload) pdfUpload.click();
            });
            if (pdfUpload) pdfUpload.addEventListener('change', (e) => this.handlePdfUpload(e));
            if (removeBtn) removeBtn.addEventListener('click', () => this.removePdfFile());

            // Process button
            const processBtn = document.getElementById('processDocument');
            if (processBtn) processBtn.addEventListener('click', () => this.processDocument());

            // Watermark options
            const opacitySlider = document.getElementById('watermarkOpacity');
            if (opacitySlider) {
                opacitySlider.addEventListener('input', (e) => {
                    const opacityValue = document.getElementById('opacityValue');
                    if (opacityValue) opacityValue.textContent = e.target.value;
                });
            }
            
            console.log('Event listeners initialized successfully');
        } catch (error) {
            console.error('Error initializing event listeners:', error);
        }
    }

    selectOperation(operation) {
        this.currentOperation = operation;
        
        // Update button states
        const buttons = document.querySelectorAll('.operation-buttons button');
        buttons.forEach(btn => {
            btn.classList.remove('ms-Button--primary');
        });
        
        // Add primary class to clicked button
        const event = window.event || {};
        if (event.target) {
            event.target.classList.add('ms-Button--primary');
        }

        // Show/hide watermark options
        const watermarkOptions = document.getElementById('watermarkOptions');
        if (watermarkOptions) {
            watermarkOptions.style.display = operation === 'watermark' ? 'block' : 'none';
        }

        this.updateProcessButton();
    }

    handlePdfUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.uploadedPdf = file;
            const fileName = document.getElementById('fileName');
            const uploadedFile = document.getElementById('uploadedFile');
            
            if (fileName) fileName.textContent = file.name;
            if (uploadedFile) uploadedFile.style.display = 'block';
            
            this.updateProcessButton();
        }
    }

    removePdfFile() {
        this.uploadedPdf = null;
        const pdfUpload = document.getElementById('pdfUpload');
        const uploadedFile = document.getElementById('uploadedFile');
        
        if (pdfUpload) pdfUpload.value = '';
        if (uploadedFile) uploadedFile.style.display = 'none';
        
        this.updateProcessButton();
    }

    updateProcessButton() {
        const processBtn = document.getElementById('processDocument');
        if (processBtn) {
            processBtn.disabled = !this.canProcess();
        }
    }

    canProcess() {
        // For operations that need a PDF file
        if (['watermark', 'ocr'].includes(this.currentOperation)) {
            return this.uploadedPdf !== null;
        }
        // For operations that work with the current document
        return true;
    }

    async processDocument() {
        if (!this.canProcess()) return;

        const processBtn = document.getElementById('processDocument');
        const progress = document.getElementById('progress');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if (processBtn) processBtn.disabled = true;
        if (progress) progress.style.display = 'block';
        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'Preparing...';

        try {
            if (this.currentOperation === 'extract') {
                await this.extractTextFromDocument();
            } else if (this.currentOperation === 'convert') {
                await this.convertDocumentToPdf();
            } else if (this.currentOperation === 'watermark') {
                await this.addWatermarkToPdf();
            } else if (this.currentOperation === 'ocr') {
                await this.performOcrOnPdf();
            }

            if (progressBar) progressBar.style.width = '100%';
            if (progressText) progressText.textContent = 'Complete!';

        } catch (error) {
            console.error('Processing error:', error);
            this.showError(error.message);
        } finally {
            if (processBtn) processBtn.disabled = false;
            setTimeout(() => {
                if (progress) progress.style.display = 'none';
            }, 2000);
        }
    }

    async extractTextFromDocument() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = '25%';
        if (progressText) progressText.textContent = 'Getting document content...';

        // Get the document content
        const documentContent = await this.getDocumentContent();
        
        if (progressBar) progressBar.style.width = '50%';
        if (progressText) progressText.textContent = 'Processing with Nutrient API...';

        // Send to API for processing
        const formData = new FormData();
        formData.append('file', new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'document.docx');
        formData.append('extractTables', 'true');
        formData.append('extractKeyValuePairs', 'false');
        formData.append('language', 'en');

        const response = await fetch(this.apiBaseUrl + '/api/extract', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        
        if (progressBar) progressBar.style.width = '75%';
        if (progressText) progressText.textContent = 'Inserting extracted text...';

        // Insert the extracted text into the document
        await this.insertTextIntoDocument(result.data.text);
        
        this.showSuccess('Text extracted and inserted successfully!');
    }

    async convertDocumentToPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = '25%';
        if (progressText) progressText.textContent = 'Getting document content...';

        const documentContent = await this.getDocumentContent();
        
        if (progressBar) progressBar.style.width = '50%';
        if (progressText) progressText.textContent = 'Converting to PDF...';

        const formData = new FormData();
        formData.append('files', new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'document.docx');
        formData.append('operation', 'convert');
        formData.append('options', JSON.stringify({
            output: { type: 'pdf' }
        }));

        const response = await fetch(this.apiBaseUrl + '/api/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (progressBar) progressBar.style.width = '75%';
        if (progressText) progressText.textContent = 'Downloading PDF...';

        const blob = await response.blob();
        this.downloadFile(blob, 'converted_document.pdf');
        
        this.showSuccess('Document converted to PDF successfully!');
    }

    async addWatermarkToPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = '25%';
        if (progressText) progressText.textContent = 'Processing PDF...';

        const formData = new FormData();
        formData.append('files', this.uploadedPdf);
        formData.append('operation', 'watermark');
        formData.append('options', JSON.stringify({
            actions: [{
                type: 'watermark',
                watermarkType: 'text',
                text: document.getElementById('watermarkText').value,
                width: 200,
                height: 50,
                rotation: 45,
                opacity: parseFloat(document.getElementById('watermarkOpacity').value),
                fontColor: '#FF0000'
            }],
            output: { type: 'pdf' }
        }));

        const response = await fetch(this.apiBaseUrl + '/api/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (progressBar) progressBar.style.width = '75%';
        if (progressText) progressText.textContent = 'Downloading watermarked PDF...';

        const blob = await response.blob();
        this.downloadFile(blob, 'watermarked_document.pdf');
        
        this.showSuccess('Watermark added successfully!');
    }

    async performOcrOnPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = '25%';
        if (progressText) progressText.textContent = 'Performing OCR...';

        const formData = new FormData();
        formData.append('files', this.uploadedPdf);
        formData.append('operation', 'ocr');
        formData.append('options', JSON.stringify({
            actions: [{
                type: 'ocr',
                language: 'en'
            }],
            output: { type: 'pdf' }
        }));

        const response = await fetch(this.apiBaseUrl + '/api/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (progressBar) progressBar.style.width = '75%';
        if (progressText) progressText.textContent = 'Downloading OCR processed PDF...';

        const blob = await response.blob();
        this.downloadFile(blob, 'ocr_processed_document.pdf');
        
        this.showSuccess('OCR processing completed successfully!');
    }

    async getDocumentContent() {
        return new Promise((resolve, reject) => {
            Office.context.document.getFileAsync(Office.FileType.Compressed, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    const file = result.value;
                    file.getSliceAsync(0, (sliceResult) => {
                        if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                            const slice = sliceResult.value;
                            const data = slice.data;
                            file.closeAsync(() => {
                                resolve(data);
                            });
                        } else {
                            reject(new Error('Failed to get document slice'));
                        }
                    });
                } else {
                    reject(new Error('Failed to get document file'));
                }
            });
        });
    }

    async insertTextIntoDocument(text) {
        return new Promise((resolve, reject) => {
            Office.context.document.setSelectedDataAsync(text, {
                coercionType: Office.CoercionType.Text
            }, (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    resolve();
                } else {
                    reject(new Error('Failed to insert text'));
                }
            });
        });
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    showSuccess(message) {
        const results = document.getElementById('results');
        results.innerHTML = `
            <div class="ms-MessageBar ms-MessageBar--success">
                <div class="ms-MessageBar-content">
                    <div class="ms-MessageBar-text">${message}</div>
                </div>
            </div>
        `;
    }

    showError(message) {
        const results = document.getElementById('results');
        results.innerHTML = `
            <div class="ms-MessageBar ms-MessageBar--error">
                <div class="ms-MessageBar-content">
                    <div class="ms-MessageBar-text">Error: ${message}</div>
                </div>
            </div>
        `;
    }
} 