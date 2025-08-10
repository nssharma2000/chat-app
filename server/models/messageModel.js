const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

  _id: { type: String, required: true },
  wa_id: { type: String, required: true },
  contactName: { type: String, required: true },
  content: { type: String, default: '' },
  timestamp: { type: Date, required: true },
  conv_id: { 
    type: Number,
    ref: 'conversations', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  },
  sender_wa_id: { type: String, required: true }
});

module.exports = mongoose.model('processed_messages', messageSchema);