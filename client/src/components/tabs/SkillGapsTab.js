import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, MessageCircle } from 'lucide-react';
import axios from 'axios';
import LLMLearningAssistant from '../LLMLearningAssistant';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const SkillGapsTab = ({ userData }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillDetails, setSkillDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLLMAssistant, setShowLLMAssistant] = useState(false);

  const handleSkillClick = async (skill) => {
    setSelectedSkill(skill);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/skill-details`, {
        skill,
        targetRole: userData.targetRole,
        userExperience: userData.yearsExperience
      });
      setSkillDetails(response.data);
    } catch (error) {
      console.error('Error fetching skill details:', error);
      // Fallback data
      setSkillDetails({
        skill,
        definition: `${skill} is a fundamental technology in modern software development.`,
        whyItMatters: `Mastering ${skill} will open doors to better opportunities and higher salaries.`,
        starterTasks: [
          `Complete a comprehensive ${skill} course`,
          `Build a portfolio project showcasing ${skill}`,
          `Contribute to open-source projects using ${skill}`
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeSidePanel = () => {
    setSelectedSkill(null);
    setSkillDetails(null);
  };

  const existingSkills = userData.analysis?.existingSkills || [];
  const missingSkills = userData.analysis?.missingSkills || [];
  const prioritizedMissing = userData.analysis?.prioritizedMissing || [];

  const tiers = React.useMemo(() => {
    if (!prioritizedMissing.length) return null;
    const high = [];
    const medium = [];
    const low = [];
    prioritizedMissing.forEach(item => {
      const priority = item.priority || 'Low';
      if (priority === 'High') high.push(item);
      else if (priority === 'Medium') medium.push(item);
      else low.push(item);
    });
    return {
      high,
      medium,
      low,
      counts: {
        high: high.length,
        medium: medium.length,
        low: low.length
      }
    };
  }, [prioritizedMissing]);

  return (
    <div className="space-y-8">

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Existing Skills */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-success-500" />
            <span>Your Current Skills ({existingSkills.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {existingSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="skill-chip existing"
              >
                <span className="mr-1 text-xs px-1 py-0.5 rounded bg-success-100 border border-success-200">{index + 1}</span>
                <span className="font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-danger-500" />
            <span>Skills to Learn</span>
          </h3>
          <p className="text-sm text-gray-600">Click on the Skill to Learn More</p>

          {tiers ? (
            <div className="space-y-4">
              {/* High Priority */}
              {tiers.high.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">High Priority ({tiers.counts.high})</div>
                  <div className="flex flex-wrap gap-2">
                    {tiers.high.map((item, index) => (
                      <motion.button
                        key={item.skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSkillClick(item.skill)}
                        className="skill-chip missing shadow-sm bg-white border-gray-300 text-gray-800 hover:shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={item.reason}
                      >
                        <span className="mr-1 text-xs px-1 py-0.5 rounded bg-gray-100 border border-gray-200">{index + 1}</span>
                        <span className="font-medium">{item.skill}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Priority */}
              {tiers.medium.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Medium Priority ({tiers.counts.medium})</div>
                  <div className="flex flex-wrap gap-2">
                    {tiers.medium.map((item, index) => (
                      <motion.button
                        key={item.skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSkillClick(item.skill)}
                        className="skill-chip missing shadow-sm bg-white border-gray-300 text-gray-800 hover:shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={item.reason}
                      >
                        <span className="mr-1 text-xs px-1 py-0.5 rounded bg-gray-100 border border-gray-200">{index + 1}</span>
                        <span className="font-medium">{item.skill}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority */}
              {tiers.low.length > 0 && (
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Low Priority ({tiers.counts.low})</div>
                  <div className="flex flex-wrap gap-2">
                    {tiers.low.map((item, index) => (
                      <motion.button
                        key={item.skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSkillClick(item.skill)}
                        className="skill-chip missing shadow-sm bg-white border-gray-300 text-gray-800 hover:shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={item.reason}
                      >
                        <span className="mr-1 text-xs px-1 py-0.5 rounded bg-gray-100 border border-gray-200">{index + 1}</span>
                        <span className="font-medium">{item.skill}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-1 text-xs text-gray-500">Ranked by impact for your target role.</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <motion.button
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSkillClick(skill)}
                  className="skill-chip missing shadow-sm bg-white border-danger-200 text-danger-700 hover:shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1 text-xs px-1 py-0.5 rounded bg-danger-100 border border-danger-200">{index + 1}</span>
                  <span className="font-medium">{skill}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeSidePanel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSkill}</h2>
                  <button
                    onClick={closeSidePanel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : skillDetails ? (
                  <div className="space-y-6">
                    {/* What is */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">What is {selectedSkill}?</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {skillDetails.definition}
                      </p>
                    </div>

                    {/* Why it matters */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Why it matters for your career ?</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {skillDetails.whyItMatters}
                      </p>
                    </div>

                    {/* Most Asked Questions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Most Asked Questions</h3>
                      <div className="space-y-3">
                        {skillDetails.mostAskedQuestions?.map((question, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-xs font-semibold text-blue-600">Q</span>
                            </div>
                            <p className="text-gray-600">{question}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setShowLLMAssistant(true)}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>AI Learning Assistant</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Failed to load skill details</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LLM Learning Assistant Modal */}
      {showLLMAssistant && selectedSkill && (
        <LLMLearningAssistant
          skill={selectedSkill}
          targetRole={userData.targetRole}
          userExperience={userData.yearsExperience}
          onClose={() => setShowLLMAssistant(false)}
          quickQuestions={skillDetails?.mostAskedQuestions || []}
        />
      )}
    </div>
  );
};

export default SkillGapsTab;
