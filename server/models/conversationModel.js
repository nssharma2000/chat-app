const mongoose = require('mongoose');
const Message = require('./messageModel');

const conversationSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  contactName: { type: String, required: true },
  pNumber: { type: String, required: true }
});

module.exports = mongoose.model('conversations', conversationSchema);