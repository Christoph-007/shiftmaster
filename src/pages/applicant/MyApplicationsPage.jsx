import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { applicationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

const MyApplicationsPage = () => {
  const { success, error } = useToast();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [withdrawDialog, setWithdrawDialog] = useState({ isOpen: false, applicationId: null });
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const params = { status: filter, limit: 20 };
      const response = await applicationAPI.getMyApplications(params);
      setApplications(response.data?.applications || []);
    } catch (err) {
      error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawDialog.applicationId) return;
    setIsWithdrawing(true);
    try {
      await applicationAPI.withdraw(withdrawDialog.applicationId);
      success('Application withdrawn successfully');
      fetchApplications();
    } catch (err) {
      error('Failed to withdraw application');
    } finally {
      setIsWithdrawing(false);
      setWithdrawDialog({ isOpen: false, applicationId: null });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No applications yet"
            description="Start applying to jobs to see them here."
            icon="file"
            actionLabel="Browse Jobs"
            actionHref="/applicant/jobs"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(app._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0B3D2E] rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-[#C8E636]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.job?.title}</h3>
                      <p className="text-sm text-gray-500">{app.job?.employer?.storeName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {formatRelativeTime(app.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={app.status} />
                    {expandedId === app._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === app._id && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                  <div className="pt-4 space-y-4">
                    {app.coverLetter && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Cover Letter</h4>
                        <p className="text-sm text-gray-600 bg-white p-4 rounded-lg">{app.coverLetter}</p>
                      </div>
                    )}
                    
                    {app.expectedSalary && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Expected Salary</h4>
                        <p className="text-sm text-gray-600">${app.expectedSalary}/month</p>
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-sm text-gray-600">
                            Applied on {formatDate(app.createdAt)}
                          </span>
                        </div>
                        {app.status !== 'applied' && (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-sm text-gray-600 capitalize">
                              Status updated to {app.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {['applied', 'reviewing'].includes(app.status) && (
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWithdrawDialog({ isOpen: true, applicationId: app._id });
                          }}
                          className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Withdraw Application
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={withdrawDialog.isOpen}
        onClose={() => setWithdrawDialog({ isOpen: false, applicationId: null })}
        onConfirm={handleWithdraw}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmLabel="Withdraw"
        isLoading={isWithdrawing}
      />
    </div>
  );
};

export default MyApplicationsPage;
