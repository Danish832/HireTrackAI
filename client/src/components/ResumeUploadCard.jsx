import { useState, useRef } from 'react';
import { uploadResume, deleteResume, reparseResume } from '../api/resumeApi';

const ResumeUploadCard = ({ resumeData, onResumeUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await uploadResume(formData);
      onResumeUpdated(res.data.data);
      if (res.data.data.aiParseError) {
        setError(`Uploaded, but AI parsing failed: ${res.data.data.aiParseError}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-uploading the same file if needed
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    await deleteResume();
    onResumeUpdated(null);
  };

  const handleReparse = async () => {
    setError('');
    setUploading(true);
    try {
      const res = await reparseResume();
      onResumeUpdated({ structuredData: res.data.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Re-parsing failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Resume</h2>
        {resumeData?.resumeUrl && (
          <div className="flex gap-3 text-sm">
            <button onClick={handleReparse} disabled={uploading} className="text-blue-600 hover:underline disabled:opacity-50">
              Re-parse with AI
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {!resumeData?.resumeUrl ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-3">No resume uploaded yet</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resume (PDF/DOCX)'}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Resume uploaded ✓ {uploading && <span className="text-blue-600">(processing...)</span>}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-blue-600 hover:underline"
          >
            Replace resume
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ResumeUploadCard;