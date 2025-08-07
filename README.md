# Nutrient DWS API Integration Project

A comprehensive system for integrating with the Nutrient Document Web Service (DWS) API, including testing, deployment, UI, and Word Add-in functionality.

## Project Overview

This project provides:
1. **Unit Tests** - Comprehensive testing for API functionality
2. **Vercel Backend Server** - Serverless API endpoints for document processing
3. **Web UI** - Interactive interface for testing document operations
4. **Word Add-in** - Microsoft Word integration for document processing

## Architecture

```
nutrient-dwsapi-vercel/
├── api/                    # Vercel serverless functions
│   ├── process.js         # Main document processing endpoint
│   └── extract.js         # Text extraction endpoint
├── tests/                 # Test suite
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── fixtures/         # Test files
├── public/               # Web UI
│   ├── index.html        # Main UI
│   └── js/app.js         # UI logic
├── word-addin/           # Word Add-in
│   ├── manifest.xml      # Add-in manifest
│   ├── index.html        # Add-in UI
│   └── app.js           # Add-in logic
├── package.json          # Dependencies
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## Setup Instructions

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Set environment variables
export NUTRIENT_PROCESSOR_API_KEY="pdf_live_DAsgbvjLQGC6VeUozfIRdKdDvGKBvqlnMu8KXwemPaX"
export NUTRIENT_VIEWER_API_KEY="pdf_live_dENEDmvS8zyeX0hio2nRFKd8eZxkgrsAAyHuvYLNBfQ"
```

### 2. Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### 3. Local Development

```bash
# Start Vercel development server
npm run dev

# The server will be available at http://localhost:3000
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add NUTRIENT_PROCESSOR_API_KEY
vercel env add NUTRIENT_VIEWER_API_KEY
```

## API Endpoints

### POST /api/process
Main document processing endpoint.

**Request:**
- `files`: Array of files to process
- `operation`: Operation type (extract, convert, watermark, ocr, sign, redact)
- `options`: Processing options (JSON)

**Response:**
- Binary file or JSON response based on operation

### POST /api/extract
Text extraction endpoint.

**Request:**
- `file`: Single file to extract text from
- `extractTables`: Boolean (optional)
- `extractKeyValuePairs`: Boolean (optional)
- `language`: String (optional, default: 'en')

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "tables": [...],
    "keyValuePairs": {...}
  }
}
```

## Test Files

The project includes test files:
- `Default.pdf` - Sample PDF for testing
- `Invoice.docx` - Sample DOCX for testing

## Word Add-in Setup

### 1. Development Setup

```bash
# Navigate to word-addin directory
cd word-addin

# Update manifest.xml with your domain
# Replace "your-vercel-domain.vercel.app" with actual domain
```

### 2. Sideloading the Add-in

1. Open Word
2. Go to Insert > Add-ins > My Add-ins
3. Choose "Upload My Add-in"
4. Select the manifest.xml file
5. The add-in will appear in the ribbon

### 3. Add-in Features

- **Extract Text**: Extract text from current document
- **Convert to PDF**: Convert current document to PDF
- **Add Watermark**: Add watermark to uploaded PDF
- **OCR Processing**: Perform OCR on uploaded PDF

## Testing Strategy

### Unit Tests
- API function testing
- Error handling
- Input validation

### Integration Tests
- Nutrient API integration
- File upload/processing
- Response handling

### Manual Testing
- Web UI functionality
- Word Add-in operations
- Cross-browser compatibility

## Security Considerations

1. **API Key Protection**: Environment variables for sensitive keys
2. **File Upload Limits**: 50MB file size limit
3. **CORS Configuration**: Proper CORS headers
4. **Input Validation**: File type and size validation

## Performance Optimization

1. **Streaming Responses**: Large file streaming
2. **Memory Management**: Efficient file handling
3. **Caching**: Response caching where appropriate
4. **Error Handling**: Graceful error recovery

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify environment variables are set
   - Check API key validity

2. **File Upload Failures**
   - Check file size limits
   - Verify file format support

3. **Word Add-in Issues**
   - Ensure manifest.xml is properly configured
   - Check domain permissions

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the Nutrient DWS API documentation 