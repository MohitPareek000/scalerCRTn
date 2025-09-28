import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SkillGapsTab from './tabs/SkillGapsTab';
import InterviewPrepTab from './tabs/InterviewPrepTab';
import ProjectsTab from './tabs/ProjectsTab';
import CareerPathTab from './tabs/CareerPathTab';

const ResultsPage = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('skill-gaps');

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No data available</h2>
          <p className="text-gray-600 mb-6">Please complete the assessment first.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'skill-gaps', label: 'Skill Gaps', description: 'Identify missing skills & prioritize learning' },
    { id: 'career-path', label: 'Career Path', description: 'Step-by-step learning roadmap' },
    { id: 'interview-prep', label: 'Interview Prep', description: 'Company insights & interview tips' },
    { id: 'projects', label: 'Projects', description: 'Build portfolio & showcase skills' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'skill-gaps':
        return <SkillGapsTab userData={userData} />;
      case 'interview-prep':
        return <InterviewPrepTab userData={userData} />;
      case 'projects':
        return <ProjectsTab userData={userData} />;
      case 'career-path':
        return <CareerPathTab userData={userData} />;
      default:
        return <SkillGapsTab userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - starts from top */}
      <section className="bg-primary-600 text-white relative">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Career Roadmap</h1>
                <div className="mt-1 text-sm text-primary-100">
                  {userData.currentRole} → {userData.targetRole}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Key Metrics - Left Side */}
            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-8 sm:mt-12">
                <div className="text-center bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2">{userData.analysis?.matchScore || 0}%</div>
                  <div className="text-primary-600 text-xs sm:text-sm font-semibold">Career Match Score</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2">{userData.analysis?.existingSkills?.length || 0}</div>
                  <div className="text-primary-600 text-xs sm:text-sm font-semibold">Skills You Have</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold text-primary-700 mb-2">{userData.analysis?.missingSkills?.length || 0}</div>
                  <div className="text-primary-600 text-xs sm:text-sm font-semibold">Skills to Learn</div>
                </div>
              </div>

              {/* Section Overview Header */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-white/30"></div>
                <span className="px-4 text-white/80 text-sm font-medium">Your Career Roadmap Includes</span>
                <div className="flex-1 h-px bg-white/30"></div>
              </div>

              {/* Section Overview */}
              <div className="bg-white/10 rounded-lg p-2 border border-white/20 backdrop-blur-sm">
                <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-2 sm:gap-2">
                  <button
                    onClick={() => setActiveTab('skill-gaps')}
                    className="text-center hover:bg-white/10 rounded-lg p-1 transition-all duration-200 cursor-pointer w-full sm:flex-1 sm:max-w-28"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mb-0.5 mx-auto">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-white text-xs font-medium mb-0.5">Skill Gaps</div>
                    <div className="text-primary-100 text-xs">Identify missing skills & prioritize learning</div>
                  </button>

                  <div className="hidden sm:block">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <button
                    onClick={() => setActiveTab('career-path')}
                    className="text-center hover:bg-white/10 rounded-lg p-1 transition-all duration-200 cursor-pointer w-full sm:flex-1 sm:max-w-28"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mb-0.5 mx-auto">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-white text-xs font-medium mb-0.5">Career Path</div>
                    <div className="text-primary-100 text-xs">Step-by-step learning roadmap</div>
                  </button>

                  <div className="hidden sm:block">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <button
                    onClick={() => setActiveTab('interview-prep')}
                    className="text-center hover:bg-white/10 rounded-lg p-1 transition-all duration-200 cursor-pointer w-full sm:flex-1 sm:max-w-28"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mb-0.5 mx-auto">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-white text-xs font-medium mb-0.5">Interview Prep</div>
                    <div className="text-primary-100 text-xs">Company insights & interview tips</div>
                  </button>

                  <div className="hidden sm:block">
                    <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-center hover:bg-white/10 rounded-lg p-1 transition-all duration-200 cursor-pointer w-full sm:flex-1 sm:max-w-28"
                  >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mb-0.5 mx-auto">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-white text-xs font-medium mb-0.5">Projects</div>
                    <div className="text-primary-100 text-xs">Build portfolio & showcase skills</div>
                  </button>
                </div>
              </div>

            </div>
            {/* Career Questions CTA */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-lg p-5 border border-white/30 shadow-lg max-w-md mx-auto mt-8 lg:mt-12">
                <div className="text-center mb-4">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Need Guidance?</h3>
                </div>

                <div className="bg-white/15 rounded-lg p-4 mb-4 border border-white/25">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white mb-1">100+</div>
                    <div className="text-sm font-semibold text-white">Certified Tech Counsellors</div>
                    <div className="text-xs text-primary-100">Ready to help you succeed</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-4 py-2.5 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 hover:scale-105 transform transition-all duration-200 shadow-md text-sm">
                    Request a Callback
                  </button>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 text-xs text-primary-100">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        <span>Free Consultation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                        <span>Expert Guidance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-8 bg-white p-1 rounded-xl border shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-col items-center justify-center space-y-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-primary-600 text-white shadow'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
