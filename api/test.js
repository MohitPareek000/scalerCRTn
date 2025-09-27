// Simple API test endpoint for Vercel
export default function handler(req, res) {
    res.status(200).json({
        message: 'API is working!',
        environment: process.env.NODE_ENV,
        vercel: true,
        timestamp: new Date().toISOString()
    });
}
