import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import StatusBadge from '../../components/display/StatusBadge';
import EmptyState from '../../components/display/EmptyState';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { shiftAPI, attendanceAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const MyShiftsPage = () => {
  const { success, error } = useToast();
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, shiftId: null, action: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    fetchShifts();
  }, [filter]);

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      const params = { status: filter, limit: 20 };
      const response = await shiftAPI.getApplicantShifts(params);
      setShifts(response.data?.shifts || []);
    } catch (err) {
      error('Failed to load shifts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (shiftId) => {
    setIsProcessing(true);
    try {
      await shiftAPI.confirmShift(shiftId);
      success('Shift confirmed successfully');
      fetchShifts();
    } catch (err) {
      error('Failed to confirm shift');
    } finally {
      setIsProcessing(false);
      setConfirmDialog({ isOpen: false, shiftId: null, action: '' });
    }
  };

  const handleCheckIn = async (shiftId) => {
    if (!navigator.geolocation) {
      error('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await attendanceAPI.checkIn(shiftId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          success('Checked in successfully');
          fetchShifts();
        } catch (err) {
          error('Failed to check in');
        }
      },
      () => error('Unable to get your location')
    );
  };

  const handleCheckOut = async (shiftId) => {
    if (!navigator.geolocation) {
      error('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await attendanceAPI.checkOut(shiftId, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          success('Checked out successfully');
          fetchShifts();
        } catch (err) {
          error('Failed to check out');
        }
      },
      () => error('Unable to get your location')
    );
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
          <p className="text-gray-600">View and manage your scheduled shifts</p>
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

      {shifts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No shifts scheduled"
            description="Your scheduled shifts will appear here."
            icon="calendar"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shifts.map((shift) => (
            <div
              key={shift._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{shift.job?.title}</h3>
                    <p className="text-sm text-gray-500">{shift.employer?.storeName}</p>
                  </div>
                </div>
                <StatusBadge status={shift.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(shift.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{shift.startTime} - {shift.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{shift.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {shift.status === 'scheduled' && (
                  <button
                    onClick={() => setConfirmDialog({ isOpen: true, shiftId: shift._id, action: 'confirm' })}
                    className="flex-1 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] transition-colors"
                  >
                    Confirm Shift
                  </button>
                )}
                {shift.status === 'confirmed' && (
                  <button
                    onClick={() => handleCheckIn(shift._id)}
                    className="flex-1 py-2 bg-[#0B3D2E] text-white rounded-lg font-medium hover:bg-[#0a3528] transition-colors"
                  >
                    Check In
                  </button>
                )}
                {shift.status === 'in-progress' && (
                  <button
                    onClick={() => handleCheckOut(shift._id)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Check Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, shiftId: null, action: '' })}
        onConfirm={() => handleConfirm(confirmDialog.shiftId)}
        title="Confirm Shift?"
        message="Are you sure you want to confirm this shift?"
        confirmLabel="Confirm"
        confirmVariant="primary"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default MyShiftsPage;
