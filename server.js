const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for Office.js
app.use(cors({
    origin: ['https://appsforoffice.microsoft.com', 'https://localhost:3001', 'http://localhost:3001'],
    credentials: true
}));

// Serve static files from word-addin directory
app.use('/word-addin', express.static(path.join(__dirname, 'word-addin')));

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from root for other files
app.use(express.static(__dirname));

// API routes (if needed)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Local development server running' });
});

// Serve the main add-in page
app.get('/word-addin', (req, res) => {
    res.sendFile(path.join(__dirname, 'word-addin', 'index.html'));
});

// Serve the manifest
app.get('/word-addin/manifest.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(__dirname, 'word-addin', 'manifest.xml'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'word-addin', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Local development server running at:`);
    console.log(`   📍 http://localhost:${PORT}`);
    console.log(`   📍 https://localhost:${PORT} (if using HTTPS)`);
    console.log(`   📁 Word Add-in: http://localhost:${PORT}/word-addin/`);
    console.log(`   📄 Manifest: http://localhost:${PORT}/word-addin/manifest.xml`);
    console.log(`\n🔧 To test the add-in:`);
    console.log(`   1. Update your manifest to use: http://localhost:${PORT}/word-addin/`);
    console.log(`   2. Sideload the manifest in Word`);
    console.log(`   3. Open the add-in from Word`);
}); 