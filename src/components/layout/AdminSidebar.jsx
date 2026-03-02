import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/employers', label: 'Manage Employers', icon: Building2 },
    { path: '/admin/applicants', label: 'Manage Applicants', icon: Users },
    { path: '/admin/jobs', label: 'Moderate Jobs', icon: Briefcase },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
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
        className={`fixed left-0 top-16 bottom-0 bg-[#0B3D2E] border-r border-white/10 z-20 transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64`}
      >
        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-4 w-6 h-6 bg-[#C8E636] text-[#0B3D2E] rounded-full items-center justify-center shadow-md hover:bg-[#B5D42F]"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Admin Badge */}
        <div className={`px-4 py-4 border-b border-white/10 ${isCollapsed ? 'lg:flex lg:justify-center' : ''}`}>
          <div className={`flex items-center gap-2 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <Shield className="w-5 h-5 text-[#C8E636]" />
            <span className="text-white font-semibold">Admin Portal</span>
          </div>
        </div>

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
                      ? 'bg-[#C8E636] text-[#0B3D2E]' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                    ${isCollapsed ? 'lg:justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
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

export default AdminSidebar;
