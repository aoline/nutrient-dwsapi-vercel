class DocumentProcessor {
    constructor() {
        this.files = [];
        this.currentOperation = 'extract';
        this.apiBaseUrl = 'https://nutrient-dws-api.vercel.app';
        
        this.initializeEventListeners();
        this.updateOperationOptions();
    }

    initializeEventListeners() {
        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        dropZone.addEventListener('click', () => document.getElementById('fileInput').click());

        // Operation selection
        document.querySelectorAll('[data-operation]').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectOperation(e.target.dataset.operation));
        });

        // Output format change
        document.getElementById('outputFormat').addEventListener('change', () => this.updateOperationOptions());

        // Process and clear buttons
        document.getElementById('processBtn').addEventListener('click', () => this.processDocuments());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.addFiles(files);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        
        const files = Array.from(event.dataTransfer.files);
        this.addFiles(files);
    }

    addFiles(files) {
        files.forEach(file => {
            if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('document')) {
                this.files.push(file);
            }
        });
        this.updateFileList();
        this.updateProcessButton();
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div>
                    <i class="fas fa-file"></i>
                    <span class="ms-2">${file.name}</span>
                    <small class="text-muted ms-2">(${this.formatFileSize(file.size)})</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="app.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.updateFileList();
        this.updateProcessButton();
    }

    selectOperation(operation) {
        this.currentOperation = operation;
        
        // Update active button
        document.querySelectorAll('[data-operation]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-operation="${operation}"]`).classList.add('active');
        
        this.updateOperationOptions();
    }

    updateOperationOptions() {
        const optionsContainer = document.getElementById('operationOptions');
        const outputFormat = document.getElementById('outputFormat').value;
        
        let optionsHtml = '';
        
        switch (this.currentOperation) {
            case 'watermark':
                optionsHtml = `
                    <h6>Watermark Options</h6>
                    <div class="mb-2">
                        <label class="form-label">Text</label>
                        <input type="text" id="watermarkText" class="form-control" value="CONFIDENTIAL">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Opacity</label>
                        <input type="range" id="watermarkOpacity" class="form-range" min="0" max="1" step="0.1" value="0.7">
                        <small class="text-muted">Value: <span id="opacityValue">0.7</span></small>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Color</label>
                        <input type="color" id="watermarkColor" class="form-control" value="#FF0000">
                    </div>
                `;
                break;
                
            case 'ocr':
                optionsHtml = `
                    <h6>OCR Options</h6>
                    <div class="mb-2">
                        <label class="form-label">Language</label>
                        <select id="ocrLanguage" class="form-select">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'sign':
                optionsHtml = `
                    <h6>Signature Options</h6>
                    <div class="mb-2">
                        <label class="form-label">Signer Name</label>
                        <input type="text" id="signerName" class="form-control" value="Test User">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Reason</label>
                        <input type="text" id="signatureReason" class="form-control" value="Approval">
                    </div>
                `;
                break;
                
            case 'redact':
                optionsHtml = `
                    <h6>Redaction Options</h6>
                    <div class="mb-2">
                        <label class="form-label">Preset</label>
                        <select id="redactionPreset" class="form-select">
                            <option value="credit-card-number">Credit Card Numbers</option>
                            <option value="email-address">Email Addresses</option>
                            <option value="social-security-number">Social Security Numbers</option>
                            <option value="phone-number">Phone Numbers</option>
                        </select>
                    </div>
                `;
                break;
        }
        
        optionsContainer.innerHTML = optionsHtml;
        
        // Add event listeners for dynamic elements
        if (this.currentOperation === 'watermark') {
            document.getElementById('watermarkOpacity').addEventListener('input', (e) => {
                document.getElementById('opacityValue').textContent = e.target.value;
            });
        }
    }

    updateProcessButton() {
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = this.files.length === 0;
    }

    async processDocuments() {
        if (this.files.length === 0) return;

        const processBtn = document.getElementById('processBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        processBtn.disabled = true;
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = 'Preparing...';

        try {
            const formData = new FormData();
            
            // Add files
            this.files.forEach(file => {
                formData.append('files', file);
            });

            // Add operation and options
            formData.append('operation', this.currentOperation);
            formData.append('extractTables', options.extractTables || 'false');
            formData.append('extractKeyValuePairs', options.extractKeyValuePairs || 'false');
            
            const options = this.buildOptions();
            formData.append('options', JSON.stringify(options));

            progressBar.style.width = '25%';
            progressText.textContent = 'Uploading files...';

            // Determine endpoint
            const endpoint = '/api/upload';
            
            const response = await fetch(this.apiBaseUrl + endpoint, {
                method: 'POST',
                body: formData
            });

            progressBar.style.width = '75%';
            progressText.textContent = 'Processing...';

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            progressBar.style.width = '100%';
            progressText.textContent = 'Complete!';

            // Handle response based on content type
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                this.displayResults(result);
            } else {
                // Binary file response
                const blob = await response.blob();
                this.downloadFile(blob, `processed_${Date.now()}.${this.getFileExtension()}`);
            }

        } catch (error) {
            console.error('Processing error:', error);
            this.displayError(error.message);
        } finally {
            processBtn.disabled = false;
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 2000);
        }
    }

    buildOptions() {
        const outputFormat = document.getElementById('outputFormat').value;
        const options = {
            output: { type: outputFormat }
        };

        switch (this.currentOperation) {
            case 'watermark':
                options.actions = [{
                    type: 'watermark',
                    watermarkType: 'text',
                    text: document.getElementById('watermarkText')?.value || 'CONFIDENTIAL',
                    width: 200,
                    height: 50,
                    rotation: 45,
                    opacity: parseFloat(document.getElementById('watermarkOpacity')?.value || 0.7),
                    fontColor: document.getElementById('watermarkColor')?.value || '#FF0000'
                }];
                break;

            case 'ocr':
                options.actions = [{
                    type: 'ocr',
                    language: document.getElementById('ocrLanguage')?.value || 'en'
                }];
                break;

            case 'redact':
                options.actions = [
                    {
                        type: 'createRedactions',
                        strategy: 'preset',
                        strategyOptions: {
                            preset: document.getElementById('redactionPreset')?.value || 'credit-card-number',
                            includeAnnotations: true
                        }
                    },
                    {
                        type: 'applyRedactions'
                    }
                ];
                break;

            case 'extract':
                options.extractTables = true;
                options.extractKeyValuePairs = false;
                options.language = 'en';
                break;
        }

        return options;
    }

    displayResults(result) {
        const resultsContainer = document.getElementById('results');
        
        if (result.success) {
            if (result.data && result.data.text) {
                resultsContainer.innerHTML = `
                    <div class="alert alert-success">
                        <h6>Extracted Text:</h6>
                        <pre class="bg-light p-3 rounded">${result.data.text}</pre>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = `
                    <div class="alert alert-success">
                        <h6>Processing Complete!</h6>
                        <p>Document processed successfully.</p>
                    </div>
                `;
            }
        } else {
            this.displayError(result.error || 'Unknown error occurred');
        }
    }

    displayError(message) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
            <div class="alert alert-danger">
                <h6>Error:</h6>
                <p>${message}</p>
            </div>
        `;
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

        this.displayResults({ success: true });
    }

    getFileExtension() {
        const outputFormat = document.getElementById('outputFormat').value;
        switch (outputFormat) {
            case 'pdf': return 'pdf';
            case 'docx': return 'docx';
            case 'image': return 'png';
            case 'json-content': return 'json';
            default: return 'pdf';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearAll() {
        this.files = [];
        this.updateFileList();
        this.updateProcessButton();
        document.getElementById('results').innerHTML = '<p class="text-muted">Results will appear here after processing...</p>';
    }
}

// Initialize the application
const app = new DocumentProcessor(); 