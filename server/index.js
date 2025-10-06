const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. LLM features will not work until the key is provided via environment variables.');
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



// Middleware  
app.use(cors());
app.use(express.json());

// Mock data
const skillTaxonomy = {
  'Software Engineering': {
    // Core programming skills
    'Programming Languages': [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'C++', 'C'
    ],
    // CS fundamentals
    'Computer Science Fundamentals': [
      'Data structures', 'Algorithms', 'Object-oriented design', 'Discrete mathematics', 'Logic', 'Probability', 'Statistics', 'Operating systems', 'Networking', 'Problem solving', 'Critical thinking'
    ],
    // Persistence
    'Databases': [
      'Databases (SQL/NoSQL)', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design'
    ],
    // Platform & DevOps
    'DevOps & Cloud': [
      'Version control (Git)', 'Testing', 'Debugging', 'Profiling', 'Deployment', 'Containerization (Docker)', 'Kubernetes', 'Cloud platforms (AWS/Azure/GCP)', 'Automation', 'Scripting'
    ],
    // Architecture & systems
    'System Design': [
      'System design', 'Distributed systems', 'Microservices', 'Caching', 'Load balancing', 'API design'
    ],
    // Security & process
    'Engineering Practices': [
      'Agile/Scrum', 'Code review', 'Documentation', 'Communication', 'Teamwork'
    ],
    // Adjacent areas
    'Adjacent Domains': [
      'Mobile development', 'Machine learning basics', 'Data engineering'
    ],
    // Frontend/Backend frameworks commonly used
    'Frameworks & Runtimes': [
      'React', 'Angular', 'Vue.js', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Spring Boot', 'GraphQL', 'FastAPI', 'Laravel'
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
      'Python', 'R', 'SQL'
    ],
    'Visualization': [
      'Data Visualization', 'Dashboard Design'
    ],
    'Analysis': [
      'Business Intelligence', 'KPI Analysis', 'Trend Analysis', 'Forecasting'
    ]
  },
  'DevOps & Cloud Computing': {
    'Core Skills': [
      'Linux/Unix administration', 'Scripting (Bash/Python)', 'Version control (Git)', 'CI/CD', 'Containerization (Docker)', 'Cloud platforms (AWS/Azure/GCP)', 'Networking basics', 'Monitoring and logging (Grafana/ELK)'
    ],
    'Medium Priority': [
      'Kubernetes', 'Load balancing', 'High availability design', 'Build automation tools (Jenkins/GitLab CI)', 'System troubleshooting', 'Agile/Scrum', 'Serverless architecture', 'Cloud databases (SQL/NoSQL)', 'Compliance (GDPR, HIPAA)'
    ],
    'Advanced Skills': [
      'Service mesh (Istio/Linkerd)', 'Edge computing', 'Hybrid cloud strategies', 'Multi-cloud federation', 'Advanced scripting (Go/Ruby/Perl)', 'AI/ML for operations', 'Quantum cloud services'
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
  'Mobile Developer', 'QA Engineer', 'Other'
];

const targetRoles = [
  'Software Engineering', 'DevOps & Cloud Computing', 'Advanced AI & ML'
];

const companies = [
  {
    id: 1,
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    role: 'Software Engineer',
    salaryBand: '₹32L - ₹54L',
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
      'Implement an LRU cache with O(1) get and put operations'
    ]
  },
  // Advanced AI & ML specific companies
  {
    id: 101,
    name: 'OpenAI',
    logo: 'https://logo.clearbit.com/openai.com',
    role: 'Machine Learning Engineer',
    salaryBand: '₹45L - ₹80L+',
    source: 'Company Website',
    targetRole: 'Advanced AI & ML',
    interviewProcess: [
      'Recruiter Screen (30 min)',
      'Technical ML Interview (60 min)',
      'Research/Applied ML Deep Dive (60 min)',
      'System/ML System Design (60 min)',
      'Values/Team Fit (45 min)'
    ],
    commonQuestions: [
      'Explain bias-variance tradeoff with examples and mitigation strategies',
      'Design a recommendation system for long-tail content discovery',
      'Implement a training loop with early stopping and learning rate scheduling',
      'How would you evaluate a classifier on imbalanced data? Propose metrics and techniques',
      'Walk through building a RAG pipeline with vector DBs and safety filters'
    ]
  },
  {
    id: 102,
    name: 'NVIDIA',
    logo: 'https://logo.clearbit.com/nvidia.com',
    role: 'Deep Learning Engineer',
    salaryBand: '₹50L - ₹90L+',
    source: 'LinkedIn',
    targetRole: 'Advanced AI & ML',
    interviewProcess: [
      'Technical Screen (45 min)',
      'Deep Learning Concepts (60 min)',
      'Optimization/Performance (60 min)',
      'Coding (60 min)'
    ],
    commonQuestions: [
      'Compare SGD, Adam, and RMSProp; when would you choose each?',
      'Optimize CNN inference latency on edge devices',
      'Explain mixed-precision training and its trade-offs',
      'Derive backprop for a simple two-layer network'
    ]
  },
  {
    id: 103,
    name: 'DeepMind',
    logo: 'https://logo.clearbit.com/tech.google',
    role: 'Research Scientist (AI)',
    salaryBand: '₹60L - ₹1Cr+',
    source: 'Careers Page',
    targetRole: 'Advanced AI & ML',
    interviewProcess: [
      'Research Screen (45 min)',
      'Paper Discussion (60 min)',
      'ML Theory (60 min)',
      'Coding/Algorithms (60 min)'
    ],
    commonQuestions: [
      'Discuss a recent paper and propose an extension',
      'Prove convergence characteristics for a simple optimizer',
      'Design an RL experiment with proper evaluation and ablations'
    ]
  },
  {
    id: 104,
    name: 'Anthropic',
    logo: 'https://logo.clearbit.com/anthropic.com',
    role: 'AI Engineer (LLMs)',
    salaryBand: '₹55L - ₹95L+',
    source: 'Company Website',
    targetRole: 'Advanced AI & ML',
    interviewProcess: [
      'Recruiter Screen (30 min)',
      'LLM Engineering Interview (60 min)',
      'Safety & Evaluation (60 min)',
      'System Design (LLM) (60 min)'
    ],
    commonQuestions: [
      'Design an evaluation harness for hallucinations and factuality',
      'Implement a retrieval pipeline with reranking and caching',
      'Discuss prompt injection and mitigation techniques'
    ]
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    role: 'Software Engineer I',
    salaryBand: 'Upto ₹45L',
    source: 'Company Website',
    interviewProcess: [
      'Initial Screening (30 min)',
      'Coding Challenge (90 min)',
      'Technical Interview (60 min)',
      'Team Fit Interview (45 min)'
    ],
    commonQuestions: [
      'Walk me through your most complex project',
      'Reverse a linked list in place and analyze time and space complexity',
      'Design a URL shortening service with scalable storage and redirects',
      'Find the intersection point of two singly linked lists',
      'Describe your experience with cloud platforms'
    ]
  },
  {
    id: 3,
    name: 'Amazon',
    logo: 'https://logo.clearbit.com/amazon.com',
    role: 'SDE II',
    salaryBand: 'Upto ₹40L',
    source: 'Indeed',
    interviewProcess: [
      'Online Assessment (90 min)',
      'Phone Interview (60 min)',
      'On-site Loop (4-5 interviews)',
      'Bar Raiser Interview'
    ],
    commonQuestions: [
      'Find the intersection point of two singly linked lists',
      'How do you prioritize tasks when everything is urgent?',
      'Explain the CAP theorem',
      'Describe your experience with microservices'
    ]
  }
  ,
  // DevOps & Cloud role-specific additions
  {
    id: 101,
    targetRole: 'DevOps & Cloud Computing',
    name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    role: 'DevOps / Cloud Engineer',
    salaryBand: '₹17.5L - ₹34.8L',
    source: 'Indeed / Levels.fyi',
    interviewProcess: [
      'Recruiter / HR screening',
      'Technical phone/video screening (coding, cloud)',
      'Deep technical rounds (system design, architecture)',
      'Leadership / behavioral / team fit',
      'Final decision / offer'
    ],
    commonQuestions: [
      'Design a fault‑tolerant system across multiple Azure regions',
      'How does Kubernetes scheduling work?',
      'Terraform vs ARM templates – differences and trade‑offs',
      'Secrets management and identity in cloud (Key Vault / Managed Identities)'
    ]
  },
  {
    id: 102,
    targetRole: 'DevOps & Cloud Computing',
    name: 'Accenture',
    logo: 'https://logo.clearbit.com/accenture.com',
    role: 'DevOps Engineer',
    salaryBand: '₹5L – ₹12L',
    source: 'Glassdoor / Levels.fyi / Indeed',
    interviewProcess: [
      'HR / recruiter screening',
      'Technical screening (programming, DevOps tools)',
      'Technical rounds (cloud, infra, scripting)',
      'Managerial / behavioral round',
      'Final HR / offer'
    ],
    commonQuestions: [
      'Explain CI/CD implementation and rollback strategies',
      'How to monitor distributed services and set alerts',
      'Blue/green deployments and canary releases',
      'Infrastructure as Code and drift management'
    ]
  },
  {
    id: 103,
    targetRole: 'DevOps & Cloud Computing',
    name: 'Cisco',
    logo: 'https://logo.clearbit.com/cisco.com',
    role: 'Senior DevOps Engineer',
    salaryBand: '₹18.9L - ₹34.8L',
    source: 'Glassdoor / Indeed / Levels.fyi',
    interviewProcess: [
      'HR / recruiter screening',
      'Technical phone/video round',
      'Virtual onsite: multiple technical panels',
      'System design / architecture round',
      'Behavioral / culture fit',
      'Final HR'
    ],
    commonQuestions: [
      'Design a scalable microservices platform (auto‑scaling, load balancer)',
      'Kubernetes node roles and scheduling',
      'Disaster recovery and failover strategy in cloud',
      'Securing network, IAM, and inter‑service comms'
    ]
  },
  {
    id: 104,
    targetRole: 'DevOps & Cloud Computing',
    name: 'Oracle',
    logo: 'https://logo.clearbit.com/oracle.com',
    role: 'DevOps Engineer',
    salaryBand: '₹11L – ₹20L',
    source: 'Glassdoor / Indeed / Levels.fyi',
    interviewProcess: [
      'HR / recruiter screening',
      'Technical rounds – coding, DevOps tools',
      'Managerial / domain round',
      'HR / offer discussion'
    ],
    commonQuestions: [
      'Describe your CI/CD pipeline and rollback mechanism',
      'Deep‑dive on Docker, Kubernetes, Terraform used in projects',
      'Architecture: failover, scaling, observability',
      'Biggest production incident and your resolution'
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
      title: 'AI-Powered Inappropriate Content Moderation System',
      tier: 'Advanced',
      skills: [
        'Python',
        'PyTorch/TensorFlow',
        'CNN/RNN/Transformers',
        'OpenCV',
        'Audio/Video preprocessing',
        'Content safety heuristics',
        'MLOps'
      ],
      estimatedTime: '6-8 weeks',
      description: 'Build a multi-modal moderation system that detects and blocks inappropriate/violent content in videos by analyzing frames (vision models) and audio (NLP/ASR). Include score thresholding, human-in-the-loop review, audit logging, and a deployable API service.',
      rubric: '#'
    },
    {
      id: 15,
      title: 'Alexa-Inspired Music Recognition with ML',
      tier: 'Intermediate',
      skills: [
        'Python',
        'Librosa',
        'DSP',
        'MFCCs',
        'CNN/RNN',
        'Similarity search (Faiss/Annoy)',
        'Recommendation systems'
      ],
      estimatedTime: '4-6 weeks',
      description: 'Create a humming-to-song recognition system. Extract audio features (e.g., MFCCs), train a model to match queries against a song embedding index, and return top-K matches with recommendations for similar tracks.',
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

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    timestamp: new Date().toISOString()
  });
});

// Return all priority skills for roles with explicit priorities, otherwise use taxonomy
app.get('/api/suggested-skills/:targetRole', (req, res) => {
  const { targetRole } = req.params;
  console.log('🔍 API: Getting suggested skills for:', targetRole);
  const priorities = getExplicitPriorities(targetRole);
  console.log('🔍 API: Priorities found:', priorities);

  let skills = [];

  if (priorities && Object.keys(priorities).length > 0) {
    // For roles with explicit priorities, return all priority skills
    skills = Object.keys(priorities);
    console.log('🔍 API: Returning priority skills:', skills);
  } else if (skillTaxonomy[targetRole]) {
    // Fallback to taxonomy for roles without explicit priorities
    skills = Object.values(skillTaxonomy[targetRole]).flat();
  } else {
    return res.status(404).json({ error: 'No skills found for this role' });
  }

  // Add "None" option at the top
  const skillsWithNone = ['None', ...skills];
  console.log('🔍 API: Returning skills with None option:', skillsWithNone);
  return res.json(skillsWithNone);
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
  console.log('🔍 POST /api/analyze-skills called');
  console.log('🔍 Request method:', req.method);
  console.log('🔍 Request body:', req.body);
  const { currentRole, targetRole, currentSkills, yearsExperience, customRole } = req.body;

  try {
    // Get skills from explicit priorities if available, otherwise use taxonomy
    const explicitPriorities = getExplicitPriorities(targetRole);
    let targetRoleSkills = [];

    if (explicitPriorities && Object.keys(explicitPriorities).length > 0) {
      // Use priority skills as the definitive list
      targetRoleSkills = Object.keys(explicitPriorities);
    } else {
      // Fallback to taxonomy for roles without explicit priorities
      targetRoleSkills = skillTaxonomy[targetRole] ? Object.values(skillTaxonomy[targetRole]).flat() : [];
    }

    // Filter existing skills that are relevant to target role
    const existingSkills = currentSkills.filter(skill => targetRoleSkills.includes(skill));

    // Find missing skills specific to target role
    const missingSkills = targetRoleSkills.filter(skill => !currentSkills.includes(skill));

    // Calculate weighted coverage based on priority system
    let weightedScore = 0;
    let totalWeight = 0;

    // If we have explicit priorities, use weighted scoring
    if (explicitPriorities && Object.keys(explicitPriorities).length > 0) {
      // Calculate weighted score based on existing skills and their priorities
      existingSkills.forEach(skill => {
        const priority = explicitPriorities[skill] || 'Low';
        const weight = priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;
        weightedScore += weight;
      });

      // Calculate total possible weight
      targetRoleSkills.forEach(skill => {
        const priority = explicitPriorities[skill] || 'Low';
        const weight = priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;
        totalWeight += weight;
      });
    } else {
      // Fallback to simple coverage for roles without explicit priorities
      weightedScore = existingSkills.length;
      totalWeight = targetRoleSkills.length;
    }

    const skillCoverage = totalWeight > 0 ? (weightedScore / totalWeight) : 0;
    const matchScore = Math.round(skillCoverage * 100);

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
      missingSkills: prioritizedMissing.map(s => s.skill),
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
    const skillCoverage = targetRoleSkills.length > 0 ? (existingSkills.length / targetRoleSkills.length) : 0;
    const matchScore = Math.round(skillCoverage * 100);

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
      missingSkills: missingSkills,
      prioritizedMissing: missingSkills.map(skill => ({ skill, priorityScore: 0, reason: 'Fallback' })),
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

  // Get skill-specific definitions and questions
  const skillInfo = getSkillInfo(skill, targetRole);

  res.json({
    skill,
    category: skillCategory,
    definition: skillInfo.definition,
    whyItMatters: skillInfo.whyItMatters,
    mostAskedQuestions: skillInfo.mostAskedQuestions,
    starterTasks: generateStarterTasks(skill, targetRole),
    difficulty: getSkillDifficulty(skill, targetRole),
    estimatedLearningTime: getEstimatedLearningTime(skill, userExperience)
  });
});

function getSkillInfo(skill, targetRole) {
  const skillDefinitions = {
    // ========================= SOFTWARE ENGINEERING =========================
    'Programming Languages (C++, C, Java, Python)': {
      definition: 'Languages such as Python, Java, C++, and Go provide the syntax and semantics to create software systems.',
      whyItMatters: 'Foundation for all software engineering tasks including application development, problem solving, and system programming.',
      mostAskedQuestions: [
        'How do you choose a programming language for a project?',
        'What are the trade-offs between compiled and interpreted languages?',
        'How do you handle memory management in C/C++ compared to Java or Python?',
        'Best practices for writing clean, maintainable code?'
      ]
    },
    'Data structures': {
      definition: 'Methods of organizing and storing data such as arrays, linked lists, stacks, queues, trees, graphs, and hash tables.',
      whyItMatters: 'Core to algorithm efficiency and technical interviews.',
      mostAskedQuestions: [
        'Time complexity of different data structure operations?',
        'Array vs linked list trade-offs?',
        'How to implement a balanced binary search tree?',
        'Advantages of hash tables?'
      ]
    },
    'Algorithms': {
      definition: 'Step-by-step procedures for solving problems such as sorting, searching, graph traversal, and dynamic programming.',
      whyItMatters: 'Determines performance and scalability of software systems.',
      mostAskedQuestions: [
        'Explain Big-O complexity.',
        'Compare quicksort and mergesort.',
        'How to optimize a slow algorithm?',
        'Approach to dynamic programming problems?'
      ]
    },
    'Object-oriented design': {
      definition: 'Programming paradigm using classes and objects with principles like encapsulation, inheritance, and polymorphism.',
      whyItMatters: 'Supports modular, reusable, and maintainable code.',
      mostAskedQuestions: [
        'Explain SOLID principles.',
        'Difference between composition and inheritance?',
        'How to design a class hierarchy?',
        'Advantages of encapsulation?'
      ]
    },
    'Version control (Git)': {
      definition: 'Tooling to track and manage code changes across teams.',
      whyItMatters: 'Enables collaboration, rollback, and controlled releases.',
      mostAskedQuestions: [
        'Branching vs merging strategies?',
        'Difference between rebase and merge?',
        'How to resolve merge conflicts?',
        'Best practices for commit messages?'
      ]
    },
    'Debugging': {
      definition: 'Identifying and fixing defects using breakpoints, logs, and analyzers.',
      whyItMatters: 'Ensures correctness and reliability of software.',
      mostAskedQuestions: [
        'How to debug a segmentation fault?',
        'Strategies for intermittent bugs?',
        'Role of logging in debugging?',
        'How to use IDE debuggers effectively?'
      ]
    },
    'Testing': {
      definition: 'Verification of code correctness via unit, integration, and end-to-end tests.',
      whyItMatters: 'Prevents regressions and improves code quality.',
      mostAskedQuestions: [
        'Difference between unit and integration tests?',
        'Explain test-driven development.',
        'How to mock dependencies?',
        'Strategies for high coverage?'
      ]
    },
    'Problem solving': {
      definition: 'Ability to analyze complex issues, design solutions, and evaluate trade-offs.',
      whyItMatters: 'Core to engineering practice and interviews.',
      mostAskedQuestions: [
        'Describe a time you solved a production outage.',
        'How do you approach incomplete requirements?',
        'Explain your debugging methodology.',
        'How do you prioritize solutions?'
      ]
    },
    'Critical thinking': {
      definition: 'Logical evaluation of information to guide decisions.',
      whyItMatters: 'Informs design trade-offs and risk assessment.',
      mostAskedQuestions: [
        'How do you evaluate architectural options?',
        'Describe a time you uncovered a hidden assumption.',
        'What metrics guide your decisions?',
        'How do you validate a technical hypothesis?'
      ]
    },
    'Communication': {
      definition: 'Clear exchange of technical concepts in verbal and written form.',
      whyItMatters: 'Essential for teamwork, design reviews, and documentation.',
      mostAskedQuestions: [
        'How do you explain technical topics to non-technical stakeholders?',
        'Describe a challenging team communication scenario.',
        'Best practices for technical documentation?',
        'How to give constructive code review feedback?'
      ]
    },
    'Teamwork': {
      definition: 'Collaboration with peers, designers, and product managers.',
      whyItMatters: 'Software is built collectively; collaboration ensures quality and velocity.',
      mostAskedQuestions: [
        'Describe a time you resolved a team conflict.',
        'How do you handle code ownership in shared repositories?',
        'Approach to pair programming?',
        'How to align cross-functional teams?'
      ]
    },
    // ---------- Medium SE ----------
    'Databases (SQL/NoSQL)': {
      definition: 'Systems for persistent data storage and querying.',
      whyItMatters: 'Most applications require structured data management.',
      mostAskedQuestions: [
        'Normalize vs denormalize trade-offs?',
        'When to use NoSQL over SQL?',
        'How does indexing improve performance?',
        'Design a schema for a social network?'
      ]
    },
    'Operating systems': {
      definition: 'Core software controlling hardware resources and processes.',
      whyItMatters: 'Understanding OS behavior helps debug performance and concurrency issues.',
      mostAskedQuestions: [
        'Difference between process and thread?',
        'Explain virtual memory.',
        'How does context switching work?',
        'What is a deadlock?'
      ]
    },
    'Networking': {
      definition: 'Protocols and concepts such as TCP/IP, HTTP, DNS, and sockets.',
      whyItMatters: 'Vital for distributed applications and web services.',
      mostAskedQuestions: [
        'Difference between TCP and UDP?',
        'How does HTTPS provide security?',
        'Explain the three-way handshake.',
        'What is DNS resolution?'
      ]
    },
    'Build tools': {
      definition: 'Automation of compilation and packaging using tools like Maven or Gradle.',
      whyItMatters: 'Ensures reproducible builds and dependency management.',
      mostAskedQuestions: [
        'How to optimize build times?',
        'Static vs dynamic linking?',
        'Strategies for dependency management?',
        'How to integrate build tools with CI?'
      ]
    },
    'Continuous integration': {
      definition: 'Automated build and test process for every code change.',
      whyItMatters: 'Detects integration issues early and supports rapid iteration.',
      mostAskedQuestions: [
        'How to configure a CI pipeline?',
        'Role of automated testing?',
        'How to manage secrets in CI?',
        'Branching model best practices?'
      ]
    },
    'Deployment': {
      definition: 'Process of releasing software to staging or production.',
      whyItMatters: 'Ensures reliable and repeatable releases.',
      mostAskedQuestions: [
        'Explain blue-green deployment.',
        'How to implement canary releases?',
        'Rollback strategies?',
        'How to monitor post-deployment issues?'
      ]
    },
    'System design': {
      definition: 'Designing scalable architectures with databases, caches, and distributed systems.',
      whyItMatters: 'Needed for senior roles and large applications.',
      mostAskedQuestions: [
        'Design a URL shortener.',
        'How to scale a chat application?',
        'Monolith vs microservices trade-offs?',
        'Caching strategies for high traffic?'
      ]
    },
    'Distributed systems': {
      definition: 'Systems operating across multiple nodes while appearing as a single service.',
      whyItMatters: 'Enables high availability and scalability.',
      mostAskedQuestions: [
        'Explain CAP theorem.',
        'What is eventual consistency?',
        'Handling network partitions?',
        'Leader election techniques?'
      ]
    },
    'Code review': {
      definition: 'Peer review of code for quality and correctness.',
      whyItMatters: 'Improves maintainability and knowledge sharing.',
      mostAskedQuestions: [
        'How to give constructive feedback?',
        'Common code review checklists?',
        'Handling large pull requests?',
        'Tools for automated static analysis?'
      ]
    },
    'Documentation': {
      definition: 'Written explanations of code, APIs, and design decisions.',
      whyItMatters: 'Improves onboarding and maintenance.',
      mostAskedQuestions: [
        'Best practices for API documentation?',
        'Maintaining living design docs?',
        'Automated doc generation tools?',
        'Balancing detail and readability?'
      ]
    },
    'API design': {
      definition: 'Creating clear, stable interfaces for communication between software components.',
      whyItMatters: 'Ensures scalability and maintainability of services.',
      mostAskedQuestions: [
        'REST vs GraphQL trade-offs?',
        'How to version APIs?',
        'Best practices for error handling?',
        'How to design idempotent endpoints?'
      ]
    },
    'Automation': {
      definition: 'Creation of scripts and tools to reduce manual work.',
      whyItMatters: 'Improves productivity and reduces errors.',
      mostAskedQuestions: [
        'Common tasks to automate?',
        'Scheduling automated jobs?',
        'Custom vs off-the-shelf tools?',
        'Handling failures in automation scripts?'
      ]
    },
    'Scripting': {
      definition: 'Lightweight programming for automation using languages like Python or Bash.',
      whyItMatters: 'Speeds up repetitive tasks and system administration.',
      mostAskedQuestions: [
        'Shell scripting vs Python?',
        'How to write portable scripts?',
        'Common pitfalls in Bash scripting?',
        'Scheduling cron jobs safely?'
      ]
    },
    'Time management': {
      definition: 'Planning and prioritizing work to meet deadlines.',
      whyItMatters: 'Ensures steady progress in fast-paced environments.',
      mostAskedQuestions: [
        'Techniques for estimating timelines?',
        'Handling competing priorities?',
        'Tracking personal productivity?',
        'Balancing coding with meetings?'
      ]
    },
    'Adaptability': {
      definition: 'Ability to adjust to new tools, requirements, or team changes.',
      whyItMatters: 'Keeps skills relevant in evolving tech environments.',
      mostAskedQuestions: [
        'Describe learning a new language quickly.',
        'Handling shifting requirements?',
        'Approach to unfamiliar technologies?',
        'Staying current with industry changes?'
      ]
    },
    'Attention to detail': {
      definition: 'Careful focus on correctness and precision.',
      whyItMatters: 'Prevents subtle bugs and improves quality.',
      mostAskedQuestions: [
        'Examples of catching critical issues early?',
        'Avoiding off-by-one errors?',
        'Maintaining accuracy under deadlines?',
        'Double-checking deployments?'
      ]
    },
    // ---------- Low SE ----------
    'Containerization (Docker)': {
      definition: 'Packaging applications and dependencies into portable containers.',
      whyItMatters: 'Useful for consistent deployments and microservices.',
      mostAskedQuestions: [
        'Containers vs virtual machines?',
        'How to create minimal Docker images?',
        'Role of Docker Compose?',
        'How to secure containers?'
      ]
    },
    'Kubernetes': {
      definition: 'Container orchestration platform for scaling and managing containers.',
      whyItMatters: 'Valuable for cloud and DevOps but optional for basic SE roles.',
      mostAskedQuestions: [
        'Explain Kubernetes architecture.',
        'Deployment vs StatefulSet?',
        'How to set up auto-scaling?',
        'Secret management approaches?'
      ]
    },
    'Cloud platforms (AWS/Azure/GCP)': {
      definition: 'On-demand compute, storage, and networking services.',
      whyItMatters: 'Needed for cloud-native applications.',
      mostAskedQuestions: [
        'Key differences between AWS, Azure, and GCP?',
        'Designing a scalable cloud architecture?',
        'Best practices for cloud security?',
        'Cost control techniques?'
      ]
    },
    'Microservices': {
      definition: 'Architectural style splitting applications into small, independent services.',
      whyItMatters: 'Useful for large systems but not required for every project.',
      mostAskedQuestions: [
        'Monolith vs microservices trade-offs?',
        'Service discovery patterns?',
        'Inter-service communication?',
        'Handling distributed transactions?'
      ]
    },
    'Caching': {
      definition: 'Temporary data storage for faster retrieval.',
      whyItMatters: 'Improves performance in high-traffic systems.',
      mostAskedQuestions: [
        'Cache eviction policies?',
        'Redis vs Memcached?',
        'Maintaining cache consistency?',
        'Preventing cache stampede?'
      ]
    },
    'Load balancing': {
      definition: 'Distributing traffic across multiple servers.',
      whyItMatters: 'Ensures availability and scalability.',
      mostAskedQuestions: [
        'Layer 4 vs Layer 7 load balancers?',
        'Round-robin implementation?',
        'Sticky session techniques?',
        'Detecting and handling server failures?'
      ]
    },
    'Discrete mathematics': {
      definition: 'Mathematical foundations such as sets, graphs, and logic.',
      whyItMatters: 'Helpful for algorithms and cryptography but not daily coding.',
      mostAskedQuestions: [
        'Applications of graph theory?',
        'Explain combinatorics basics.',
        'Role of logic in circuit design?',
        'Set theory in algorithms?'
      ]
    },
    'Logic': {
      definition: 'Formal reasoning and boolean algebra.',
      whyItMatters: 'Supports algorithmic thinking and correctness proofs.',
      mostAskedQuestions: [
        'Explain truth tables.',
        'Propositional vs predicate logic?',
        'Logic in query optimization?',
        'Logic in compiler design?'
      ]
    },
    'Probability': {
      definition: 'Mathematical study of randomness and uncertainty.',
      whyItMatters: 'Useful for algorithms and AI applications.',
      mostAskedQuestions: [
        'How to compute conditional probability?',
        'Applications in randomized algorithms?',
        'Explain Bayes’ theorem.',
        'Modeling events in probability space?'
      ]
    },
    'Statistics': {
      definition: 'Collection and analysis of numerical data.',
      whyItMatters: 'Helps with metrics and data-driven decisions.',
      mostAskedQuestions: [
        'Difference between mean and median?',
        'Explain standard deviation.',
        'Interpreting confidence intervals?',
        'Hypothesis testing in experiments?'
      ]
    },
    'Mobile development': {
      definition: 'Building applications for Android or iOS platforms.',
      whyItMatters: 'Required for mobile product teams only.',
      mostAskedQuestions: [
        'Native vs cross-platform development?',
        'Android activity lifecycle?',
        'Optimizing app performance?',
        'App store deployment steps?'
      ]
    },
    'Machine learning basics': {
      definition: 'Algorithms that learn patterns from data.',
      whyItMatters: 'Useful for AI products but not core to most SE roles.',
      mostAskedQuestions: [
        'Supervised vs unsupervised learning?',
        'Avoiding overfitting?',
        'Explain gradient descent.',
        'What is feature engineering?'
      ]
    },
    'Data engineering': {
      definition: 'Building pipelines to move and process large datasets.',
      whyItMatters: 'Essential for analytics and ML teams but optional elsewhere.',
      mostAskedQuestions: [
        'What is ETL?',
        'Batch vs stream processing?',
        'Designing a data warehouse?',
        'Common tools for data pipelines?'
      ]
    },
    'UI/UX awareness': {
      definition: 'Understanding user interface and experience design principles.',
      whyItMatters: 'Improves collaboration with designers and front-end quality.',
      mostAskedQuestions: [
        'Difference between UX and UI?',
        'Applying usability heuristics?',
        'Responsive design basics?',
        'Accessibility considerations?'
      ]
    },

    // ========================= DEVOPS =========================
    // ---------- High ----------
    'Linux/Unix administration': {
      definition: 'Managing servers, processes, file systems, and permissions in Linux or Unix environments.',
      whyItMatters: 'Most production systems and cloud services run on Linux. Core for DevOps engineers.',
      mostAskedQuestions: [
        'How do you manage services and processes?',
        'Explain file permissions and ownership.',
        'Common performance tuning commands?',
        'Steps to secure a Linux server?'
      ]
    },
    'Scripting (Bash/Python)': {
      definition: 'Writing scripts to automate tasks and system administration.',
      whyItMatters: 'Reduces manual work and enables infrastructure automation.',
      mostAskedQuestions: [
        'Difference between Bash and Python scripting?',
        'How to write portable scripts?',
        'Common pitfalls in shell scripting?',
        'Scheduling jobs using cron?'
      ]
    },
    'CI/CD': {
      definition: 'Automating build, test, and deployment using pipelines.',
      whyItMatters: 'Enables frequent and reliable software releases.',
      mostAskedQuestions: [
        'Setting up a CI/CD pipeline from scratch?',
        'Rollback strategies for failed deployments?',
        'Security considerations in CI/CD?',
        'Integrating automated testing?'
      ]
    },
    'Containerization (Docker) [DevOps]': {
      definition: 'Packaging applications and dependencies into portable containers for consistent deployment.',
      whyItMatters: 'Simplifies deployment and scaling in cloud environments.',
      mostAskedQuestions: [
        'Containers vs virtual machines?',
        'Optimizing Docker images?',
        'Docker volumes and their use?',
        'Securing containerized applications?'
      ]
    },
    'Cloud platforms (AWS/Azure/GCP) [DevOps]': {
      definition: 'On-demand compute, storage, and networking services provided by major cloud vendors.',
      whyItMatters: 'Backbone of modern infrastructure and DevOps pipelines.',
      mostAskedQuestions: [
        'Differences between AWS, Azure, and GCP?',
        'Designing a scalable cloud architecture?',
        'Best practices for cloud security?',
        'Cost optimization techniques?'
      ]
    },
    'Networking basics': {
      definition: 'Understanding of TCP/IP, HTTP/HTTPS, DNS, and routing.',
      whyItMatters: 'Essential for configuring and troubleshooting infrastructure.',
      mostAskedQuestions: [
        'Explain TCP three-way handshake.',
        'Difference between TCP and UDP?',
        'How does DNS resolution work?',
        'How to secure network communications?'
      ]
    },
    'Security fundamentals': {
      definition: 'Practices like encryption, authentication, and access control.',
      whyItMatters: 'Protects systems from breaches and ensures compliance.',
      mostAskedQuestions: [
        'Difference between symmetric and asymmetric encryption?',
        'How to implement least privilege access?',
        'Best practices for API key management?',
        'Steps to secure CI/CD pipelines?'
      ]
    },
    'Monitoring and logging (Grafana/ELK)': {
      definition: 'Tools to collect metrics, visualize data, and detect anomalies.',
      whyItMatters: 'Ensures system reliability and quick incident response.',
      mostAskedQuestions: [
        'How to set up alerts for service downtime?',
        'Difference between metrics and logs?',
        'Visualizing application performance?',
        'Root-cause analysis using logs?'
      ]
    },

    // ---------- Medium ----------
    'Kubernetes [DevOps]': {
      definition: 'Container orchestration platform for managing clusters.',
      whyItMatters: 'Industry standard for running production workloads at scale.',
      mostAskedQuestions: [
        'Explain Kubernetes architecture.',
        'Difference between Deployment and StatefulSet?',
        'How to implement auto-scaling?',
        'Managing secrets securely?'
      ]
    },
    'Load balancing [DevOps]': {
      definition: 'Distributing network traffic across multiple servers.',
      whyItMatters: 'Ensures high availability and scalability.',
      mostAskedQuestions: [
        'Layer 4 vs Layer 7 load balancing?',
        'How to implement round-robin balancing?',
        'Techniques for sticky sessions?',
        'Detecting and handling server failures?'
      ]
    },
    'High availability design': {
      definition: 'Architecting systems to remain operational despite failures.',
      whyItMatters: 'Minimizes downtime and improves reliability.',
      mostAskedQuestions: [
        'Strategies for redundancy?',
        'Active-active vs active-passive setups?',
        'Designing for failover?',
        'Disaster recovery planning?'
      ]
    },
    'Build automation tools (Jenkins/GitLab CI)': {
      definition: 'Platforms for automating builds, tests, and deployments.',
      whyItMatters: 'Core of CI/CD pipelines in DevOps.',
      mostAskedQuestions: [
        'Setting up Jenkins pipelines?',
        'Difference between Jenkins and GitLab CI?',
        'Managing build artifacts?',
        'Integrating automated tests?'
      ]
    },
    'System troubleshooting': {
      definition: 'Diagnosing and fixing infrastructure or application issues.',
      whyItMatters: 'Critical for maintaining uptime and performance.',
      mostAskedQuestions: [
        'Steps to isolate a production outage?',
        'Using logs for root-cause analysis?',
        'Handling intermittent network failures?',
        'Performance tuning methods?'
      ]
    },
    'Agile/Scrum': {
      definition: 'Iterative development methodology for planning and delivering software.',
      whyItMatters: 'Improves collaboration and delivery speed.',
      mostAskedQuestions: [
        'Explain Scrum ceremonies.',
        'Difference between Agile and Waterfall?',
        'Handling changing requirements?',
        'Role of a DevOps engineer in Scrum?'
      ]
    },
    'Serverless architecture': {
      definition: 'Building applications without managing servers using services like AWS Lambda.',
      whyItMatters: 'Reduces operational overhead and scales automatically.',
      mostAskedQuestions: [
        'Benefits and limitations of serverless?',
        'Cold start issues and mitigation?',
        'When to use serverless over containers?',
        'Cost management in serverless environments?'
      ]
    },
    'Cloud databases (SQL/NoSQL) [DevOps]': {
      definition: 'Managed database services such as Amazon RDS or Google Cloud Firestore.',
      whyItMatters: 'Simplifies database operations and scaling.',
      mostAskedQuestions: [
        'Difference between managed and self-hosted databases?',
        'How to implement automated backups?',
        'High availability configurations?',
        'Security considerations for cloud databases?'
      ]
    },
    'Compliance (GDPR, HIPAA)': {
      definition: 'Legal standards for handling data privacy and security.',
      whyItMatters: 'Ensures adherence to regulatory requirements.',
      mostAskedQuestions: [
        'Key GDPR principles?',
        'How to achieve HIPAA compliance?',
        'Data retention best practices?',
        'Handling user consent and data deletion?'
      ]
    },

    // ---------- Low ----------
    'Service mesh (Istio/Linkerd)': {
      definition: 'Layer for managing service-to-service communication in microservices.',
      whyItMatters: 'Adds observability, security, and traffic control.',
      mostAskedQuestions: [
        'What is a service mesh?',
        'When to use Istio vs Linkerd?',
        'How to implement mTLS in a service mesh?',
        'Impact on performance and complexity?'
      ]
    },
    'Edge computing': {
      definition: 'Processing data closer to the source rather than a central cloud.',
      whyItMatters: 'Reduces latency for real-time applications.',
      mostAskedQuestions: [
        'Use cases for edge computing?',
        'Challenges in edge deployment?',
        'Security considerations at the edge?',
        'Tools for edge orchestration?'
      ]
    },
    'Hybrid cloud strategies': {
      definition: 'Combining on-premise and public cloud infrastructure.',
      whyItMatters: 'Provides flexibility and risk mitigation.',
      mostAskedQuestions: [
        'Benefits of hybrid cloud?',
        'Common networking challenges?',
        'Data synchronization methods?',
        'Cost management approaches?'
      ]
    },
    'Multi-cloud federation': {
      definition: 'Coordinating resources across multiple cloud providers.',
      whyItMatters: 'Avoids vendor lock-in and increases redundancy.',
      mostAskedQuestions: [
        'Challenges of multi-cloud deployments?',
        'Techniques for cross-cloud networking?',
        'Handling identity across clouds?',
        'Cost optimization strategies?'
      ]
    },
    'Advanced scripting (Go/Ruby/Perl)': {
      definition: 'Writing complex automation in less common scripting languages.',
      whyItMatters: 'Useful for specific environments but not a core requirement.',
      mostAskedQuestions: [
        'When to choose Go for scripting?',
        'Maintaining older Perl automation scripts?',
        'Performance differences between Go and Python?',
        'Interoperability with system libraries?'
      ]
    },
    'AI/ML for operations': {
      definition: 'Using machine learning to predict failures and optimize infrastructure.',
      whyItMatters: 'Emerging field for proactive operations management.',
      mostAskedQuestions: [
        'Examples of predictive maintenance using ML?',
        'Data requirements for training ops models?',
        'How to integrate ML into monitoring pipelines?',
        'Challenges in real-time anomaly detection?'
      ]
    },
    'Quantum cloud services': {
      definition: 'Cloud-based quantum computing platforms.',
      whyItMatters: 'Highly specialized and experimental at present.',
      mostAskedQuestions: [
        'What is quantum computing?',
        'Current quantum cloud providers?',
        'Practical use cases today?',
        'Limitations of quantum hardware?'
      ]
    }
  };

  // Return specific info if available, otherwise use generic definitions
  if (skillDefinitions[skill]) {
    return skillDefinitions[skill];
  }

  // Generic definitions for other skills
  return {
    definition: `${skill} is a fundamental skill in ${targetRole} and is essential for building ${getRoleDescription(targetRole)}.`,
    whyItMatters: `This skill is highly valued in ${targetRole} roles and will significantly improve your job prospects and technical capabilities.`,
    mostAskedQuestions: [
      `What are the key concepts of ${skill}?`,
      `How do you apply ${skill} in real-world projects?`,
      `What are the best practices for ${skill}?`,
      `How do you troubleshoot common ${skill} issues?`
    ]
  };
}

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
  const explicitPriorities = getExplicitPriorities(targetRole);

  return skills
    .map(skill => {
      const priority = explicitPriorities[skill] || 'Low';
      const priorityScore = priority === 'High' ? 5 : priority === 'Medium' ? 3 : 1;
      const reason = getPriorityReason(skill, priority);
      return { skill, priorityScore, reason, priority };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function getExplicitPriorities(targetRole) {
  const priorities = {
    'Software Engineering': {
      // High Priority
      'Programming Languages (C++, C, Java, Python)': 'High',
      'Data structures': 'High',
      'Algorithms': 'High',
      'Object-oriented design': 'High',
      'Version control (Git)': 'High',
      'Debugging': 'High',
      'Testing': 'High',
      'Problem solving': 'High',
      'Critical thinking': 'High',

      // Medium Priority
      'Databases (SQL/NoSQL)': 'Medium',
      'Operating systems': 'Medium',
      'Networking': 'Medium',
      'Continuous integration': 'Medium',
      'System design': 'Medium',
      'Distributed systems': 'Medium',
      'API design': 'Medium',
      'Scripting': 'Medium',

      // Low Priority
      'Containerization (Docker)': 'Low',
      'Kubernetes': 'Low',
      'Cloud platforms (AWS/Azure/GCP)': 'Low',
      'Microservices': 'Low',
      'Caching': 'Low',
      'Load balancing': 'Low',
      'Discrete mathematics': 'Low',
      'Probability': 'Low',
      'Statistics': 'Low',
      'Mobile development': 'Low',
      'Machine learning basics': 'Low',
      'Data engineering': 'Low',
      'UI/UX awareness': 'Low'
    },
    'DevOps & Cloud Computing': {
      // High Priority
      'Linux/Unix administration': 'High',
      'Scripting (Bash/Python)': 'High',
      'Version control (Git)': 'High',
      'CI/CD': 'High',
      'Containerization (Docker)': 'High',
      'Cloud platforms (AWS/Azure/GCP)': 'High',
      'Networking basics': 'High',
      'Security fundamentals': 'High',
      'Monitoring and logging (Grafana/ELK)': 'High',

      // Medium Priority
      'Kubernetes': 'Medium',
      'Load balancing': 'Medium',
      'High availability design': 'Medium',
      'Build automation tools (Jenkins/GitLab CI)': 'Medium',
      'System troubleshooting': 'Medium',
      'Agile/Scrum': 'Medium',
      'Serverless architecture': 'Medium',
      'Cloud databases (SQL/NoSQL)': 'Medium',
      'Compliance (GDPR, HIPAA)': 'Medium',

      // Low Priority
      'Service mesh (Istio/Linkerd)': 'Low',
      'Edge computing': 'Low',
      'Hybrid cloud strategies': 'Low',
      'Multi-cloud federation': 'Low',
      'Advanced scripting (Go/Ruby/Perl)': 'Low',
      'AI/ML for operations': 'Low',
      'Quantum cloud services': 'Low'
    },
    'Advanced AI & ML': {
      // High Priority
      'NumPy': 'High',
      'Pandas': 'High',
      'Probability': 'High',
      'Statistics': 'High',
      'Exploratory Data Analysis (EDA)': 'High',
      'Visualization basics': 'High',
      'Linear regression': 'High',
      'Logistic regression': 'High',
      'Evaluation metrics': 'High',
      'scikit-learn pipelines': 'High',

      // Medium Priority
      'KNN': 'Medium',
      'Decision trees': 'Medium',
      'Bagging': 'Medium',
      'Boosting': 'Medium',
      'Naive Bayes': 'Medium',
      'Clustering': 'Medium',
      'Gaussian Mixture Models': 'Medium',
      'Anomaly detection': 'Medium',
      'PCA': 'Medium',
      'Time-series forecasting': 'Medium',
      'Recommender systems': 'Medium',
      'Feed-forward networks': 'Medium',
      'Activation functions': 'Medium',
      'Loss functions': 'Medium',
      'Optimizers': 'Medium',
      'Regularization': 'Medium',
      'OpenCV': 'Medium',
      'CNN architectures': 'Medium',
      'Transfer learning': 'Medium',
      'Segmentation': 'Medium',
      'Text preprocessing': 'Medium',
      'Sentiment analysis': 'Medium',
      'Topic modeling': 'Medium',
      'RNN/LSTM/GRU': 'Medium',
      'Attention mechanisms': 'Medium',
      'Transformers': 'Medium',
      'LLM fundamentals': 'Medium',
      'Prompt engineering': 'Medium',
      'Embeddings': 'Medium',
      'Vector databases': 'Medium',
      'RAG architectures': 'Medium',
      'Agentic frameworks': 'Medium',
      'Dataset engineering': 'Medium',
      'Fine-tuning': 'Medium',
      'Model quantization': 'Medium',
      'Inference optimization': 'Medium',
      'ML lifecycle': 'Medium',
      'MLflow': 'Medium',
      'Feature stores': 'Medium',
      'LLM serving': 'Medium',
      'Monitoring': 'Medium',
      'Cost management': 'Medium',

      // Low Priority
      'AWS SageMaker': 'Low',
      'Docker': 'Low',
      'CI/CD for ML': 'Low',
      'Ethics & governance': 'Low',
      'Optimization theory': 'Low',
      'Statistical learning': 'Low',
      'Backpropagation math': 'Low',
      'Transformer internals': 'Low',
      'Data structures': 'Low',
      'Algorithms': 'Low'
    }
  };

  return priorities[targetRole] || {};
}

function getPriorityReason(skill, priority) {
  const reasons = {
    'High': 'Essential skill for this role',
    'Medium': 'Important supporting skill',
    'Low': 'Nice-to-have skill'
  };
  return reasons[priority] || 'Additional skill';
}

function getRoleCategoryWeights(targetRole) {
  const defaults = { core: 3, supporting: 2, niceToHave: 1 };
  const roleMaps = {
    'Software Engineering': {
      'Programming Languages': 3,
      'Computer Science Fundamentals': 3,
      'System Design': 3,
      'Databases': 2,
      'DevOps & Cloud': 2,
      'Frameworks & Runtimes': 2,
      'Engineering Practices': 2,
      'Adjacent Domains': 1
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

// For Vercel, export the app instead of listening
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Also export for Vercel compatibility
module.exports = app;
