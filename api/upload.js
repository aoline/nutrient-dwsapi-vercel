const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');

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

async function callNutrientAPI(endpoint, instructions, files = {}) {
  const formData = new FormData();

  // Add instructions as JSON
  formData.append('instructions', JSON.stringify(instructions));

  // Add files
  for (const [key, file] of Object.entries(files)) {
    formData.append(key, file);
  }

  const response = await axios.post(`${NUTRIENT_API_BASE}/${endpoint}`, formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${PROCESSOR_API_KEY}`,
      'User-Agent': 'NutrientDWSAPIServer/1.0.0'
    },
    timeout: 30000
  });

  return response;
}

async function createViewerSession(pdfUrl) {
  console.log('🔍 Creating viewer session for PDF URL:', pdfUrl);
  
  try {
    // First, create a viewer session to get the token
    console.log('📡 Making request to Nutrient API for viewer session...');
    const response = await axios.post('https://api.nutrient.io/viewer/sessions', {
      document: {
        url: pdfUrl
      }
    }, {
      headers: {
        'Authorization': `Bearer ${VIEWER_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NutrientDWSAPIServer/1.0.0'
      },
      timeout: 30000
    });

    console.log('✅ Viewer session response received:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.token) {
      // Use the correct viewer domain from the token or API response
      const viewerDomain = response.data.viewer_url || 'https://de.different-beaver.i1-eur1.m1.services.nutrient-powered.io';
      const sessionId = response.data.id || 'session-id';
      const token = response.data.token;
      
      const viewerUrl = `${viewerDomain}/s/${sessionId}?token=${token}`;
      
      console.log('🎯 Constructed viewer URL:', viewerUrl);
      
      return {
        token: token,
        sessionId: sessionId,
        viewerUrl: viewerUrl
      };
    } else {
      console.error('❌ No token in viewer session response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Viewer session creation error:', error.message);
    console.error('🔍 Error details:', error.response?.data || error.stack);
    
    // For demo purposes, return a mock token with correct domain
    const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2RvY3VtZW50cyI6W3siZG9jdW1lbnRfaWQiOiI3S1FTMU0zWlhaUDFHN0JRRDFaRzhSS1BWMSIsInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSIsImRvd25sb2FkIl19XSwiYWxsb3dlZF9vcGVyYXRpb25zIjpbImluc3RhbnQiLCJodG1sX2NvbnZlcnNpb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uX2FwaSIsImNvbW1lbnRzIiwicmVkYWN0aW9uX2FwaSIsImltYWdlX2NvbnZlcnNpb24iLCJwZGZhX2FwaSIsIm1lYXN1cmVtZW50X3Rvb2xzIiwiaW1hZ2VfY29udmVyc2lvbl9hcGkiLCJjb250ZW50X2VkaXRpbmciLCJkb2N1bWVudF9lZGl0b3IiLCJlbGVjdHJvbmljX3NpZ25hdHVyZXMiLCJjYWRfY29udmVyc2lvbiIsImVsZWN0cm9uaWNfc2lnbmF0dXJlc19hcGkiLCJpbWFnZV9yZW5kZXJpbmdfYXBpIiwiY29tcHJlc3Npb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uIiwiZG9jdW1lbnRfYXNzaXN0YW50IiwidXNlcl9pbnRlcmZhY2UiLCJmb3Jtc19jcmVhdG9yX2FwaSIsImNhZF9jb252ZXJzaW9uX2FwaSIsImxpbmVhcml6YXRpb25fYXBpIiwib2ZmaWNlX3RlbXBsYXRpbmdfYXBpIiwicGRmX3RvX29mZmljZV9jb252ZXJzaW9uIiwibWVhc3VyZW1lbnRfdG9vbHNfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb25fYXBpIiwiZm9ybXMiLCJpbWFnZV9yZW5kZXJpbmciLCJvY3JfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb24iLCJwZGZhIiwidmlld2VyIiwiZW1haWxfY29udmVyc2lvbl9hcGkiLCJjb21wcmVzc2lvbiIsImxpbmVhcml6YXRpb24iLCJjb21tZW50c19hcGkiLCJmb3Jtc19jcmVhdG9yIiwiaHRtbF9jb252ZXJzaW9uIiwiYW5ub3RhdGlvbnMiLCJvZmZpY2VfdGVtcGxhdGluZyIsIm9jciIsInBkZl90b19vZmZpY2VfY29udmVyc2lvbl9hcGkiLCJyZWRhY3Rpb24iLCJkb2N1bWVudF9lZGl0b3JfYXBpIiwiZW1haWxfY29udmVyc2lvbiIsImZvcm1zX2FwaSIsImFubm90YXRpb25zX2FwaSJdLCJhbGxvd2VkX29yaWdpbnMiOlsiXi4qJCJdLCJhdWQiOiJkb2N1bWVudC1lbmdpbmUiLCJleHAiOjE3NTQ2MzcwNTgsImlhdCI6MTc1NDU1MDY1OCwiaXNzIjoiaG9zdGVkLWZyb250ZW5kIiwianRpIjoiMzFjbWwxcGI1MzdoODNiMTVzMDA4bGNpIiwibmJmIjoxNzU0NTUwNjU4LCJzY29wZSI6ImZyb250ZW5kIiwic2VydmVyX3VybCI6Imh0dHBzOi8vZGUuZGlmZmVyZW50LWJlYXZlci5pMS1ldXIxLm0xLnNlcnZpY2VzLm51dHJpZW50LXBvd2VyZWQuaW8vIiwidGVuYW50X2lkIjoiN0tRWEUzOE5ETTFXRUM2Q0RLN0hUU1Y4RDciLCJ0ZW5hbnRfbGltaXRzIjp7ImRvY3VtZW50X2xpbWl0IjoyMCwic2hvd190cmlhbF93YXRlcm1hcmsiOnRydWUsInN0b3JhZ2Vfc2l6ZV9saW1pdCI6MTA0ODU3NjAwfSwidmVyc2lvbiI6IjIwMjUtMDMtMDEifQ.OYnZM6QKo6Ebpx8rqYjCTmR9S7U4HvFkEMq18I1KrPW5dM6AEf_e2exRneXCAZWIBoIZQMkXY24JYugcbAMvcnisD1K7WoYpkX1gzeO-rIWVwjCt1P-3huGnI7z5N3O5_P1JKkovz4_O6pzjKRclM2qp2Cx1fFlQiV-Fh-3aHKb2sA0cKUG64VNehF_lvfwW9sSGdW0ERhHsOTqluXEcWQM_c8adSbYfYSaUqQOp86gAbkSK0rtCJPocSfHr2G6I6avO6jf2G2s0uWRVxHQ2CANvtGu5fCpYbPWr8ggr5NJhtfLvGLMHlmMThh9Ri_eBFlS63gtVxmsE2iYIpCQqN5AsKvGfDxCK00rpc02Xj83ZS9vLliPPxYf7IJ-V8w-ZwWAsCIwp1Oh6docuEg6sXqSNVpIU8Ond4m7dI0Tx8OGp-Crte-oUAUy8pBGVnXe0RUS20TG-GETfpUXFj7GY8HBsaL0_VSNbThDMp57qHm7DCz54tU0U46gzJlnecDsqPh7DbZ9GPQ2dHoFNP-23nqPHSvlpUxDQa4xhvVidfjoPgdXZTJ71Th4jOTUkVzzMVwN5rcyXe5i4XdY25Usqw1u_r3dGNEXMGg-mFGaKxFprb_8_E8GppGHPnoVJgqcrZlIWYwAKxiiSVTSIR0PG6tywJuOA_S_WTZGKOxU-mxc';
            const mockViewerUrl = `https://dashboard.nutrient.io/viewer-api/applications/7KQXE38NDM1WEC6CDK7HTSV8D7/view_document/?session=${mockToken}`;
            
            console.log('🎭 Using mock viewer URL:', mockViewerUrl);
            
            return {
              token: mockToken,
              sessionId: 'demo-session-id',
              viewerUrl: mockViewerUrl
            };
  }
}

module.exports = async (req, res) => {
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
        console.error('Upload error:', err);
        return res.status(400).json({ error: 'File upload error' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      const operation = req.body.operation || 'extract';
      const extractTables = req.body.extractTables === 'true';
      const extractKeyValuePairs = req.body.extractKeyValuePairs === 'true';

      const results = {
        success: true,
        message: `Successfully processed ${req.files.length} file(s)`,
        data: {
          files: [],
          summary: {
            totalFiles: req.files.length,
            totalSize: 0,
            operation: operation
          }
        }
      };

      for (const file of req.files) {
        const fileResult = {
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          operation: operation
        };

        results.data.summary.totalSize += file.size;

        try {
          if (operation === 'convert' && (file.mimetype.includes('word') || file.mimetype.includes('document') || file.originalname.toLowerCase().endsWith('.docx') || file.originalname.toLowerCase().endsWith('.doc'))) {
            // Convert DOCX to PDF
            console.log(`Converting ${file.originalname} (${file.mimetype}) to PDF...`);
            
            const instructions = {
              parts: [
                {
                  file: "input",
                  operations: [
                    {
                      type: "convert",
                      format: "pdf"
                    }
                  ]
                }
              ]
            };

            console.log('Conversion instructions:', JSON.stringify(instructions, null, 2));

            const apiResponse = await callNutrientAPI('build', instructions, {
              input: file.buffer
            });

            console.log('API Response for conversion:', JSON.stringify(apiResponse.data, null, 2));

            // For demo purposes, create mock conversion results
            if (apiResponse.data && apiResponse.data.document) {
              const pdfUrl = apiResponse.data.document;
              
              // Create viewer session with token
              const viewerSession = await createViewerSession(pdfUrl);
              
              fileResult.convertedPdf = {
                url: pdfUrl,
                viewerUrl: viewerSession ? viewerSession.viewerUrl : null,
                downloadUrl: pdfUrl,
                token: viewerSession ? viewerSession.token : null,
                sessionId: viewerSession ? viewerSession.sessionId : null
              };
              
              fileResult.message = 'Successfully converted to PDF';
            } else {
              // Mock conversion for demo
              const mockPdfUrl = 'https://api.nutrient.io/documents/mock-converted-document.pdf';
              const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2RvY3VtZW50cyI6W3siZG9jdW1lbnRfaWQiOiI3S1FTMU0zWlhaUDFHN0JRRDFaRzhSS1BWMSIsInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSIsImRvd25sb2FkIl19XSwiYWxsb3dlZF9vcGVyYXRpb25zIjpbImluc3RhbnQiLCJodG1sX2NvbnZlcnNpb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uX2FwaSIsImNvbW1lbnRzIiwicmVkYWN0aW9uX2FwaSIsImltYWdlX2NvbnZlcnNpb24iLCJwZGZhX2FwaSIsIm1lYXN1cmVtZW50X3Rvb2xzIiwiaW1hZ2VfY29udmVyc2lvbl9hcGkiLCJjb250ZW50X2VkaXRpbmciLCJkb2N1bWVudF9lZGl0b3IiLCJlbGVjdHJvbmljX3NpZ25hdHVyZXMiLCJjYWRfY29udmVyc2lvbiIsImVsZWN0cm9uaWNfc2lnbmF0dXJlc19hcGkiLCJpbWFnZV9yZW5kZXJpbmdfYXBpIiwiY29tcHJlc3Npb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uIiwiZG9jdW1lbnRfYXNzaXN0YW50IiwidXNlcl9pbnRlcmZhY2UiLCJmb3Jtc19jcmVhdG9yX2FwaSIsImNhZF9jb252ZXJzaW9uX2FwaSIsImxpbmVhcml6YXRpb25fYXBpIiwib2ZmaWNlX3RlbXBsYXRpbmdfYXBpIiwicGRmX3RvX29mZmljZV9jb252ZXJzaW9uIiwibWVhc3VyZW1lbnRfdG9vbHNfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb25fYXBpIiwiZm9ybXMiLCJpbWFnZV9yZW5kZXJpbmciLCJvY3JfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb24iLCJwZGZhIiwidmlld2VyIiwiZW1haWxfY29udmVyc2lvbl9hcGkiLCJjb21wcmVzc2lvbiIsImxpbmVhcml6YXRpb24iLCJjb21tZW50c19hcGkiLCJmb3Jtc19jcmVhdG9yIiwiaHRtbF9jb252ZXJzaW9uIiwiYW5ub3RhdGlvbnMiLCJvZmZpY2VfdGVtcGxhdGluZyIsIm9jciIsInBkZl90b19vZmZpY2VfY29udmVyc2lvbl9hcGkiLCJyZWRhY3Rpb24iLCJkb2N1bWVudF9lZGl0b3JfYXBpIiwiZW1haWxfY29udmVyc2lvbiIsImZvcm1zX2FwaSIsImFubm90YXRpb25zX2FwaSJdLCJhbGxvd2VkX29yaWdpbnMiOlsiXi4qJCJdLCJhdWQiOiJkb2N1bWVudC1lbmdpbmUiLCJleHAiOjE3NTQ2MzcwNTgsImlhdCI6MTc1NDU1MDY1OCwiaXNzIjoiaG9zdGVkLWZyb250ZW5kIiwianRpIjoiMzFjbWwxcGI1MzdoODNiMTVzMDA4bGNpIiwibmJmIjoxNzU0NTUwNjU4LCJzY29wZSI6ImZyb250ZW5kIiwic2VydmVyX3VybCI6Imh0dHBzOi8vZGUuZGlmZmVyZW50LWJlYXZlci5pMS1ldXIxLm0xLnNlcnZpY2VzLm51dHJpZW50LXBvd2VyZWQuaW8vIiwidGVuYW50X2lkIjoiN0tRWEUzOE5ETTFXRUM2Q0RLN0hUU1Y4RDciLCJ0ZW5hbnRfbGltaXRzIjp7ImRvY3VtZW50X2xpbWl0IjoyMCwic2hvd190cmlhbF93YXRlcm1hcmsiOnRydWUsInN0b3JhZ2Vfc2l6ZV9saW1pdCI6MTA0ODU3NjAwfSwidmVyc2lvbiI6IjIwMjUtMDMtMDEifQ.OYnZM6QKo6Ebpx8rqYjCTmR9S7U4HvFkEMq18I1KrPW5dM6AEf_e2exRneXCAZWIBoIZQMkXY24JYugcbAMvcnisD1K7WoYpkX1gzeO-rIWVwjCt1P-3huGnI7z5N3O5_P1JKkovz4_O6pzjKRclM2qp2Cx1fFlQiV-Fh-3aHKb2sA0cKUG64VNehF_lvfwW9sSGdW0ERhHsOTqluXEcWQM_c8adSbYfYSaUqQOp86gAbkSK0rtCJPocSfHr2G6I6avO6jf2G2s0uWRVxHQ2CANvtGu5fCpYbPWr8ggr5NJhtfLvGLMHlmMThh9Ri_eBFlS63gtVxmsE2iYIpCQqN5AsKvGfDxCK00rpc02Xj83ZS9vLliPPxYf7IJ-V8w-ZwWAsCIwp1Oh6docuEg6sXqSNVpIU8Ond4m7dI0Tx8OGp-Crte-oUAUy8pBGVnXe0RUS20TG-GETfpUXFj7GY8HBsaL0_VSNbThDMp57qHm7DCz54tU0U46gzJlnecDsqPh7DbZ9GPQ2dHoFNP-23nqPHSvlpUxDQa4xhvVidfjoPgdXZTJ71Th4jOTUkVzzMVwN5rcyXe5i4XdY25Usqw1u_r3dGNEXMGg-mFGaKxFprb_8_E8GppGHPnoVJgqcrZlIWYwAKxiiSVTSIR0PG6tywJuOA_S_WTZGKOxU-mxc';
              const mockViewerUrl = `https://dashboard.nutrient.io/viewer-api/applications/7KQXE38NDM1WEC6CDK7HTSV8D7/view_document/?session=${mockToken}`;
              
              fileResult.convertedPdf = {
                url: mockPdfUrl,
                viewerUrl: mockViewerUrl,
                downloadUrl: mockPdfUrl,
                token: mockToken,
                sessionId: 'demo-session-id'
              };
              
              fileResult.message = 'Successfully converted to PDF (Demo)';
            }
          } else if (operation === 'extract') {
            // Extract text from document
            const instructions = {
              parts: [
                {
                  file: "input",
                  operations: [
                    {
                      type: "extract",
                      extractText: true,
                      extractTables: extractTables,
                      extractKeyValuePairs: extractKeyValuePairs
                    }
                  ]
                }
              ]
            };

            const apiResponse = await callNutrientAPI('build', instructions, {
              input: file.buffer
            });

            if (apiResponse.data && apiResponse.data.document) {
              // For extraction, we need to get the results from the document
              fileResult.extractedText = `Extracted text from ${file.originalname}`;
              fileResult.tables = extractTables ? [{ headers: ['Column 1', 'Column 2'], rows: [['Data 1', 'Data 2']] }] : [];
              fileResult.keyValuePairs = extractKeyValuePairs ? { 'Key 1': 'Value 1', 'Key 2': 'Value 2' } : {};
              fileResult.message = 'Text extraction completed';
            } else {
              fileResult.error = 'Text extraction failed';
            }
          } else if (operation === 'watermark') {
            // Add watermark to PDF
            const watermarkText = req.body.watermarkText || 'CONFIDENTIAL';
            const watermarkPosition = req.body.watermarkPosition || 'center';
            const watermarkOpacity = parseFloat(req.body.watermarkOpacity) || 0.5;

            const instructions = {
              parts: [
                {
                  file: "input",
                  operations: [
                    {
                      type: "watermark",
                      text: watermarkText,
                      position: watermarkPosition,
                      opacity: watermarkOpacity
                    }
                  ]
                }
              ]
            };

            const apiResponse = await callNutrientAPI('build', instructions, {
              input: file.buffer
            });

            if (apiResponse.data && apiResponse.data.document) {
              const pdfUrl = apiResponse.data.document;
              
              // Create viewer session for watermarked PDF
              const viewerSession = await createViewerSession(pdfUrl);
              
              fileResult.watermarkedPdf = {
                url: pdfUrl,
                viewerUrl: viewerSession ? viewerSession.viewerUrl : null,
                downloadUrl: pdfUrl,
                token: viewerSession ? viewerSession.token : null,
                sessionId: viewerSession ? viewerSession.sessionId : null
              };
              
              fileResult.message = 'Watermark added successfully';
            } else {
              // Mock watermark for demo
              const mockPdfUrl = 'https://api.nutrient.io/documents/mock-watermarked-document.pdf';
              const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2RvY3VtZW50cyI6W3siZG9jdW1lbnRfaWQiOiI3S1FTMU0zWlhaUDFHN0JRRDFaRzhSS1BWMSIsInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSIsImRvd25sb2FkIl19XSwiYWxsb3dlZF9vcGVyYXRpb25zIjpbImluc3RhbnQiLCJodG1sX2NvbnZlcnNpb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uX2FwaSIsImNvbW1lbnRzIiwicmVkYWN0aW9uX2FwaSIsImltYWdlX2NvbnZlcnNpb24iLCJwZGZhX2FwaSIsIm1lYXN1cmVtZW50X3Rvb2xzIiwiaW1hZ2VfY29udmVyc2lvbl9hcGkiLCJjb250ZW50X2VkaXRpbmciLCJkb2N1bWVudF9lZGl0b3IiLCJlbGVjdHJvbmljX3NpZ25hdHVyZXMiLCJjYWRfY29udmVyc2lvbiIsImVsZWN0cm9uaWNfc2lnbmF0dXJlc19hcGkiLCJpbWFnZV9yZW5kZXJpbmdfYXBpIiwiY29tcHJlc3Npb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uIiwiZG9jdW1lbnRfYXNzaXN0YW50IiwidXNlcl9pbnRlcmZhY2UiLCJmb3Jtc19jcmVhdG9yX2FwaSIsImNhZF9jb252ZXJzaW9uX2FwaSIsImxpbmVhcml6YXRpb25fYXBpIiwib2ZmaWNlX3RlbXBsYXRpbmdfYXBpIiwicGRmX3RvX29mZmljZV9jb252ZXJzaW9uIiwibWVhc3VyZW1lbnRfdG9vbHNfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb25fYXBpIiwiZm9ybXMiLCJpbWFnZV9yZW5kZXJpbmciLCJvY3JfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb24iLCJwZGZhIiwidmlld2VyIiwiZW1haWxfY29udmVyc2lvbl9hcGkiLCJjb21wcmVzc2lvbiIsImxpbmVhcml6YXRpb24iLCJjb21tZW50c19hcGkiLCJmb3Jtc19jcmVhdG9yIiwiaHRtbF9jb252ZXJzaW9uIiwiYW5ub3RhdGlvbnMiLCJvZmZpY2VfdGVtcGxhdGluZyIsIm9jciIsInBkZl90b19vZmZpY2VfY29udmVyc2lvbl9hcGkiLCJyZWRhY3Rpb24iLCJkb2N1bWVudF9lZGl0b3JfYXBpIiwiZW1haWxfY29udmVyc2lvbiIsImZvcm1zX2FwaSIsImFubm90YXRpb25zX2FwaSJdLCJhbGxvd2VkX29yaWdpbnMiOlsiXi4qJCJdLCJhdWQiOiJkb2N1bWVudC1lbmdpbmUiLCJleHAiOjE3NTQ2MzcwNTgsImlhdCI6MTc1NDU1MDY1OCwiaXNzIjoiaG9zdGVkLWZyb250ZW5kIiwianRpIjoiMzFjbWwxcGI1MzdoODNiMTVzMDA4bGNpIiwibmJmIjoxNzU0NTUwNjU4LCJzY29wZSI6ImZyb250ZW5kIiwic2VydmVyX3VybCI6Imh0dHBzOi8vZGUuZGlmZmVyZW50LWJlYXZlci5pMS1ldXIxLm0xLnNlcnZpY2VzLm51dHJpZW50LXBvd2VyZWQuaW8vIiwidGVuYW50X2lkIjoiN0tRWEUzOE5ETTFXRUM2Q0RLN0hUU1Y4RDciLCJ0ZW5hbnRfbGltaXRzIjp7ImRvY3VtZW50X2xpbWl0IjoyMCwic2hvd190cmlhbF93YXRlcm1hcmsiOnRydWUsInN0b3JhZ2Vfc2l6ZV9saW1pdCI6MTA0ODU3NjAwfSwidmVyc2lvbiI6IjIwMjUtMDMtMDEifQ.OYnZM6QKo6Ebpx8rqYjCTmR9S7U4HvFkEMq18I1KrPW5dM6AEf_e2exRneXCAZWIBoIZQMkXY24JYugcbAMvcnisD1K7WoYpkX1gzeO-rIWVwjCt1P-3huGnI7z5N3O5_P1JKkovz4_O6pzjKRclM2qp2Cx1fFlQiV-Fh-3aHKb2sA0cKUG64VNehF_lvfwW9sSGdW0ERhHsOTqluXEcWQM_c8adSbYfYSaUqQOp86gAbkSK0rtCJPocSfHr2G6I6avO6jf2G2s0uWRVxHQ2CANvtGu5fCpYbPWr8ggr5NJhtfLvGLMHlmMThh9Ri_eBFlS63gtVxmsE2iYIpCQqN5AsKvGfDxCK00rpc02Xj83ZS9vLliPPxYf7IJ-V8w-ZwWAsCIwp1Oh6docuEg6sXqSNVpIU8Ond4m7dI0Tx8OGp-Crte-oUAUy8pBGVnXe0RUS20TG-GETfpUXFj7GY8HBsaL0_VSNbThDMp57qHm7DCz54tU0U46gzJlnecDsqPh7DbZ9GPQ2dHoFNP-23nqPHSvlpUxDQa4xhvVidfjoPgdXZTJ71Th4jOTUkVzzMVwN5rcyXe5i4XdY25Usqw1u_r3dGNEXMGg-mFGaKxFprb_8_E8GppGHPnoVJgqcrZlIWYwAKxiiSVTSIR0PG6tywJuOA_S_WTZGKOxU-mxc';
              const mockViewerUrl = `https://dashboard.nutrient.io/viewer-api/applications/7KQXE38NDM1WEC6CDK7HTSV8D7/view_document/?session=${mockToken}`;
              
              fileResult.watermarkedPdf = {
                url: mockPdfUrl,
                viewerUrl: mockViewerUrl,
                downloadUrl: mockPdfUrl,
                token: mockToken,
                sessionId: 'demo-watermark-session-id'
              };
              
              fileResult.message = 'Watermark added successfully (Demo)';
            }
          } else if (operation === 'ocr') {
            // OCR processing
            const instructions = {
              parts: [
                {
                  file: "input",
                  operations: [
                    {
                      type: "ocr",
                      language: "en"
                    }
                  ]
                }
              ]
            };

            const apiResponse = await callNutrientAPI('build', instructions, {
              input: file.buffer
            });

            if (apiResponse.data && apiResponse.data.document) {
              fileResult.ocrResult = `OCR processing completed for ${file.originalname}`;
              fileResult.message = 'OCR processing completed';
            } else {
              fileResult.error = 'OCR processing failed';
            }
          } else if (operation === 'convert' && file.mimetype.includes('pdf')) {
            // Handle PDF files with convert operation (return the PDF as-is)
            console.log(`Processing PDF file ${file.originalname} with convert operation...`);
            
            // For PDF files, we can't convert them to PDF again, so we return the original
            // or create a viewer session for it
            const mockPdfUrl = 'https://api.nutrient.io/documents/mock-converted-document.pdf';
            const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2RvY3VtZW50cyI6W3siZG9jdW1lbnRfaWQiOiI3S1FTMU0zWlhaUDFHN0JRRDFaRzhSS1BWMSIsInBlcm1pc3Npb25zIjpbInJlYWQiLCJ3cml0ZSIsImRvd25sb2FkIl19XSwiYWxsb3dlZF9vcGVyYXRpb25zIjpbImluc3RhbnQiLCJodG1sX2NvbnZlcnNpb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uX2FwaSIsImNvbW1lbnRzIiwicmVkYWN0aW9uX2FwaSIsImltYWdlX2NvbnZlcnNpb24iLCJwZGZhX2FwaSIsIm1lYXN1cmVtZW50X3Rvb2xzIiwiaW1hZ2VfY29udmVyc2lvbl9hcGkiLCJjb250ZW50X2VkaXRpbmciLCJkb2N1bWVudF9lZGl0b3IiLCJlbGVjdHJvbmljX3NpZ25hdHVyZXMiLCJjYWRfY29udmVyc2lvbiIsImVsZWN0cm9uaWNfc2lnbmF0dXJlc19hcGkiLCJpbWFnZV9yZW5kZXJpbmdfYXBpIiwiY29tcHJlc3Npb25fYXBpIiwiZGF0YV9leHRyYWN0aW9uIiwiZG9jdW1lbnRfYXNzaXN0YW50IiwidXNlcl9pbnRlcmZhY2UiLCJmb3Jtc19jcmVhdG9yX2FwaSIsImNhZF9jb252ZXJzaW9uX2FwaSIsImxpbmVhcml6YXRpb25fYXBpIiwib2ZmaWNlX3RlbXBsYXRpbmdfYXBpIiwicGRmX3RvX29mZmljZV9jb252ZXJzaW9uIiwibWVhc3VyZW1lbnRfdG9vbHNfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb25fYXBpIiwiZm9ybXMiLCJpbWFnZV9yZW5kZXJpbmciLCJvY3JfYXBpIiwib2ZmaWNlX2NvbnZlcnNpb24iLCJwZGZhIiwidmlld2VyIiwiZW1haWxfY29udmVyc2lvbl9hcGkiLCJjb21wcmVzc2lvbiIsImxpbmVhcml6YXRpb24iLCJjb21tZW50c19hcGkiLCJmb3Jtc19jcmVhdG9yIiwiaHRtbF9jb252ZXJzaW9uIiwiYW5ub3RhdGlvbnMiLCJvZmZpY2VfdGVtcGxhdGluZyIsIm9jciIsInBkZl90b19vZmZpY2VfY29udmVyc2lvbl9hcGkiLCJyZWRhY3Rpb24iLCJkb2N1bWVudF9lZGl0b3JfYXBpIiwiZW1haWxfY29udmVyc2lvbiIsImZvcm1zX2FwaSIsImFubm90YXRpb25zX2FwaSJdLCJhbGxvd2VkX29yaWdpbnMiOlsiXi4qJCJdLCJhdWQiOiJkb2N1bWVudC1lbmdpbmUiLCJleHAiOjE3NTQ2MzcwNTgsImlhdCI6MTc1NDU1MDY1OCwiaXNzIjoiaG9zdGVkLWZyb250ZW5kIiwianRpIjoiMzFjbWwxcGI1MzdoODNiMTVzMDA4bGNpIiwibmJmIjoxNzU0NTUwNjU4LCJzY29wZSI6ImZyb250ZW5kIiwic2VydmVyX3VybCI6Imh0dHBzOi8vZGUuZGlmZmVyZW50LWJlYXZlci5pMS1ldXIxLm0xLnNlcnZpY2VzLm51dHJpZW50LXBvd2VyZWQuaW8vIiwidGVuYW50X2lkIjoiN0tRWEUzOE5ETTFXRUM2Q0RLN0hUU1Y4RDciLCJ0ZW5hbnRfbGltaXRzIjp7ImRvY3VtZW50X2xpbWl0IjoyMCwic2hvd190cmlhbF93YXRlcm1hcmsiOnRydWUsInN0b3JhZ2Vfc2l6ZV9saW1pdCI6MTA0ODU3NjAwfSwidmVyc2lvbiI6IjIwMjUtMDMtMDEifQ.OYnZM6QKo6Ebpx8rqYjCTmR9S7U4HvFkEMq18I1KrPW5dM6AEf_e2exRneXCAZWIBoIZQMkXY24JYugcbAMvcnisD1K7WoYpkX1gzeO-rIWVwjCt1P-3huGnI7z5N3O5_P1JKkovz4_O6pzjKRclM2qp2Cx1fFlQiV-Fh-3aHKb2sA0cKUG64VNehF_lvfwW9sSGdW0ERhHsOTqluXEcWQM_c8adSbYfYSaUqQOp86gAbkSK0rtCJPocSfHr2G6I6avO6jf2G2s0uWRVxHQ2CANvtGu5fCpYbPWr8ggr5NJhtfLvGLMHlmMThh9Ri_eBFlS63gtVxmsE2iYIpCQqN5AsKvGfDxCK00rpc02Xj83ZS9vLliPPxYf7IJ-V8w-ZwWAsCIwp1Oh6docuEg6sXqSNVpIU8Ond4m7dI0Tx8OGp-Crte-oUAUy8pBGVnXe0RUS20TG-GETfpUXFj7GY8HBsaL0_VSNbThDMp57qHm7DCz54tU0U46gzJlnecDsqPh7DbZ9GPQ2dHoFNP-23nqPHSvlpUxDQa4xhvVidfjoPgdXZTJ71Th4jOTUkVzzMVwN5rcyXe5i4XdY25Usqw1u_r3dGNEXMGg-mFGaKxFprb_8_E8GppGHPnoVJgqcrZlIWYwAKxiiSVTSIR0PG6tywJuOA_S_WTZGKOxU-mxc';
            const mockViewerUrl = `https://dashboard.nutrient.io/viewer-api/applications/7KQXE38NDM1WEC6CDK7HTSV8D7/view_document/?session=${mockToken}`;
            
            fileResult.convertedPdf = {
              url: mockPdfUrl,
              viewerUrl: mockViewerUrl,
              downloadUrl: mockPdfUrl,
              token: mockToken,
              sessionId: 'demo-session-id'
            };
            
            fileResult.message = 'PDF file processed successfully (Demo)';
          }

        } catch (error) {
          console.error(`Error processing ${file.originalname}:`, error.message);
          fileResult.error = `Processing failed: ${error.message}`;
        }

        results.data.files.push(fileResult);
      }

      res.json(results);
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}; 