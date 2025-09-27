import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FileText, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import LLMLearningAssistant from '../LLMLearningAssistant';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const InterviewPrepTab = ({ userData }) => {
  const [companies, setCompanies] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [experienceCompany, setExperienceCompany] = useState(null);
  const [askAICompany, setAskAICompany] = useState(null);
  const [questionIndexByCompany, setQuestionIndexByCompany] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      const all = response.data || [];
      // Filter by target role when provided
      if (userData?.targetRole === 'DevOps & Cloud Computing') {
        const filtered = all.filter(c => c.targetRole === 'DevOps & Cloud Computing');
        setCompanies(filtered.length ? filtered : all);
      } else {
        setCompanies(all.filter(c => !c.targetRole));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (idx) => {
    // Only allow one card to be expanded at a time
    console.log('Toggling card:', idx, 'Current expanded:', expandedCard);

    // Force close all other cards first, then toggle the clicked one
    if (expandedCard !== null && expandedCard !== idx) {
      setExpandedCard(null);
      setTimeout(() => setExpandedCard(idx), 50);
    } else {
      setExpandedCard(expandedCard === idx ? null : idx);
    }
  };

  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'LinkedIn': return 'bg-blue-100 text-blue-800';
      case 'Company Website': return 'bg-green-100 text-green-800';
      case 'Indeed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Interview Preparation
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore opportunities at top companies and prepare for your interviews with our comprehensive guides.
        </p>
        {/* <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
          We will be showing Interview Experience
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => {
          const uniqueId = `company-${company.id || company.name || index}`;
          const isExpanded = expandedCard === index;
          console.log(`Card ${index} (${company.name}): isExpanded=${isExpanded}, expandedCard=${expandedCard}`);

          return (
            <motion.div
              key={uniqueId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg"
            >
              {/* Company Header */}
              <button
                type="button"
                className="w-full flex items-center space-x-4 mb-4 text-left"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCard(index);
                }}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-gray-600 font-semibold text-sm" style={{ display: 'none' }}>
                    {company.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.role}</p>
                </div>
                <div className="flex items-center">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Company Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {company.salaryBand && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">Average Salary: {company.salaryBand}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {company.interviewProcess.length} rounds
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 pt-4 mt-4"
                  >
                    {/* Interview Process */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Interview Process</span>
                      </h4>
                      <div className="space-y-2">
                        {company.interviewProcess.map((stage, stageIndex) => (
                          <div key={stageIndex} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary-600">
                                {stageIndex + 1}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{stage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Questions */}
                    <div className="mb-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <h4 className="font-semibold text-gray-900">Most Asked Questions</h4>
                        </div>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          // Rotate prompt per company
                          const list = company.commonQuestions || [];
                          if (!list.length) { setAskAICompany(company); return; }
                          setQuestionIndexByCompany(prev => {
                            const next = ((prev[company.id] ?? -1) + 1) % list.length;
                            return { ...prev, [company.id]: next };
                          });
                          setAskAICompany({ ...company });
                        }} className="btn-primary inline-flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4" />
                          <span>Explore Answers</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {company.commonQuestions.map((question, qIndex) => (
                          <div key={qIndex} className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button onClick={(e) => { e.stopPropagation(); window.open('https://www.scaler.com/ai-mock-interview', '_blank'); }} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                        <ExternalLink className="w-4 h-4" />
                        <span>Explore AI Mock Interview</span>
                      </button>
                      {/* Interview Experience button removed */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Resources CTA simplified */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Ace Your Interview?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Practice with our AI-powered mock interviews and get personalized feedback to improve your performance.</p>
        <button onClick={() => window.open('https://www.scaler.com/ai-mock-interview', '_blank')} className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Explore AI Mock Interview
        </button>
      </div>

      {/* Interview Experience Modal */}
      <AnimatePresence>
        {experienceCompany && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setExperienceCompany(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto"
              role="dialog" aria-modal="true"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <img src={experienceCompany.logo} alt="logo" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{experienceCompany.name}</h3>
                    <p className="text-sm text-gray-600">{experienceCompany.role}</p>
                  </div>
                </div>
                <button onClick={() => setExperienceCompany(null)} className="btn-secondary">Close</button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interview Process</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                    {experienceCompany.interviewProcess.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Common Questions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {experienceCompany.commonQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                {experienceCompany.salaryBand && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Salary Range (India)</h4>
                    <p className="text-sm text-gray-700">{experienceCompany.salaryBand}</p>
                  </div>
                )}
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3">
                  We will be showing Interview Experience
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ask AI Modal seeded with company questions */}
      <AnimatePresence>
        {askAICompany && (
          <LLMLearningAssistant
            skill={`${askAICompany.name} ${askAICompany.role}`}
            targetRole={userData?.targetRole || 'DevOps & Cloud Computing'}
            userExperience={userData?.yearsExperience || 0}
            onClose={() => setAskAICompany(null)}
            quickQuestions={askAICompany.commonQuestions || []}
            initialUserQuestion={(askAICompany.commonQuestions || [])[(questionIndexByCompany[askAICompany.id] ?? 0) % (askAICompany.commonQuestions?.length || 1)] || ''}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPrepTab;


