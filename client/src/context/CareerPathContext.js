import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CareerPathContext = createContext();

export function CareerPathProvider({ targetRole, children }) {
  const storageKey = useMemo(() => `career_topics_status_${targetRole}`, [targetRole]);
  const [topics, setTopics] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setStatuses(JSON.parse(saved));
      } catch (_) {}
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(statuses));
  }, [statuses, storageKey]);

  useEffect(() => {
    if (!targetRole) return;
    setIsLoading(true);
    setError(null);
    axios
      .get(`${API_BASE_URL}/career-topics/${encodeURIComponent(targetRole)}`)
      .then(res => {
        const withStatus = res.data.map(t => ({
          ...t,
          status: statuses[t.id] || t.status || 'none'
        }));
        setTopics(withStatus);
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRole]);

  const setTopicStatus = (id, status) => {
    setTopics(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const value = {
    topics,
    isLoading,
    error,
    setTopicStatus,
    stats: computeStats(topics)
  };

  return (
    <CareerPathContext.Provider value={value}>{children}</CareerPathContext.Provider>
  );
}

export function useCareerPath() {
  return useContext(CareerPathContext);
}

function computeStats(topics) {
  if (!topics || topics.length === 0) return { total: 0, done: 0, inProgress: 0, skip: 0, percentDone: 0 };
  const total = topics.length;
  const done = topics.filter(t => t.status === 'done').length;
  const inProgress = topics.filter(t => t.status === 'in_progress').length;
  const skip = topics.filter(t => t.status === 'skip').length;
  const percentDone = Math.round((done / total) * 100);
  return { total, done, inProgress, skip, percentDone };
}







