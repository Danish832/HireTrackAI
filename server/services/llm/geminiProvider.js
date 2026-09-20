const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends a prompt to Gemini and returns raw text response.
 * @param {string} prompt
 * @param {object} options - { jsonMode: boolean }
 */
const generateContent = async (prompt, options = {}) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    generationConfig: options.jsonMode
      ? { responseMimeType: 'application/json' }
      : undefined,
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

module.exports = { generateContent };