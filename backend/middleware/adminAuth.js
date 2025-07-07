const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
require('dotenv').config();

const adminAuth = (req, res, next) => {
    // console.log('[ADMIN AUTH] Received Authorization header:');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log('[ADMIN AUTH] No token provided.');
        return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('[ADMIN AUTH] Decoded token:', decoded);
        if (!decoded.isAdmin) {
            // console.log('[ADMIN AUTH] Not authorized as admin.');
            return res.status(403).json({ message: 'Not authorized as admin.' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        // console.error('[ADMIN AUTH] Invalid or expired token:', err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = adminAuth;