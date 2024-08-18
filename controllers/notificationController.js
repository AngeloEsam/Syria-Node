const notificationModel = require('../models/notificationModel');

const getAllNotifications = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    let notificationData = await notificationModel
      .find().skip(skip).limit(limit)
      .sort({ createdAt: -1 });
    res.status(201).json({
      message: 'Successfully fetched all the notifications ',
      data: notificationData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllNotifications,
};
