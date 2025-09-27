// Individual API endpoint for Vercel - career-topics
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

    console.log('🔍 GET /api/career-topics called for:', targetRole);

    try {
        // Career topics data from server/careerTopics.json
        const careerTopics = {
            'Software Engineering': [
                {
                    id: 'se-01',
                    title: 'Programming Language Fundamentals',
                    why: 'Every software engineering journey begins with mastering a programming language. This step lays the foundation for all your coding skills, helping you build problem-solving confidence and understand the syntax, logic, and structure that will support everything you do later.',
                    topicsList: [
                        'Variables',
                        'Data types',
                        'Operators',
                        'Loops',
                        'Functions',
                        'Recursion',
                        'Arrays',
                        'Strings',
                        'Debugging'
                    ],
                    milestone: 'Comfortably write 200–300 line programs without external help.',
                    status: 'none'
                },
                {
                    id: 'se-02',
                    title: 'Data Structures & Algorithms (Basics)',
                    why: 'Understanding how data is organized and manipulated enables efficient problem-solving. Learning these fundamental building blocks allows you to approach problems systematically and optimize solutions.',
                    topicsList: [
                        'Arrays',
                        'Strings',
                        'Linked lists',
                        'Stacks',
                        'Queues',
                        'Hashmaps',
                        'Searching & sorting',
                        'Complexity analysis'
                    ],
                    milestone: 'Able to solve 20–30 basic coding problems and explain time/space complexity.',
                    status: 'none'
                },
                {
                    id: 'se-03',
                    title: 'Intermediate Problem Solving',
                    why: 'Strengthen your problem-solving skills by practicing medium-difficulty challenges. This helps develop strategies for tackling more complex coding problems and builds confidence in critical thinking.',
                    topicsList: [
                        'Sliding window',
                        'Prefix sums',
                        'Binary search variations',
                        'Two pointers'
                    ],
                    milestone: 'Confidently solve 50+ medium-level problems on coding platforms.',
                    status: 'none'
                },
                {
                    id: 'se-04',
                    title: 'Advanced DSA',
                    why: 'Prepare for challenging coding problems with advanced concepts and patterns. Focus on optimization techniques and data structures that appear in competitive and real-world scenarios.',
                    topicsList: [
                        'Advanced math',
                        'Backtracking',
                        'Tries',
                        'String pattern matching',
                        'Advanced dynamic programming',
                        'Graph theory'
                    ],
                    milestone: 'Interview-ready for top product company coding rounds.',
                    status: 'none'
                },
                {
                    id: 'se-05',
                    title: 'SQL & Databases',
                    why: 'Efficiently manage, query, and manipulate structured data, a critical skill for backend development and data-driven applications.',
                    topicsList: [
                        'SELECT queries',
                        'Joins',
                        'Aggregations',
                        'Window functions',
                        'Indexes',
                        'Normalization',
                        'Transactions'
                    ],
                    milestone: 'Write optimized SQL queries for real-world datasets.',
                    status: 'none'
                },
                {
                    id: 'se-06',
                    title: 'Backend Development',
                    why: 'Understand how servers work and build backend applications. Learn application architecture, APIs, databases, and scalable system design.',
                    topicsList: [
                        'Software Design Principles: SOLID, design patterns, UML',
                        'Schema design, API design',
                        'TCP/UDP/HTTP, MVC, LLD, unit testing, ORM, deployment, Git',
                        'Spring Boot/Node.js/Django'
                    ],
                    milestone: 'Deploy your first backend service with APIs.',
                    status: 'none'
                },
                {
                    id: 'se-07',
                    title: 'Fullstack Development',
                    why: 'Expand backend knowledge to include frontend technologies, building complete applications end-to-end. Integrate UI with backend services while considering best practices, deployment, and performance.',
                    topicsList: [
                        'HTML, CSS, JavaScript, React, Redux',
                        'OOP in JS, concurrency, DOM manipulation',
                        'Event handling, API integration, deployment',
                        'Frontend LLD'
                    ],
                    milestone: 'Launch a full-stack project connecting frontend and backend.',
                    status: 'none'
                },
                {
                    id: 'se-08',
                    title: 'High-Level Design (HLD)',
                    why: 'Learn to design scalable, reliable systems for millions of users. This prepares for system design interviews and real-world architecture decisions.',
                    topicsList: [
                        'Consistent hashing',
                        'Caching',
                        'CAP theorem',
                        'Distributed databases',
                        'Scalability',
                        'Kafka, microservices',
                        'Case studies (Twitter, Uber, WhatsApp)'
                    ],
                    milestone: 'Confidently explain and design scalable architectures in interviews.',
                    status: 'none'
                },
                {
                    id: 'se-09',
                    title: 'Data Engineering',
                    why: 'Gain expertise in handling big data and building data pipelines. Learn tools and techniques to extract, transform, and analyze data efficiently for data-driven products.',
                    topicsList: [
                        'Data processing systems',
                        'Advanced SQL',
                        'ETL pipelines',
                        'MapReduce, Spark',
                        'Cloud services',
                        'Data warehousing',
                        'Workflow orchestration',
                        'Monitoring'
                    ],
                    milestone: 'Build a production-level ETL pipeline with dashboards and monitoring.',
                    status: 'none'
                },
                {
                    id: 'se-10',
                    title: 'Product Thinking for Engineers',
                    why: 'Understand product management concepts to contribute beyond coding. Learn product discovery, roadmap planning, prioritization, and analytics to influence product development.',
                    topicsList: [
                        'Product discovery',
                        'Roadmaps',
                        'Prioritization',
                        'Analytics',
                        'Case studies',
                        'Delivery management'
                    ],
                    milestone: 'Confidently participate in product discussions and roadmap planning.',
                    status: 'none'
                },
                {
                    id: 'se-11',
                    title: 'Generative AI for Engineers',
                    why: 'Learn to integrate cutting-edge AI into software products. Understand LLMs, RAG, and AI agents to build intelligent, production-ready applications that solve real-world problems.',
                    topicsList: [
                        'AI/ML basics',
                        'LLMs',
                        'Transformer architecture',
                        'Embeddings',
                        'RAG',
                        'AI agents',
                        'Building production-ready AI apps'
                    ],
                    milestone: 'Ship your first GenAI-powered application.',
                    status: 'none'
                }
            ],
            'DevOps & Cloud Computing': [
                {
                    id: 'devops-01',
                    title: 'Linux/Unix Administration',
                    why: 'Master the fundamentals of Linux systems administration, which forms the backbone of most cloud and DevOps environments.',
                    topicsList: [
                        'Command line basics and shell scripting',
                        'File system management and permissions',
                        'Process management and system monitoring'
                    ],
                    milestone: 'Comfortably manage Linux servers and troubleshoot system issues.',
                    status: 'none'
                },
                {
                    id: 'devops-02',
                    title: 'Containerization with Docker',
                    why: 'Learn containerization technologies that enable consistent application deployment across different environments.',
                    topicsList: [
                        'Docker fundamentals and container lifecycle',
                        'Dockerfile best practices',
                        'Docker Compose and multi-container applications'
                    ],
                    milestone: 'Containerize and deploy applications using Docker.',
                    status: 'none'
                },
                {
                    id: 'devops-03',
                    title: 'Cloud Platforms (AWS/Azure/GCP)',
                    why: 'Understand cloud computing fundamentals and learn to work with major cloud platforms for scalable infrastructure.',
                    topicsList: [
                        'Cloud computing concepts and service models',
                        'Virtual machines, storage, and networking',
                        'Identity and access management (IAM)'
                    ],
                    milestone: 'Deploy and manage applications on cloud platforms.',
                    status: 'none'
                },
                {
                    id: 'devops-04',
                    title: 'Kubernetes Orchestration',
                    why: 'Master container orchestration with Kubernetes for managing large-scale containerized applications.',
                    topicsList: [
                        'Kubernetes architecture and components',
                        'Pods, services, and deployments',
                        'ConfigMaps, Secrets, and persistent volumes'
                    ],
                    milestone: 'Deploy and manage containerized applications with Kubernetes.',
                    status: 'none'
                },
                {
                    id: 'devops-05',
                    title: 'CI/CD Pipelines',
                    why: 'Implement continuous integration and continuous deployment practices for automated software delivery.',
                    topicsList: [
                        'CI/CD concepts and best practices',
                        'Jenkins, GitLab CI, GitHub Actions',
                        'Automated testing and deployment strategies'
                    ],
                    milestone: 'Build and maintain CI/CD pipelines for automated deployments.',
                    status: 'none'
                },
                {
                    id: 'devops-06',
                    title: 'Infrastructure as Code (IaC)',
                    why: 'Learn to manage infrastructure using code for consistent, repeatable, and version-controlled infrastructure.',
                    topicsList: [
                        'Terraform fundamentals and state management',
                        'CloudFormation and ARM templates',
                        'Infrastructure automation and best practices'
                    ],
                    milestone: 'Manage infrastructure using Infrastructure as Code tools.',
                    status: 'none'
                },
                {
                    id: 'devops-07',
                    title: 'Monitoring and Observability',
                    why: 'Implement comprehensive monitoring and logging solutions for maintaining system health and performance.',
                    topicsList: [
                        'Monitoring tools (Prometheus, Grafana)',
                        'Logging and log aggregation (ELK Stack)',
                        'Alerting and incident response'
                    ],
                    milestone: 'Set up comprehensive monitoring and alerting systems.',
                    status: 'none'
                },
                {
                    id: 'devops-08',
                    title: 'Security and Compliance',
                    why: 'Learn security best practices and compliance requirements for cloud and DevOps environments.',
                    topicsList: [
                        'Security fundamentals and threat modeling',
                        'Identity and access management',
                        'Compliance frameworks (SOC2, GDPR, HIPAA)'
                    ],
                    milestone: 'Implement security best practices and compliance measures.',
                    status: 'none'
                }
            ]
        };

        const topics = careerTopics[targetRole] || [];

        console.log('🔍 Returning topics for', targetRole, ':', topics.length, 'topics');
        res.json(topics);

    } catch (error) {
        console.error('❌ Error in career-topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
