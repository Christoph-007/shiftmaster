import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI, resumeAPI } from '../../services/api';

const ApplicantSignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    experience: '',
    expectedHourlyRate: '',
    skills: [],
    jobCategories: [],
    availabilityDays: [],
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const jobCategoryOptions = [
    'Web Development',
    'Design',
    'Marketing',
    'Sales',
    'Customer Service',
    'Data Entry',
    'Writing',
    'Accounting',
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleToggleDay = (day) => {
    const newDays = formData.availabilityDays.includes(day)
      ? formData.availabilityDays.filter((d) => d !== day)
      : [...formData.availabilityDays, day];
    setFormData({ ...formData, availabilityDays: newDays });
  };

  const handleToggleCategory = (category) => {
    const newCategories = formData.jobCategories.includes(category)
      ? formData.jobCategories.filter((c) => c !== category)
      : [...formData.jobCategories, category];
    setFormData({ ...formData, jobCategories: newCategories });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('File size must be less than 5MB');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        error('Only PDF, DOC, and DOCX files are allowed');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Signup
      const signupData = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        expectedHourlyRate: formData.expectedHourlyRate ? parseFloat(formData.expectedHourlyRate) : undefined,
        skills: formData.skills,
        jobCategories: formData.jobCategories,
        availabilityDays: formData.availabilityDays,
      };

      const response = await authAPI.applicantSignup(signupData);
      const { token, user } = response.data;

      // Upload resume if provided
      if (resumeFile && token) {
        try {
          const formData = new FormData();
          formData.append('resume', resumeFile);
          await resumeAPI.upload(formData);
        } catch (err) {
          console.error('Resume upload failed:', err);
        }
      }

      login(token, user);
      success('Account created successfully!');
      navigate('/applicant/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Applicant Account" subtitle="Join thousands of job seekers" type="applicant">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent
                ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="1234567890"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Professional Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Hourly Rate ($)
            </label>
            <input
              type="number"
              value={formData.expectedHourlyRate}
              onChange={(e) => setFormData({ ...formData, expectedHourlyRate: e.target.value })}
              placeholder="25"
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add a skill and press Enter"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-[#0B3D2E] text-white rounded-lg hover:bg-[#0a3528] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#C8E636]/20 text-[#0B3D2E] rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Job Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Job Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {jobCategoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleToggleCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all
                  ${formData.jobCategories.includes(category)
                    ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#0B3D2E]'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Days
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleToggleDay(day)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all
                  ${formData.availabilityDays.includes(day)
                    ? 'bg-[#0B3D2E] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resume (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C8E636] transition-colors">
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resume" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOC, DOCX, max 5MB)'}
              </p>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#0B3D2E] text-white rounded-lg font-semibold hover:bg-[#0a3528] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0B3D2E] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ApplicantSignupPage;
