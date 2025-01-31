const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');  

// Test route with more logging
router.get('/', (req, res) => {
    console.log('Base auth route hit');
    res.json({ message: 'Auth route is working' });
});

// Add this near the top of your routes
router.get('/test-redirect', (req, res) => {
    console.log('Test redirect route hit');
    res.redirect('https://www.google.com');
});

// Google OAuth routes with error handling and logging and HTML response
router.get('/google', (req, res) => {
    console.log('Google auth route hit');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'https://frequency-tube-england-pipes.trycloudflare.com/api/auth/google/callback';
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Google Auth Test</title>
        </head>
        <body>
            <h1>Google Auth Test</h1>
            <p>Click the button to start authentication:</p>
            <button onclick="startAuth()">Login with Google</button>

            <script>
                function startAuth() {
                    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' +
                        'client_id=${clientId}&' +
                        'redirect_uri=${encodeURIComponent(redirectUri)}&' +
                        'response_type=code&' +
                        'scope=profile%20email&' +
                        'access_type=offline&' +
                        'prompt=consent';
                }
            </script>
        </body>
        </html>
    `);
});


router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        console.log('Callback received with code:', code);

        // Use the code to get user profile from Google
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'https://frequency-tube-england-pipes.trycloudflare.com/api/auth/google/callback',
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await response.json();
        console.log('Google OAuth tokens:', tokens);

        if (tokens.error) {
            throw new Error(tokens.error_description || tokens.error);
        }

        // Get user profile from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        }).then(res => res.json());
        
        console.log('Google user info:', userInfo);

        // Find or create user in our database
        let user = await User.findOne({ email: userInfo.email });
        
        if (!user) {
            user = await User.create({
                username: userInfo.name,
                email: userInfo.email,
                googleId: userInfo.id,
                authType: 'google',
                preferences: { genres: [], watchlist: [] }
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send a detailed success page
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Success</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 40px auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .token {
                        word-break: break-all;
                        background: #f0f0f0;
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .debug {
                        font-size: 12px;
                        color: #666;
                        margin-top: 40px;
                        border-top: 1px solid #eee;
                        padding-top: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>Authentication Successful! 🎉</h1>
                <p>Your Google authentication was successful. Here are the details:</p>
                
                <h2>User Details:</h2>
                <ul>
                    <li>Email: ${user.email}</li>
                    <li>Username: ${user.username}</li>
                    <li>Auth Type: ${user.authType}</li>
                </ul>

                <h2>Your JWT Token:</h2>
                <p class="token">${token}</p>

                <p><strong>Next Steps:</strong></p>
                <p>Use this token in the Authorization header for API requests:</p>
                <code>Authorization: Bearer ${token}</code>

                <p><em>You can now use this token to authenticate API requests as documented in the README.</em></p>

                <div class="debug">
                    <h3>Debug Information:</h3>
                    <p>MongoDB User ID: ${user._id}</p>
                    <p>Google ID: ${user.googleId}</p>
                    <p>Created: ${user.createdAt}</p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Callback error:', error);
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Error</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 40px auto;
                        padding: 20px;
                    }
                    .error {
                        color: red;
                        background: #fff0f0;
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .debug {
                        font-size: 12px;
                        color: #666;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>Authentication Failed</h1>
                <p class="error">Error: ${error.message}</p>
                <div class="debug">
                    <p>Debug info: ${error.stack}</p>
                </div>
                <p><a href="/api/auth/google">Try Again</a></p>
            </body>
            </html>
        `);
    }
});


// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;