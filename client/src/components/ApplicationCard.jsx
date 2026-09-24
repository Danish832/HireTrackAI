import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application, onEdit, onDelete, onGenerateScore, scoring }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{application.role}</h3>
          <p className="text-sm text-gray-500">{application.company}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {application.location && (
        <p className="text-xs text-gray-400">{application.location}</p>
      )}

      {application.matchScore !== null &&
        application.matchScore !== undefined && (
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  application.matchScore >= 70
                    ? "bg-green-500"
                    : application.matchScore >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${application.matchScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {application.matchScore}%
            </span>
          </div>
        )}

      {application.matchReasoning && (
        <p className="text-xs text-gray-500 mt-1">
          {application.matchReasoning}
        </p>
      )}

      {application.missingSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {application.missingSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2 text-sm">
        <button
          onClick={() => onEdit(application)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(application._id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
        {application.jobDescription && (
          <button
            onClick={() => onGenerateScore(application._id)}
            disabled={scoring}
            className="text-purple-600 hover:underline disabled:opacity-50"
          >
            {scoring
              ? "Scoring..."
              : application.matchScore != null
                ? "Re-score"
                : "AI Match Score"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;