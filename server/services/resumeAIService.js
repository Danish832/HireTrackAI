const { generateJSON } = require('./llm/lllmService');
const { buildResumeParsingPrompt } = require('../utils/prompts/resumeParsingPrompt');

const REQUIRED_FIELDS = [
  'name', 'email', 'phone', 'summary', 'skills',
  'experience', 'education', 'totalYearsExperience',
];

const parseResumeWithAI = async (resumeText) => {
  const prompt = buildResumeParsingPrompt(resumeText);
  const parsed = await generateJSON(prompt);

  // Defensive validation — ensure the shape matches what we expect
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new Error(`AI response missing expected field: ${field}`);
    }
  }

  // Normalize types defensively in case the model slightly deviates
  return {
    name: parsed.name || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    summary: parsed.summary || '',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    totalYearsExperience:
      typeof parsed.totalYearsExperience === 'number' ? parsed.totalYearsExperience : 0,
  };
};

module.exports = { parseResumeWithAI };