const multer = require('multer');
const User = require('../models/User');

// Set up multer for image upload
const upload = multer({ dest: 'uploads/' });

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.userId);  // From JWT Middleware
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
};

exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { username, email }, { new: true });

    if (req.file) {
        user.profileImage = req.file.path;  // Store profile image path
        await user.save();
    }

    res.json(user);
};
