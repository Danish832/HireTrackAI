const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromResume = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file format for text extraction');
};

module.exports = { extractTextFromResume };