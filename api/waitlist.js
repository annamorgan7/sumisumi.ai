export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Handle GET request to view emails
    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Waitlist API is working',
            note: 'POST email to add to waitlist'
        });
    }

    if (req.method === 'POST') {
        try {
            const { email } = req.body;
            
            if (!email || !email.includes('@')) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Valid email required' 
                });
            }

            const timestamp = new Date().toISOString();
            
            // Log in a format that's easier to find
            console.log(`WAITLIST_EMAIL: ${email} | TIME: ${timestamp}`);
            
            // Also send to a test webhook for verification
            try {
                await fetch('https://webhook.site/f8a8c8e5-6c5d-4e8f-9b4d-5e8a9c7f2d1b', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        timestamp: timestamp,
                        source: 'sumisumi-waitlist'
                    })
                });
            } catch (webhookError) {
                console.log('Webhook failed, but email logged:', webhookError);
            }

            return res.status(200).json({ 
                success: true, 
                message: 'Successfully added to waitlist'
            });

        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}