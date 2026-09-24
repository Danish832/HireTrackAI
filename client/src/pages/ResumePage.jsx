import { useState, useEffect } from 'react';
import { getResume } from '../api/resumeApi';
import ResumeUploadCard from '../components/ResumeUploadCard';
import ParsedResumeDisplay from '../components/ParsedResumeDisplay';

const ResumePage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await getResume();
      setResumeData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch resume', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleResumeUpdated = (updated) => {
    if (updated === null) {
      setResumeData(null);
    } else if (updated.structuredData !== undefined && !updated.resumeUrl) {
      // reparse response — merge into existing state
      setResumeData((prev) => ({
        ...prev,
        parsedResume: { ...prev?.parsedResume, structuredData: updated.structuredData },
      }));
    } else {
      // upload response
      setResumeData({
        resumeUrl: updated.resumeUrl,
        parsedResume: { structuredData: updated.structuredData },
      });
    }
  };

  if (loading) return <p className="text-gray-500">Loading resume...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Resume</h1>
      <ResumeUploadCard resumeData={resumeData} onResumeUpdated={handleResumeUpdated} />
      <ParsedResumeDisplay structuredData={resumeData?.parsedResume?.structuredData} />
    </div>
  );
};

export default ResumePage;