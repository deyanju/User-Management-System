const User = require('../models/User');
const Device = require('../models/Device');

// Fetch the list of devices
exports.getDevices = async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    res.status(200).json({ devices: req.user.devices });
    //res.json(user.devices);
};

// Logout from a specific device
/*exports.logoutFromDevice = async (req, res) => {
    /*const { deviceId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.devices = user.devices.filter(device => device !== deviceId);
    await user.save();

    res.json({ message: 'Logged out from device' });
    const { deviceId } = req.body;
  
    try {
      const userId = req.user.id; // Assume middleware sets `req.user`
      const device = await Device.findOneAndDelete({ userId, deviceId });
  
      if (!device) {
        return res.status(404).json({ message: 'Device not found.' });
      }
  
      res.status(200).json({ message: 'Successfully logged out from the device.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging out from device.' });
    }
  
};*/



exports.logoutFromDevice = async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID is required.' });
  }

  try {
    const userId = req.user.userId; // Ensure middleware sets req.user.userId
    console.log(`User ID: ${userId}, Device ID: ${deviceId}`);

    const device = await Device.findOneAndDelete({ userId, deviceId });

    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.status(200).json({ message: 'Successfully logged out from the device.' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Error logging out from device.' });
  }
};




    
