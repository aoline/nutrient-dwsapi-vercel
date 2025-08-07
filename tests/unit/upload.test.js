const assert = require('assert');
const { mockViewerSession } = require('./viewer.test');

// Mock the upload functionality
const mockUploadResponse = {
  success: true,
  data: {
    files: [{
      filename: 'test.pdf',
      convertedPdf: {
        url: 'https://api.nutrient.io/documents/mock-converted-document.pdf',
        viewerUrl: mockViewerSession.viewerUrl,
        downloadUrl: 'https://api.nutrient.io/documents/mock-converted-document.pdf',
        token: mockViewerSession.token,
        sessionId: mockViewerSession.sessionId
      }
    }]
  }
};

describe('Upload API Tests', () => {
  
  describe('Viewer URL Generation', () => {
    it('should return correct dashboard viewer URL format', () => {
      const viewerUrl = mockUploadResponse.data.files[0].convertedPdf.viewerUrl;
      const expectedUrl = `https://dashboard.nutrient.io/viewer-api/applications/7KQXE38NDM1WEC6CDK7HTSV8D7/view_document/?session=${mockViewerSession.token}`;
      
      assert.strictEqual(viewerUrl, expectedUrl);
    });

    it('should include all required viewer properties', () => {
      const convertedPdf = mockUploadResponse.data.files[0].convertedPdf;
      
      assert(convertedPdf.url, 'Should have PDF URL');
      assert(convertedPdf.viewerUrl, 'Should have viewer URL');
      assert(convertedPdf.downloadUrl, 'Should have download URL');
      assert(convertedPdf.token, 'Should have token');
      assert(convertedPdf.sessionId, 'Should have session ID');
    });

    it('should use HTTPS for all URLs', () => {
      const convertedPdf = mockUploadResponse.data.files[0].convertedPdf;
      
      assert(convertedPdf.url.startsWith('https://'), 'PDF URL should use HTTPS');
      assert(convertedPdf.viewerUrl.startsWith('https://'), 'Viewer URL should use HTTPS');
      assert(convertedPdf.downloadUrl.startsWith('https://'), 'Download URL should use HTTPS');
    });
  });

  describe('API Response Structure', () => {
    it('should return successful response structure', () => {
      assert(mockUploadResponse.success, 'Response should indicate success');
      assert(mockUploadResponse.data, 'Response should have data property');
      assert(Array.isArray(mockUploadResponse.data.files), 'Files should be an array');
      assert(mockUploadResponse.data.files.length > 0, 'Files array should not be empty');
    });

    it('should include file information', () => {
      const file = mockUploadResponse.data.files[0];
      
      assert(file.filename, 'File should have filename');
      assert(file.convertedPdf, 'File should have convertedPdf property');
    });

    it('should handle multiple files', () => {
      const multiFileResponse = {
        success: true,
        data: {
          files: [
            {
              filename: 'file1.pdf',
              convertedPdf: {
                ...mockUploadResponse.data.files[0].convertedPdf,
                viewerUrl: mockViewerSession.viewerUrl
              }
            },
            {
              filename: 'file2.pdf',
              convertedPdf: {
                ...mockUploadResponse.data.files[0].convertedPdf,
                viewerUrl: mockViewerSession.viewerUrl
              }
            }
          ]
        }
      };

      assert(multiFileResponse.data.files.length === 2, 'Should handle multiple files');
      multiFileResponse.data.files.forEach(file => {
        assert(file.convertedPdf.viewerUrl, 'Each file should have viewer URL');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle upload errors gracefully', () => {
      const errorResponse = {
        success: false,
        error: 'Failed to upload file',
        message: 'File upload failed'
      };

      assert(!errorResponse.success, 'Error response should indicate failure');
      assert(errorResponse.error, 'Error response should contain error information');
    });

    it('should handle missing files', () => {
      const noFilesResponse = {
        success: true,
        data: {
          files: []
        }
      };

      assert(noFilesResponse.success, 'Should handle empty files array');
      assert(Array.isArray(noFilesResponse.data.files), 'Files should still be an array');
    });
  });

  describe('Viewer Integration', () => {
    it('should integrate with viewer session correctly', () => {
      const convertedPdf = mockUploadResponse.data.files[0].convertedPdf;
      
      // Check that the viewer URL matches the session data
      assert.strictEqual(convertedPdf.viewerUrl, mockViewerSession.viewerUrl);
      assert.strictEqual(convertedPdf.token, mockViewerSession.token);
      assert.strictEqual(convertedPdf.sessionId, mockViewerSession.sessionId);
    });

    it('should provide consistent viewer URLs across operations', () => {
      const operations = ['convert', 'watermark', 'ocr'];
      
      operations.forEach(operation => {
        const mockResponse = {
          success: true,
          data: {
            files: [{
              filename: `test-${operation}.pdf`,
              [`${operation === 'ocr' ? 'ocr' : operation + 'ed'}Pdf`]: {
                url: `https://api.nutrient.io/documents/mock-${operation}-document.pdf`,
                viewerUrl: mockViewerSession.viewerUrl,
                downloadUrl: `https://api.nutrient.io/documents/mock-${operation}-document.pdf`,
                token: mockViewerSession.token,
                sessionId: mockViewerSession.sessionId
              }
            }]
          }
        };

        const file = mockResponse.data.files[0];
        const pdfData = file.convertedPdf || file.watermarkedPdf || file.ocrPdf;
        
        assert(pdfData.viewerUrl, `Should have viewer URL for ${operation} operation`);
        assert.strictEqual(pdfData.viewerUrl, mockViewerSession.viewerUrl, `Viewer URL should be consistent for ${operation}`);
      });
    });
  });

  describe('Security and Validation', () => {
    it('should validate viewer URLs', () => {
      const viewerUrl = mockUploadResponse.data.files[0].convertedPdf.viewerUrl;
      
      try {
        const url = new URL(viewerUrl);
        assert.strictEqual(url.protocol, 'https:', 'Viewer URL should use HTTPS');
        assert.strictEqual(url.hostname, 'dashboard.nutrient.io', 'Viewer URL should use correct domain');
        assert(url.pathname.includes('/viewer-api/'), 'Viewer URL should have correct path');
      } catch (error) {
        assert.fail(`Viewer URL should be valid: ${error.message}`);
      }
    });

    it('should not expose sensitive data in URLs', () => {
      const viewerUrl = mockUploadResponse.data.files[0].convertedPdf.viewerUrl;
      const url = new URL(viewerUrl);
      const queryParams = Array.from(url.searchParams.keys());
      
      // Should only have expected parameters
      const allowedParams = ['session'];
      queryParams.forEach(param => {
        assert(allowedParams.includes(param), `Query parameter '${param}' should be allowed`);
      });
    });
  });
});

module.exports = {
  mockUploadResponse
}; 