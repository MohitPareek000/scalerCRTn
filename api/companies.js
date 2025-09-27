// Individual API endpoint for Vercel - companies
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

    console.log('🔍 GET /api/companies called');

    try {
        // EXACT companies data from server/index.js
        const companies = [
            {
                id: 1,
                name: 'Google',
                logo: 'https://logo.clearbit.com/google.com',
                role: 'Senior Software Engineer',
                salaryBand: '₹20L - ₹70L',
                source: 'LinkedIn',
                interviewProcess: [
                    'Phone Screen (45 min)',
                    'Technical Interview (60 min)',
                    'System Design (60 min)',
                    'Behavioral Interview (45 min)',
                    'Hiring Committee Review'
                ],
                commonQuestions: [
                    'Explain your approach to designing a scalable system',
                    'How would you optimize a slow database query?',
                    'Describe a challenging technical problem you solved',
                    'How do you stay updated with new technologies?'
                ]
            },
            {
                id: 2,
                name: 'Microsoft',
                logo: 'https://logo.clearbit.com/microsoft.com',
                role: 'Software Engineer II',
                salaryBand: 'Upto ₹45L',
                source: 'Company Website',
                interviewProcess: [
                    'Initial Screening (30 min)',
                    'Coding Challenge (90 min)',
                    'Technical Interview (60 min)',
                    'Team Fit Interview (45 min)'
                ],
                commonQuestions: [
                    'Walk me through your most complex project',
                    'How do you handle code reviews?',
                    'Explain the difference between SQL and NoSQL',
                    'Describe your experience with cloud platforms'
                ]
            },
            {
                id: 3,
                name: 'Amazon',
                logo: 'https://logo.clearbit.com/amazon.com',
                role: 'SDE II',
                salaryBand: 'Upto ₹40L',
                source: 'Indeed',
                interviewProcess: [
                    'Online Assessment (90 min)',
                    'Phone Interview (60 min)',
                    'On-site Loop (4-5 interviews)',
                    'Bar Raiser Interview'
                ],
                commonQuestions: [
                    'Tell me about a time you disagreed with your manager',
                    'How do you prioritize tasks when everything is urgent?',
                    'Explain the CAP theorem',
                    'Describe your experience with microservices'
                ]
            },
            {
                id: 101,
                targetRole: 'DevOps & Cloud Computing',
                name: 'Microsoft',
                logo: 'https://logo.clearbit.com/microsoft.com',
                role: 'DevOps / Cloud Engineer',
                salaryBand: '₹17.5L - ₹34.8L',
                source: 'Indeed / Levels.fyi',
                interviewProcess: [
                    'Recruiter / HR screening',
                    'Technical phone/video screening (coding, cloud)',
                    'Deep technical rounds (system design, architecture)',
                    'Leadership / behavioral / team fit',
                    'Final decision / offer'
                ],
                commonQuestions: [
                    'Design a fault‑tolerant system across multiple Azure regions',
                    'How does Kubernetes scheduling work?',
                    'Terraform vs ARM templates – differences and trade‑offs',
                    'Secrets management and identity in cloud (Key Vault / Managed Identities)'
                ]
            },
            {
                id: 102,
                targetRole: 'DevOps & Cloud Computing',
                name: 'Accenture',
                logo: 'https://logo.clearbit.com/accenture.com',
                role: 'DevOps Engineer',
                salaryBand: '₹5L – ₹10.4L',
                source: 'Glassdoor / Levels.fyi / Indeed',
                interviewProcess: [
                    'HR / recruiter screening',
                    'Technical screening (programming, DevOps tools)',
                    'Technical rounds (cloud, infra, scripting)',
                    'Managerial / behavioral round',
                    'Final HR / offer'
                ],
                commonQuestions: [
                    'Explain CI/CD implementation and rollback strategies',
                    'How to monitor distributed services and set alerts',
                    'Blue/green deployments and canary releases',
                    'Infrastructure as Code and drift management'
                ]
            },
            {
                id: 103,
                targetRole: 'DevOps & Cloud Computing',
                name: 'Cisco',
                logo: 'https://logo.clearbit.com/cisco.com',
                role: 'Senior DevOps Engineer',
                salaryBand: '₹9L - ₹48.7L+',
                source: 'Glassdoor / Indeed / Levels.fyi',
                interviewProcess: [
                    'HR / recruiter screening',
                    'Technical phone/video round',
                    'Virtual onsite: multiple technical panels',
                    'System design / architecture round',
                    'Behavioral / culture fit',
                    'Final HR'
                ],
                commonQuestions: [
                    'Design a scalable microservices platform (auto‑scaling, load balancer)',
                    'Kubernetes node roles and scheduling',
                    'Disaster recovery and failover strategy in cloud',
                    'Securing network, IAM, and inter‑service comms'
                ]
            },
            {
                id: 104,
                targetRole: 'DevOps & Cloud Computing',
                name: 'Oracle',
                logo: 'https://logo.clearbit.com/oracle.com',
                role: 'DevOps Engineer',
                salaryBand: '₹7L – ₹38.8L',
                source: 'Glassdoor / Indeed / Levels.fyi',
                interviewProcess: [
                    'HR / recruiter screening',
                    'Technical rounds – coding, DevOps tools',
                    'Managerial / domain round',
                    'HR / offer discussion'
                ],
                commonQuestions: [
                    'Describe your CI/CD pipeline and rollback mechanism',
                    'Deep‑dive on Docker, Kubernetes, Terraform used in projects',
                    'Architecture: failover, scaling, observability',
                    'Biggest production incident and your resolution'
                ]
            }
        ];

        console.log('🔍 Returning companies:', companies.length, 'companies');
        res.json(companies);

    } catch (error) {
        console.error('❌ Error in companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}