const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const authHeader = req.headers['authorization']; // or req.get('authorization')
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Authorization header format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = auth;