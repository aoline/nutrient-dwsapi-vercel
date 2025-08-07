const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

describe('Word Add-in File Upload Tests', () => {
  const API_BASE = 'https://nutrient-dws-api.vercel.app';
  const testFiles = {
    pdf: path.join(__dirname, '../fixtures/Default.pdf'),
    docx: path.join(__dirname, '../fixtures/Invoice.docx')
  };

  describe('Word Add-in API Integration', () => {
    it('should handle Word Add-in file upload requests', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'extract');
      formData.append('extractTables', 'true');
      formData.append('extractKeyValuePairs', 'true');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data.files).to.have.length(1);
      expect(response.data.data.files[0].filename).to.equal('Default.pdf');
    });

    it('should handle Word document content extraction', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.docx));
      formData.append('operation', 'extract');
      formData.append('extractTables', 'true');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data.files[0].filename).to.equal('Invoice.docx');
    });

    it('should handle PDF to DOCX conversion requests', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'convert');
      formData.append('targetFormat', 'docx');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
    });

    it('should handle watermark addition requests', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'watermark');
      formData.append('watermarkText', 'CONFIDENTIAL');
      formData.append('opacity', '0.5');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
    });

    it('should handle OCR processing requests', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'ocr');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
    });
  });

  describe('Word Add-in CORS and Security', () => {
    it('should allow requests from Word Add-in domain', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'Origin': 'https://nutrient-dws-api.vercel.app'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.headers['access-control-allow-origin']).to.equal('*');
    });

    it('should handle preflight requests from Word Add-in', async () => {
      const response = await axios.options(`${API_BASE}/api/upload`, {
        headers: {
          'Origin': 'https://nutrient-dws-api.vercel.app',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 10000
      });

      expect(response.status).to.equal(200);
      expect(response.headers['access-control-allow-origin']).to.equal('*');
      expect(response.headers['access-control-allow-methods']).to.include('POST');
    });
  });

  describe('Word Add-in Error Scenarios', () => {
    it('should handle missing operation parameter gracefully', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
    });

    it('should handle invalid operation gracefully', async () => {
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'invalid_operation');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
    });

    it('should handle empty file uploads from Word Add-in', async () => {
      const formData = new FormData();

      try {
        await axios.post(`${API_BASE}/api/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
            'Content-Type': 'multipart/form-data',
            'User-Agent': 'Word-Add-in/1.0.0'
          },
          timeout: 30000
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data.error).to.include('File upload error');
      }
    });
  });

  describe('Word Add-in Performance', () => {
    it('should handle Word Add-in requests within reasonable time', async () => {
      const startTime = Date.now();
      
      const formData = new FormData();
      formData.append('files', fs.createReadStream(testFiles.pdf));
      formData.append('operation', 'extract');
      formData.append('extractTables', 'true');

      const response = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'User-Agent': 'Word-Add-in/1.0.0'
        },
        timeout: 30000
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).to.equal(200);
      expect(duration).to.be.lessThan(15000); // Should complete within 15 seconds for Word Add-in
    });

    it('should handle multiple concurrent Word Add-in requests', async () => {
      const promises = [];
      
      for (let i = 0; i < 3; i++) {
        const formData = new FormData();
        formData.append('files', fs.createReadStream(testFiles.pdf));
        formData.append('operation', 'extract');
        
        promises.push(
          axios.post(`${API_BASE}/api/upload`, formData, {
            headers: {
              ...formData.getHeaders(),
              'Content-Type': 'multipart/form-data',
              'User-Agent': 'Word-Add-in/1.0.0'
            },
            timeout: 30000
          })
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
      });
    });
  });
}); 