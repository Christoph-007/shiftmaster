import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'indigo',
  loading = false,
  className = '',
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const accentColors = {
    indigo: 'border-indigo-500',
    green: 'border-green-500',
    amber: 'border-amber-500',
    red: 'border-red-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-100 p-5 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="w-16 h-6 bg-gray-200 rounded" />
          </div>
          <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-32 h-8 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border-l-4 ${accentColors[color]} border border-gray-100 p-5 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trendLabel && (
        <p className="text-xs text-gray-400 mt-2">{trendLabel}</p>
      )}
    </div>
  );
};

export default StatCard;
