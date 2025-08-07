const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { callNutrientAPI } = require('../../src/nutrient-api');

describe('Nutrient DWS API Integration Tests', () => {
  const API_KEY = process.env.NUTRIENT_API_KEY || 'pdf_live_DAsgbvjLQGC6VeUozfIRdKdDvGKBvqlnMu8KXwemPaX';
  const testFiles = {
    pdf: path.join(__dirname, '../fixtures/Default.pdf'),
    docx: path.join(__dirname, '../fixtures/Invoice.docx')
  };

  before(() => {
    // Verify test files exist
    Object.entries(testFiles).forEach(([type, filePath]) => {
      expect(fs.existsSync(filePath), `${type} test file not found`).to.be.true;
    });
  });

  describe('Build API', () => {
    it('should extract text from PDF', async () => {
      const instructions = {
        parts: [{ file: 'Default.pdf' }],
        output: {
          type: 'json-content',
          plainText: true,
          tables: false,
          language: 'en'
        }
      };

      const result = await callNutrientAPI('build', instructions, {
        'Default.pdf': fs.createReadStream(testFiles.pdf)
      });

      expect(result.status).to.equal(200);
      expect(result.data).to.have.property('text');
    });

    it('should convert DOCX to PDF', async () => {
      const instructions = {
        parts: [{ file: 'Invoice.docx' }],
        output: { type: 'pdf' }
      };

      const result = await callNutrientAPI('build', instructions, {
        'Invoice.docx': fs.createReadStream(testFiles.docx)
      });

      expect(result.status).to.equal(200);
      expect(result.headers['content-type']).to.include('application/pdf');
    });

    it('should add watermark to PDF', async () => {
      const instructions = {
        parts: [{ file: 'Default.pdf' }],
        actions: [{
          type: 'watermark',
          watermarkType: 'text',
          text: 'TEST WATERMARK',
          width: 200,
          height: 50,
          rotation: 45,
          opacity: 0.7,
          fontColor: '#FF0000'
        }],
        output: { type: 'pdf' }
      };

      const result = await callNutrientAPI('build', instructions, {
        'Default.pdf': fs.createReadStream(testFiles.pdf)
      });

      expect(result.status).to.equal(200);
      expect(result.headers['content-type']).to.include('application/pdf');
    });

    it('should perform OCR on PDF', async () => {
      const instructions = {
        parts: [{ file: 'Default.pdf' }],
        actions: [{
          type: 'ocr',
          language: 'en'
        }],
        output: { type: 'pdf' }
      };

      const result = await callNutrientAPI('build', instructions, {
        'Default.pdf': fs.createReadStream(testFiles.pdf)
      });

      expect(result.status).to.equal(200);
    });
  });

  describe('Sign API', () => {
    it('should digitally sign PDF', async () => {
      const signatureOptions = {
        signatureType: 'cms',
        appearance: {
          mode: 'signatureAndDescription',
          showSigner: true,
          showSignDate: true
        },
        position: {
          pageIndex: 0,
          rect: [100, 100, 200, 50]
        },
        signatureMetadata: {
          signerName: 'Test User',
          signatureReason: 'Testing',
          signatureLocation: 'Test Location'
        }
      };

      const result = await callNutrientAPI('sign', {
        file: 'Default.pdf',
        signatureOptions
      }, {
        'Default.pdf': fs.createReadStream(testFiles.pdf)
      });

      expect(result.status).to.equal(200);
      expect(result.headers['content-type']).to.include('application/pdf');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid API key', async () => {
      const originalKey = process.env.NUTRIENT_API_KEY;
      process.env.NUTRIENT_API_KEY = 'invalid_key';

      try {
        const instructions = {
          parts: [{ file: 'Default.pdf' }],
          output: { type: 'pdf' }
        };

        await callNutrientAPI('build', instructions, {
          'Default.pdf': fs.createReadStream(testFiles.pdf)
        });
        throw new Error('Should have failed');
      } catch (error) {
        expect(error.response.status).to.equal(401);
      } finally {
        process.env.NUTRIENT_API_KEY = originalKey;
      }
    });

    it('should handle invalid file format', async () => {
      const instructions = {
        parts: [{ file: 'invalid.txt' }],
        output: { type: 'pdf' }
      };

      try {
        await callNutrientAPI('build', instructions, {
          'invalid.txt': Buffer.from('invalid content')
        });
        throw new Error('Should have failed');
      } catch (error) {
        expect(error.response.status).to.be.oneOf([400, 422]);
      }
    });
  });
}); 