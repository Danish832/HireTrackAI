import SkillTag from './SkillTag';

const ParsedResumeDisplay = ({ structuredData }) => {
  if (!structuredData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-4">
        <p className="text-gray-500 text-sm">
          No parsed data available yet — upload a resume or try re-parsing.
        </p>
      </div>
    );
  }

  const {
    name, email, phone, summary, skills = [],
    experience = [], education = [], totalYearsExperience,
  } = structuredData;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-4 space-y-5">
      <div>
        <h3 className="text-lg font-semibold">{name || 'Name not detected'}</h3>
        <p className="text-sm text-gray-500">
          {[email, phone].filter(Boolean).join(' · ') || 'No contact info detected'}
        </p>
        {totalYearsExperience > 0 && (
          <p className="text-sm text-gray-500 mt-1">{totalYearsExperience} years of experience</p>
        )}
      </div>

      {summary && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
          <p className="text-sm text-gray-600">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => <SkillTag key={i} skill={skill} />)}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Experience</h4>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-gray-100 pl-3">
                <p className="text-sm font-medium">{exp.title} — {exp.company}</p>
                <p className="text-xs text-gray-400">{exp.duration}</p>
                <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Education</h4>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <p className="text-sm font-medium">{edu.degree}</p>
                <p className="text-xs text-gray-400">{edu.institution} {edu.year && `· ${edu.year}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParsedResumeDisplay;