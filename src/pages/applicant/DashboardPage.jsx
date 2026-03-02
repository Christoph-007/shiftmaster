import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell, 
  Mail,
  ArrowRight,
  Loader2
} from 'lucide-react';
import StatCard from '../../components/display/StatCard';
import JobCard from '../../components/display/JobCard';
import EmptyState from '../../components/display/EmptyState';
import StatusBadge from '../../components/display/StatusBadge';
import { applicationAPI, shiftAPI, jobRequestAPI, notificationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const DashboardPage = () => {
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    shifts: 0,
    jobRequests: 0,
    notifications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [appsRes, shiftsRes, requestsRes, notifRes] = await Promise.all([
        applicationAPI.getMyApplications({ limit: 3 }),
        shiftAPI.getApplicantShifts({ limit: 2 }),
        jobRequestAPI.getReceived({ status: 'sent', limit: 1 }),
        notificationAPI.getUnreadCount(),
      ]);

      setRecentApplications(appsRes.data?.applications || []);
      setUpcomingShifts(shiftsRes.data?.shifts || []);
      setRecentRequests(requestsRes.data?.jobRequests || []);
      setNotifications(notifRes.data?.count || 0);

      setStats({
        applications: appsRes.data?.total || 0,
        shifts: shiftsRes.data?.total || 0,
        jobRequests: requestsRes.data?.total || 0,
        notifications: notifRes.data?.count || 0,
      });
    } catch (err) {
      error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: 'My Applications', value: stats.applications, icon: FileText, color: 'blue', trend: 12 },
    { title: 'Upcoming Shifts', value: stats.shifts, icon: Calendar, color: 'green' },
    { title: 'Job Requests', value: stats.jobRequests, icon: Mail, color: 'amber' },
    { title: 'Notifications', value: stats.notifications, icon: Bell, color: 'purple' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your job search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#0B3D2E] to-[#0f4d3a] rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/applicant/jobs"
            className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] transition-colors"
          >
            Browse Jobs
          </Link>
          <Link
            to="/applicant/applications"
            className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            View Applications
          </Link>
          <Link
            to="/applicant/shifts"
            className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            My Shifts
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link
              to="/applicant/applications"
              className="text-sm text-[#0B3D2E] font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <EmptyState
                title="No applications yet"
                description="Start applying to jobs to see them here."
                icon="file"
                actionLabel="Browse Jobs"
                actionHref="/applicant/jobs"
              />
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0B3D2E] rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-[#C8E636]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.job?.title}</p>
                        <p className="text-sm text-gray-500">{app.job?.employer?.storeName}</p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
            <Link
              to="/applicant/shifts"
              className="text-sm text-[#0B3D2E] font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingShifts.length === 0 ? (
              <EmptyState
                title="No upcoming shifts"
                description="Your scheduled shifts will appear here."
                icon="calendar"
              />
            ) : (
              <div className="space-y-4">
                {upcomingShifts.map((shift) => (
                  <div
                    key={shift._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#0B3D2E]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.job?.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(shift.date)} • {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={shift.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Requests */}
      {recentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">New Job Requests</h2>
            <Link
              to="/applicant/job-requests"
              className="text-sm text-[#0B3D2E] font-medium flex items-center gap-1 hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Job offer from {request.employer?.storeName}
                      </p>
                      <p className="text-sm text-gray-500">{request.job?.title}</p>
                    </div>
                  </div>
                  <Link
                    to="/applicant/job-requests"
                    className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium hover:bg-[#B5D42F] transition-colors"
                  >
                    Respond
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
