const User = require('../models/User');
const Device = require('../models/Device');
const jwt = require('jsonwebtoken');


// Fetch the list of devices
exports.getDevices = async (req, res) => {
  try {
    // Access the userId from req.user (set by the middleware)
    const userId = req.user.userId;
    
    // Find the user by userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the list of devices
    res.status(200).json({ devices: user.devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
};



exports.logoutFromDevice = async (req, res) => {
  const { deviceId } = req.body;
  
  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID is required.' });
  }

  try {
    
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    // Decode the token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId; // The userId from the token
    

    // Find and delete the device based on the userId and deviceId
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { devices: { _id: deviceId } } }, // Use _id if deviceId is stored as _id in the device object
      { new: true }
    );
    //console.log(devices);
    if (!deviceId) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.status(200).json({ message: 'Successfully logged out from the device.' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Error logging out from device.' });
  }
};




    
