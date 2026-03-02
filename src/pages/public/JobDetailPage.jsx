import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { jobAPI, applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatSalary } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import StatusBadge from '../../components/display/StatusBadge';
import Modal from '../../components/modals/Modal';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const { success, error } = useToast();
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    coverLetter: '',
    expectedSalary: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await jobAPI.getJob(id);
      setJob(response.data);
      // Check if already applied (for authenticated applicants)
      if (isAuthenticated && userType === 'applicant') {
        // This would typically come from the job response or a separate check
        setIsApplied(response.data?.hasApplied || false);
      }
    } catch (err) {
      error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (userType !== 'applicant') {
      error('Only applicants can apply for jobs');
      return;
    }
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await applicationAPI.apply(id, {
        coverLetter: applyForm.coverLetter,
        expectedSalary: applyForm.expectedSalary ? parseFloat(applyForm.expectedSalary) : undefined,
      });
      success('Application submitted successfully!');
      setIsApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.employer?.storeName}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="text-[#0B3D2E] font-semibold hover:underline">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0B3D2E] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0B3D2E] rounded-xl flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-[#C8E636]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-gray-600">{job.employer?.storeName}</p>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{job.city}, {job.state}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="capitalize">{job.jobType?.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-5 h-5" />
                  <span>{formatSalary(job.salaryAmount, job.salaryPeriod)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {job.requirements.split('\n').map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-[#C8E636]/20 text-[#0B3D2E] rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="space-y-4">
                {isApplied ? (
                  <button
                    disabled
                    className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Already Applied
                  </button>
                ) : job.status === 'open' ? (
                  <button
                    onClick={handleApply}
                    className="w-full py-3 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Job {job.status === 'filled' ? 'Filled' : 'Closed'}
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    className="flex-1 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              {/* Employer Info */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">About the Employer</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{job.employer?.storeName}</p>
                    <p className="text-sm text-gray-500">{job.employer?.businessType}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.employer?.description || 'No description available.'}
                </p>
              </div>

              {/* Job Details */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Job ID</span>
                    <span className="text-gray-900">#{id.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted On</span>
                    <span className="text-gray-900">{formatDate(job.createdAt)}</span>
                  </div>
                  {job.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expires On</span>
                      <span className="text-gray-900">{formatDate(job.expiryDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for this Job"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowApplyModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter (Optional)
            </label>
            <textarea
              value={applyForm.coverLetter}
              onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
              placeholder="Tell us why you're a good fit for this position..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary (Optional)
            </label>
            <input
              type="number"
              value={applyForm.expectedSalary}
              onChange={(e) => setApplyForm({ ...applyForm, expectedSalary: e.target.value })}
              placeholder="Enter expected salary"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
