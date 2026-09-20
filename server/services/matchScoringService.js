const { generateJSON } = require('./llm/lllmService');
const { buildMatchScoringPrompt } = require('../utils/prompts/matchScoringPrompt');

const VALID_RECOMMENDATIONS = ['Strong Match', 'Good Match', 'Partial Match', 'Weak Match'];

const scoreJobMatch = async (resumeData, jobDescription, role, company) => {
  if (!jobDescription || jobDescription.trim().length < 20) {
    throw new Error('Job description is too short to evaluate');
  }

  const prompt = buildMatchScoringPrompt(resumeData, jobDescription, role, company);
  const result = await generateJSON(prompt);

  // Defensive validation
  const matchScore = typeof result.matchScore === 'number'
    ? Math.min(100, Math.max(0, Math.round(result.matchScore)))
    : null;

  if (matchScore === null) {
    throw new Error('AI did not return a valid match score');
  }

  return {
    matchScore,
    reasoning: result.reasoning || 'No reasoning provided.',
    matchedSkills: Array.isArray(result.matchedSkills) ? result.matchedSkills : [],
    missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
    recommendation: VALID_RECOMMENDATIONS.includes(result.recommendation)
      ? result.recommendation
      : 'Partial Match',
  };
};

module.exports = { scoreJobMatch };