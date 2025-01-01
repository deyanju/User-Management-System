const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileImages'); // Directory to store profile images
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

exports.getProfile = async (req, res) => {

    try {
      
      // Find the user by userId
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the list of devices
      res.status(200).json({ name: user.name, email:user.email, profileImage:user.profileImage });
    } catch (error) {
    res.status(500).json({ message: 'Error fetching profile details.' });
  }


};


exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (req.file) {
      req.user.profileImage = `/uploads/profileImages/${req.file.filename}`;
    }

    await req.user.save();
    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
};

exports.upload = upload.single('profileImage'); // Middleware to handle file upload
