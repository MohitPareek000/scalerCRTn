// Test endpoint to verify Vercel functions are working
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

    try {
        res.json({
            message: 'API is working!',
            environment: process.env.NODE_ENV,
            vercel: process.env.VERCEL,
            openaiKey: process.env.OPENAI_API_KEY ? 'Set' : 'Not Set',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error in test endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
