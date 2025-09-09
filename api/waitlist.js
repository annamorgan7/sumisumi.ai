// Simple in-memory storage (resets on deployment, but good for testing)
let waitlistEmails = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET request to view all emails
    if (req.method === 'GET') {
        return res.status(200).json({
            totalEmails: waitlistEmails.length,
            emails: waitlistEmails,
            message: 'All waitlist submissions'
        });
    }

    if (req.method === 'POST') {
        const { email } = req.body || {};
        const timestamp = new Date().toISOString();
        
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Valid email required' });
        }

        // Store the email
        waitlistEmails.push({
            email: email,
            timestamp: timestamp
        });
        
        console.log('New email:', email, 'Total:', waitlistEmails.length);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Successfully added to waitlist'
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}