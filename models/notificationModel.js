const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  user: { type: Object },
  data: { type: Object },
},{
    timestamps: true,
  });

const notificationModel = mongoose.model('Notification', notificationSchema);
module.exports = notificationModel;
