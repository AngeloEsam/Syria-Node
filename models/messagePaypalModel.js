const mongoose = require('mongoose');
const MessagePaypalSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    content: { type: String, required: true },
     icon: { type: String },
  },
  {
    timestamps: true,
  }
);

const MessagePaypalModel = mongoose.model('MessagePaypal', MessagePaypalSchema);
module.exports = MessagePaypalModel;
