import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ApplicantSidebar from './components/layout/ApplicantSidebar';
import EmployerSidebar from './components/layout/EmployerSidebar';
import AdminSidebar from './components/layout/AdminSidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import BrowseJobsPage from './pages/public/BrowseJobsPage';
import JobDetailPage from './pages/public/JobDetailPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ApplicantSignupPage from './pages/auth/ApplicantSignupPage';
import EmployerSignupPage from './pages/auth/EmployerSignupPage';

// Applicant Pages
import ApplicantDashboard from './pages/applicant/DashboardPage';
import ApplicantBrowseJobs from './pages/applicant/BrowseJobsPage';
import MyApplicationsPage from './pages/applicant/MyApplicationsPage';
import MyShiftsPage from './pages/applicant/MyShiftsPage';
import AttendancePage from './pages/applicant/AttendancePage';
import JobRequestsPage from './pages/applicant/JobRequestsPage';
import ApplicantNotifications from './pages/applicant/NotificationsPage';
import ApplicantProfile from './pages/applicant/ProfilePage';
import ResumePage from './pages/applicant/ResumePage';
import ApplicantSettings from './pages/applicant/SettingsPage';

// Employer Pages
import EmployerDashboard from './pages/employer/DashboardPage';
import MyJobsPage from './pages/employer/MyJobsPage';
import CreateJobPage from './pages/employer/CreateJobPage';
import EditJobPage from './pages/employer/EditJobPage';
import JobApplicationsPage from './pages/employer/JobApplicationsPage';
import BrowseApplicantsPage from './pages/employer/BrowseApplicantsPage';
import ApplicantProfilePage from './pages/employer/ApplicantProfilePage';
import ShortlistPage from './pages/employer/ShortlistPage';
import SentJobRequestsPage from './pages/employer/SentJobRequestsPage';
import EmployerShiftsPage from './pages/employer/MyShiftsPage';
import CreateShiftPage from './pages/employer/CreateShiftPage';
import EmployerAttendancePage from './pages/employer/AttendancePage';
import EmployerNotifications from './pages/employer/NotificationsPage';
import EmployerProfile from './pages/employer/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import ManageEmployersPage from './pages/admin/ManageEmployersPage';
import ManageApplicantsPage from './pages/admin/ManageApplicantsPage';
import ModerateJobsPage from './pages/admin/ModerateJobsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

// Layout wrapper for portal pages
const PortalLayout = ({ children, sidebar: Sidebar }) => (
  <div className="min-h-screen bg-gray-50 pt-16">
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
);

// Public layout with footer
const PublicLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

function App() {
  const { isAuthenticated, userType } = useAuth();

  // Redirect authenticated users away from auth pages
  const AuthRedirect = ({ children }) => {
    if (isAuthenticated) {
      if (userType === 'applicant') return <Navigate to="/applicant/dashboard" />;
      if (userType === 'employer') return <Navigate to="/employer/dashboard" />;
      if (userType === 'admin') return <Navigate to="/admin/dashboard" />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/jobs" element={<PublicLayout><BrowseJobsPage /></PublicLayout>} />
      <Route path="/jobs/:id" element={<PublicLayout><JobDetailPage /></PublicLayout>} />

      {/* Auth Routes */}
      <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
      <Route path="/signup/applicant" element={<AuthRedirect><ApplicantSignupPage /></AuthRedirect>} />
      <Route path="/signup/employer" element={<AuthRedirect><EmployerSignupPage /></AuthRedirect>} />

      {/* Applicant Portal Routes */}
      <Route path="/applicant/dashboard" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ApplicantDashboard /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/jobs" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ApplicantBrowseJobs /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/applications" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><MyApplicationsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/shifts" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><MyShiftsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/attendance" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><AttendancePage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/job-requests" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><JobRequestsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/notifications" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ApplicantNotifications /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/profile" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ApplicantProfile /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/resume" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ResumePage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/applicant/settings" element={
        <ProtectedRoute role="applicant">
          <PortalLayout sidebar={ApplicantSidebar}><ApplicantSettings /></PortalLayout>
        </ProtectedRoute>
      } />

      {/* Employer Portal Routes */}
      <Route path="/employer/dashboard" element={
        <ProtectedRoute role="employer">
          <PortalLayout sidebar={EmployerSidebar}><EmployerDashboard /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><MyJobsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs/create" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><CreateJobPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs/:id/edit" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><EditJobPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/jobs/:id/applicants" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><JobApplicationsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/applicants" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><BrowseApplicantsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/applicants/:id" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><ApplicantProfilePage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/shortlist" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><ShortlistPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/job-requests" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><SentJobRequestsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/shifts" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><EmployerShiftsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/shifts/create" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><CreateShiftPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/attendance" element={
        <ProtectedRoute role="employer" requireApproved>
          <PortalLayout sidebar={EmployerSidebar}><EmployerAttendancePage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/notifications" element={
        <ProtectedRoute role="employer">
          <PortalLayout sidebar={EmployerSidebar}><EmployerNotifications /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/employer/profile" element={
        <ProtectedRoute role="employer">
          <PortalLayout sidebar={EmployerSidebar}><EmployerProfile /></PortalLayout>
        </ProtectedRoute>
      } />

      {/* Admin Portal Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin">
          <PortalLayout sidebar={AdminSidebar}><AdminDashboard /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/employers" element={
        <ProtectedRoute role="admin">
          <PortalLayout sidebar={AdminSidebar}><ManageEmployersPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/applicants" element={
        <ProtectedRoute role="admin">
          <PortalLayout sidebar={AdminSidebar}><ManageApplicantsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/jobs" element={
        <ProtectedRoute role="admin">
          <PortalLayout sidebar={AdminSidebar}><ModerateJobsPage /></PortalLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute role="admin">
          <PortalLayout sidebar={AdminSidebar}><AnalyticsPage /></PortalLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
