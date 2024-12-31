const mongoose = require('mongoose');
//const User = require('../models/User');


const deviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceName: { type: String, required: true },
    ipAddress: { type: String },
    lastUsed: { type: Date, default: Date.now },
    token: { type: String, required: true }
  });

  module.exports = mongoose.model('Device', deviceSchema);







