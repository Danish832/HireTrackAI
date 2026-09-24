const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { PDFParse } = require('pdf-parse');

const extractTextFromResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      // free the pdf.js worker/canvas resources
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    }
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file format for text extraction');
};

module.exports = { extractTextFromResume };