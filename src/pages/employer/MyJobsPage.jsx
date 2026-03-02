import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Users, X, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { jobAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const MyJobsPage = () => {
  const { success, error } = useToast();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, jobId: null, action: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'filled', label: 'Filled' },
  ];

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = { status: filter, limit: 20 };
      const response = await jobAPI.getEmployerJobs(params);
      setJobs(response.data?.jobs || []);
    } catch (err) {
      error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async (jobId) => {
    setIsProcessing(true);
    try {
      await jobAPI.closeJob(jobId);
      success('Job closed successfully');
      fetchJobs();
    } catch (err) {
      error('Failed to close job');
    } finally {
      setIsProcessing(false);
      setConfirmDialog({ isOpen: false, jobId: null, action: '' });
    }
  };

  const handleReopen = async (jobId) => {
    setIsProcessing(true);
    try {
      await jobAPI.reopenJob(jobId);
      success('Job reopened successfully');
      fetchJobs();
    } catch (err) {
      error('Failed to reopen job');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog.jobId) return;
    setIsProcessing(true);
    try {
      await jobAPI.deleteJob(confirmDialog.jobId);
      success('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      error('Failed to delete job');
    } finally {
      setIsProcessing(false);
      setConfirmDialog({ isOpen: false, jobId: null, action: '' });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
          <p className="text-gray-600">Manage your job listings</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Link
            to="/employer/jobs/create"
            className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post Job
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No jobs posted yet"
            description="Start posting jobs to find the perfect candidates."
            icon="briefcase"
            actionLabel="Post Your First Job"
            actionHref="/employer/jobs/create"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Posted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applications</th>
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
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="flex items-center gap-2 text-[#0B3D2E] hover:underline"
                      >
                        <Users className="w-4 h-4" />
                        {job.applicationCount || 0} applicants
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/employer/jobs/${job._id}/edit`}
                          className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {job.status === 'open' ? (
                          <button
                            onClick={() => handleClose(job._id)}
                            className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReopen(job._id)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDialog({ isOpen: true, jobId: job._id, action: 'delete' })}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, jobId: null, action: '' })}
        onConfirm={handleDelete}
        title="Delete Job?"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default MyJobsPage;
