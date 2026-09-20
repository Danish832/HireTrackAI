const geminiProvider = require('./geminiProvider');
const openaiProvider = require('./openaiProvider');

const providers = {
  gemini: geminiProvider,
  openai: openaiProvider,
};

const getProvider = () => {
  const providerName = process.env.LLM_PROVIDER || 'gemini';
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown LLM provider: ${providerName}`);
  }

  return provider;
};

/**
 * Generic entry point used by all controllers.
 * Swapping providers = changing LLM_PROVIDER in .env, nothing else.
 */
const generateContent = async (prompt, options = {}) => {
  const provider = getProvider();
  return provider.generateContent(prompt, options);
};

/**
 * Helper: send a prompt expecting strict JSON back, and safely parse it.
 */
const generateJSON = async (prompt) => {
  const raw = await generateContent(prompt, { jsonMode: true });

  try {
    return JSON.parse(raw);
  } catch (error) {
    // Fallback: strip markdown code fences if the model added them anyway
    const cleaned = raw.replace(/```json|```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch (innerError) {
      throw new Error('LLM did not return valid JSON');
    }
  }
};

module.exports = { generateContent, generateJSON };