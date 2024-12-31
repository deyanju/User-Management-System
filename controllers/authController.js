const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const useragent = require('express-useragent');
const User = require('../models/User');
const { sendEmailVerification } = require('../utils/sendEmail');
const { generateToken } = require('../config/jwt');  // Import generateToken

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
    await user.save();

    // Generate email verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    await sendEmailVerification(user.email, verificationLink);

    res.status(201).json({ message: 'User registered successfully, please verify your email.' });
};

// User Login
/*exports.login = async (req, res) => {
   // const { email, password } = req.body;


    try {
        const { email, password } = req.body;
    
        // Verify user credentials
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
    
        // Parse device details
        const userAgent = req.headers['user-agent'];
        const agent = useragent.parse(userAgent);
    
        const device = {
          deviceName: `${agent.browser} on ${agent.os}`,
          ipAddress: req.ip,
          lastUsed: new Date(),
          token, // Associate the token with this device
        };
    
        // Update user's devices array (allow multiple logins)
        user.devices.push(device);
        await user.save();
    
        res.status(200).json({ token, device });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };
*/


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
          name: req.headers['user-agent'] || 'Unknown device',
          ipAddress: req.ip,
          lastUsed: new Date(),
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
    
    
   /* const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.emailVerified) return res.status(400).json({ message: 'Please verify your email first' });

    res.status(201).json({ message: 'Logged In Successfully' }, {token});

    // Generate JWT token using the imported function
    const token = generateToken(user._id);

    //res.json({ token });
};*/

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
