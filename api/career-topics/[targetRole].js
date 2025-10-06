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
        // EXACT career topics data from server/careerTopics.json
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
                    why: 'To solve real-world problems efficiently, you need to understand how data is organized and manipulated. In this step, you will learn the essential building blocks of programming logic, gaining the ability to approach problems systematically and optimize your solutions.',
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
                    why: 'This step challenges you to take your problem-solving skills to the next level. You will practice medium-difficulty problems that combine multiple concepts, helping you think critically and develop strategies for solving more complex coding challenges.',
                    topicsList: [
                        'Sliding window',
                        'Prefix sums',
                        'Binary search variations',
                        'Two pointers'
                    ],
                    milestone: 'Confidently solve 50+ medium-level problems on platforms like LeetCode.',
                    status: 'none'
                },
                {
                    id: 'se-04',
                    title: 'Advanced DSA',
                    why: 'Now it is time to tackle the toughest coding challenges. This intensive sprint prepares you for top-tier product company interviews, focusing on advanced patterns, optimization techniques, and data structures that appear in competitive and real-world problem-solving scenarios.',
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
                    why: 'Data is at the core of almost every application. Learning SQL and databases will allow you to efficiently manage, query, and manipulate structured data, a critical skill for both backend development and data-driven applications.',
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
                    why: 'Backend development teaches you how to design and build the server-side of applications. You will understand how the internet works, APIs, databases, and application architecture, enabling you to develop scalable and maintainable systems.',
                    topicsList: [
                        'Software Design Principles: SOLID, design patterns, UML, schema design, API design',
                        'Backend Development: TCP/UDP/HTTP, MVC, LLD, unit testing, ORM, deployment, Git, Spring Boot/Node.js/Django'
                    ],
                    milestone: 'Deploy your first backend service with APIs.',
                    status: 'none'
                },
                {
                    id: 'se-07',
                    title: 'Fullstack Development',
                    why: 'Fullstack development expands your backend knowledge to include frontend technologies. You will learn to build complete applications end-to-end, integrating UI with backend services while considering best practices, deployment, and performance.',
                    topicsList: [
                        'HTML',
                        'CSS',
                        'JavaScript',
                        'React',
                        'Redux',
                        'OOP in JS',
                        'Concurrency',
                        'DOM manipulation',
                        'Event handling',
                        'API integration',
                        'Deployment',
                        'Frontend LLD'
                    ],
                    milestone: 'Launch a full-stack project connecting frontend and backend.',
                    status: 'none'
                },
                {
                    id: 'se-08',
                    title: 'High-Level Design (HLD)',
                    why: 'As you grow as a software engineer, understanding system-level design is critical. This step teaches you to design scalable, reliable systems for millions of users, preparing you for system design interviews and real-world architecture decisions.',
                    topicsList: [
                        'Consistent hashing',
                        'Caching',
                        'CAP theorem',
                        'Distributed databases',
                        'Scalability',
                        'Kafka',
                        'Microservices',
                        'Case studies (Twitter, Uber, WhatsApp)'
                    ],
                    milestone: 'Confidently explain and design scalable architectures in interviews.',
                    status: 'none'
                },
                {
                    id: 'se-09',
                    title: 'Dive into Data Engineering',
                    why: 'This step focuses on building robust data pipelines and handling large-scale data. You will learn tools and techniques to extract, transform, and analyze data efficiently, enabling you to contribute to data-driven products and analytics systems.',
                    topicsList: [
                        'Data processing systems',
                        'Advanced SQL',
                        'ETL pipelines',
                        'MapReduce',
                        'Spark',
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
                    why: 'Great engineers understand the product they are building. In this step, you will learn product management concepts, including discovery, roadmap planning, prioritization, and analytics, enabling you to contribute meaningfully beyond writing code.',
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
                    why: 'AI is transforming software development. This step teaches you how to leverage generative AI technologies, LLMs, RAG, and AI agents to build intelligent, production-ready applications that solve real-world problems.',
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
            'Data Science': [
                {
                    id: 'ds-01',
                    title: 'Python for Data Science',
                    shortDescription: 'NumPy, Pandas, visualization',
                    detailedContent: 'Load and clean data with Pandas, compute with NumPy, visualize with Matplotlib/Seaborn, notebooks best practices and storytelling.',
                    status: 'none'
                },
                {
                    id: 'ds-02',
                    title: 'ML Fundamentals',
                    shortDescription: 'Modeling and evaluation',
                    detailedContent: 'Supervised vs unsupervised learning, feature engineering, model selection, cross-validation, metrics (precision/recall/ROC-AUC), bias-variance tradeoff.',
                    status: 'none'
                }
            ],
            'Data Analytics': [
                {
                    id: 'da-01',
                    title: 'SQL & BI Dashboards',
                    shortDescription: 'Transform data into insights',
                    detailedContent: 'Write complex SQL (joins, windows), build dashboards in Tableau/Power BI, design KPIs and tell data stories with clear visual choices.',
                    status: 'none'
                },
                {
                    id: 'da-02',
                    title: 'SQ & BI Dashboards',
                    shortDescription: 'Transform data into insights',
                    detailedContent: 'Write complex SQL (joins, windows), build dashboards in Tableau/Power BI, design KPIs and tell data stories with clear visual choices.',
                    status: 'none'
                }
            ],
            'DevOps & Cloud Computing': [
                {
                    id: 'dc-01',
                    title: 'Programming Foundations',
                    why: 'Strong coding skills enable automation, efficient problem solving, and integration of tools used throughout DevOps.',
                    topicsList: [
                        'Python syntax, data types, loops, functions, file I/O',
                        'Basic algorithms and complexity analysis',
                        'Small scripting tasks such as log parsing or API calls'
                    ],
                    milestone: 'Build a command-line utility and explain its logic and time complexity.',
                    status: 'none'
                },
                {
                    id: 'dc-02',
                    title: 'Linux, Operating Systems, and Networking',
                    why: 'Most infrastructure runs on Linux; understanding the OS and networks is critical for configuration and troubleshooting.',
                    topicsList: [
                        'Linux commands, file permissions, process management, shell scripting',
                        'OS concepts: memory, scheduling, threads',
                        'Networking fundamentals: TCP/IP, DNS, HTTP',
                        'Database basics: schema design, replication, backups'
                    ],
                    milestone: 'Securely access a remote server, diagnose a network issue, and restore a database from backup.',
                    status: 'none'
                },
                {
                    id: 'dc-03',
                    title: 'DevOps Toolchain',
                    why: 'Automation and orchestration ensure consistent deployments and reliable operations.',
                    topicsList: [
                        'Docker containerization',
                        'Kubernetes orchestration: pods, services, networking, persistent storage',
                        'Version control with Git and GitHub',
                        'CI/CD pipelines using Jenkins or GitHub Actions',
                        'Configuration management with Ansible',
                        'Observability with Prometheus and Grafana'
                    ],
                    milestone: 'Push code to a repository and watch an automated pipeline build, test, and deploy to a running Kubernetes cluster.',
                    status: 'none'
                },
                {
                    id: 'dc-04',
                    title: 'Cloud Computing (AWS Focus)',
                    why: 'Cloud platforms provide scalable infrastructure and managed services for modern applications.',
                    topicsList: [
                        'AWS IAM roles and security',
                        'Compute and storage: EC2, S3, EBS',
                        'Networking: VPCs, subnets, routing, load balancers, auto-scaling',
                        'Serverless computing: AWS Lambda',
                        'Infrastructure as Code: CloudFormation',
                        'Monitoring: CloudWatch, CloudTrail'
                    ],
                    milestone: 'Deploy a production-ready web service on AWS with automated scaling, logging, and monitoring.',
                    status: 'none'
                },
                {
                    id: 'dc-05',
                    title: 'System Design and Advanced Algorithms',
                    why: 'Designing distributed systems ensures scalability, reliability, and cost efficiency.',
                    topicsList: [
                        'Caching strategies, consistent hashing, CAP theorem',
                        'SQL vs NoSQL trade-offs',
                        'Messaging systems: Kafka, Zookeeper',
                        'Microservices architecture',
                        'Advanced DSA for optimization problems'
                    ],
                    milestone: 'Present a high-level design for a large-scale service (e.g., social media feed) and defend the architectural choices.',
                    status: 'none'
                },
                {
                    id: 'dc-06',
                    title: 'MLOps and AI Integration',
                    why: 'Many organizations deploy machine-learning models that require the same operational rigor as traditional services.',
                    topicsList: [
                        'API development with Flask or FastAPI',
                        'Containerized model deployment with Docker/Kubernetes',
                        'CI/CD for model retraining and deployment',
                        'Model tracking with MLflow',
                        'LLM concepts: embeddings, retrieval-augmented generation, AI agents'
                    ],
                    milestone: 'Operate a production ML or LLM service with automated updates and monitoring.',
                    status: 'none'
                },
                {
                    id: 'dc-07',
                    title: 'Capstone Projects and Portfolio',
                    why: 'Practical, production-grade projects demonstrate readiness for professional roles.',
                    topicsList: [
                        'Infrastructure automation with Terraform and Ansible',
                        'Multi-service Kubernetes deployment integrated with AWS services',
                        'Full observability and incident-response workflows'
                    ],
                    milestone: 'Publish a complete end-to-end project showcasing DevOps automation, cloud deployment, and monitoring to prospective employers.',
                    status: 'none'
                }
            ],
            'Advanced AI & ML': [
                {
                    id: 'aiml-01',
                    title: 'Master Data Foundations',
                    why: 'All AI systems rely on accurate, well-structured data. Understanding how to clean, explore, and visualize data lets you detect errors early, choose the right features, and communicate findings. Strong probability knowledge builds the intuition to judge model outputs and uncertainty.',
                    topicsList: [
                        'NumPy', 'Pandas', 'DataFrames', 'EDA', 'Visualization basics', 'Probability fundamentals'
                    ],
                    milestone: 'Complete a full EDA project on a public dataset and explain key probability concepts in a notebook or presentation.',
                    status: 'none'
                },
                {
                    id: 'aiml-02',
                    title: 'Supervised ML Basics',
                    why: 'Regression and classification form the backbone of ML. Mastering these teaches you how algorithms learn from labeled data, evaluate performance, and generalize to unseen cases.',
                    topicsList: [
                        'Linear regression', 'Logistic regression', 'Evaluation metrics', 'scikit-learn pipelines', 'KNN', 'Decision trees', 'Bagging', 'Boosting', 'Naive Bayes'
                    ],
                    milestone: 'Deliver a price-prediction or spam-classification model with a reproducible scikit-learn pipeline.',
                    status: 'none'
                },
                {
                    id: 'aiml-03',
                    title: 'Unsupervised Learning & Time Series',
                    why: 'Unsupervised methods help discover natural groupings and detect anomalies; time-series techniques enable forecasting and anomaly detection; recommenders personalize products.',
                    topicsList: [
                        'Clustering', 'Gaussian Mixture Models', 'Anomaly detection', 'PCA', 'Time-series decomposition', 'Forecasting', 'Collaborative recommenders', 'Content-based recommenders'
                    ],
                    milestone: 'Build a customer-segmentation project and a basic recommender or sales-forecast model.',
                    status: 'none'
                },
                {
                    id: 'aiml-04',
                    title: 'Neural Networks Fundamentals',
                    why: 'Understand layers, activations, optimization and hyperparameters to debug models instead of treating them as black boxes.',
                    topicsList: [
                        'Feed-forward networks', 'Activation functions', 'Loss functions', 'Optimizers', 'Weight initialization', 'Regularization'
                    ],
                    milestone: 'Implement a small neural network from scratch and match results using PyTorch or TensorFlow.',
                    status: 'none'
                },
                {
                    id: 'aiml-05',
                    title: 'Computer Vision',
                    why: 'Vision models power applications from medical imaging to autonomous driving. CNNs and transfer learning extract spatial features efficiently.',
                    topicsList: [
                        'OpenCV', 'CNN architectures', 'Transfer learning', 'Segmentation', 'Face detection/recognition'
                    ],
                    milestone: 'Deploy an image-classification or object-detection model.',
                    status: 'none'
                },
                {
                    id: 'aiml-06',
                    title: 'Natural Language Processing',
                    why: 'NLP techniques enable chatbots, search engines, and summarizers by teaching machines to understand and generate language.',
                    topicsList: [
                        'Text preprocessing (NLTK/spaCy)', 'Sentiment analysis', 'Topic modeling', 'RNN/LSTM/GRU', 'Attention mechanisms', 'Transformers'
                    ],
                    milestone: 'Release a sentiment-analysis API or a question-answer bot.',
                    status: 'none'
                },
                {
                    id: 'aiml-07',
                    title: 'Generative AI & LLM Fundamentals',
                    why: 'Learn prompt engineering, vector databases, and RAG to build custom chatbots, summarizers, and AI search systems.',
                    topicsList: [
                        'LLM fundamentals', 'Prompt engineering & security', 'Embeddings', 'Vector databases', 'RAG architectures'
                    ],
                    milestone: 'Build a RAG-based chatbot using an open-source LLM and a vector database.',
                    status: 'none'
                },
                {
                    id: 'aiml-08',
                    title: 'AI Agents & Fine-Tuning',
                    why: 'Move beyond static models: plan, reason, and act autonomously; adapt models to domain data and deploy efficiently.',
                    topicsList: [
                        'Agentic frameworks (Agents, MCPs, Google A2A)', 'Dataset engineering', 'Fine-tuning', 'Model quantization', 'Inference optimization'
                    ],
                    milestone: 'Fine-tune a small LLM on custom data and integrate it into an autonomous agent pipeline.',
                    status: 'none'
                },
                {
                    id: 'aiml-09',
                    title: 'MLOps & LLMOps',
                    why: 'Version, test, monitor, and deploy at scale. Cost control and governance ensure reliable and compliant production systems.',
                    topicsList: [
                        'ML lifecycle', 'CI/CD', 'Docker', 'MLflow', 'Feature stores', 'AWS SageMaker', 'LLM serving', 'Monitoring', 'Cost management', 'Ethics'
                    ],
                    milestone: 'Containerize and deploy a trained model with automated monitoring and logging.',
                    status: 'none'
                },
                {
                    id: 'aiml-10',
                    title: 'Advanced ML Theory & DSA',
                    why: 'Deep math enables innovation beyond libraries; strong algorithms ensure efficient large-scale solutions.',
                    topicsList: [
                        'Probability & statistics', 'Optimization theory', 'Statistical learning', 'Backpropagation math', 'Transformer internals', 'Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic programming'
                    ],
                    milestone: 'Derive and implement an algorithm from first principles and solve medium-to-hard coding problems consistently.',
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