const mongoose = require('mongoose');
/*const Devices = require('./Device');

const deviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceName: String,
    ipAddress: String,
    lastUsed: Date,
    token: String, // JWT associated with the device
  });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    emailVerified: { type: Boolean, default: false },
    devices: [deviceSchema],  // Store device identifiers (e.g., JWT or device token)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
//module.exports = mongoose.model('Devices', deviceSchema);*/

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  devices: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String },
      ipAddress: { type: String },
      lastUsed: { type: Date, default: Date.now },
      token: { type: String },
    },
  ],
});


module.exports = mongoose.model('User', userSchema);
