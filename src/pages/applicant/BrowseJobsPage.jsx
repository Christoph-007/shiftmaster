import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, X } from 'lucide-react';
import JobCard from '../../components/display/JobCard';
import EmptyState from '../../components/display/EmptyState';
import Modal from '../../components/modals/Modal';
import { jobAPI, applicationAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';

const BrowseJobsPage = () => {
  const { success, error } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ coverLetter: '', expectedSalary: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    city: '',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'shift', label: 'Shift' },
  ];

  useEffect(() => {
    fetchJobs();
  }, [debouncedSearch, filters.jobType, filters.city, currentPage]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = {
        status: 'open',
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        jobType: filters.jobType,
        city: filters.city,
      };
      
      const response = await jobAPI.getJobs(params);
      setJobs(response.data?.jobs || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', jobType: '', city: '' });
    setCurrentPage(1);
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      await applicationAPI.apply(selectedJob._id, {
        coverLetter: applyForm.coverLetter,
        expectedSalary: applyForm.expectedSalary ? parseFloat(applyForm.expectedSalary) : undefined,
      });
      success('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyForm({ coverLetter: '', expectedSalary: '' });
      fetchJobs(); // Refresh to update applied status
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveFilters = filters.search || filters.jobType || filters.city;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="jobType"
                checked={filters.jobType === type.value}
                onChange={() => handleFilterChange('jobType', type.value)}
                className="w-4 h-4 text-[#0B3D2E] focus:ring-[#C8E636]"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="jobType"
              checked={!filters.jobType}
              onChange={() => handleFilterChange('jobType', '')}
              className="w-4 h-4 text-[#0B3D2E] focus:ring-[#C8E636]"
            />
            <span className="text-sm text-gray-700">All Types</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Enter city"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-600">Find your perfect job opportunity</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by job title, company, or keywords"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Job List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm">
              <EmptyState
                title="No jobs found"
                description="Try adjusting your filters to find more opportunities."
                icon="search"
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    showApply 
                    onApply={handleApply}
                    isApplied={job.hasApplied}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={`Apply for ${selectedJob?.title}`}
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
              className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
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
              placeholder="Tell us why you're a good fit..."
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

export default BrowseJobsPage;
