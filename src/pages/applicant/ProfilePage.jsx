import React, { useState, useEffect } from 'react';
import { Loader2, Plus, X, Edit2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    experience: '',
    expectedHourlyRate: '',
    skills: [],
    jobCategories: [],
    availabilityDays: [],
    isAvailable: true,
  });
  
  const [skillInput, setSkillInput] = useState('');

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getMe();
      const profile = response.data;
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        email: profile.email || '',
        experience: profile.experience?.toString() || '',
        expectedHourlyRate: profile.expectedHourlyRate?.toString() || '',
        skills: profile.skills || [],
        jobCategories: profile.jobCategories || [],
        availabilityDays: profile.availabilityDays || [],
        isAvailable: profile.isAvailable !== false,
      });
    } catch (err) {
      error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        expectedHourlyRate: formData.expectedHourlyRate ? parseFloat(formData.expectedHourlyRate) : undefined,
        skills: formData.skills,
        jobCategories: formData.jobCategories,
        availabilityDays: formData.availabilityDays,
      };
      
      const response = await authAPI.updateMe(updateData);
      updateUser(response.data);
      success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    const newValue = !formData.isAvailable;
    setFormData({ ...formData, isAvailable: newValue });
    try {
      await authAPI.updateMe({ isAvailable: newValue });
      updateUser({ isAvailable: newValue });
      success(newValue ? 'You are now available for jobs' : 'You are now unavailable');
    } catch (err) {
      setFormData({ ...formData, isAvailable: !newValue });
      error('Failed to update availability');
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B3D2E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Availability Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Available for jobs</span>
            <button
              onClick={handleToggleAvailability}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={formData.isAvailable}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isAvailable ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#0B3D2E] text-white rounded-lg flex items-center gap-2 hover:bg-[#0a3528]"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.email || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formData.experience || '0'} years</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Hourly Rate ($)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.expectedHourlyRate}
                  onChange={(e) => setFormData({ ...formData, expectedHourlyRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">${formData.expectedHourlyRate || '0'}/hr</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          {isEditing && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#0B3D2E] text-white rounded-lg hover:bg-[#0a3528]"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#C8E636]/20 text-[#0B3D2E] rounded-full text-sm"
              >
                {skill}
                {isEditing && (
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </span>
            ))}
            {formData.skills.length === 0 && <p className="text-gray-500">No skills added</p>}
          </div>
        </div>

        {/* Job Categories */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Job Categories</h2>
          <div className="flex flex-wrap gap-2">
            {jobCategoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => isEditing && handleToggleCategory(category)}
                disabled={!isEditing}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all
                  ${formData.jobCategories.includes(category)
                    ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                    : 'bg-white text-gray-700 border-gray-300'
                  }
                  ${!isEditing ? 'cursor-default' : 'hover:border-[#0B3D2E]'}
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Days */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Days</h2>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => isEditing && handleToggleDay(day)}
                disabled={!isEditing}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all
                  ${formData.availabilityDays.includes(day)
                    ? 'bg-[#0B3D2E] text-white'
                    : 'bg-gray-100 text-gray-700'
                  }
                  ${!isEditing ? 'cursor-default' : 'hover:bg-gray-200'}
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
