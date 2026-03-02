import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, Trash2, Send } from 'lucide-react';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { shortlistAPI, jobRequestAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ShortlistPage = () => {
  const { success, error } = useToast();
  const [shortlist, setShortlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    try {
      setIsLoading(true);
      const response = await shortlistAPI.getAll({ limit: 50 });
      setShortlist(response.data?.shortlist || []);
    } catch (err) {
      error('Failed to load shortlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await shortlistAPI.remove(id);
      success('Removed from shortlist');
      fetchShortlist();
    } catch (err) {
      error('Failed to remove from shortlist');
    }
  };

  const handleSendRequest = async () => {
    if (!selectedApplicant) return;
    setIsProcessing(true);
    try {
      await jobRequestAPI.send({
        applicantId: selectedApplicant._id,
        message: requestMessage,
      });
      success('Job request sent');
      setShowSendRequestModal(false);
      setRequestMessage('');
    } catch (err) {
      error('Failed to send request');
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shortlist</h1>
        <p className="text-gray-600">Candidates you've saved for later</p>
      </div>

      {shortlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No shortlisted candidates"
            description="Save candidates you're interested in to see them here."
            icon="heart"
            actionLabel="Browse Applicants"
            actionHref="/employer/applicants"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortlist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <Link to={`/employer/applicants/${item.applicant?._id}`} className="flex-1">
                  <h3 className="font-semibold text-gray-900 hover:text-[#0B3D2E]">{item.applicant?.fullName}</h3>
                  <p className="text-sm text-gray-500">{item.applicant?.experience} years experience</p>
                </Link>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {item.applicant?.skills?.slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/employer/applicants/${item.applicant?._id}`}
                  className="flex-1 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setSelectedApplicant(item.applicant);
                    setShowSendRequestModal(true);
                  }}
                  className="flex-1 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] text-sm flex items-center justify-center gap-1"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showSendRequestModal}
        onClose={() => setShowSendRequestModal(false)}
        title="Send Job Request"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowSendRequestModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSendRequest}
              disabled={isProcessing}
              className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] disabled:opacity-50"
            >
              {isProcessing ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        }
      >
        <div>
          <p className="text-gray-600 mb-4">
            Send a job request to <strong>{selectedApplicant?.fullName}</strong>
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <textarea
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Enter a message..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent resize-none"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ShortlistPage;
