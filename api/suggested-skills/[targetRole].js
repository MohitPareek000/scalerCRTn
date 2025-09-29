// Individual API endpoint for Vercel - suggested-skills
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
    console.log('🔍 API: Getting suggested skills for:', targetRole);

    try {
        // Get explicit priorities for the target role
        const priorities = getExplicitPriorities(targetRole);
        console.log('🔍 API: Priorities found:', priorities);

        let skills = [];

        if (Object.keys(priorities).length > 0) {
            // Return prioritized skills (High + 3 Medium + 3 Low)
            const highPrioritySkills = Object.keys(priorities).filter(skill => priorities[skill] === 'High');
            const mediumPrioritySkills = Object.keys(priorities).filter(skill => priorities[skill] === 'Medium').slice(0, 3);
            const lowPrioritySkills = Object.keys(priorities).filter(skill => priorities[skill] === 'Low').slice(0, 3);

            skills = [...highPrioritySkills, ...mediumPrioritySkills, ...lowPrioritySkills];
            console.log('🔍 API: Returning priority skills:', skills);
        }

        // Fallback to taxonomy for roles without explicit priorities
        if (skills.length === 0) {
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
                skills = Object.values(skillTaxonomy[targetRole]).flat();
                console.log('🔍 API: Returning taxonomy skills:', skills);
            } else {
                return res.status(404).json({ error: 'No skills found for this role' });
            }
        }

        // Add "None" option at the top
        const skillsWithNone = ['None', ...skills];
        console.log('🔍 API: Returning skills with None option:', skillsWithNone);
        return res.json(skillsWithNone);

    } catch (error) {
        console.error('❌ Error in suggested-skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

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
}