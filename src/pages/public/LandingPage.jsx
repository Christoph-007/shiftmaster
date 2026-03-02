import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import JobCard from '../../components/display/JobCard';
import { jobAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const LandingPage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobAPI.getJobs({ limit: 6, status: 'open' });
      setFeaturedJobs(response.data?.jobs || []);
    } catch (err) {
      error('Failed to load featured jobs');
      // Fallback data
      setFeaturedJobs([
        {
          _id: '1',
          title: 'Sr. User Interface Designer',
          jobType: 'full-time',
          city: 'London',
          state: 'UK',
          salaryAmount: 4500,
          salaryPeriod: 'monthly',
          status: 'open',
          employer: { storeName: 'Apple Inc.' },
          description: 'We are looking for a talented UI Designer to join our team.',
        },
        {
          _id: '2',
          title: 'PHP Developer',
          jobType: 'full-time',
          city: 'London',
          state: 'UK',
          salaryAmount: 5000,
          salaryPeriod: 'monthly',
          status: 'open',
          employer: { storeName: 'Fiverr' },
          description: 'Looking for an experienced PHP developer.',
        },
        {
          _id: '3',
          title: 'Sr. Software Engineer',
          jobType: 'full-time',
          city: 'London',
          state: 'UK',
          salaryAmount: 5500,
          salaryPeriod: 'monthly',
          status: 'open',
          employer: { storeName: 'Behance' },
          description: 'Join our engineering team as a senior software engineer.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { value: '45k+', label: 'Jobs Posted', description: 'Innovative design tools can thrust your business ahead' },
    { value: '15min+', label: 'Avg. Response', description: 'Creative design tools can drive your business ahead' },
    { value: '2000+', label: 'Companies', description: 'Revolutionary design instruments can propel your venture' },
  ];

  const steps = [
    { number: '1', title: 'Create Accounts', description: 'Sign up as an applicant or employer in just a few clicks. Set up your profile to get started.' },
    { number: '2', title: 'Complete Your Profile', description: 'Add your skills, experience, and preferences to stand out to potential employers.' },
    { number: '3', title: 'Apply Job Or Hire', description: 'Browse jobs, apply with one click, or find the perfect candidate for your open positions.' },
  ];

  const testimonials = [
    { name: 'Grace J. Park', role: 'Digital Marketer', location: 'North America', rating: 5 },
    { name: 'Melissa Sampson', role: 'Product Designer', location: 'North America', rating: 5 },
    { name: 'Lori Schkufza', role: 'Software Engineer', location: 'North America', rating: 5 },
    { name: 'Paige Stewart Enslow', role: 'UX Researcher', location: 'North America', rating: 5 },
  ];

  const companies = ['Luminous', 'Lightbox', 'FocalPoint', 'Polymath', 'Alt+Shift', 'Netcore'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#0B3D2E] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-[#C8E636] rounded-full opacity-20" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/20 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#C8E636] rounded-full" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Build & Ship a Job<br />Board Fast with ShiftMaster
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Connect with top talent and find your dream job. The most efficient platform for job seekers and employers.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white rounded-full p-2 shadow-lg">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search Your Needs"
                  className="flex-1 py-2 outline-none text-gray-700"
                />
              </div>
              <div className="flex items-center border-l px-4">
                <select className="bg-transparent outline-none text-gray-700 cursor-pointer">
                  <option>Web Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
              <button className="bg-[#C8E636] text-[#0B3D2E] px-6 py-3 rounded-full font-semibold hover:bg-[#B5D42F] transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="text-gray-400 text-sm">Popular Jobs:</span>
            {['Designer', 'Web Developer', 'Software Engineer', 'Marketing'].map((tag) => (
              <Link
                key={tag}
                to={`/jobs?category=${tag}`}
                className="text-white text-sm hover:text-[#C8E636] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 bg-[#0B3D2E] rounded-full border-2 border-white" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-[#0B3D2E]">3k+</p>
                  <p className="text-xs text-gray-500">Active Jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="max-w-7xl mx-auto mt-16">
          <p className="text-gray-400 text-sm mb-6">Trusted By 1M+ Business</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {companies.map((company) => (
              <span key={company} className="text-white font-semibold">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Get things Done with<br />Minimal Effort
              </h2>
              <p className="text-gray-600 mb-8">
                Our platform streamlines the hiring process, making it easier than ever to find the perfect match.
              </p>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#C8E636] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-[#0B3D2E]">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=500&fit=crop"
                alt="How it works"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#0B3D2E] text-white p-6 rounded-xl">
                <p className="font-semibold mb-2">Made for professionals</p>
                <p className="text-sm text-gray-300">Change your website into a true sector leader.</p>
                <button className="mt-4 px-4 py-2 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold text-sm">
                  Upload Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-[#0B3D2E] mb-2">{stat.value}</p>
                <p className="font-semibold text-gray-900 mb-2">{stat.label}</p>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Jobs Grid */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Job Circulars</h2>
              
              {/* Search & Filter */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center border rounded-lg px-4 py-2">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search Your Needs"
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>
                <select className="border rounded-lg px-4 py-2 outline-none">
                  <option>Web Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
                <button className="bg-[#C8E636] text-[#0B3D2E] px-4 py-2 rounded-lg font-semibold">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm text-gray-500">Popular Categories:</span>
                {['Designer', 'Web Developer', 'Software Engineer', 'Doctors', 'Marketing'].map((cat) => (
                  <button
                    key={cat}
                    className="px-3 py-1 text-sm border rounded-full hover:bg-[#0B3D2E] hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Jobs Grid */}
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )}

              <button className="w-full mt-8 py-3 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors">
                Load More
              </button>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* CTA Card */}
              <div className="bg-[#0B3D2E] rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Your Next Great Hire is Just a Click Away!</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Post your job today and quickly connect with top talent. Our user-friendly platform streamlines hiring.
                </p>
                <Link
                  to="/signup/employer"
                  className="block w-full text-center px-4 py-3 bg-[#C8E636] text-[#0B3D2E] rounded-lg font-semibold hover:bg-[#B5D42F] transition-colors"
                >
                  Post Job On ShiftMaster
                </Link>
              </div>

              {/* Featured Companies */}
              <div className="bg-white border rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Featured Company</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Behance', location: 'London, UK' },
                    { name: 'Microsoft', location: 'USA' },
                    { name: 'Fiverr', location: 'London, UK' },
                    { name: 'Intel', location: 'London, UK' },
                  ].map((company) => (
                    <div key={company.name} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Profiles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Creative Profiles Make your<br />Profile & get Eyeballs
            </h2>
            <Link
              to="/jobs"
              className="px-6 py-3 bg-[#0B3D2E] text-white rounded-full font-semibold hover:bg-[#0a3528] transition-colors"
            >
              Browse the Team
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((person) => (
              <div key={person.name} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=300&h=300&fit=crop&crop=face`}
                  alt={person.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{person.location}</p>
                  <p className="font-semibold text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why teams love ShiftMaster's<br />Hiring Software
          </h2>
          <p className="text-gray-600 mb-8">
            ShiftMaster's Customers share a passion for nurturing company culture. We all agree hiring can be more meaningful and personal.
          </p>
          <Link
            to="/signup/employer"
            className="inline-block px-8 py-4 bg-[#C8E636] text-[#0B3D2E] rounded-full font-semibold hover:bg-[#B5D42F] transition-colors"
          >
            About Our Customers
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
