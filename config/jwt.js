const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (userId) => {
    const payload = { userId };  // Payload to embed in the token
    const options = { expiresIn: '1h' };  // Expiry time (e.g., 1 hour)

    // Sign the JWT with a secret key from environment variables
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);  // Verify and decode the token
    } catch (err) {
        throw new Error("Token is invalid or expired.");
    }
};

module.exports = { generateToken, verifyToken };
