import React from 'react';

const statusConfig = {
  // Job statuses
  open: { label: 'Open', className: 'bg-green-100 text-green-800' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
  filled: { label: 'Filled', className: 'bg-blue-100 text-blue-800' },
  
  // Application statuses
  applied: { label: 'Applied', className: 'bg-blue-100 text-blue-800' },
  reviewing: { label: 'Reviewing', className: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  withdrawn: { label: 'Withdrawn', className: 'bg-gray-100 text-gray-800' },
  
  // Shift statuses
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
  'in-progress': { label: 'In Progress', className: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  
  // Job request statuses
  sent: { label: 'Sent', className: 'bg-amber-100 text-amber-800' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-800' },
  expired: { label: 'Expired', className: 'bg-gray-100 text-gray-800' },
  
  // Attendance statuses
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  disputed: { label: 'Disputed', className: 'bg-red-100 text-red-800' },
  
  // Employer approval statuses
  true: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  false: { label: 'Pending', className: 'bg-amber-100 text-amber-800' },
  blocked: { label: 'Blocked', className: 'bg-red-100 text-red-800' },
  
  // User statuses
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
  deactivated: { label: 'Deactivated', className: 'bg-red-100 text-red-800' },
  
  // Availability
  available: { label: 'Available', className: 'bg-green-100 text-green-800' },
  unavailable: { label: 'Unavailable', className: 'bg-gray-100 text-gray-800' },
};

const StatusBadge = ({ 
  status, 
  className = '',
  size = 'md'
}) => {
  const config = statusConfig[status?.toString()?.toLowerCase()] || { 
    label: status || 'Unknown', 
    className: 'bg-gray-100 text-gray-800' 
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses[size]} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
