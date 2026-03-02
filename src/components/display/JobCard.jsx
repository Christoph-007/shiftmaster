import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, CheckCircle } from 'lucide-react';
import { formatSalary } from '../../utils/formatCurrency';
import StatusBadge from './StatusBadge';

const JobCard = ({ 
  job, 
  showApply = false, 
  onApply, 
  isApplied = false,
  className = '' 
}) => {
  const {
    _id,
    title,
    jobType,
    city,
    state,
    salaryAmount,
    salaryPeriod,
    status,
    employer,
    description,
  } = job;

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0B3D2E] rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6 text-[#C8E636]" />
          </div>
          <div>
            <Link 
              to={`/jobs/${_id}`}
              className="font-semibold text-gray-900 hover:text-[#0B3D2E] transition-colors line-clamp-1"
            >
              {title}
            </Link>
            <p className="text-sm text-gray-500">{employer?.storeName || 'Company'}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{city}, {state}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="capitalize">{jobType?.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{formatSalary(salaryAmount, salaryPeriod)}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {description}
      </p>

      {/* Actions */}
      {showApply && (
        <div className="flex gap-2">
          {isApplied ? (
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Applied
            </button>
          ) : (
            <button
              onClick={() => onApply?.(job)}
              className="flex-1 px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
            >
              Apply Now
            </button>
          )}
          <Link
            to={`/jobs/${_id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobCard;
