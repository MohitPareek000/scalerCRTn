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

    const { targetRole } = req.query;

    console.log('🔍 GET /api/projects called for:', targetRole);

    try {
        // Projects data from server/index.js
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
                }
            ],
            'DevOps & Cloud Computing': [
                {
                    id: 6,
                    title: 'CI/CD Pipeline Setup',
                    tier: 'Beginner',
                    skills: ['Jenkins', 'Docker', 'Git', 'Bash Scripting', 'AWS'],
                    estimatedTime: '2-3 weeks',
                    description: 'Set up a complete CI/CD pipeline using Jenkins, Docker, and cloud services for automated deployment.',
                    rubric: '#'
                },
                {
                    id: 7,
                    title: 'Kubernetes Cluster Management',
                    tier: 'Intermediate',
                    skills: ['Kubernetes', 'Docker', 'Helm', 'Prometheus', 'Grafana'],
                    estimatedTime: '4-5 weeks',
                    description: 'Deploy and manage a Kubernetes cluster with monitoring, logging, and scaling capabilities.',
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
