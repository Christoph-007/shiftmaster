import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/display/StatCard';
import StatusBadge from '../../components/display/StatusBadge';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';

const DashboardPage = () => {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplicants: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingApprovals: 0,
    todaySignups: 0,
  });
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getEmployers({ isApproved: false, limit: 5 }),
      ]);

      const statsData = statsRes.data || {};
      setStats({
        totalApplicants: statsData.totalApplicants || 0,
        totalEmployers: statsData.totalEmployers || 0,
        totalJobs: statsData.totalJobs || 0,
        totalApplications: statsData.totalApplications || 0,
        pendingApprovals: statsData.pendingApprovals || 0,
        todaySignups: statsData.todaySignups || 0,
      });
      
      setPendingEmployers(pendingRes.data?.employers || []);
      setRecentJobs(statsData.recentJobs || []);
    } catch (err) {
      error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (employerId) => {
    try {
      await adminAPI.approveEmployer(employerId);
      success('Employer approved successfully');
      fetchDashboardData();
    } catch (err) {
      error('Failed to approve employer');
    }
  };

  const handleReject = async (employerId) => {
    try {
      await adminAPI.rejectEmployer(employerId, { reason: 'Rejected by admin' });
      success('Employer rejected');
      fetchDashboardData();
    } catch (err) {
      error('Failed to reject employer');
    }
  };

  const statCards = [
    { title: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'blue' },
    { title: 'Total Employers', value: stats.totalEmployers, icon: Building2, color: 'indigo' },
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'green' },
    { title: 'Applications', value: stats.totalApplications, icon: FileText, color: 'purple' },
    { title: 'Pending Approvals', value: stats.pendingApprovals, icon: Calendar, color: 'amber' },
    { title: "Today's Signups", value: stats.todaySignups, icon: Users, color: 'red' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} loading={isLoading} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pending Employer Approvals</h2>
            <Link
              to="/admin/employers"
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
            ) : pendingEmployers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEmployers.map((employer) => (
                  <div
                    key={employer._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0B3D2E] rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#C8E636]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employer.storeName}</p>
                        <p className="text-sm text-gray-500">{employer.ownerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(employer._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(employer._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <Link
              to="/admin/jobs"
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
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent jobs
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-[#0B3D2E]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.employer?.storeName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={job.status} />
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
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
