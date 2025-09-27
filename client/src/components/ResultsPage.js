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
    { id: 'skill-gaps', label: 'Skill Gaps' },
    { id: 'career-path', label: 'Career Path' },
    { id: 'interview-prep', label: 'Interview Prep' },
    { id: 'projects', label: 'Projects' }
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Career Roadmap</h1>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-800">
                  <span className="font-medium">{userData.currentRole}</span>
                  <span className="opacity-60">→</span>
                  <span className="font-semibold text-primary-700">{userData.targetRole}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500"></div>
          </div>
        </div>
      </div>

      {/* Hero Banner aligned with Scaler-style visual */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Score cluster */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-extrabold tracking-tight">{userData.analysis?.matchScore || 0}%</div>
                  <div className="text-primary-100 mt-1">Career Match Score</div>
                </div>
                <div className="w-px h-16 bg-white/30 hidden md:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold">{userData.analysis?.existingSkills?.length || 0}</div>
                  <div className="text-primary-100 mt-1">Skills You Have</div>
                </div>
                <div className="w-px h-16 bg-white/30 hidden md:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold">{userData.analysis?.missingSkills?.length || 0}</div>
                  <div className="text-primary-100 mt-1">Skills to Learn</div>
                </div>
              </div>
            </div>
            {/* Social proof */}
            <div className="md:col-span-1">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                <div className="text-sm text-primary-50">Trusted by professionals</div>
                <div className="text-2xl font-bold mt-1">6,02,579+ Working Professionals</div>
                <div className="text-primary-100">transformed their career using scaler's career roadmap tool</div>
                <a
                  href="https://www.scaler.com/ai-mock-interview"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 px-4 py-2 rounded-md bg-white text-primary-700 font-semibold hover:bg-primary-50"
                >
                  Explore AI Mock Interviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl border shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-primary-600 text-white shadow'
                : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              <span>{tab.label}</span>
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
