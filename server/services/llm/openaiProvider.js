// Placeholder for OpenAI integration — implement if/when you add OpenAI support.
// Keeping the same function signature as geminiProvider.js means llmService.js
// requires zero changes when this is implemented.

const generateContent = async (prompt, options = {}) => {
  throw new Error('OpenAI provider not implemented yet. Set LLM_PROVIDER=gemini in .env');
};

module.exports = { generateContent };