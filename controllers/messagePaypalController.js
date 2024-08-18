const messagePaypalModel = require('../models/messagePaypalModel');
const userModel = require('../models/userModel');
const sgelModel = require('../models/seglModel');
const getAllMessagesPaypals = async (req, res) => {
  try {
    let messagesPaypals = await messagePaypalModel
      .find()
      .sort({ createdAt: -1 });
    res.status(201).json({
      message: 'Successfully fetched all the messagePaypal',
      data: messagesPaypals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addMessagePaypal = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, content } = req.body;
    let icon = '';
    if (req.file !== undefined) {
      icon = req.file.filename;
    }
    const addNewMessagePaypal = await messagePaypalModel.create({
      content,
      category,
      icon
    });
    
    const user = await userModel.findById(id);
    if (user.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `add ${category}`,
      user: user,
      data: addNewMessagePaypal,
    });
    }
    res.status(200).json({
      success: 'MessagePaypal added successfully',
      data: addNewMessagePaypal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateMessagePaypal = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;

  const { category, content } = req.body;
  let icon = '';
  if (req.file !== undefined) {
    icon = req.file.filename;
  } else {
    const existingMess = await chilDataModel.findById(childDataId);
    if (existingMess) {
      icon = existingMess.icon;
    }
  }
  const updateMessagePaypal = await messagePaypalModel.findByIdAndUpdate(
    id,
    { category, content,icon },
    { new: true }
  );
  if (!updateMessagePaypal) {
    return res.status(404).json('No messagePaypal with this Id found.');
  }
  const user = await userModel.findById(userId);
  if (user.role !== 'owner') {
      
  const sgelData = await sgelModel.create({
    type: `update ${category}`,
    user: user,
    data: updateMessagePaypal,
  });
  }
  res.status(200).json({ data: updateMessagePaypal });
};

const deleteMessagePaypal = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;
  try {
    const data = await messagePaypalModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.findById(userId);
    if (user.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: 'delete',
      user: user,
      data: data,
    });
    }
    res.status(200).json('MessagePaypal Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getSingleMessagePaypal = async (req, res) => {
  try {
    const { id } = req.params;
    const singleMessagePaypal = await messagePaypalModel.findById(id);
    res.json(singleMessagePaypal);
  } catch (error) {
    res.json({ message: error.message });
  }
};
const searchByIdOrCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { category } = req.query;
    const messagesPaypals = await messagePaypalModel.find({
      $or: [{ category: category }, { _id: id }],
    });

    res.json(messagesPaypals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllMessagesPaypals,
  addMessagePaypal,
  updateMessagePaypal,
  deleteMessagePaypal,
  getSingleMessagePaypal,
  searchByIdOrCategory,
};
