const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmailVerification } = require('../utils/sendEmail');


// User Registration
exports.register = async (req, res) => {
    const { email, username, password } = req.body;

    // Check if the email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    
    // Create new user
    const user = new User({ email, username, password: hashedPassword });

    // Generate email verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.token = token;

    await user.save();

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    await sendEmailVerification(user.email, verificationLink);

    res.status(201).json({ message: 'User registered successfully, please verify your email.' });
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Get device details (example from headers or other means)
    const deviceInfo = {
      userId: user._id, // Ensure userId is set
      name: req.headers['user-agent'] || 'Unknown Device', // Ensure the device name is set properly
      ipAddress: req.ip, // IP address of the device making the request
      lastUsed: new Date(), // Time of the login attempt
      token: token, // Save the JWT token with the device
    };
    // Add the device to the devices array
    user.devices.push(deviceInfo);

    // Save user with updated devices
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
};

    
    


// Email Verification
exports.verifyEmail = async (req, res) => {
    //const { token } = req.query;
    const { email, verificationToken } = req.body;


    try {
        const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(400).json({ message: 'User not found' });

        user.emailVerified = true;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
