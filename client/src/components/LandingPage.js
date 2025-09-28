import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check, User, Target, Code } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const LandingPage = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    currentRole: '',
    yearsExperience: 0,
    targetRole: '',
    currentSkills: []
  });
  const [currentRoles, setCurrentRoles] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [customRole, setCustomRole] = useState('');

  const fetchCurrentRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/current-roles`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCurrentRoles(response.data);
      } else {
        setCurrentRoles(getDefaultCurrentRoles());
      }
    } catch (error) {
      console.error('Error fetching current roles:', error);
      setCurrentRoles(getDefaultCurrentRoles());
    }
  }, []);

  const fetchTargetRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/target-roles`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setTargetRoles(response.data);
      } else {
        setTargetRoles(getDefaultTargetRoles());
      }
    } catch (error) {
      console.error('Error fetching target roles:', error);
      setTargetRoles(getDefaultTargetRoles());
    }
  }, []);

  const getDefaultCurrentRoles = () => ([
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
    'Machine Learning Engineer', 'AI Engineer', 'Product Manager', 'UI/UX Designer',
    'Mobile Developer', 'QA Engineer', 'System Administrator', 'Other'
  ]);

  const getDefaultTargetRoles = () => ([
    'Software Engineering', 'Data Science', 'Data Analytics', 'DevOps & Cloud Computing', 'Advanced AI & ML'
  ]);

  const fetchSkills = useCallback(async (targetRole) => {
    console.log('🔍 Fetching skills for target role:', targetRole);
    console.log('API_BASE_URL:', API_BASE_URL);
    try {
      // Prefer curated suggestions (All High + 3 Medium + 3 Low) for SE and DevOps
      const curatedUrl = `${API_BASE_URL}/suggested-skills/${encodeURIComponent(targetRole)}`;
      console.log('Trying curated URL:', curatedUrl);
      const curatedRes = await axios.get(curatedUrl);
      console.log('Curated response:', curatedRes.data);
      if (Array.isArray(curatedRes.data) && curatedRes.data.length) {
        console.log('Using curated skills:', curatedRes.data);
        setSkills(curatedRes.data);
        return;
      }

      // Fallback to full skills list
      const fallbackUrl = `${API_BASE_URL}/skills/${encodeURIComponent(targetRole)}`;
      console.log('Trying fallback URL:', fallbackUrl);
      const response = await axios.get(fallbackUrl);
      console.log('Fallback response:', response.data);
      const data = response.data;
      if (Array.isArray(data)) {
        setSkills(data.length ? data : getDefaultSkills(targetRole));
      } else if (data && typeof data === 'object') {
        try {
          const flattened = Object.values(data).flat();
          setSkills(flattened.length ? flattened : getDefaultSkills(targetRole));
        } catch {
          setSkills(getDefaultSkills(targetRole));
        }
      } else {
        setSkills(getDefaultSkills(targetRole));
      }
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      console.log('Using default skills for:', targetRole);
      setSkills(getDefaultSkills(targetRole));
    }
  }, []);

  const getDefaultSkills = (targetRole) => {
    switch (targetRole) {
      case 'Software Engineering':
        return ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'HTML5', 'CSS3', 'SQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Git', 'Docker'];
      case 'Data Science':
        return ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'SQL', 'Jupyter'];
      case 'Data Analytics':
        return ['SQL', 'Excel', 'Power BI', 'Tableau', 'Looker', 'Python', 'Data Visualization', 'Dashboard Design'];
      case 'DevOps & Cloud Computing':
        return ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Monitoring'];
      case 'Advanced AI & ML':
        return ['Python', 'Transformers', 'TensorFlow', 'PyTorch', 'Hugging Face', 'RAG', 'Embeddings', 'LLMs', 'MLOps'];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchCurrentRoles();
    fetchTargetRoles();
  }, [fetchCurrentRoles, fetchTargetRoles]);

  useEffect(() => {
    if (formData.targetRole) {
      fetchSkills(formData.targetRole);
    }
  }, [formData.targetRole, fetchSkills]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(skill)
        ? prev.currentSkills.filter(s => s !== skill)
        : [...prev.currentSkills, skill]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting form submission...');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Form data:', formData);
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        customRole: formData.currentRole === 'Other' ? customRole : null
      };

      console.log('Submitting to:', `${API_BASE_URL}/analyze-skills`);
      console.log('Submit data:', submitData);
      const response = await axios.post(`${API_BASE_URL}/analyze-skills`, submitData);
      console.log('Response received:', response.data);
      const analysisData = response.data;

      // Animate match score gradually
      let currentScore = 0;
      const targetScore = analysisData.matchScore;
      const increment = targetScore / 50; // 50 steps for smooth animation

      const animateScore = () => {
        if (currentScore < targetScore) {
          currentScore += increment;
          setMatchScore(Math.min(Math.round(currentScore), targetScore));
          requestAnimationFrame(animateScore);
        } else {
          setMatchScore(targetScore);
          setTimeout(() => {
            onComplete({ ...submitData, analysis: analysisData });
            navigate('/results');
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1000);
        }
      };

      animateScore();
    } catch (error) {
      console.error('❌ Error analyzing skills:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      setIsLoading(false);
      // Show user-friendly error message
      alert('Failed to analyze skills. Please check your connection and try again.');
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Current Role',
      icon: <User className="w-6 h-6" />,
      description: 'Tell us about your current position'
    },
    // {
    //   id: 2,
    //   title: 'Experience',
    //   icon: <Briefcase className="w-6 h-6" />,
    //   description: 'How many years of experience do you have?'
    // },
    {
      id: 2,
      title: 'Target Role',
      icon: <Target className="w-6 h-6" />,
      description: 'What role are you aiming for?'
    },
    {
      id: 3,
      title: 'Current Skills',
      icon: <Code className="w-6 h-6" />,
      description: 'Select your current technical skills'
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What's your current role?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentRoles.map(role => (
                <button
                  key={role}
                  onClick={() => { handleInputChange('currentRole', role); setTimeout(() => nextStep(), 0); }}
                  className={`p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${formData.currentRole === role
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {formData.currentRole === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify your current role:
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Enter your current role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}
          </div>
        );

      // case 2:
      //   return (
      //     <div className="space-y-6">
      //       <h3 className="text-xl font-semibold text-gray-900">
      //         Years of Experience: {formData.yearsExperience}
      //       </h3>
      //       <div className="px-4">
      //         <input
      //           type="range"
      //           min="0"
      //           max="20"
      //           value={formData.yearsExperience}
      //           onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value))}
      //           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      //         />
      //         <div className="flex justify-between text-sm text-gray-500 mt-2">
      //           <span>0 years</span>
      //           <span>20+ years</span>
      //         </div>
      //       </div>
      //     </div>
      //   );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What's your target role?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {targetRoles.map(role => (
                <button
                  key={role}
                  onClick={() => { handleInputChange('targetRole', role); setTimeout(() => nextStep(), 0); }}
                  className={`p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${formData.targetRole === role
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="font-medium">{role}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {getRoleDescription(role)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Select your current skills</h3>
            <div className="max-h-80 sm:max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${formData.currentSkills.includes(skill)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Selected {formData.currentSkills.length} skills
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      'Software Engineering': 'Build robust and scalable software applications',
      'Data Science': 'Extract insights and build machine learning models',
      'Data Analytics': 'Create business intelligence and data visualization solutions',
      'DevOps & Cloud Computing': 'Manage reliable and scalable cloud infrastructure',
      'Advanced AI & ML': 'Develop cutting-edge AI and machine learning systems'
    };
    return descriptions[role] || '';
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.currentRole !== '' && (formData.currentRole !== 'Other' || customRole.trim() !== '');
      case 2: return true; // Always valid as it has a default value
      case 3: return formData.targetRole !== '';
      case 4: return formData.currentSkills.length > 0;
      default: return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - matchScore / 100)}`}
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">{matchScore}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your profile...</h2>
          <p className="text-gray-600 mb-6">We're calculating your career match score</p>

          {/* Simple Tech Facts */}
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Did you know?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The first computer bug was an actual bug! In 1947, Grace Hopper found a moth trapped in a Harvard Mark II computer, coining the term "debugging" that developers use today.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Career Roadmap Tool
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Discover your path to your dream role in just 3 simple steps
            </p>

            {/* Social Proof */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 sm:p-6 mb-8 border border-blue-200 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">Trusted by professionals</p>
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    <span className="text-blue-600">6,02,579+ Working Professionals</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    transformed their career using <span className="font-semibold">Scaler's career roadmap tool</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                      }`}>
                      {currentStep > step.id ? <Check className="w-6 h-6" /> : step.icon}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                        }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                      }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-8"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isStepValid()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${isStepValid()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <span>Get My Roadmap</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
