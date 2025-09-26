import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareerPath, CareerPathProvider } from '../../context/CareerPathContext';
import { Filter, X, BookOpen } from 'lucide-react';
import LLMLearningAssistant from '../LLMLearningAssistant';

function StatusBadge({ status }) {
  const map = {
    none: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
    skip: 'bg-gray-200 text-gray-700'
  };
  const label = {
    none: 'Not set',
    in_progress: 'In Progress',
    done: 'Done',
    skip: 'Skip'
  }[status] || 'Not set';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || map.none}`}>{label}</span>;
}

function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full shadow-sm"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function TopicModal({ topic, onClose, onSetStatus, onOpenAI }) {
  const [buttonStates, setButtonStates] = useState({
    inProgress: topic.status === 'in_progress',
    done: topic.status === 'done'
  });

  const handleStatusChange = (status) => {
    // Set visual feedback
    if (status === 'in_progress') {
      setButtonStates({ inProgress: true, done: false });
    } else if (status === 'done') {
      setButtonStates({ inProgress: false, done: true });
    }

    // Call the original function
    onSetStatus(status);
  };

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
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-64px-140px)]">
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
        <div className="p-6 border-t">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleStatusChange('in_progress')}
              className={`px-4 py-3 rounded-lg border transition-all duration-300 font-medium active:scale-95 transform flex items-center justify-center space-x-2 ${buttonStates.inProgress
                ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg'
                : 'bg-yellow-500/10 text-yellow-800 border-yellow-200 hover:bg-yellow-500/20 hover:border-yellow-300'
                }`}
            >
              {buttonStates.inProgress && <span className="text-lg">✓</span>}
              <span>In Progress</span>
            </button>
            <button
              onClick={() => handleStatusChange('done')}
              className={`px-4 py-3 rounded-lg border transition-all duration-300 font-medium active:scale-95 transform flex items-center justify-center space-x-2 ${buttonStates.done
                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                : 'bg-green-500/10 text-green-800 border-green-200 hover:bg-green-500/20 hover:border-green-300'
                }`}
            >
              {buttonStates.done && <span className="text-lg">✓</span>}
              <span>Done</span>
            </button>
          </div>
        </div>
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
  const { topics, isLoading, error, setTopicStatus, stats } = useCareerPath();
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [aiTopic, setAiTopic] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return topics;
    return topics.filter(t => t.status === filter);
  }, [topics, filter]);

  if (isLoading) return <div className="py-12 text-center text-gray-600">Loading topics...</div>;
  if (error) return <div className="py-12 text-center text-red-600">Failed to load topics.</div>;

  return (
    <div className="space-y-6">
      {/* Header + Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Path</h2>
          <p className="text-gray-600">Track your roadmap topics and mark progress.</p>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              <span>{topics.length} steps to achieve your target role</span>
            </span>
          </div>
        </div>
        <div className="min-w-[240px]">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>{stats.done} done</span>
            <span>{stats.percentDone}%</span>
          </div>
          <ProgressBar percent={stats.percentDone} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600 flex items-center gap-1"><Filter className="w-4 h-4" /> Filter:</span>
        {['all', 'in_progress', 'done'].map(opt => (
          <button key={opt} onClick={() => setFilter(opt)} className={`px-3 py-1 rounded-full text-sm border ${filter === opt ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            {opt.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Topic stepper */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" aria-hidden="true" />
        <div className="space-y-4">
          {filtered.map((t, idx) => (
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
                  <StatusBadge status={t.status} />
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
            onSetStatus={(status) => { setTopicStatus(active.id, status); setActive(prev => prev ? { ...prev, status } : prev); }}
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


