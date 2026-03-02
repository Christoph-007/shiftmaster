import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  Mail,
  Bell,
  User,
  File,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ApplicantSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { path: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applicant/jobs', label: 'Browse Jobs', icon: Briefcase },
    { path: '/applicant/applications', label: 'My Applications', icon: FileText },
    { path: '/applicant/shifts', label: 'My Shifts', icon: Calendar },
    { path: '/applicant/attendance', label: 'Attendance', icon: Clock },
    { path: '/applicant/job-requests', label: 'Job Requests', icon: Mail },
    { path: '/applicant/notifications', label: 'Notifications', icon: Bell },
    { path: '/applicant/profile', label: 'Profile', icon: User },
    { path: '/applicant/resume', label: 'Resume', icon: File },
    { path: '/applicant/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/applicant/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 z-20 transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64`}
      >
        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-4 w-6 h-6 bg-[#0B3D2E] text-white rounded-full items-center justify-center shadow-md hover:bg-[#0a3528]"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="h-full overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${active 
                      ? 'bg-[#0B3D2E] text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#0B3D2E]'
                    }
                    ${isCollapsed ? 'lg:justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#C8E636]' : ''}`} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`} />
    </>
  );
};

export default ApplicantSidebar;
