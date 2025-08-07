const { expect } = require('chai');
const { processDocument, extractText, convertFormat, addWatermark } = require('../../src/api');

describe('API Unit Tests', () => {
  describe('processDocument', () => {
    it('should process PDF document successfully', async () => {
      const result = await processDocument('Default.pdf', { type: 'pdf' });
      expect(result).to.have.property('success', true);
      expect(result).to.have.property('output');
    });

    it('should handle processing errors gracefully', async () => {
      const result = await processDocument('nonexistent.pdf', { type: 'pdf' });
      expect(result).to.have.property('success', false);
      expect(result).to.have.property('error');
    });
  });

  describe('extractText', () => {
    it('should extract text from PDF', async () => {
      const result = await extractText('Default.pdf');
      expect(result).to.have.property('text');
      expect(result.text).to.be.a('string');
    });

    it('should extract text from DOCX', async () => {
      const result = await extractText('Invoice.docx');
      expect(result).to.have.property('text');
      expect(result.text).to.be.a('string');
    });
  });

  describe('convertFormat', () => {
    it('should convert DOCX to PDF', async () => {
      const result = await convertFormat('Invoice.docx', 'pdf');
      expect(result).to.have.property('success', true);
      expect(result.output).to.include('.pdf');
    });

    it('should convert PDF to DOCX', async () => {
      const result = await convertFormat('Default.pdf', 'docx');
      expect(result).to.have.property('success', true);
      expect(result.output).to.include('.docx');
    });
  });

  describe('addWatermark', () => {
    it('should add text watermark to PDF', async () => {
      const result = await addWatermark('Default.pdf', {
        text: 'CONFIDENTIAL',
        position: 'center',
        opacity: 0.7
      });
      expect(result).to.have.property('success', true);
    });
  });
}); 