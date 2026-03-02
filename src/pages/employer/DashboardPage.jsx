import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Calendar, 
  Bell, 
  Heart,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import StatCard from '../../components/display/StatCard';
import EmptyState from '../../components/display/EmptyState';
import StatusBadge from '../../components/display/StatusBadge';
import { jobAPI, shiftAPI, jobRequestAPI, notificationAPI, shortlistAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const DashboardPage = () => {
  const { user, isApproved } = useAuth();
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    shifts: 0,
    shortlist: 0,
    jobRequests: 0,
    notifications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [jobsRes, shiftsRes, requestsRes, notifRes, shortlistRes] = await Promise.all([
        jobAPI.getEmployerJobs({ limit: 5 }),
        shiftAPI.getEmployerShifts({ limit: 3 }),
        jobRequestAPI.getSent({ limit: 3 }),
        notificationAPI.getUnreadCount(),
        shortlistAPI.getAll({ limit: 1 }),
      ]);

      const jobs = jobsRes.data?.jobs || [];
      setRecentJobs(jobs);
      
      // Get applications from first 2 jobs
      const appPromises = jobs.slice(0, 2).map(job => 
        jobAPI.getJob(job._id).catch(() => ({ data: { applications: [] } }))
      );
      const appResults = await Promise.all(appPromises);
      const allApps = appResults.flatMap(r => r.data?.applications || []).slice(0, 5);
      setRecentApplications(allApps);

      setUpcomingShifts(shiftsRes.data?.shifts || []);

      setStats({
        jobs: jobsRes.data?.total || 0,
        applications: allApps.length,
        shifts: shiftsRes.data?.total || 0,
        shortlist: shortlistRes.data?.total || 0,
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
    { title: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'indigo' },
    { title: 'Applications', value: stats.applications, icon: FileText, color: 'blue' },
    { title: 'Upcoming Shifts', value: stats.shifts, icon: Calendar, color: 'green' },
    { title: 'Shortlisted', value: stats.shortlist, icon: Heart, color: 'red' },
  ];

  return (
    <div className="space-y-8">
      {/* Pending Approval Banner */}
      {!isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Account Pending Approval</h3>
            <p className="text-sm text-amber-700">
              Your employer account is under review. You'll be able to post jobs once approved.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.storeName}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={isLoading} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#0B3D2E] to-[#0f4d3a] rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/employer/jobs/create"
            className={`px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-medium transition-colors ${
              !isApproved ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-[#B5D42F]'
            }`}
          >
            Post New Job
          </Link>
          <Link
            to="/employer/applicants"
            className={`px-4 py-2 bg-white/10 text-white rounded-lg font-medium transition-colors ${
              !isApproved ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-white/20'
            }`}
          >
            Browse Applicants
          </Link>
          <Link
            to="/employer/shifts/create"
            className={`px-4 py-2 bg-white/10 text-white rounded-lg font-medium transition-colors ${
              !isApproved ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-white/20'
            }`}
          >
            Create Shift
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link
              to="/employer/jobs"
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
                description="Applications will appear here when candidates apply to your jobs."
                icon="file"
              />
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0B3D2E] rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#C8E636]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant?.fullName}</p>
                        <p className="text-sm text-gray-500">Applied for {app.job?.title}</p>
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
              to="/employer/shifts"
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
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#0B3D2E]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.job?.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(shift.date)} • {shift.applicant?.fullName}
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
    </div>
  );
};

export default DashboardPage;
