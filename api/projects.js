// Individual API endpoint for Vercel - projects
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract targetRole from the URL path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const targetRole = pathParts[pathParts.length - 1];

    console.log('🔍 GET /api/projects called for:', targetRole);

    try {
        // EXACT projects data from server/index.js
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
                }
            ]
        };

        const roleProjects = projects[targetRole] || [];

        console.log('🔍 Returning projects for', targetRole, ':', roleProjects.length, 'projects');
        res.json(roleProjects);

    } catch (error) {
        console.error('❌ Error in projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
