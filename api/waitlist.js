export default async function handler(req, res) {
    // Enable CORS for your website
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle browser preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Log every request for debugging
    console.log('=== WAITLIST API CALLED ===');
    console.log('Method:', req.method);
    console.log('Time:', new Date().toISOString());
    console.log('Headers:', req.headers);

    // Only accept POST requests
    if (req.method !== 'POST') {
        console.log('Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        console.log('=== EMAIL SUBMISSION ===');
        console.log('Raw body:', req.body);
        console.log('Email received:', email);

        // Validate email
        if (!email || !email.includes('@')) {
            console.log('Invalid email provided:', email);
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid email address' 
            });
        }

        // Get timestamp
        const timestamp = new Date().toISOString();
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const referer = req.headers.referer || 'Direct';

        // Log the signup details
        console.log('=== NEW WAITLIST SIGNUP ===');
        console.log('Email:', email);
        console.log('Timestamp:', timestamp);
        console.log('User Agent:', userAgent);
        console.log('Referer:', referer);
        console.log('===========================');

        // Send notification (if webhook URL is set in environment variables)
        await sendNotification(email, timestamp);

        // Return success response
        res.status(200).json({ 
            success: true, 
            message: 'Successfully added to waitlist',
            timestamp: timestamp
        });

    } catch (error) {
        console.error('=== ERROR IN WAITLIST API ===');
        console.error('Error details:', error);
        console.error('Stack trace:', error.stack);
        console.error('=============================');
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error occurred' 
        });
    }
}

// Function to send notifications (Discord webhook)
async function sendNotification(email, timestamp) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
        console.log('No Discord webhook URL configured');
        return;
    }
    
    try {
        console.log('Sending Discord notification...');
        
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `New Sumi Sumi waitlist signup!\n**Email:** ${email}\n**Time:** ${timestamp}`
            })
        });
        
        console.log('Discord notification sent successfully');
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
    }
}