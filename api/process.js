const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Max 5 files
  }
});

// Nutrient API configuration
const NUTRIENT_API_BASE = 'https://api.nutrient.io';
const PROCESSOR_API_KEY = process.env.NUTRIENT_PROCESSOR_API_KEY || 'pdf_live_DAsgbvjLQGC6VeUozfIRdKdDvGKBvqlnMu8KXwemPaX';
const VIEWER_API_KEY = process.env.NUTRIENT_VIEWER_API_KEY || 'pdf_live_dENEDmvS8zyeX0hio2nRFKd8eZxkgrsAAyHuvYLNBfQ';

// Helper function to call Nutrient API
async function callNutrientAPI(endpoint, instructions, files = {}) {
  const formData = new FormData();
  
  // Add instructions as JSON
  formData.append('instructions', JSON.stringify(instructions));
  
  // Add files
  for (const [key, file] of Object.entries(files)) {
    formData.append(key, file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
  }

  const response = await axios.post(`${NUTRIENT_API_BASE}/${endpoint}`, formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${PROCESSOR_API_KEY}`,
      'User-Agent': 'NutrientDWSAPIServer/1.0.0'
    },
    responseType: 'stream'
  });

  return response;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle file upload
    upload.array('files', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error', details: err.message });
      }

      const { operation, options } = req.body;
      const files = req.files || [];

      if (files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      // Prepare files for Nutrient API
      const nutrientFiles = {};
      files.forEach((file, index) => {
        const key = file.originalname || `file_${index}`;
        nutrientFiles[key] = file;
      });

      // Build instructions based on operation
      let instructions = {
        parts: files.map(file => ({
          file: file.originalname || `file_${files.indexOf(file)}`
        }))
      };

      // Add actions based on operation
      if (options && options.actions) {
        instructions.actions = options.actions;
      }

      // Add output configuration
      if (options && options.output) {
        instructions.output = options.output;
      } else {
        instructions.output = { type: 'pdf' };
      }

      // Call Nutrient API
      const endpoint = operation === 'sign' ? 'sign' : 'build';
      const response = await callNutrientAPI(endpoint, instructions, nutrientFiles);

      // Set response headers
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', response.headers['content-disposition'] || 'attachment');

      // Stream the response
      response.data.pipe(res);

    });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // Nutrient API error
      res.status(error.response.status).json({
        error: 'Nutrient API Error',
        status: error.response.status,
        message: error.response.data
      });
    } else {
      // Internal error
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
}; 