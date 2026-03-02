import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Loader2, User, FileText } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { applicationAPI, jobAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const JobApplicationsPage = () => {
  const { id } = useParams();
  const { success, error } = useToast();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [jobRes, appsRes] = await Promise.all([
        jobAPI.getJob(id),
        applicationAPI.getJobApplications(id, { limit: 50 }),
      ]);
      setJob(jobRes.data);
      setApplications(appsRes.data?.applications || []);
    } catch (err) {
      error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicationId) => {
    setIsProcessing(true);
    try {
      await applicationAPI.accept(applicationId);
      success('Application accepted');
      fetchData();
    } catch (err) {
      error('Failed to accept application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    setIsProcessing(true);
    try {
      await applicationAPI.reject(selectedApplication._id, { reason: rejectReason });
      success('Application rejected');
      setShowDetailModal(false);
      setRejectReason('');
      fetchData();
    } catch (err) {
      error('Failed to reject application');
    } finally {
      setIsProcessing(false);
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
      <Link to="/employer/jobs" className="flex items-center gap-2 text-gray-600 hover:text-[#0B3D2E]">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
        <p className="text-gray-600">{applications.length} applications received</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState title="No applications yet" description="Applications will appear here when candidates apply." icon="file" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applicant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applied</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{app.applicant?.fullName}</p>
                      <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(app.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg"
                        >
                          <User className="w-4 h-4" />
                        </button>
                        {app.status === 'applied' && (
                          <>
                            <button
                              onClick={() => handleAccept(app._id)}
                              disabled={isProcessing}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
        title="Application Details"
        footer={
          selectedApplication?.status === 'applied' && (
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => handleAccept(selectedApplication._id)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )
        }
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Applicant</label>
              <p className="text-gray-900">{selectedApplication.applicant?.fullName}</p>
              <p className="text-sm text-gray-500">{selectedApplication.applicant?.email}</p>
              <p className="text-sm text-gray-500">{selectedApplication.applicant?.phone}</p>
            </div>
            {selectedApplication.coverLetter && (
              <div>
                <label className="text-sm font-medium text-gray-500">Cover Letter</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedApplication.coverLetter}</p>
              </div>
            )}
            {selectedApplication.expectedSalary && (
              <div>
                <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                <p className="text-gray-900">${selectedApplication.expectedSalary}/month</p>
              </div>
            )}
            {selectedApplication.status === 'applied' && (
              <div>
                <label className="text-sm font-medium text-gray-500">Rejection Reason (if rejecting)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent resize-none"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobApplicationsPage;
