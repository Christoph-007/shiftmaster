import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Briefcase, Loader2, Heart, Send } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import Modal from '../../components/modals/Modal';
import { employerApplicantAPI, shortlistAPI, jobRequestAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ApplicantProfilePage = () => {
  const { id } = useParams();
  const { success, error } = useToast();
  const [applicant, setApplicant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  const fetchApplicant = async () => {
    try {
      setIsLoading(true);
      const response = await employerApplicantAPI.getProfile(id);
      setApplicant(response.data);
      
      const shortlistRes = await shortlistAPI.check(id);
      setIsShortlisted(shortlistRes.data?.isShortlisted || false);
    } catch (err) {
      error('Failed to load applicant profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleShortlist = async () => {
    try {
      if (isShortlisted) {
        const shortlistRes = await shortlistAPI.getAll({ applicantId: id });
        const item = shortlistRes.data?.shortlist?.find(s => s.applicant?._id === id);
        if (item) {
          await shortlistAPI.remove(item._id);
          setIsShortlisted(false);
          success('Removed from shortlist');
        }
      } else {
        await shortlistAPI.add({ applicantId: id });
        setIsShortlisted(true);
        success('Added to shortlist');
      }
    } catch (err) {
      error('Failed to update shortlist');
    }
  };

  const handleSendRequest = async () => {
    setIsProcessing(true);
    try {
      await jobRequestAPI.send({
        applicantId: id,
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

  if (!applicant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Applicant not found</p>
        <Link to="/employer/applicants" className="text-[#0B3D2E] hover:underline mt-2 inline-block">
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/employer/applicants" className="flex items-center gap-2 text-gray-600 hover:text-[#0B3D2E]">
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#0B3D2E] rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#C8E636]">
                {applicant.fullName?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{applicant.fullName}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  {applicant.experience || 0} years experience
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  ${applicant.expectedHourlyRate || 0}/hr
                </span>
                <StatusBadge status={applicant.isAvailable ? 'available' : 'unavailable'} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleShortlist}
              className={`p-3 rounded-lg transition-colors ${
                isShortlisted
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowSendRequestModal(true)}
              className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Request
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>{applicant.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>{applicant.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{applicant.city ? `${applicant.city}, ${applicant.state}` : 'Location not specified'}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="flex flex-wrap gap-2">
              {applicant.availabilityDays?.map((day) => (
                <span key={day} className="px-3 py-1 bg-[#C8E636]/20 text-[#0B3D2E] rounded-full text-sm">
                  {day}
                </span>
              )) || <span className="text-gray-500">Not specified</span>}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {applicant.skills?.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            )) || <span className="text-gray-500">No skills listed</span>}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Job Categories</h2>
          <div className="flex flex-wrap gap-2">
            {applicant.jobCategories?.map((cat) => (
              <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {cat}
              </span>
            )) || <span className="text-gray-500">Not specified</span>}
          </div>
        </div>
      </div>

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
            Send a job request to <strong>{applicant.fullName}</strong>
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

export default ApplicantProfilePage;
