// Individual API endpoint for Vercel - current-roles
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

    const currentRoles = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Scientist', 'Data Analyst', 'DevOps Engineer', 'Cloud Engineer',
        'Machine Learning Engineer', 'AI Engineer', 'Product Manager', 'UI/UX Designer',
        'Mobile Developer', 'QA Engineer', 'System Administrator', 'Other'
    ];

    console.log('🔍 API: Returning current roles:', currentRoles);
    res.json(currentRoles);
}
