import React, { useState, useEffect } from 'react';
import { Loader2, Download } from 'lucide-react';
import EmptyState from '../../components/display/EmptyState';
import StatusBadge from '../../components/display/StatusBadge';
import { attendanceAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatDate';

const AttendancePage = () => {
  const { error } = useToast();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await attendanceAPI.getApplicantHistory({ limit: 50 });
      setRecords(response.data?.records || []);
    } catch (err) {
      error('Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Job', 'Check In', 'Check Out', 'Status'].join(','),
      ...records.map((r) => [
        new Date(r.date).toLocaleDateString(),
        r.job?.title,
        r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '-',
        r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '-',
        r.status,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_history.csv';
    a.click();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-600">View your check-in/check-out records</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm">
          <EmptyState
            title="No attendance records"
            description="Your check-in/check-out records will appear here."
            icon="clock"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check In</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check Out</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDateTime(record.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.job?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.checkIn ? formatDateTime(record.checkIn) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.checkOut ? formatDateTime(record.checkOut) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={record.status} />
                    </td>
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

export default AttendancePage;
