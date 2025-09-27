// Individual API endpoint for Vercel - target-roles
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

    const targetRoles = [
        'Software Engineering', 'Data Science', 'Data Analytics', 'DevOps & Cloud Computing', 'Advanced AI & ML'
    ];

    console.log('🔍 API: Returning target roles:', targetRoles);
    res.json(targetRoles);
}
