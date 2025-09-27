import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerPath, CareerPathProvider } from '../../context/CareerPathContext';
import { X, BookOpen } from 'lucide-react';
import LLMLearningAssistant from '../LLMLearningAssistant';

// Tracking UI removed per requirements

// Progress bar removed as step tracking is no longer displayed

function TopicModal({ topic, onClose, onOpenAI }) {

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-64px-140px)] scrollbar-hide">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
              <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600">1</span>
              </span>
              <span>Why to learn?</span>
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{topic.why || topic.detailedContent}</p>
          </div>
          {Array.isArray(topic.topicsList) && topic.topicsList.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">2</span>
                </span>
                <span>What to learn?</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {topic.topicsList.map((it, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          )}
          {topic.milestone && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-600">3</span>
                </span>
                <span>Milestone</span>
              </h3>
              <p className="text-gray-700 text-sm">{topic.milestone}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Need a quick summary?</h3>
            <button
              onClick={onOpenAI}
              className="btn-primary inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Summarize with AI
            </button>
          </div>
        </div>
        {/* Status controls removed */}
      </motion.div>
    </div>
  );
}

function generateAIPrompt(topic) {
  const stepName = topic.title;
  const whatToLearn = Array.isArray(topic.topicsList) ? topic.topicsList : [];

  let prompt = `What is ${stepName}? `;

  if (whatToLearn.length > 0) {
    const explainPoints = whatToLearn.map(point => `Explain ${point}`).join(', ');
    prompt += explainPoints;
  }

  return prompt;
}

function generateQuickQuestions(topic) {
  const stepName = topic.title;
  const whatToLearn = Array.isArray(topic.topicsList) ? topic.topicsList : [];

  const questions = [`What is ${stepName}?`];

  if (whatToLearn.length > 0) {
    const explainQuestions = whatToLearn.map(point => `Explain ${point}`);
    questions.push(...explainQuestions);
  }

  return questions;
}

function CareerPathInner({ targetRole }) {
  const { topics, isLoading, error } = useCareerPath();
  const [active, setActive] = useState(null);
  const [aiTopic, setAiTopic] = useState(null);

  if (isLoading) return <div className="py-12 text-center text-gray-600">Loading topics...</div>;
  if (error) return <div className="py-12 text-center text-red-600">Failed to load topics.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Path</h2>
          <p className="text-gray-600">Your step-by-step roadmap for the selected role.</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <div className="px-4 py-2 bg-white rounded-xl border shadow-sm flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
            <div className="text-sm text-gray-700"><span className="font-semibold text-gray-900">{topics.length}</span> steps to achieve your target role</div>
          </div>
        </div>
      </div>

      {/* Filters removed */}

      {/* Topic stepper */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" aria-hidden="true" />
        <div className="space-y-4">
          {topics.map((t, idx) => (
            <div key={t.id} className="relative pl-12">
              <div className="absolute left-2 top-3 w-4 h-4 rounded-full bg-white border-2 border-primary-600" aria-hidden="true" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Step {idx + 1}</div>
                    <h3 className="font-semibold text-gray-900">{t.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{t.shortDescription}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => setActive(t)} className="btn-primary inline-flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <TopicModal
            topic={active}
            onClose={() => setActive(null)}
            onOpenAI={() => setAiTopic(active)}
          />
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {aiTopic && (
          <LLMLearningAssistant
            skill={aiTopic.title}
            targetRole={targetRole}
            userExperience={0}
            onClose={() => setAiTopic(null)}
            initialUserQuestion={generateAIPrompt(aiTopic)}
            quickQuestions={generateQuickQuestions(aiTopic)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareerPathTab({ userData }) {
  return (
    <CareerPathProvider targetRole={userData?.targetRole}>
      <CareerPathInner targetRole={userData?.targetRole} />
    </CareerPathProvider>
  );
}


