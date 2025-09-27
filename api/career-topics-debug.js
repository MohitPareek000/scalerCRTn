// Debug endpoint for career topics
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

    console.log('🔍 DEBUG: GET /api/career-topics-debug called for:', targetRole);

    try {
        // Simple test data
        const testTopics = [
            {
                id: 'test-01',
                title: 'Test Step 1',
                why: 'This is a test step to verify the API is working.',
                topicsList: ['Topic 1', 'Topic 2', 'Topic 3'],
                milestone: 'Complete test milestone',
                status: 'none'
            },
            {
                id: 'test-02',
                title: 'Test Step 2',
                why: 'Another test step to verify the API is working.',
                topicsList: ['Topic 4', 'Topic 5', 'Topic 6'],
                milestone: 'Complete another test milestone',
                status: 'none'
            }
        ];

        console.log('🔍 DEBUG: Returning test topics:', testTopics.length);
        res.json(testTopics);

    } catch (error) {
        console.error('❌ DEBUG: Error in career-topics-debug:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
