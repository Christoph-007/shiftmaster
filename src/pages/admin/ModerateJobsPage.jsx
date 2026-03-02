import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { adminAPI, jobAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatDate';

const ModerateJobsPage = () => {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, jobId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, filter]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = { search: debouncedSearch, status: filter || undefined, limit: 50 };
      const response = await jobAPI.getJobs(params);
      setJobs(response.data?.jobs || []);
    } catch (err) {
      error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.jobId) return;
    setIsDeleting(true);
    try {
      await adminAPI.deleteJob(deleteDialog.jobId);
      success('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      error('Failed to delete job');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, jobId: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderate Jobs</h1>
        <p className="text-gray-400">Review and manage job postings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="filled">Filled</option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState title="No jobs found" description="Try adjusting your filters" icon="search" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Posted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.city}, {job.state}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.employer?.storeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(job.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={job.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, jobId: job._id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-gray-900">{selectedJob.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employer</label>
              <p className="text-gray-900">{selectedJob.employer?.storeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 whitespace-pre-line">{selectedJob.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{selectedJob.city}, {selectedJob.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Type</label>
                <p className="text-gray-900 capitalize">{selectedJob.jobType?.replace('-', ' ')}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Salary</label>
              <p className="text-gray-900">${selectedJob.salaryAmount}/{selectedJob.salaryPeriod}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Posted On</label>
              <p className="text-gray-900">{formatDate(selectedJob.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, jobId: null })}
        onConfirm={handleDelete}
        title="Delete Job?"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ModerateJobsPage;
