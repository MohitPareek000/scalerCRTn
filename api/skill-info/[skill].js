// Individual API endpoint for Vercel - skill-info
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

    const { skill } = req.query;
    const { targetRole } = req.body;

    console.log('🔍 POST /api/skill-info called for skill:', skill, 'targetRole:', targetRole);

    try {
        // EXACT skill info logic from server/index.js
        const skillInfo = {
            what: `Learn the fundamentals of ${skill} and how to apply it effectively in ${targetRole} roles.`,
            why: `Mastering ${skill} is crucial for ${targetRole} as it enables you to build scalable, maintainable applications and solve complex problems efficiently.`,
            how: [
                `Start with official ${skill} documentation and tutorials`,
                `Practice with hands-on projects and coding exercises`,
                `Join ${skill} communities and contribute to open-source projects`,
                `Read documentation and build a mini-application using ${skill}`
            ],
            mostAskedQuestions: [
                `What are the key concepts in ${skill}?`,
                `How do you apply ${skill} in real-world projects?`,
                `What are the best practices for ${skill}?`,
                `How do you troubleshoot common ${skill} issues?`
            ]
        };

        console.log('🔍 Returning skill info for', skill);
        res.json(skillInfo);

    } catch (error) {
        console.error('❌ Error in skill-info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
