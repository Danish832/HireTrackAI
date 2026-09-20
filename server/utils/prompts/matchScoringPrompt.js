const buildMatchScoringPrompt = (resumeData, jobDescription, role, company) => `
You are an expert technical recruiter evaluating how well a candidate's resume matches a job posting.

Candidate's resume data (JSON):
${JSON.stringify(resumeData, null, 2)}

Job details:
Company: ${company}
Role: ${role}
Job Description:
"""
${jobDescription}
"""

Evaluate the match and return ONLY a valid JSON object with this exact shape (no markdown, no explanation):

{
  "matchScore": number (0-100, overall fit score),
  "reasoning": string (3-4 sentence explanation of the score, mentioning specific strengths and gaps),
  "matchedSkills": string[] (skills from the resume that align with the job requirements),
  "missingSkills": string[] (important skills/requirements mentioned in the job description that are absent from the resume),
  "recommendation": string (one of: "Strong Match", "Good Match", "Partial Match", "Weak Match")
}

Scoring guidance:
- 80-100: Strong Match — most requirements met, directly relevant experience
- 60-79: Good Match — solid overlap, some gaps
- 40-59: Partial Match — meaningful gaps in core requirements
- 0-39: Weak Match — significant misalignment

Be honest and specific — do not inflate the score to be encouraging.
`;

module.exports = { buildMatchScoringPrompt };