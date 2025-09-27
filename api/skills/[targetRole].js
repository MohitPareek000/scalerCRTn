// Individual API endpoint for Vercel - skills (fallback)
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

    console.log('🔍 GET /api/skills called for:', targetRole);

    try {
        // Fallback skills data
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
            },
            'DevOps & Cloud Computing': {
                'Core Skills': [
                    'Linux/Unix administration', 'Scripting (Bash/Python)', 'Version control (Git)', 'CI/CD', 'Containerization (Docker)', 'Cloud platforms (AWS/Azure/GCP)', 'Networking basics', 'Security fundamentals'
                ],
                'Advanced Skills': [
                    'Kubernetes', 'Load balancing', 'High availability design', 'Build automation tools (Jenkins/GitLab CI)', 'System troubleshooting', 'Agile/Scrum', 'Serverless architecture'
                ],
                'Specialized Skills': [
                    'Service mesh (Istio/Linkerd)', 'Edge computing', 'Hybrid cloud strategies', 'Multi-cloud federation', 'Advanced scripting (Go/Ruby/Perl)', 'AI/ML for operations'
                ]
            }
        };

        if (skillTaxonomy[targetRole]) {
            const allSkills = Object.values(skillTaxonomy[targetRole]).flat();
            console.log('🔍 Returning fallback skills:', allSkills);
            return res.json(allSkills);
        }

        // Default fallback
        const defaultSkills = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
        console.log('🔍 Returning default skills:', defaultSkills);
        res.json(defaultSkills);

    } catch (error) {
        console.error('❌ Error in skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
