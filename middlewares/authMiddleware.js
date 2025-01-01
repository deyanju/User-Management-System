const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path based on your project structure

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from the header
  console.log('Authorization Header:', authHeader);

  if (!token) {
    return res.status(401).json({ message: 'Access token required' }); // No token provided
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId }; 

    // Fetch the user from the database using the userId from the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // User doesn't exist
    }

  

    // Check if the token exists in the user's devices array
    const device = user.devices.find((d) => d.token === token);
    if (!device) {
      return res.status(403).json({ message: 'Invalid or expired token' }); // Token not found or expired
    }

    // Attach the user ID to the request object for downstream use
    req.user = { userId: user._id };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
