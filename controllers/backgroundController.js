const userModel = require('../models/userModel');
const sgelModel = require('../models/seglModel');
const backgroundModel = require('../models/backgroundModel');
const getAllBackgroundImages = async (req, res) => {
  try {
    let backgroundImages = await backgroundModel.find().sort({ createdAt: -1 });
    res.status(201).json({
      message: 'Successfully fetched all the backgroundImages',
      data: backgroundImages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addBackgroundImage = async (req, res) => {
  try {
    const { id } = req.params;
  
    let image = '';
    if (req.file !== undefined) {
      image = req.file.filename;
    }
    const addBackgroundImage = await backgroundModel.create({
      image,
    });
    const user = await userModel.findById(id);
        if (user.role !== 'owner') {
            
    const sgelData = await sgelModel.create({
      type: `add background image`,
      user: user,
      data: addBackgroundImage,
    });
        }
    res.status(200).json({
      success: 'backgroundImages added successfully',
      data: addBackgroundImage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateBackgroundImage = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;
  let image = '';
  if (req.file !== undefined) {
    image = req.file.filename;
  } else {
    const existingMess = await backgroundModel.findById(id);
    if (existingMess) {
      image = existingMess.image;
    }
  }

  const updateBackgroundImage = await backgroundModel.findByIdAndUpdate(
    id,
    { image },
    { new: true }
  );
  if (!updateBackgroundImage) {
    return res.status(404).json('No background image with this Id found.');
  }
  const user = await userModel.findById(userId);
      if (user.role !== 'owner') {
          
  const sgelData = await sgelModel.create({
    type: `update background image`,
    user: user,
    data: updateBackgroundImage,
  });
      }
  res.status(200).json({ data: updateBackgroundImage });
};

const deleteBackgroundImage = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;
  try {
    const data = await backgroundModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.findById(userId);
        if (user.role !== 'owner') {
            
    const sgelData = await sgelModel.create({
      type: 'delete background image',
      user: user,
      data: data,
    });
        }
    res.status(200).json('Background Image Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getSingleBackgroundImage = async (req, res) => {
  try {
    const { id } = req.params;
    const singleBackgroundImage = await backgroundModel.findById(id);
    res.json(singleBackgroundImage);
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  getAllBackgroundImages,
  addBackgroundImage,
  updateBackgroundImage,
  deleteBackgroundImage,
  getSingleBackgroundImage,
};
