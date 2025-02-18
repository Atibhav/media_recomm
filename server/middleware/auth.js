const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    console.log('Auth middleware hit');
    console.log('Request path:', req.path);
    console.log('Headers:', req.headers);
    
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token received:', token ? 'Yes' : 'No');
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified, user ID:', decoded.id);
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = auth;