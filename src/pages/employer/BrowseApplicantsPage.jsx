import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Loader2, Heart, Send } from 'lucide-react';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { employerApplicantAPI, shortlistAPI, jobRequestAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';

const BrowseApplicantsPage = () => {
  const { success, error } = useToast();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    skills: '',
    city: '',
    minExperience: '',
    maxExpectedRate: '',
    isAvailable: '',
  });
  const [shortlisted, setShortlisted] = useState(new Set());
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchApplicants();
  }, [debouncedSearch, filters]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: debouncedSearch,
        ...filters,
        limit: 20,
      };
      const response = await employerApplicantAPI.browse(params);
      setApplicants(response.data?.applicants || []);
      
      // Check shortlist status for each applicant
      const shortlistRes = await shortlistAPI.getAll({ limit: 100 });
      const shortlistedIds = new Set(shortlistRes.data?.shortlist?.map(s => s.applicant?._id) || []);
      setShortlisted(shortlistedIds);
    } catch (err) {
      error('Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleShortlist = async (applicantId) => {
    try {
      if (shortlisted.has(applicantId)) {
        const shortlistRes = await shortlistAPI.getAll({ applicantId });
        const item = shortlistRes.data?.shortlist?.find(s => s.applicant?._id === applicantId);
        if (item) {
          await shortlistAPI.remove(item._id);
          setShortlisted(prev => {
            const next = new Set(prev);
            next.delete(applicantId);
            return next;
          });
          success('Removed from shortlist');
        }
      } else {
        await shortlistAPI.add({ applicantId });
        setShortlisted(prev => new Set(prev).add(applicantId));
        success('Added to shortlist');
      }
    } catch (err) {
      error('Failed to update shortlist');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Applicants</h1>
        <p className="text-gray-600">Find the perfect candidates for your jobs</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skills..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            placeholder="City"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          />
          <input
            type="number"
            value={filters.minExperience}
            onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
            placeholder="Min Experience (years)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          />
          <input
            type="number"
            value={filters.maxExpectedRate}
            onChange={(e) => setFilters({ ...filters, maxExpectedRate: e.target.value })}
            placeholder="Max Hourly Rate"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          />
          <select
            value={filters.isAvailable}
            onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          >
            <option value="">All Availability</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState title="No applicants found" description="Try adjusting your filters" icon="search" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{applicant.fullName}</h3>
                  <p className="text-sm text-gray-500">{applicant.experience} years experience</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleShortlist(applicant._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      shortlisted.has(applicant._id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${shortlisted.has(applicant._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{applicant.city || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${applicant.expectedHourlyRate || 0}/hr</span>
                </div>
              </div>

              {applicant.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {applicant.skills.slice(0, 5).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{applicant.skills.length - 5}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to={`/employer/applicants/${applicant._id}`}
                  className="flex-1 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setSelectedApplicant(applicant);
                    setShowSendRequestModal(true);
                  }}
                  className="flex-1 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F]"
                >
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

export default BrowseApplicantsPage;
