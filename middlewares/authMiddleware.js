const jwt = require('jsonwebtoken');

exports.authenticateToken = async (req, res, next) => {
    /*const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }*/



   /* const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {*/
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    // Check if token exists in user's devices
    const device = user.devices.find((d) => d.token === token);
    if (!device) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token' });
  }
};

//};
