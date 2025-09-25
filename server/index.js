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
  'Software Engineering', 'Data Science', 'Data Analytics', 'DevOps & Cloud Computing', 'Advanced AI & ML'
];

const companies = [
  {
    id: 1,
    name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    role: 'Senior Software Engineer',
    salaryBand: '₹20L - ₹70L',
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
    salaryBand: 'Upto ₹40L',
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
    salaryBand: '₹5L – ₹10.4L',
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
    salaryBand: '₹9L - ₹48.7L+',
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
    salaryBand: '₹7L – ₹38.8L',
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

// Return all priority skills for roles with explicit priorities, otherwise use taxonomy
app.get('/api/suggested-skills/:targetRole', (req, res) => {
  const { targetRole } = req.params;
  const priorities = getExplicitPriorities(targetRole);

  if (priorities && Object.keys(priorities).length > 0) {
    // For roles with explicit priorities, return all priority skills
    const allPrioritySkills = Object.keys(priorities);
    return res.json(allPrioritySkills);
  }

  // Fallback to taxonomy for roles without explicit priorities
  if (skillTaxonomy[targetRole]) {
    const allSkills = Object.values(skillTaxonomy[targetRole]).flat();
    return res.json(allSkills);
  }

  return res.status(404).json({ error: 'No skills found for this role' });
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
    'Programming Languages (C++, C, Java, Python)': {
      definition: 'Programming languages are the fundamental tools for writing software. They provide syntax, rules, and structures that allow developers to create applications, websites, and systems. Each language has its strengths: Python for data science, Java for enterprise applications, C++ for performance-critical systems, and C for system programming.',
      whyItMatters: 'Mastering programming languages is essential for any software development role. It enables you to build applications, solve problems, and communicate with computers effectively. Strong programming skills are the foundation for all other technical skills and are highly valued by employers.',
      mostAskedQuestions: [
        'What are the key differences between compiled and interpreted languages?',
        'How do you choose the right programming language for a project?',
        'What are the best practices for writing clean, maintainable code?',
        'How do you handle memory management in different languages?'
      ]
    },
    'Data structures': {
      definition: 'Data structures are ways of organizing and storing data in a computer so that it can be accessed and modified efficiently. They include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each structure has specific use cases and performance characteristics.',
      whyItMatters: 'Understanding data structures is crucial for writing efficient algorithms and solving complex problems. It helps you choose the right structure for specific tasks, optimize performance, and pass technical interviews. This knowledge is fundamental for system design and software architecture.',
      mostAskedQuestions: [
        'What is the time complexity of different data structure operations?',
        'How do you choose between an array and a linked list?',
        'What are the advantages of using hash tables?',
        'How do you implement a binary search tree?'
      ]
    },
    'Algorithms': {
      definition: 'Algorithms are step-by-step procedures for solving problems or performing tasks. They include sorting algorithms (quicksort, mergesort), searching algorithms (binary search), graph algorithms (BFS, DFS), and dynamic programming solutions. Algorithms are the building blocks of efficient software.',
      whyItMatters: 'Algorithm knowledge is essential for writing efficient code and solving complex problems. It helps you optimize performance, reduce computational costs, and approach problems systematically. Strong algorithmic thinking is highly valued in technical interviews and system design.',
      mostAskedQuestions: [
        'What is the difference between time and space complexity?',
        'How do you optimize an algorithm for better performance?',
        'What are the trade-offs between different sorting algorithms?',
        'How do you approach dynamic programming problems?'
      ]
    },
    'CI/CD': {
      definition: 'CI/CD (Continuous Integration/Continuous Deployment) is a set of practices that automate the software development lifecycle. CI involves automatically building and testing code changes, while CD automates the deployment of code to production environments. It includes tools like Jenkins, GitLab CI, GitHub Actions, and Docker.',
      whyItMatters: 'CI/CD is essential for modern software development as it enables faster, more reliable releases. It reduces manual errors, improves code quality, and allows teams to deploy changes frequently and safely. This skill is highly valued in DevOps and cloud engineering roles.',
      mostAskedQuestions: [
        'How do you set up a CI/CD pipeline from scratch?',
        'What are the best practices for automated testing in CI/CD?',
        'How do you handle rollbacks in a CI/CD environment?',
        'What are the security considerations for CI/CD pipelines?'
      ]
    },
    'Containerization (Docker)': {
      definition: 'Containerization is a lightweight virtualization technology that packages applications and their dependencies into portable containers. Docker is the most popular containerization platform, allowing applications to run consistently across different environments. Containers include everything needed to run an application.',
      whyItMatters: 'Containerization skills are crucial for modern software deployment and DevOps practices. It enables consistent environments, easier scaling, and simplified deployment processes. Docker knowledge is essential for cloud-native applications and microservices architecture.',
      mostAskedQuestions: [
        'What is the difference between containers and virtual machines?',
        'How do you optimize Docker images for production?',
        'What are Docker volumes and when should you use them?',
        'How do you secure Docker containers?'
      ]
    },
    'Cloud platforms (AWS/Azure/GCP)': {
      definition: 'Cloud platforms provide on-demand computing resources over the internet. AWS, Azure, and GCP offer services for computing, storage, databases, networking, and more. These platforms enable scalable, cost-effective solutions without managing physical infrastructure.',
      whyItMatters: 'Cloud skills are essential for modern software development and DevOps roles. They enable you to build scalable applications, manage infrastructure as code, and leverage cloud services for better performance and cost optimization. Cloud certifications are highly valued by employers.',
      mostAskedQuestions: [
        'What are the key differences between AWS, Azure, and GCP?',
        'How do you design a scalable cloud architecture?',
        'What are the best practices for cloud security?',
        'How do you optimize cloud costs?'
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
