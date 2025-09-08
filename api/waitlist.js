export default async function handler(req, res) {
    // Allow requests from your website
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle browser preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        // Check if email is valid
        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid email address' 
            });
        }

        // Get current time
        const timestamp = new Date().toISOString();
        
        // For now, we'll just log the email (you'll see it in Vercel logs)
        console.log('New waitlist signup:', email, 'at', timestamp);

        // Send success response
        res.status(200).json({ 
            success: true, 
            message: 'Successfully added to waitlist' 
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong' 
        });
    }
}