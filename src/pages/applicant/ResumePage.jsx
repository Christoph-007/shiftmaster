import React, { useState, useEffect } from 'react';
import { Upload, File, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import EmptyState from '../../components/display/EmptyState';
import ConfirmDialog from '../../components/modals/ConfirmDialog';
import { resumeAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ResumePage = () => {
  const { success, error } = useToast();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await resumeAPI.get('me');
      setResume(response.data);
    } catch (err) {
      // No resume uploaded yet
      setResume(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      error('File size must be less than 5MB');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      error('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await resumeAPI.upload(formData);
      setResume(response.data);
      success('Resume uploaded successfully');
    } catch (err) {
      error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await resumeAPI.delete();
      setResume(null);
      success('Resume deleted successfully');
    } catch (err) {
      error('Failed to delete resume');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resume Management</h1>
        <p className="text-gray-600">Upload and manage your resume</p>
      </div>

      {resume ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{resume.filename || 'Resume'}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-[#0B3D2E] hover:bg-gray-100 rounded-lg transition-colors"
                title="View"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Replace Upload */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Upload a new resume to replace the current one</p>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-[#C8E636] bg-[#C8E636]/10' : 'border-gray-300 hover:border-[#C8E636]'
              }`}
            >
              <input
                type="file"
                id="replace-resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="replace-resume" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {isUploading ? 'Uploading...' : 'Click or drag to upload new resume'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragOver ? 'border-[#C8E636] bg-[#C8E636]/10' : 'border-gray-300 hover:border-[#C8E636]'
            }`}
          >
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="resume" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
              <p className="text-sm text-gray-600 mb-4">
                {isUploading ? 'Uploading...' : 'Drag and drop your resume here, or click to browse'}
              </p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 5MB</p>
            </label>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Resume?"
        message="Are you sure you want to delete your resume? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ResumePage;
