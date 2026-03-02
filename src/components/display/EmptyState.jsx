import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Search, FileText, Briefcase, Users, Bell } from 'lucide-react';

const iconMap = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  job: Briefcase,
  users: Users,
  bell: Bell,
};

const EmptyState = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  icon = 'inbox',
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) => {
  const Icon = iconMap[icon] || Inbox;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {(actionLabel || onAction) && (
        actionHref ? (
          <Link
            to={actionHref}
            className="px-6 py-2.5 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-6 py-2.5 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
