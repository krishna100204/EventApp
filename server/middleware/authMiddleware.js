const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' }); // Return 401 if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' }); // Return 401 if token is invalid
    }

    req.userId = decoded.id; // Save the user ID from the token
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware; 