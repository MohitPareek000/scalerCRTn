import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MapPin, DollarSign, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const InterviewPrepTab = ({ userData }) => {
  const [companies, setCompanies] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (companyId) => {
    setExpandedCard(expandedCard === companyId ? null : companyId);
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg cursor-pointer"
            onClick={() => toggleCard(company.id)}
          >
            {/* Company Header */}
            <div className="flex items-center space-x-4 mb-4">
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
              <div className="flex items-center space-x-1">
                {expandedCard === company.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{company.salaryBand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(company.source)}`}>
                  {company.source}
                </span>
                <span className="text-xs text-gray-500">
                  {company.interviewProcess.length} stages
                </span>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedCard === company.id && (
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
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Most Asked Questions</span>
                    </h4>
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
                    <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Start Mock Interview</span>
                    </button>
                    <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>View Job</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Ace Your Interview?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Practice with our AI-powered mock interviews and get personalized feedback to improve your performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Start Practice Session
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
              View All Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepTab;


