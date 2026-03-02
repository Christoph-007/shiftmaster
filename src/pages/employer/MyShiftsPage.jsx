import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import { shiftAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const MyShiftsPage = () => {
  const { error } = useToast();
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchShifts();
  }, [filter]);

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      const params = { status: filter, limit: 20 };
      const response = await shiftAPI.getEmployerShifts(params);
      setShifts(response.data?.shifts || []);
    } catch (err) {
      error('Failed to load shifts');
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
          <h1 className="text-2xl font-bold text-gray-900">My Shifts</h1>
          <p className="text-gray-600">Manage scheduled shifts</p>
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
            to="/employer/shifts/create"
            className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Shift
          </Link>
        </div>
      </div>

      {shifts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No shifts scheduled"
            description="Create shifts to schedule work with applicants."
            icon="calendar"
            actionLabel="Create Shift"
            actionHref="/employer/shifts/create"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applicant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shifts.map((shift) => (
                  <tr key={shift._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{shift.job?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shift.applicant?.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(shift.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{shift.startTime} - {shift.endTime}</td>
                    <td className="px-6 py-4"><StatusBadge status={shift.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShiftsPage;
