const buildResumeParsingPrompt = (resumeText) => `
You are a resume parsing engine. Extract structured information from the resume text below.

Return ONLY a valid JSON object with this exact shape (no markdown, no explanation):

{
  "name": string or null,
  "email": string or null,
  "phone": string or null,
  "summary": string (2-3 sentence professional summary, or empty string if none found),
  "skills": string[] (technical and soft skills, deduplicated, max 30),
  "experience": [
    {
      "company": string,
      "title": string,
      "duration": string,
      "description": string (1-2 sentence summary of responsibilities/achievements)
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "year": string or null
    }
  ],
  "totalYearsExperience": number (best estimate based on work history, 0 if unclear)
}

Rules:
- If a field cannot be found, use null, empty string, or empty array as appropriate — never omit a key.
- Do not fabricate information not present in the text.
- Keep descriptions concise.

Resume text:
"""
${resumeText}
"""
`;

module.exports = { buildResumeParsingPrompt };