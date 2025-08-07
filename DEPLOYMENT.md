# Deployment Guide

## Phase 1: Unit Tests Implementation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Step 3: Verify Test Results
- All unit tests should pass
- Integration tests should connect to Nutrient API successfully
- Test files (Default.pdf, Invoice.docx) should be processed correctly

## Phase 2: Vercel Backend Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Configure Environment Variables
```bash
# Set environment variables
vercel env add NUTRIENT_PROCESSOR_API_KEY
# Enter: pdf_live_DAsgbvjLQGC6VeUozfIRdKdDvGKBvqlnMu8KXwemPaX

vercel env add NUTRIENT_VIEWER_API_KEY
# Enter: pdf_live_dENEDmvS8zyeX0hio2nRFKd8eZxkgrsAAyHuvYLNBfQ
```

### Step 4: Deploy to Vercel
```bash
vercel --prod
```

### Step 5: Verify Deployment
- Check Vercel dashboard for deployment status
- Test API endpoints:
  ```bash
  # Test process endpoint
  curl -X POST https://your-domain.vercel.app/api/process \
    -F "files=@Default.pdf" \
    -F "operation=extract" \
    -F "options={\"output\":{\"type\":\"json-content\"}}"

  # Test extract endpoint
  curl -X POST https://your-domain.vercel.app/api/extract \
    -F "file=@Default.pdf" \
    -F "extractTables=true"
  ```

## Phase 3: Web UI Deployment

### Step 1: Update API Base URL
Edit `public/js/app.js`:
```javascript
this.apiBaseUrl = 'https://your-vercel-domain.vercel.app';
```

### Step 2: Deploy UI
The UI is automatically deployed with the Vercel backend.

### Step 3: Test UI Functionality
1. Navigate to `https://your-domain.vercel.app`
2. Upload test files (Default.pdf, Invoice.docx)
3. Test each operation:
   - Extract text
   - Convert format
   - Add watermark
   - OCR processing
   - Digital signing
   - Redaction

## Phase 4: Word Add-in Setup

### Step 1: Update Add-in Configuration
Edit `word-addin/manifest.xml`:
```xml
<AppDomains>
  <AppDomain>https://your-vercel-domain.vercel.app</AppDomain>
</AppDomains>
```

Edit `word-addin/app.js`:
```javascript
this.apiBaseUrl = 'https://your-vercel-domain.vercel.app';
```

### Step 2: Host Add-in Files
Deploy add-in files to a web server or use GitHub Pages:
```bash
# Create a new repository for the add-in
git init
git add word-addin/
git commit -m "Initial add-in files"
git remote add origin https://github.com/your-username/nutrient-word-addin.git
git push -u origin main
```

### Step 3: Update Manifest URLs
Update `word-addin/manifest.xml` with your hosting URLs:
```xml
<SourceLocation DefaultValue="https://your-username.github.io/nutrient-word-addin/index.html"/>
<bt:Url id="Taskpane.Url" DefaultValue="https://your-username.github.io/nutrient-word-addin/index.html" />
```

### Step 4: Sideload Add-in in Word
1. Open Microsoft Word
2. Go to Insert > Add-ins > My Add-ins
3. Choose "Upload My Add-in"
4. Select the `manifest.xml` file
5. The add-in will appear in the ribbon

### Step 5: Test Add-in Functionality
1. Open a Word document
2. Click "Process Document" in the ribbon
3. Test each operation:
   - Extract text from document
   - Convert document to PDF
   - Upload PDF and add watermark
   - Perform OCR on uploaded PDF

## Verification Checklist

### Backend API
- [ ] All endpoints respond correctly
- [ ] File upload works (up to 50MB)
- [ ] CORS headers are set properly
- [ ] Error handling works correctly
- [ ] API keys are properly configured

### Web UI
- [ ] File upload and drag-drop works
- [ ] All operations execute successfully
- [ ] Progress indicators work
- [ ] Results display correctly
- [ ] Error messages are clear

### Word Add-in
- [ ] Add-in loads without errors
- [ ] All buttons are functional
- [ ] Document operations work
- [ ] File upload works
- [ ] Results are handled correctly

### Integration
- [ ] Web UI connects to backend API
- [ ] Word Add-in connects to backend API
- [ ] Test files process correctly
- [ ] All operations return expected results

## Troubleshooting

### Common Deployment Issues

1. **Environment Variables Not Set**
   ```bash
   # Check environment variables
   vercel env ls
   
   # Re-add if missing
   vercel env add NUTRIENT_PROCESSOR_API_KEY
   ```

2. **CORS Errors**
   - Verify CORS headers in API responses
   - Check domain configuration in add-in manifest

3. **File Upload Failures**
   - Check file size limits
   - Verify file format support
   - Check network connectivity

4. **API Key Errors**
   - Verify API keys are valid
   - Check API key permissions
   - Test with curl commands

### Debug Commands

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Test API locally
npm run dev

# Run tests
npm test
```

## Performance Monitoring

### Vercel Analytics
- Monitor API response times
- Check error rates
- Track usage patterns

### API Monitoring
- Set up alerts for API failures
- Monitor Nutrient API usage
- Track file processing times

## Security Review

- [ ] API keys are in environment variables
- [ ] File upload validation is working
- [ ] CORS is properly configured
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS is enforced

## Final Deployment Checklist

- [ ] All tests pass
- [ ] Backend deployed to Vercel
- [ ] Web UI is functional
- [ ] Word Add-in is sideloaded
- [ ] All integrations work
- [ ] Documentation is updated
- [ ] Security review completed
- [ ] Performance monitoring enabled 