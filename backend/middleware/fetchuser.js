const jwt = require('jsonwebtoken');

// Reads the JWT from the "auth-token" header and attaches req.user
const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Session expired. Please log in again' });
  }
};

module.exports = fetchuser;
