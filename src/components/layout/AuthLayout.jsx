import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, Users, Building2 } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, type = 'login' }) => {
  const features = [
    { icon: CheckCircle, text: 'Free to join - no hidden fees' },
    { icon: Users, text: 'Connect with top employers' },
    { icon: Building2, text: 'Thousands of job opportunities' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B3D2E] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C8E636] rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-[#0B3D2E]" />
            </div>
            <span className="text-2xl font-bold text-white">ShiftMaster</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            {type === 'login' 
              ? 'Welcome Back!' 
              : type === 'applicant' 
                ? 'Start Your Career Journey'
                : 'Find Your Next Great Hire'}
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            {type === 'login'
              ? 'Sign in to access your dashboard and manage your account.'
              : type === 'applicant'
                ? 'Create an account to apply for jobs and get discovered by top employers.'
                : 'Join thousands of employers who trust ShiftMaster for their hiring needs.'}
          </p>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <feature.icon className="w-5 h-5 text-[#C8E636]" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-400 text-sm">
          Trusted by 10,000+ companies worldwide
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#0B3D2E]" />
              </div>
              <span className="text-xl font-bold text-[#0B3D2E]">ShiftMaster</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
