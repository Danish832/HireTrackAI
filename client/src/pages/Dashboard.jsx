import SkeletonCard from '../components/SkeletonCard';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  generateMatchScore,
} from '../api/applicationApi';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationFormModal from '../components/ApplicationFormModal';

const STATUS_FILTERS = ['All', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [scoringId, setScoringId] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await getApplications(params);
      setApplications(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCreate = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  const handleEdit = (application) => {
    setEditingApp(application);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      toast.success('Application deleted');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingApp) {
      await updateApplication(editingApp._id, formData);
      toast.success('Application updated');
    } else {
      await createApplication(formData);
      toast.success('Application created');
    }
    fetchApplications();
  };


  const handleGenerateScore = async (id) => {
    setScoringId(id);
    try {
      await generateMatchScore(id);
      toast.success('Match score generated');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate match score');
    } finally {
      setScoringId(null);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Applications</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Application
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-md w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-md"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 mb-3">No applications yet</p>
          <button
            onClick={handleCreate}
            className="text-blue-600 hover:underline text-sm"
          >
            Add your first application
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGenerateScore={handleGenerateScore}
                scoring={scoringId === app._id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ApplicationFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingApp}
      />
    </div>
  );
};

export default Dashboard; 