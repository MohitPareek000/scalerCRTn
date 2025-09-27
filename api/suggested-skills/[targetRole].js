// Individual API endpoint for Vercel - suggested-skills
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

// Priority mappings for Software Engineering
const explicitPriorities = {
    'Software Engineering': {
        'High': [
            'Programming Languages', 'Data structures', 'Algorithms', 'Object-oriented design',
            'Version control (Git)', 'Debugging', 'Testing', 'Problem solving', 'Critical thinking'
        ],
        'Medium': [
            'Databases (SQL/NoSQL)', 'Operating systems', 'Networking', 'Continuous integration',
            'System design', 'Distributed systems', 'API design', 'Scripting'
        ],
        'Low': [
            'Containerization (Docker)', 'Kubernetes', 'Cloud platforms (AWS/Azure/GCP)',
            'Microservices', 'Caching', 'Load balancing', 'Discrete mathematics', 'Probability',
            'Statistics', 'Mobile development', 'Machine learning basics', 'Data engineering', 'UI/UX awareness'
        ]
    }
};

function getExplicitPriorities(targetRole) {
    return explicitPriorities[targetRole] || null;
}

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

    const priorities = getExplicitPriorities(targetRole);
    console.log('🔍 API: Priorities found:', priorities);

    if (priorities && Object.keys(priorities).length > 0) {
        // For roles with explicit priorities, return all priority skills
        const allPrioritySkills = Object.keys(priorities);
        console.log('🔍 API: Returning priority skills:', allPrioritySkills);
        return res.json(allPrioritySkills);
    }

    // Fallback to taxonomy for roles without explicit priorities
    if (skillTaxonomy[targetRole]) {
        const allSkills = Object.values(skillTaxonomy[targetRole]).flat();
        console.log('🔍 API: Returning taxonomy skills:', allSkills);
        return res.json(allSkills);
    }

    // Default fallback
    const defaultSkills = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
    console.log('🔍 API: Returning default skills:', defaultSkills);
    res.json(defaultSkills);
}
