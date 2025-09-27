import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, User, Briefcase, Target, Code } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    fetchCurrentRoles();
    fetchTargetRoles();
  }, []);

  useEffect(() => {
    if (formData.targetRole) {
      fetchSkills(formData.targetRole);
    }
  }, [formData.targetRole]);

  const fetchCurrentRoles = async () => {
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
  };

  const fetchTargetRoles = async () => {
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
  };

  const getDefaultCurrentRoles = () => ([
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
    'Machine Learning Engineer', 'AI Engineer', 'Product Manager', 'UI/UX Designer',
    'Mobile Developer', 'QA Engineer', 'System Administrator', 'Other'
  ]);

  const getDefaultTargetRoles = () => ([
    'Software Engineering', 'Data Science', 'Data Analytics', 'DevOps & Cloud Computing', 'Advanced AI & ML'
  ]);

  const fetchSkills = async (targetRole) => {
    try {
      // Prefer curated suggestions (All High + 3 Medium + 3 Low) for SE and DevOps
      const curatedUrl = `${API_BASE_URL}/suggested-skills/${encodeURIComponent(targetRole)}`;
      const curatedRes = await axios.get(curatedUrl);
      if (Array.isArray(curatedRes.data) && curatedRes.data.length) {
        setSkills(curatedRes.data);
        return;
      }

      // Fallback to full skills list
      const response = await axios.get(`${API_BASE_URL}/skills/${encodeURIComponent(targetRole)}`);
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
      console.error('Error fetching skills:', error);
      setSkills(getDefaultSkills(targetRole));
    }
  };

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
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        customRole: formData.currentRole === 'Other' ? customRole : null
      };

      const response = await axios.post(`${API_BASE_URL}/analyze-skills`, submitData);
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
          }, 1000);
        }
      };

      animateScore();
    } catch (error) {
      console.error('Error analyzing skills:', error);
      setIsLoading(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentRoles.map(role => (
                <button
                  key={role}
                  onClick={() => { handleInputChange('currentRole', role); setTimeout(() => nextStep(), 0); }}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${formData.currentRole === role
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
            <div className="grid grid-cols-1 gap-3">
              {targetRoles.map(role => (
                <button
                  key={role}
                  onClick={() => { handleInputChange('targetRole', role); setTimeout(() => nextStep(), 0); }}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${formData.targetRole === role
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
            <div className="max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${formData.currentSkills.includes(skill)
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
          <p className="text-gray-600">We're calculating your career match score</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Roadmap Tool
            </h1>
            <p className="text-xl text-gray-600">
              Discover your path to your dream role in just 4 simple steps
            </p>
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
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
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
