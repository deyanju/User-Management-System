const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  devices: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true, default: 'Unknown Device' },
      ipAddress: { type: String },
      lastUsed: { type: Date, default: Date.now },
      token: { type: String },
    },
  ],
  
});


module.exports = mongoose.model('User', userSchema);
