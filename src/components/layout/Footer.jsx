import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/' },
      { label: 'Careers', path: '/jobs' },
      { label: 'Blog', path: '/' },
      { label: 'Press', path: '/' },
    ],
    jobSeekers: [
      { label: 'Browse Jobs', path: '/jobs' },
      { label: 'Create Account', path: '/signup/applicant' },
      { label: 'Job Alerts', path: '/' },
      { label: 'Career Advice', path: '/' },
    ],
    employers: [
      { label: 'Post a Job', path: '/signup/employer' },
      { label: 'Search Resumes', path: '/signup/employer' },
      { label: 'Recruiting Solutions', path: '/' },
      { label: 'Pricing', path: '/' },
    ],
    support: [
      { label: 'Help Center', path: '/' },
      { label: 'Contact Us', path: '/' },
      { label: 'Privacy Policy', path: '/' },
      { label: 'Terms of Service', path: '/' },
    ],
  };

  return (
    <footer className="bg-[#0B3D2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#0B3D2E]" />
              </div>
              <span className="text-2xl font-bold">ShiftMaster</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Connecting talented professionals with amazing opportunities. 
              Find your dream job or hire the perfect candidate.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-[#C8E636]" />
                <span>support@shiftmaster.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-[#C8E636]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-[#C8E636]" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#C8E636] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Seekers Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Seekers</h3>
            <ul className="space-y-3">
              {footerLinks.jobSeekers.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#C8E636] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Employers</h3>
            <ul className="space-y-3">
              {footerLinks.employers.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#C8E636] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-[#C8E636] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            {currentYear} ShiftMaster. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C8E636] hover:text-[#0B3D2E] transition-all"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C8E636] hover:text-[#0B3D2E] transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C8E636] hover:text-[#0B3D2E] transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#C8E636] hover:text-[#0B3D2E] transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
