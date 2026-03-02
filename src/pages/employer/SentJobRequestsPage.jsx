import React, { useState, useEffect } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import { jobRequestAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const SentJobRequestsPage = () => {
  const { error } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
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
      const response = await jobRequestAPI.getSent(params);
      setRequests(response.data?.jobRequests || []);
    } catch (err) {
      error('Failed to load job requests');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Sent Job Requests</h1>
          <p className="text-gray-600">Track job offers you've sent to applicants</p>
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
            title="No job requests sent"
            description="Send job requests to applicants from their profiles."
            icon="mail"
            actionLabel="Browse Applicants"
            actionHref="/employer/applicants"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.applicant?.fullName}</h3>
                    <p className="text-sm text-gray-500">Sent on {formatDate(request.createdAt)}</p>
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{request.message}"</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={request.status} />
              </div>
              {request.status === 'declined' && request.declineReason && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Reason: {request.declineReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentJobRequestsPage;
