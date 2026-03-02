import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, Briefcase, FileText, Calendar } from 'lucide-react';
import StatCard from '../../components/display/StatCard';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AnalyticsPage = () => {
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    jobsThisMonth: 0,
    applicationsThisMonth: 0,
    topCategories: [],
    recentGrowth: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data || {
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        jobsThisMonth: 0,
        applicationsThisMonth: 0,
        topCategories: [],
        recentGrowth: [],
      });
    } catch (err) {
      error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'blue' },
    { title: 'Total Jobs', value: analytics.totalJobs, icon: Briefcase, color: 'green' },
    { title: 'Total Applications', value: analytics.totalApplications, icon: FileText, color: 'purple' },
    { title: 'Active Jobs', value: analytics.activeJobs, icon: Calendar, color: 'indigo' },
  ];

  const monthlyStats = [
    { title: 'Jobs This Month', value: analytics.jobsThisMonth, icon: Briefcase, color: 'amber' },
    { title: 'Applications This Month', value: analytics.applicationsThisMonth, icon: FileText, color: 'red' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-gray-400">Overview of platform performance and metrics</p>
      </div>

      {/* Overall Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Overall Statistics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={isLoading} />
          ))}
        </div>
      </div>

      {/* Monthly Stats */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">This Month</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {monthlyStats.map((stat) => (
            <StatCard key={stat.title} {...stat} loading={isLoading} />
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Job Categories</h2>
        {analytics.topCategories?.length > 0 ? (
          <div className="space-y-3">
            {analytics.topCategories.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-gray-400">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">{cat.name}</span>
                    <span className="text-gray-500">{cat.count} jobs</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8E636] rounded-full"
                      style={{ width: `${(cat.count / analytics.topCategories[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No category data available</p>
        )}
      </div>

      {/* Growth Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0B3D2E]" />
          Platform Growth
        </h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Growth chart visualization would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
