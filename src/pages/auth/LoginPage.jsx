import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI } from '../../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    userType: 'applicant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Email or phone is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      login(token, user);
      success('Login successful!');
      
      // Redirect based on role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (user.userType === 'applicant') {
        navigate('/applicant/dashboard');
      } else if (user.userType === 'employer') {
        navigate('/employer/dashboard');
      } else if (user.userType === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    { value: 'applicant', label: 'Applicant' },
    { value: 'employer', label: 'Employer' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account" type="login">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I am a
          </label>
          <div className="grid grid-cols-3 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, userType: type.value })}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all
                  ${formData.userType === type.value
                    ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email/Phone */}
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone
          </label>
          <input
            type="text"
            id="identifier"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            placeholder="Enter your email or phone"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent transition-all
              ${errors.identifier ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-[#C8E636] focus:border-transparent transition-all
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0B3D2E] focus:ring-[#C8E636]" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-[#0B3D2E] hover:underline">
            Forgot password?
          </Link>
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup/applicant" className="text-[#0B3D2E] font-semibold hover:underline">
            Sign up as Applicant
          </Link>
          {' or '}
          <Link to="/signup/employer" className="text-[#0B3D2E] font-semibold hover:underline">
            Employer
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
