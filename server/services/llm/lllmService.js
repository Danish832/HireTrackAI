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
// const generateContent = async (prompt, options = {}) => {
//   const provider = getProvider();
//   return provider.generateContent(prompt, options);
// };
const generateContent = async (prompt, options = {}, retries = 3) => {
  const provider = getProvider();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await provider.generateContent(prompt, options);
    } catch (error) {
      const isRetryable =
        error.message?.includes('503') ||
        error.message?.includes('overloaded') ||
        error.message?.includes('high demand');

      if (isRetryable && attempt < retries) {
        const delay = 1500 * Math.pow(2, attempt); // 1.5s, 3s, 6s
        console.log(`Gemini overloaded, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
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