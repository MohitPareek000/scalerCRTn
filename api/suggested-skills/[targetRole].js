// Individual API endpoint for Vercel - suggested-skills
export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { targetRole } = req.query;
    console.log('🔍 API: Getting suggested skills for:', targetRole);

    // EXACT getExplicitPriorities function from server/index.js
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

    const priorities = getExplicitPriorities(targetRole);
    console.log('🔍 API: Priorities found:', priorities);

    if (priorities && Object.keys(priorities).length > 0) {
        // For roles with explicit priorities, return all priority skills
        const allPrioritySkills = Object.keys(priorities);
        console.log('🔍 API: Returning priority skills:', allPrioritySkills);
        return res.json(allPrioritySkills);
    }

    // Fallback to taxonomy for roles without explicit priorities
    const skillTaxonomy = {
        'Software Engineering': {
            'Programming Languages': [
                'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'C++', 'C'
            ],
            'Computer Science Fundamentals': [
                'Data structures', 'Algorithms', 'Object-oriented design', 'Discrete mathematics', 'Logic', 'Probability', 'Statistics', 'Operating systems', 'Networking', 'Problem solving', 'Critical thinking'
            ],
            'Databases': [
                'Databases (SQL/NoSQL)', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design'
            ],
            'DevOps & Cloud': [
                'Version control (Git)', 'Testing', 'Debugging', 'Profiling', 'Deployment', 'Containerization (Docker)', 'Kubernetes', 'Cloud platforms (AWS/Azure/GCP)', 'Automation', 'Scripting'
            ],
            'System Design': [
                'System design', 'Distributed systems', 'Microservices', 'Caching', 'Load balancing', 'API design'
            ],
            'Engineering Practices': [
                'Agile/Scrum', 'Code review', 'Documentation', 'Communication', 'Teamwork'
            ]
        }
    };

    if (skillTaxonomy[targetRole]) {
        const allSkills = Object.values(skillTaxonomy[targetRole]).flat();
        console.log('🔍 API: Returning taxonomy skills:', allSkills);
        return res.json(allSkills);
    }

    return res.status(404).json({ error: 'No skills found for this role' });
}