Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        document.getElementById('sideload-msg').style.display = 'none';
        document.getElementById('app-body').style.display = 'block';
        
        // Initialize the add-in
        initializeAddIn();
    }
});

class WordAddIn {
    constructor() {
        this.currentOperation = 'extract';
        this.uploadedPdf = null;
        this.apiBaseUrl = 'https://nutrient-dws-api.vercel.app'; // Updated to production URL
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Operation buttons
        document.getElementById('extractText').addEventListener('click', () => this.selectOperation('extract'));
        document.getElementById('convertToPdf').addEventListener('click', () => this.selectOperation('convert'));
        document.getElementById('addWatermark').addEventListener('click', () => this.selectOperation('watermark'));
        document.getElementById('performOcr').addEventListener('click', () => this.selectOperation('ocr'));

        // File upload
        document.getElementById('uploadPdf').addEventListener('click', () => document.getElementById('pdfUpload').click());
        document.getElementById('pdfUpload').addEventListener('change', (e) => this.handlePdfUpload(e));
        document.getElementById('removeFile').addEventListener('click', () => this.removePdfFile());

        // Process button
        document.getElementById('processDocument').addEventListener('click', () => this.processDocument());

        // Watermark options
        document.getElementById('watermarkOpacity').addEventListener('input', (e) => {
            document.getElementById('opacityValue').textContent = e.target.value;
        });
    }

    selectOperation(operation) {
        this.currentOperation = operation;
        
        // Update button states
        document.querySelectorAll('.operation-buttons button').forEach(btn => {
            btn.classList.remove('ms-Button--primary');
        });
        event.target.classList.add('ms-Button--primary');

        // Show/hide watermark options
        const watermarkOptions = document.getElementById('watermarkOptions');
        watermarkOptions.style.display = operation === 'watermark' ? 'block' : 'none';

        this.updateProcessButton();
    }

    handlePdfUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.uploadedPdf = file;
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('uploadedFile').style.display = 'block';
            this.updateProcessButton();
        }
    }

    removePdfFile() {
        this.uploadedPdf = null;
        document.getElementById('pdfUpload').value = '';
        document.getElementById('uploadedFile').style.display = 'none';
        this.updateProcessButton();
    }

    updateProcessButton() {
        const processBtn = document.getElementById('processDocument');
        processBtn.disabled = !this.canProcess();
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

        processBtn.disabled = true;
        progress.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = 'Preparing...';

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

            progressBar.style.width = '100%';
            progressText.textContent = 'Complete!';

        } catch (error) {
            console.error('Processing error:', error);
            this.showError(error.message);
        } finally {
            processBtn.disabled = false;
            setTimeout(() => {
                progress.style.display = 'none';
            }, 2000);
        }
    }

    async extractTextFromDocument() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = '25%';
        progressText.textContent = 'Getting document content...';

        // Get the document content
        const documentContent = await this.getDocumentContent();
        
        progressBar.style.width = '50%';
        progressText.textContent = 'Processing with Nutrient API...';

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
        
        progressBar.style.width = '75%';
        progressText.textContent = 'Inserting extracted text...';

        // Insert the extracted text into the document
        await this.insertTextIntoDocument(result.data.text);
        
        this.showSuccess('Text extracted and inserted successfully!');
    }

    async convertDocumentToPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = '25%';
        progressText.textContent = 'Getting document content...';

        const documentContent = await this.getDocumentContent();
        
        progressBar.style.width = '50%';
        progressText.textContent = 'Converting to PDF...';

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

        progressBar.style.width = '75%';
        progressText.textContent = 'Downloading PDF...';

        const blob = await response.blob();
        this.downloadFile(blob, 'converted_document.pdf');
        
        this.showSuccess('Document converted to PDF successfully!');
    }

    async addWatermarkToPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = '25%';
        progressText.textContent = 'Processing PDF...';

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

        progressBar.style.width = '75%';
        progressText.textContent = 'Downloading watermarked PDF...';

        const blob = await response.blob();
        this.downloadFile(blob, 'watermarked_document.pdf');
        
        this.showSuccess('Watermark added successfully!');
    }

    async performOcrOnPdf() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = '25%';
        progressText.textContent = 'Performing OCR...';

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

        progressBar.style.width = '75%';
        progressText.textContent = 'Downloading OCR processed PDF...';

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

function initializeAddIn() {
    window.wordAddIn = new WordAddIn();
} 