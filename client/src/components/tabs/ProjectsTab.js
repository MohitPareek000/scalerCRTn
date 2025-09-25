import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Code, ExternalLink, Bookmark, BookmarkCheck, Star, Users } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProjectsTab = ({ userData }) => {
  const [projects, setProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState(new Set());
  const [selectedTier, setSelectedTier] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.targetRole) {
      fetchProjects(userData.targetRole);
    }
    // Load saved projects from localStorage
    const saved = localStorage.getItem('savedProjects');
    if (saved) {
      setSavedProjects(new Set(JSON.parse(saved)));
    }
  }, [userData?.targetRole]);

  const fetchProjects = async (targetRole) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${targetRole}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveProject = (projectId) => {
    const newSavedProjects = new Set(savedProjects);
    if (savedProjects.has(projectId)) {
      newSavedProjects.delete(projectId);
    } else {
      newSavedProjects.add(projectId);
    }
    setSavedProjects(newSavedProjects);
    localStorage.setItem('savedProjects', JSON.stringify([...newSavedProjects]));
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Beginner': return '🟢';
      case 'Intermediate': return '🟡';
      case 'Advanced': return '🔴';
      default: return '⚪';
    }
  };

  const filteredProjects = selectedTier === 'all' 
    ? projects 
    : projects.filter(project => project.tier === selectedTier);

  const tiers = ['all', 'Beginner', 'Intermediate', 'Advanced'];

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
          Recommended Projects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build your portfolio with these hands-on projects tailored to your career goals.
        </p>
      </div>

      {/* Tier Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTier === tier
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tier === 'all' ? 'All Projects' : `${getTierIcon(tier)} ${tier}`}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg group"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(project.tier)}`}>
                    {getTierIcon(project.tier)} {project.tier}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {project.title}
                </h3>
              </div>
              <button
                onClick={() => toggleSaveProject(project.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label={savedProjects.has(project.id) ? 'Unsave project' : 'Save project'}
              >
                {savedProjects.has(project.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-primary-600" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Project Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Covered:</h4>
              <div className="flex flex-wrap gap-1">
                {project.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{project.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Solo Project</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Start Project</span>
              </button>
              <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>View Rubric</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Saved Projects Summary */}
      {savedProjects.size > 0 && (
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Your Saved Projects
              </h3>
              <p className="text-gray-600">
                {savedProjects.size} project{savedProjects.size !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4" />
              <span>View All Saved</span>
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start with any project that interests you. Each project includes detailed instructions, 
            starter code, and a rubric to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Browse All Projects
            </button>
            <button className="btn-secondary px-8 py-3 text-lg">
              Get Personalized Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTab;
