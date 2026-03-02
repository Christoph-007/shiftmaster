import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Ban, Eye } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatDate';

const ManageApplicantsPage = () => {
  const { success, error } = useToast();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchApplicants();
  }, [debouncedSearch]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const params = { search: debouncedSearch, limit: 50 };
      const response = await adminAPI.getApplicants(params);
      setApplicants(response.data?.applicants || []);
    } catch (err) {
      error('Failed to load applicants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (applicantId) => {
    try {
      await adminAPI.deactivateApplicant(applicantId);
      success('Applicant deactivated');
      fetchApplicants();
    } catch (err) {
      error('Failed to deactivate applicant');
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
        <h1 className="text-2xl font-bold text-white">Manage Applicants</h1>
        <p className="text-gray-400">View and manage applicant accounts</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          />
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState title="No applicants found" description="Try adjusting your search" icon="search" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applicants.map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{applicant.fullName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{applicant.email}</p>
                      <p>{applicant.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{applicant.experience || 0} years</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(applicant.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeactivate(applicant._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Deactivate"
                        >
                          <Ban className="w-4 h-4" />
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
        title="Applicant Details"
        size="md"
      >
        {selectedApplicant && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{selectedApplicant.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{selectedApplicant.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{selectedApplicant.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Experience</label>
              <p className="text-gray-900">{selectedApplicant.experience || 0} years</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Expected Hourly Rate</label>
              <p className="text-gray-900">${selectedApplicant.expectedHourlyRate || 0}/hr</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Skills</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedApplicant.skills?.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>
                )) || <span className="text-gray-500">No skills listed</span>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Joined</label>
              <p className="text-gray-900">{formatDate(selectedApplicant.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageApplicantsPage;
