// Individual API endpoint for Vercel - analyze-skills
const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Mock data - you can move this to a separate file later
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

function prioritizeSkills(targetRoleSkills, currentSkills) {
    const priorities = getExplicitPriorities(targetRole);
    if (!priorities) return [];

    const prioritized = [];

    // Add High priority skills first
    priorities.High.forEach(skill => {
        if (targetRoleSkills.includes(skill) && !currentSkills.includes(skill)) {
            prioritized.push({ skill, priority: 'High' });
        }
    });

    // Add Medium priority skills
    priorities.Medium.forEach(skill => {
        if (targetRoleSkills.includes(skill) && !currentSkills.includes(skill)) {
            prioritized.push({ skill, priority: 'Medium' });
        }
    });

    // Add Low priority skills
    priorities.Low.forEach(skill => {
        if (targetRoleSkills.includes(skill) && !currentSkills.includes(skill)) {
            prioritized.push({ skill, priority: 'Low' });
        }
    });

    return prioritized;
}

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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('🔍 POST /api/analyze-skills called');
    console.log('🔍 Request body:', req.body);
    console.log('🔍 Environment check:', {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        openaiKey: process.env.OPENAI_API_KEY ? 'Set' : 'Not Set'
    });

    const { currentRole, targetRole, currentSkills, yearsExperience, customRole } = req.body;

    try {
        // Get skills from explicit priorities if available, otherwise use taxonomy
        const explicitPriorities = getExplicitPriorities(targetRole);
        let targetRoleSkills = [];

        if (explicitPriorities && Object.keys(explicitPriorities).length > 0) {
            // Use priority skills as the definitive list
            targetRoleSkills = Object.values(explicitPriorities).flat();
        } else if (skillTaxonomy[targetRole]) {
            // Fallback to taxonomy
            targetRoleSkills = Object.values(skillTaxonomy[targetRole]).flat();
        } else {
            // Default skills if no mapping found
            targetRoleSkills = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
        }

        // Calculate existing skills (intersection)
        const existingSkills = currentSkills.filter(skill => targetRoleSkills.includes(skill));

        // Calculate missing skills (skills in target but not in current)
        const missingSkills = targetRoleSkills.filter(skill => !currentSkills.includes(skill));

        // Get prioritized missing skills
        const prioritizedMissing = prioritizeSkills(targetRoleSkills, currentSkills);

        // Calculate match score
        const matchScore = Math.round((existingSkills.length / targetRoleSkills.length) * 100);

        // Calculate skill coverage
        const skillCoverage = matchScore;

        const analysisData = {
            matchScore,
            existingSkills,
            missingSkills,
            prioritizedMissing,
            skillCoverage,
            targetRoleSkills,
            currentSkills,
            yearsExperience: yearsExperience || 0
        };

        console.log('🔍 Analysis result:', analysisData);
        res.json(analysisData);

    } catch (error) {
        console.error('❌ Error in analyze-skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}