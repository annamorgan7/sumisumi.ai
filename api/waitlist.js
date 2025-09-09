export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { email } = req.body || {};
        
        // Simple logging
        console.log('=== EMAIL RECEIVED ===');
        console.log('Email:', email);
        console.log('Body:', JSON.stringify(req.body));
        console.log('Method:', req.method);
        console.log('======================');
        
        return res.status(200).json({ 
            success: true, 
            received: email
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}