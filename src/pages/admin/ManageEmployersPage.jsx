import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Lock, Unlock, Loader2, Eye } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatDate';

const ManageEmployersPage = () => {
  const { success, error } = useToast();
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ isApproved: '', isBlocked: '' });
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchEmployers();
  }, [debouncedSearch, filter]);

  const fetchEmployers = async () => {
    try {
      setIsLoading(true);
      const params = {
        search: debouncedSearch,
        isApproved: filter.isApproved || undefined,
        isBlocked: filter.isBlocked || undefined,
        limit: 50,
      };
      const response = await adminAPI.getEmployers(params);
      setEmployers(response.data?.employers || []);
    } catch (err) {
      error('Failed to load employers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (employerId) => {
    try {
      await adminAPI.approveEmployer(employerId);
      success('Employer approved successfully');
      fetchEmployers();
    } catch (err) {
      error('Failed to approve employer');
    }
  };

  const handleReject = async (employerId) => {
    try {
      await adminAPI.rejectEmployer(employerId, { reason: 'Rejected by admin' });
      success('Employer rejected');
      fetchEmployers();
    } catch (err) {
      error('Failed to reject employer');
    }
  };

  const handleBlock = async (employerId) => {
    try {
      await adminAPI.blockEmployer(employerId);
      success('Employer blocked');
      fetchEmployers();
    } catch (err) {
      error('Failed to block employer');
    }
  };

  const handleUnblock = async (employerId) => {
    try {
      await adminAPI.unblockEmployer(employerId);
      success('Employer unblocked');
      fetchEmployers();
    } catch (err) {
      error('Failed to unblock employer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Employers</h1>
        <p className="text-gray-400">View and manage employer accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filter.isApproved}
          onChange={(e) => setFilter({ ...filter, isApproved: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
        >
          <option value="">All Approval Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
        <select
          value={filter.isBlocked}
          onChange={(e) => setFilter({ ...filter, isBlocked: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
        >
          <option value="">All Block Status</option>
          <option value="true">Blocked</option>
          <option value="false">Active</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
          </div>
        ) : employers.length === 0 ? (
          <EmptyState title="No employers found" description="Try adjusting your filters" icon="search" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Business</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Owner</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employers.map((employer) => (
                  <tr key={employer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{employer.storeName}</p>
                      <p className="text-sm text-gray-500">{employer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employer.ownerName}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <StatusBadge status={employer.isApproved ? 'approved' : 'pending'} />
                        {employer.isBlocked && <StatusBadge status="blocked" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(employer.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployer(employer);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!employer.isApproved && (
                          <>
                            <button
                              onClick={() => handleApprove(employer._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(employer._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {employer.isApproved && (
                          employer.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(employer._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Unblock"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(employer._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Block"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Employer Details"
        size="md"
      >
        {selectedEmployer && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Business Name</label>
              <p className="text-gray-900">{selectedEmployer.storeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Owner Name</label>
              <p className="text-gray-900">{selectedEmployer.ownerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{selectedEmployer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{selectedEmployer.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">
                {selectedEmployer.address && `${selectedEmployer.address}, `}
                {selectedEmployer.city}, {selectedEmployer.state} {selectedEmployer.pincode}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Business Type</label>
              <p className="text-gray-900">{selectedEmployer.businessType || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900">{selectedEmployer.description || 'No description'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Joined</label>
              <p className="text-gray-900">{formatDate(selectedEmployer.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEmployersPage;
