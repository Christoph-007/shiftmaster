import React, { useState, useEffect } from 'react';
import { Mail, Loader2, Check, X } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { jobRequestAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

const JobRequestsPage = () => {
  const { success, error } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('sent');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOptions = [
    { value: 'sent', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'expired', label: 'Expired' },
  ];

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const params = { status: filter, limit: 20 };
      const response = await jobRequestAPI.getReceived(params);
      setRequests(response.data?.jobRequests || []);
    } catch (err) {
      error('Failed to load job requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setIsProcessing(true);
    try {
      await jobRequestAPI.accept(requestId);
      success('Job request accepted');
      fetchRequests();
    } catch (err) {
      error('Failed to accept request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await jobRequestAPI.decline(selectedRequest._id, { declineReason });
      success('Job request declined');
      setShowDeclineModal(false);
      setDeclineReason('');
      fetchRequests();
    } catch (err) {
      error('Failed to decline request');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Requests</h1>
          <p className="text-gray-600">View and respond to job offers from employers</p>
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

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No job requests"
            description="When employers send you job offers, they will appear here."
            icon="mail"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.job?.title}</h3>
                    <p className="text-sm text-gray-500">From {request.employer?.storeName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Received {formatRelativeTime(request.createdAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {request.message && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                </div>
              )}

              {request.status === 'sent' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(request._id)}
                    disabled={isProcessing}
                    className="flex-1 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowDeclineModal(true);
                    }}
                    className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              )}

              {request.status === 'declined' && request.declineReason && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Your reason: {request.declineReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Decline Job Request"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeclineModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDecline}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Decline'}
            </button>
          </div>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for declining (optional)
          </label>
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter your reason..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent resize-none"
          />
        </div>
      </Modal>
    </div>
  );
};

export default JobRequestsPage;
