import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { jobAPI, shiftAPI, applicationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CreateShiftPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    jobId: '',
    applicantId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
  });
  
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (formData.jobId) {
      fetchApplicants(formData.jobId);
    }
  }, [formData.jobId]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobAPI.getEmployerJobs({ status: 'open', limit: 50 });
      setJobs(response.data?.jobs || []);
    } catch (err) {
      error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const response = await applicationAPI.getJobApplications(jobId, { status: 'accepted', limit: 50 });
      setApplicants(response.data?.applications?.map(a => a.applicant) || []);
    } catch (err) {
      error('Failed to load applicants');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await shiftAPI.createShift(formData);
      success('Shift created successfully');
      navigate('/employer/shifts');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create shift');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate('/employer/shifts')} className="flex items-center gap-2 text-gray-600 hover:text-[#0B3D2E]">
        <ArrowLeft className="w-4 h-4" />
        Back to Shifts
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Shift</h1>
        <p className="text-gray-600">Schedule a work shift with an applicant</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job <span className="text-red-500">*</span></label>
          <select
            value={formData.jobId}
            onChange={(e) => setFormData({ ...formData, jobId: e.target.value, applicantId: '' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            required
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Applicant <span className="text-red-500">*</span></label>
          <select
            value={formData.applicantId}
            onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            required
            disabled={!formData.jobId}
          >
            <option value="">Select an applicant</option>
            {applicants.map((app) => (
              <option key={app._id} value={app._id}>{app.fullName}</option>
            ))}
          </select>
          {formData.jobId && applicants.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">No accepted applicants for this job yet.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Enter work location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="button" onClick={() => navigate('/employer/shifts')} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.applicantId}
            className="flex-1 px-6 py-2.5 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Create Shift
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShiftPage;
