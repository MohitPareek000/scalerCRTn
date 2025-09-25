const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-1234efgh5678ijkl1234efgh5678ijkl1234efgh'
});



// Middleware  
app.use(cors());
app.use(express.json());

// Mock data
const skillTaxonomy = {
  'Software Engineering': {
    'Frontend Development': [
      'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite', 'Next.js', 'Nuxt.js'
    ],
    'Backend Development': [
      'Node.js', 'Python', 'Java', 'C#', 'Go', 'Express.js', 'Django', 'Spring Boot', 'REST APIs', 'GraphQL', 'FastAPI', 'Laravel'
    ],
    'Database': [
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization', 'Elasticsearch'
    ],
    'System Design': [
      'Microservices', 'Load Balancing', 'Caching', 'Message Queues', 'API Design', 'Scalability', 'Performance Optimization'
    ]
  },
  'Data Science': {
    'Programming': [
      'Python', 'R', 'SQL', 'Scala', 'Julia'
    ],
    'Data Analysis': [
      'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter Notebooks', 'Data Visualization'
    ],
    'Machine Learning': [
      'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'XGBoost', 'Feature Engineering', 'Model Evaluation'
    ],
    'Statistics': [
      'Statistical Analysis', 'Hypothesis Testing', 'A/B Testing', 'Probability', 'Regression Analysis'
    ]
  },
  'Data Analytics': {
    'Tools': [
      'Excel', 'Power BI', 'Tableau', 'Looker', 'Google Analytics', 'Mixpanel'
    ],
    'Programming': [
      'Python', 'R', 'SQL', 'VBA'
    ],
    'Visualization': [
      'Data Visualization', 'Dashboard Design', 'Storytelling', 'Chart Design'
    ],
    'Analysis': [
      'Business Intelligence', 'KPI Analysis', 'Trend Analysis', 'Forecasting'
    ]
  },
  'DevOps & Cloud Computing': {
    'Cloud Platforms': [
      'AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Heroku'
    ],
    'Containerization': [
      'Docker', 'Kubernetes', 'Docker Compose', 'Helm'
    ],
    'CI/CD': [
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI'
    ],
    'Infrastructure': [
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'Infrastructure as Code'
    ],
    'Monitoring': [
      'Prometheus', 'Grafana', 'ELK Stack', 'New Relic', 'Datadog'
    ]
  },
  'Advanced AI & ML': {
    'Deep Learning': [
      'TensorFlow', 'PyTorch', 'Keras', 'Neural Networks', 'CNN', 'RNN', 'LSTM', 'Transformer'
    ],
    'NLP': [
      'Natural Language Processing', 'BERT', 'GPT', 'Hugging Face', 'spaCy', 'NLTK'
    ],
    'Computer Vision': [
      'OpenCV', 'YOLO', 'Image Classification', 'Object Detection', 'Image Segmentation'
    ],
    'MLOps': [
      'MLflow', 'Kubeflow', 'DVC', 'Model Deployment', 'Model Monitoring'
    ],
    'Advanced Topics': [
      'Reinforcement Learning', 'Generative AI', 'Large Language Models', 'AutoML'
    ]
  }
};

const currentRoles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
  'Machine Learning Engineer', 'AI Engineer', 'Product Manager', 'UI/UX Designer',
  'Mobile Developer', 'QA Engineer', 'System Administrator', 'Other'
];

const targetRoles = [
  'Software Engineering', 'Data Science', 'Data Analytics', 'DevOps & Cloud Computing', 'Advanced AI & ML'
];

const companies = [
  {
    id: 1,
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    role: 'Senior Software Engineer',
    salaryBand: '$150k - $250k',
    source: 'LinkedIn',
    interviewProcess: [
      'Phone Screen (45 min)',
      'Technical Interview (60 min)',
      'System Design (60 min)',
      'Behavioral Interview (45 min)',
      'Hiring Committee Review'
    ],
    commonQuestions: [
      'Explain your approach to designing a scalable system',
      'How would you optimize a slow database query?',
      'Describe a challenging technical problem you solved',
      'How do you stay updated with new technologies?'
    ]
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    role: 'Software Engineer II',
    salaryBand: '$120k - $180k',
    source: 'Company Website',
    interviewProcess: [
      'Initial Screening (30 min)',
      'Coding Challenge (90 min)',
      'Technical Interview (60 min)',
      'Team Fit Interview (45 min)'
    ],
    commonQuestions: [
      'Walk me through your most complex project',
      'How do you handle code reviews?',
      'Explain the difference between SQL and NoSQL',
      'Describe your experience with cloud platforms'
    ]
  },
  {
    id: 3,
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    role: 'SDE II',
    salaryBand: '$130k - $200k',
    source: 'Indeed',
    interviewProcess: [
      'Online Assessment (90 min)',
      'Phone Interview (60 min)',
      'On-site Loop (4-5 interviews)',
      'Bar Raiser Interview'
    ],
    commonQuestions: [
      'Tell me about a time you disagreed with your manager',
      'How do you prioritize tasks when everything is urgent?',
      'Explain the CAP theorem',
      'Describe your experience with microservices'
    ]
  }
];

const projects = {
  'Software Engineering': [
    {
      id: 1,
      title: 'E-commerce Platform',
      tier: 'Beginner',
      skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript'],
      estimatedTime: '2-3 weeks',
      description: 'Build a full-stack e-commerce application with user authentication, product catalog, and shopping cart functionality.',
      rubric: '#'
    },
    {
      id: 2,
      title: 'Real-time Chat Application',
      tier: 'Intermediate',
      skills: ['React', 'Socket.io', 'Node.js', 'Redis', 'TypeScript'],
      estimatedTime: '3-4 weeks',
      description: 'Create a real-time chat application with multiple rooms, file sharing, and message persistence.',
      rubric: '#'
    },
    {
      id: 3,
      title: 'Microservices Architecture',
      tier: 'Advanced',
      skills: ['Docker', 'Kubernetes', 'API Gateway', 'Service Mesh', 'Load Balancing'],
      estimatedTime: '6-8 weeks',
      description: 'Design and implement a scalable microservices architecture with proper service communication and monitoring.',
      rubric: '#'
    },
    {
      id: 4,
      title: 'API Gateway & Authentication',
      tier: 'Intermediate',
      skills: ['Express.js', 'JWT', 'OAuth', 'Rate Limiting', 'API Design'],
      estimatedTime: '3-4 weeks',
      description: 'Build a secure API gateway with authentication, authorization, and rate limiting.',
      rubric: '#'
    }
  ],
  'Data Science': [
    {
      id: 5,
      title: 'Customer Segmentation Analysis',
      tier: 'Beginner',
      skills: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Jupyter Notebooks'],
      estimatedTime: '2-3 weeks',
      description: 'Analyze customer data to identify distinct segments using clustering algorithms.',
      rubric: '#'
    },
    {
      id: 6,
      title: 'Predictive Model for Sales',
      tier: 'Intermediate',
      skills: ['Python', 'TensorFlow', 'Pandas', 'Feature Engineering', 'Model Evaluation'],
      estimatedTime: '4-5 weeks',
      description: 'Build a machine learning model to predict sales based on historical data and external factors.',
      rubric: '#'
    },
    {
      id: 7,
      title: 'Deep Learning Image Classifier',
      tier: 'Advanced',
      skills: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Computer Vision'],
      estimatedTime: '6-8 weeks',
      description: 'Develop a deep learning model for image classification using convolutional neural networks.',
      rubric: '#'
    }
  ],
  'Data Analytics': [
    {
      id: 8,
      title: 'Business Intelligence Dashboard',
      tier: 'Beginner',
      skills: ['Tableau', 'Power BI', 'SQL', 'Data Visualization', 'Dashboard Design'],
      estimatedTime: '2-3 weeks',
      description: 'Create interactive dashboards to visualize business metrics and KPIs.',
      rubric: '#'
    },
    {
      id: 9,
      title: 'A/B Testing Analysis',
      tier: 'Intermediate',
      skills: ['Python', 'Statistical Analysis', 'Hypothesis Testing', 'Pandas', 'Matplotlib'],
      estimatedTime: '3-4 weeks',
      description: 'Design and analyze A/B tests to optimize business metrics and user experience.',
      rubric: '#'
    },
    {
      id: 10,
      title: 'Real-time Analytics Pipeline',
      tier: 'Advanced',
      skills: ['Python', 'Apache Kafka', 'Apache Spark', 'Redis', 'Stream Processing'],
      estimatedTime: '6-8 weeks',
      description: 'Build a real-time data pipeline for processing and analyzing streaming data.',
      rubric: '#'
    }
  ],
  'DevOps & Cloud Computing': [
    {
      id: 11,
      title: 'Infrastructure as Code',
      tier: 'Beginner',
      skills: ['Terraform', 'AWS', 'Docker', 'Git', 'YAML'],
      estimatedTime: '2-3 weeks',
      description: 'Automate cloud infrastructure provisioning using Terraform and best practices.',
      rubric: '#'
    },
    {
      id: 12,
      title: 'CI/CD Pipeline',
      tier: 'Intermediate',
      skills: ['Jenkins', 'Docker', 'Kubernetes', 'GitLab CI', 'Automated Testing'],
      estimatedTime: '3-4 weeks',
      description: 'Set up a complete CI/CD pipeline with automated testing, building, and deployment.',
      rubric: '#'
    },
    {
      id: 13,
      title: 'Multi-Cloud Kubernetes Cluster',
      tier: 'Advanced',
      skills: ['Kubernetes', 'AWS', 'Azure', 'Terraform', 'Helm', 'Monitoring'],
      estimatedTime: '6-8 weeks',
      description: 'Deploy and manage a multi-cloud Kubernetes cluster with monitoring and security.',
      rubric: '#'
    }
  ],
  'Advanced AI & ML': [
    {
      id: 14,
      title: 'NLP Chatbot',
      tier: 'Beginner',
      skills: ['Python', 'NLTK', 'spaCy', 'Transformers', 'Natural Language Processing'],
      estimatedTime: '3-4 weeks',
      description: 'Build an intelligent chatbot using natural language processing and machine learning.',
      rubric: '#'
    },
    {
      id: 15,
      title: 'Computer Vision Object Detection',
      tier: 'Intermediate',
      skills: ['Python', 'OpenCV', 'YOLO', 'TensorFlow', 'Computer Vision'],
      estimatedTime: '4-5 weeks',
      description: 'Develop a real-time object detection system using computer vision techniques.',
      rubric: '#'
    },
    {
      id: 16,
      title: 'Large Language Model Fine-tuning',
      tier: 'Advanced',
      skills: ['Python', 'Transformers', 'PyTorch', 'Hugging Face', 'Model Fine-tuning'],
      estimatedTime: '6-8 weeks',
      description: 'Fine-tune a large language model for specific domain tasks and deploy it.',
      rubric: '#'
    }
  ]
};

// Routes
app.get('/api/current-roles', (req, res) => {
  res.json(currentRoles);
});

app.get('/api/target-roles', (req, res) => {
  res.json(targetRoles);
});

app.get('/api/skills/:targetRole', (req, res) => {
  const { targetRole } = req.params;
  if (skillTaxonomy[targetRole]) {
    const allSkills = Object.values(skillTaxonomy[targetRole]).flat();
    res.json(allSkills);
  } else {
    res.status(404).json({ error: 'Target role not found' });
  }
});

app.get('/api/companies', (req, res) => {
  res.json(companies);
});

app.get('/api/projects/:targetRole', (req, res) => {
  const { targetRole } = req.params;
  if (projects[targetRole]) {
    res.json(projects[targetRole]);
  } else {
    res.status(404).json({ error: 'Projects not found for this target role' });
  }
});

app.post('/api/analyze-skills', async (req, res) => {
  const { currentRole, targetRole, currentSkills, yearsExperience, customRole } = req.body;
  
  try {
    // Get skills specific to the target role
    const targetRoleSkills = skillTaxonomy[targetRole] ? Object.values(skillTaxonomy[targetRole]).flat() : [];
    
    // Filter existing skills that are relevant to target role
    const existingSkills = currentSkills.filter(skill => targetRoleSkills.includes(skill));
    
    // Find missing skills specific to target role
    const missingSkills = targetRoleSkills.filter(skill => !currentSkills.includes(skill));
    
    // Calculate match score based on experience and skill overlap
    const baseScore = Math.min(20 + (yearsExperience * 8), 70); // Base score from experience
    const skillCoverage = targetRoleSkills.length > 0 ? (existingSkills.length / targetRoleSkills.length) : 0;
    const skillBonus = skillCoverage * 30; // Skill bonus up to 30 points
    const matchScore = Math.min(Math.round(baseScore + skillBonus), 95);
    
    // Prioritize skills for the target role
    const prioritizedMissing = prioritizeSkills(missingSkills, targetRole);
    const prioritizedExisting = prioritizeSkills(existingSkills, targetRole);

    // Generate AI-powered recommendations for top missing skills
    const topMissingSkills = prioritizedMissing.slice(0, 5).map(s => s.skill);
    const aiRecommendations = await generateAIRecommendations(topMissingSkills, targetRole, currentRole, yearsExperience);
    
    // Combine AI recommendations with structured data
    const recommendations = topMissingSkills.map((skill, index) => {
      const skillCategory = Object.keys(skillTaxonomy[targetRole] || {}).find(category => 
        skillTaxonomy[targetRole][category].includes(skill)
      );
      
      return {
        skill,
        category: skillCategory,
        definition: aiRecommendations[index]?.definition || `${skill} is a fundamental skill in ${targetRole} and is essential for building ${getRoleDescription(targetRole)}.`,
        whyItMatters: aiRecommendations[index]?.whyItMatters || `This skill is highly valued in ${targetRole} roles and will significantly improve your job prospects and technical capabilities.`,
        starterTasks: aiRecommendations[index]?.starterTasks || generateStarterTasks(skill, targetRole),
        difficulty: getSkillDifficulty(skill, targetRole)
      };
    });
    
    res.json({
      matchScore,
      existingSkills: prioritizedExisting.map(s => s.skill),
      missingSkills: prioritizedMissing.map(s => s.skill).slice(0, 20),
      prioritizedMissing,
      recommendations,
      targetRoleSkills: targetRoleSkills.length,
      skillCoverage: Math.round(skillCoverage * 100)
    });
  } catch (error) {
    console.error('Error in skill analysis:', error);
    // Fallback to basic analysis if AI fails
    const targetRoleSkills = skillTaxonomy[targetRole] ? Object.values(skillTaxonomy[targetRole]).flat() : [];
    const existingSkills = currentSkills.filter(skill => targetRoleSkills.includes(skill));
    const missingSkills = targetRoleSkills.filter(skill => !currentSkills.includes(skill));
    const baseScore = Math.min(20 + (yearsExperience * 8), 70);
    const skillCoverage = targetRoleSkills.length > 0 ? (existingSkills.length / targetRoleSkills.length) : 0;
    const skillBonus = skillCoverage * 30;
    const matchScore = Math.min(Math.round(baseScore + skillBonus), 95);
    
    const recommendations = missingSkills.slice(0, 5).map(skill => ({
      skill,
      definition: `${skill} is a fundamental skill in ${targetRole}.`,
      whyItMatters: `This skill is highly valued in ${targetRole} roles.`,
      starterTasks: generateStarterTasks(skill, targetRole),
      difficulty: getSkillDifficulty(skill, targetRole)
    }));
    
    res.json({
      matchScore,
      existingSkills,
      missingSkills: missingSkills.slice(0, 12),
      prioritizedMissing: missingSkills.slice(0, 12).map(skill => ({ skill, priorityScore: 0, reason: 'Fallback' })),
      recommendations,
      targetRoleSkills: targetRoleSkills.length,
      skillCoverage: Math.round(skillCoverage * 100)
    });
  }
});

// Helper functions
function getRoleDescription(targetRole) {
  const descriptions = {
    'Software Engineering': 'robust and scalable software applications',
    'Data Science': 'data-driven insights and machine learning models',
    'Data Analytics': 'business intelligence and data visualization solutions',
    'DevOps & Cloud Computing': 'reliable and scalable cloud infrastructure',
    'Advanced AI & ML': 'cutting-edge AI and machine learning systems'
  };
  return descriptions[targetRole] || 'professional solutions';
}

function generateStarterTasks(skill, targetRole) {
  const taskTemplates = {
    'Software Engineering': [
      `Complete a hands-on tutorial on ${skill} fundamentals`,
      `Build a small project showcasing ${skill} best practices`,
      `Join the ${skill} community and contribute to open-source projects`,
      `Read documentation and build a mini-application using ${skill}`
    ],
    'Data Science': [
      `Complete a data science course focusing on ${skill}`,
      `Work on a Kaggle competition using ${skill}`,
      `Build a data analysis project with real-world datasets`,
      `Practice ${skill} with Jupyter notebooks and sample datasets`
    ],
    'Data Analytics': [
      `Create a dashboard using ${skill} with sample business data`,
      `Complete a ${skill} certification course`,
      `Practice with real business scenarios and KPIs`,
      `Build interactive visualizations using ${skill}`
    ],
    'DevOps & Cloud Computing': [
      `Set up a lab environment to practice ${skill}`,
      `Complete hands-on labs and tutorials for ${skill}`,
      `Build a project using ${skill} with best practices`,
      `Get certified in ${skill} through official training`
    ],
    'Advanced AI & ML': [
      `Complete a deep learning course covering ${skill}`,
      `Build a project using ${skill} with real datasets`,
      `Experiment with ${skill} on platforms like Google Colab`,
      `Read research papers and implement ${skill} from scratch`
    ]
  };
  
  return taskTemplates[targetRole] || [
    `Learn ${skill} through online courses and tutorials`,
    `Practice ${skill} with hands-on projects`,
    `Join communities and forums related to ${skill}`
  ];
}

function getSkillDifficulty(skill, targetRole) {
  // Simple difficulty assessment based on skill complexity
  const advancedSkills = ['Kubernetes', 'TensorFlow', 'PyTorch', 'Microservices', 'System Design'];
  const intermediateSkills = ['Docker', 'React', 'Node.js', 'Machine Learning', 'Data Visualization'];
  
  if (advancedSkills.some(s => skill.includes(s))) return 'Advanced';
  if (intermediateSkills.some(s => skill.includes(s))) return 'Intermediate';
  return 'Beginner';
}

app.post('/api/skill-details', (req, res) => {
  const { skill, targetRole, userExperience } = req.body;
  
  // Enhanced skill details with role-specific information
  const skillCategory = Object.keys(skillTaxonomy[targetRole] || {}).find(category => 
    skillTaxonomy[targetRole] && skillTaxonomy[targetRole][category].includes(skill)
  );
  
  res.json({
    skill,
    category: skillCategory,
    definition: `${skill} is a fundamental skill in ${targetRole} and is essential for building ${getRoleDescription(targetRole)}.`,
    whyItMatters: `This skill is highly valued in ${targetRole} roles and will significantly improve your job prospects and technical capabilities.`,
    starterTasks: generateStarterTasks(skill, targetRole),
    difficulty: getSkillDifficulty(skill, targetRole),
    estimatedLearningTime: getEstimatedLearningTime(skill, userExperience)
  });
});

// New endpoint for LLM-powered learning assistance
app.post('/api/llm-learning-assistant', async (req, res) => {
  const { skill, targetRole, userQuestion, conversationHistory = [] } = req.body;
  
  try {
    // Use OpenAI API for real responses
    const llmResponse = await generateOpenAIResponse(skill, targetRole, userQuestion, conversationHistory);
    
    res.json({
      response: llmResponse,
      suggestions: generateLearningSuggestions(skill, targetRole, userQuestion),
      resources: getLearningResources(skill, targetRole)
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate learning assistance',
      response: generateFallbackResponse(skill, userQuestion)
    });
  }
});

// Helper functions for LLM integration
async function generateAIRecommendations(skills, targetRole, currentRole, yearsExperience) {
  try {
    const prompt = `You are a career coach helping someone transition from ${currentRole} to ${targetRole}. 
    
    For each of these skills: ${skills.join(', ')}, provide:
    1. A clear, concise definition (1-2 sentences)
    2. Why it matters for their career transition (1-2 sentences)
    3. 3 specific starter tasks to learn this skill
    
    Format as JSON array with objects containing: definition, whyItMatters, starterTasks (array)
    
    Focus on practical, actionable advice for someone with ${yearsExperience} years of experience.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach. Respond only with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
}

async function generateOpenAIResponse(skill, targetRole, userQuestion, conversationHistory) {
  try {
    // Build conversation context
    const systemPrompt = `You are an expert career coach and technical mentor specializing in ${targetRole}. You're helping someone learn ${skill} to advance their career in ${targetRole}. 

Your role:
- Provide clear, practical guidance on learning ${skill}
- Give specific, actionable advice tailored to ${targetRole} career path
- Be encouraging and supportive
- Keep responses concise but comprehensive
- Focus on practical applications and real-world examples
- Suggest hands-on projects and learning resources

Context:
- Skill being learned: ${skill}
- Target career: ${targetRole}
- User's question: ${userQuestion}

Previous conversation context: ${conversationHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

Respond as a helpful mentor who understands both the technical aspects and career implications.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userQuestion
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

function generateLearningSuggestions(skill, targetRole, userQuestion) {
  return [
    `Try building a small project using ${skill}`,
    `Join the ${skill} community and ask questions`,
    `Follow tutorials specific to ${targetRole} applications`,
    `Practice with real-world scenarios`
  ];
}

function getLearningResources(skill, targetRole) {
  return {
    documentation: `Official ${skill} documentation`,
    tutorials: `Interactive ${skill} tutorials for ${targetRole}`,
    courses: `Online courses covering ${skill} in ${targetRole} context`,
    community: `${skill} community forums and Discord servers`
  };
}

function generateFallbackResponse(skill, userQuestion) {
  return `I'm here to help you learn ${skill}. While I'm having some technical difficulties, here are some general tips: Start with official documentation, practice with small projects, and join the community. What specific aspect of ${skill} would you like to explore?`;
}

function getEstimatedLearningTime(skill, userExperience) {
  const difficulty = getSkillDifficulty(skill, 'Software Engineering');
  const experienceMultiplier = userExperience > 5 ? 0.7 : userExperience > 2 ? 0.9 : 1.0;
  
  const baseTime = {
    'Beginner': 2,
    'Intermediate': 4,
    'Advanced': 8
  };
  
  return Math.ceil(baseTime[difficulty] * experienceMultiplier);
}

// Skill prioritization helpers
function prioritizeSkills(skills, targetRole) {
  const roleCategoryWeights = getRoleCategoryWeights(targetRole);
  return skills
    .map(skill => {
      const base = 1;
      const categoryWeight = getSkillCategoryWeight(skill, targetRole, roleCategoryWeights);
      const difficultyWeight = getDifficultyWeight(getSkillDifficulty(skill, targetRole));
      const priorityScore = base + categoryWeight + difficultyWeight;
      const reason = buildPriorityReason(skill, categoryWeight, difficultyWeight);
      return { skill, priorityScore, reason };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function getRoleCategoryWeights(targetRole) {
  const defaults = { core: 3, supporting: 2, niceToHave: 1 };
  const roleMaps = {
    'Software Engineering': {
      'Frontend Development': 3,
      'Backend Development': 3,
      'System Design': 3,
      'Database': 2
    },
    'Data Science': {
      'Programming': 3,
      'Machine Learning': 3,
      'Statistics': 2,
      'Data Analysis': 2
    },
    'Data Analytics': {
      'Tools': 3,
      'Visualization': 3,
      'Analysis': 2,
      'Programming': 2
    },
    'DevOps & Cloud Computing': {
      'Cloud Platforms': 3,
      'Containerization': 3,
      'CI/CD': 3,
      'Infrastructure': 2,
      'Monitoring': 2
    },
    'Advanced AI & ML': {
      'Deep Learning': 3,
      'NLP': 3,
      'Computer Vision': 3,
      'MLOps': 2
    }
  };
  return roleMaps[targetRole] || defaults;
}

function getSkillCategoryWeight(skill, targetRole, weights) {
  const categories = skillTaxonomy[targetRole] ? Object.keys(skillTaxonomy[targetRole]) : [];
  for (const cat of categories) {
    if (skillTaxonomy[targetRole][cat].includes(skill)) {
      return weights[cat] || 1;
    }
  }
  return 1;
}

function getDifficultyWeight(difficulty) {
  if (difficulty === 'Advanced') return 1.5;
  if (difficulty === 'Intermediate') return 1.0;
  return 0.5;
}

function buildPriorityReason(skill, categoryWeight, difficultyWeight) {
  const parts = [];
  if (categoryWeight >= 3) parts.push('Core category for target role');
  if (difficultyWeight >= 1.5) parts.push('High-impact advanced skill');
  if (difficultyWeight === 1.0) parts.push('Widely used intermediate skill');
  if (parts.length === 0) parts.push('Foundational skill');
  return parts.join(' • ');
}

// Career topics endpoint (serves role-based topics)
const careerTopicsByRole = require('./careerTopics.json');

app.get('/api/career-topics/:targetRole', (req, res) => {
  const { targetRole } = req.params;
  const topics = careerTopicsByRole[targetRole];
  if (!topics) return res.status(404).json({ error: 'No topics found for role' });
  res.json(topics);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
