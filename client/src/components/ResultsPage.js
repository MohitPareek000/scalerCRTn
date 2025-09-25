import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
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
    { id: 'skill-gaps', label: 'Skill Gaps', icon: '🎯' },
    { id: 'interview-prep', label: 'Interview Prep', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'career-path', label: 'Career Path', icon: '🛤️' }
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
      <div className="bg-white shadow-sm border-b">
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
                <h1 className="text-2xl font-bold text-gray-900">Your Career Roadmap</h1>
                <p className="text-gray-600">
                  {userData.currentRole} → {userData.targetRole}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{userData.yearsExperience} years experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Score Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {userData.analysis?.matchScore || 0}%
              </div>
              <div className="text-primary-100">Career Match Score</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-primary-400"></div>
            <div className="text-center">
              <div className="text-2xl font-semibold mb-1">
                {userData.analysis?.existingSkills?.length || 0}
              </div>
              <div className="text-primary-100">Skills You Have</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-primary-400"></div>
            <div className="text-center">
              <div className="text-2xl font-semibold mb-1">
                {userData.analysis?.missingSkills?.length || 0}
              </div>
              <div className="text-primary-100">Skills to Learn</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
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
