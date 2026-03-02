import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  applicantSignup: (data) => api.post('/auth/applicant/signup', data),
  employerSignup: (data) => api.post('/auth/employer/signup', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  logout: () => api.post('/auth/logout'),
};

// Job APIs
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  closeJob: (id) => api.put(`/jobs/${id}/close`),
  reopenJob: (id) => api.put(`/jobs/${id}/reopen`),
  getEmployerJobs: (params) => api.get('/jobs/employer/my-jobs', { params }),
};

// Application APIs
export const applicationAPI = {
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data),
  accept: (id) => api.put(`/applications/${id}/accept`),
  reject: (id, data) => api.put(`/applications/${id}/reject`, data),
  withdraw: (id) => api.put(`/applications/${id}/withdraw`),
};

// Shift APIs
export const shiftAPI = {
  getApplicantShifts: (params) => api.get('/shifts/applicant/my-shifts', { params }),
  getEmployerShifts: (params) => api.get('/shifts/employer/my-shifts', { params }),
  createShift: (data) => api.post('/shifts', data),
  updateShift: (id, data) => api.put(`/shifts/${id}`, data),
  deleteShift: (id) => api.delete(`/shifts/${id}`),
  confirmShift: (id) => api.put(`/shifts/${id}/confirm`),
  cancelShift: (id, data) => api.put(`/shifts/${id}/cancel`, data),
};

// Attendance APIs
export const attendanceAPI = {
  getApplicantHistory: (params) => api.get('/attendance/applicant/history', { params }),
  getEmployerRecords: (params) => api.get('/attendance/employer/records', { params }),
  getShiftAttendance: (shiftId) => api.get(`/attendance/shift/${shiftId}`),
  checkIn: (shiftId, data) => api.post(`/attendance/${shiftId}/checkin`, data),
  checkOut: (shiftId, data) => api.post(`/attendance/${shiftId}/checkout`, data),
  approve: (id) => api.put(`/attendance/${id}/approve`),
  manualEntry: (data) => api.post('/attendance/manual', data),
};

// Job Request APIs
export const jobRequestAPI = {
  getReceived: (params) => api.get('/job-requests/applicant/received', { params }),
  getSent: (params) => api.get('/job-requests/employer/sent', { params }),
  send: (data) => api.post('/job-requests', data),
  accept: (id) => api.put(`/job-requests/${id}/accept`),
  decline: (id, data) => api.put(`/job-requests/${id}/decline`, data),
};

// Shortlist APIs
export const shortlistAPI = {
  getAll: (params) => api.get('/shortlist', { params }),
  check: (applicantId) => api.get(`/shortlist/check/${applicantId}`),
  add: (data) => api.post('/shortlist', data),
  update: (id, data) => api.put(`/shortlist/${id}`, data),
  remove: (id) => api.delete(`/shortlist/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Resume APIs
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: () => api.delete('/resume'),
  get: (applicantId) => api.get(`/resume/${applicantId}`),
};

// Employer Applicant APIs
export const employerApplicantAPI = {
  browse: (params) => api.get('/employer/applicants', { params }),
  getProfile: (id) => api.get(`/employer/applicants/${id}`),
  getSavedFilters: () => api.get('/employer/saved-filters'),
  saveFilters: (data) => api.put('/employer/saved-filters', data),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
  getEmployers: (params) => api.get('/admin/employers', { params }),
  approveEmployer: (id) => api.put(`/admin/employers/${id}/approve`),
  rejectEmployer: (id, data) => api.put(`/admin/employers/${id}/reject`, data),
  blockEmployer: (id) => api.put(`/admin/employers/${id}/block`),
  unblockEmployer: (id) => api.put(`/admin/employers/${id}/unblock`),
  getApplicants: (params) => api.get('/admin/applicants', { params }),
  deactivateApplicant: (id) => api.put(`/admin/applicants/${id}/deactivate`),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};

export default api;
