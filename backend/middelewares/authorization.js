const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


// Authorization logic
const authorization = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'No token!' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();

  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(401).json({ message: 'Invalid or expired token!' });
  }
};

module.exports = authorization;
