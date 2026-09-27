import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadResume, deleteResume, reparseResume } from '../api/resumeApi';

const ResumeUploadCard = ({ resumeData, onResumeUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await uploadResume(formData);
      onResumeUpdated(res.data.data);
      if (res.data.data.aiParseError) {
        toast.error(`Uploaded, but AI parsing failed`);
      } else {
        toast.success('Resume uploaded and parsed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your resume?')) return;
    try {
      await deleteResume();
      onResumeUpdated(null);
      toast.success('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  const handleReparse = async () => {
    setUploading(true);
    try {
      const res = await reparseResume();
      onResumeUpdated({ structuredData: res.data.data });
      toast.success('Resume re-parsed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Re-parsing failed');
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