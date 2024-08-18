const chilDataModel = require('../models/childDataModel');
const userModel = require('../models/userModel');
const sgelModel = require('../models/seglModel');
const notificationModel = require('../models/notificationModel');

const getAllChildData = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
    const skip = (page - 1) * limit;
    let childData = await chilDataModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate('user');
    res.status(201).json({
      message: 'Successfully fetched all the childData',
      data: childData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllChildDataUserView = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
    const skip = (page - 1) * limit;
    let childData = await chilDataModel
      .find({ isAccepted: true }).skip(skip).limit(limit)
      .sort({ createdAt: -1 }).populate('user');
    res.status(201).json({
      message: 'Successfully fetched all the childData',
      data: childData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addChildData = async (req, res) => {
  try {
    const { userId } = req.params;
  
    let files = req.files;
    let documents = [];
    if (files['documents'] != undefined) {
      documents = files['documents'].map((file) => file.filename);
    }
    const profileImage = files['profileImage'][0].filename;
  
    const {
      category,
      name,
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
      place,
      details,
      externalLinks,
      isAccepted,
    } = req.body;
    const user = await userModel.findById(userId);
    const addNewChildData = await chilDataModel.create({
      documents,
      category,
      name,
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
      place,
      details,
      isAccepted: user.role === 'admin' || user.role === 'supervisor'||
        user.role === 'owner',
      externalLinks,
      profileImage,
      user: userId,
    });
    if (!addNewChildData) {
      return res.status(400).json({ error: 'Failed to add the data' });
    }

    const updateData = await userModel
      .findByIdAndUpdate(
        userId,
        { child: [...user.child, addNewChildData] },
        { new: true }
      )
      .populate('child');
       if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `add child data post`,
        user: user,
        data: addNewChildData,
      });
    }
    if (addNewChildData.isAccepted == true) {
      const notificationData = await notificationModel.create({
        type: `add child data post`,
        user: user,
        data: addNewChildData,
      });
    }

    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteChildData = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const data = await chilDataModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.findById(userId);
       if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `delete child data post`,
        user: user,
        data: data,
      });
    }
    res.status(200).json('childData Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const acceptChildData = async (req, res) => {
  try {
    const { childId, userId } = req.params;

    const acceptedChild = await chilDataModel.findByIdAndUpdate(
      childId,
      {
        isAccepted: true,
        notification: 'تم قبول منشورك بنجاح',
      },
      { new: true }
    );

    if (!acceptedChild) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    const user = await userModel.findById(userId);
    if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `accept child data post`,
        user: user,
        data: acceptedChild,
      });
    }
    const notificationData = await notificationModel.create({
      type: `add child data post`,
      user: user,
      data: acceptedChild,
    });
        
    res
      .status(200)
      .json({ success: 'data updated successfully', data: acceptedChild });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByCategory = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const { category, responsibleAuthority } = req.query;
    const found = await chilDataModel
      .find({
        category: category,
        responsibleAuthority: responsibleAuthority,
        isAccepted: true,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }).populate('user');
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const found = await chilDataModel
      .find({
        name: { $regex: name, $options: 'i' },
        isAccepted: true,
      })
      .sort({ createdAt: -1 }).populate('user');
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const searchByCategoryFalse = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const { category } = req.query;
    const found = await chilDataModel
      .find({
        category: category,
        isAccepted: false,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }).populate('user');
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChildData = async (req, res) => {
  try {
    const { childDataId, userId } = req.params;
    const {
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
      name,
      place,
      externalLinks,
      details
    } = req.body;
    let profileImage = '';
    //let documents = [];

    if (req.file !== undefined) {
      profileImage = req.file.filename;
    } else {
      const existingchild = await chilDataModel.findById(childDataId);
      if (existingchild) {
        profileImage = existingchild.profileImage;
      }
    }
    const currentDate = new Date();
    if (new Date(dateOfBirth) > currentDate) {
      return res.status(400).json('Date of birth cannot be in the future');
    }
    const updateChildData = await chilDataModel.findByIdAndUpdate(
      childDataId,
      {
        
        nickname,
        dateOfBirth,
        responsibleAuthority,
        governorate,
        fatherName,
        motherName,
        profileImage,
        name,
      place,
      externalLinks,
      details
      },
      { new: true }
    );

    if (!updateChildData) {
      res.status(404).json('No chid data with this Id found.');
    }
    const user = await userModel.findById(userId);
       if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `update child data post`,
        user: user,
        data: updateChildData,
      });
    }
    res.status(200).json({ data: updateChildData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingleChildData = async (req, res) => {
  try {
    const { id } = req.params;
    const singlechildData = await chilDataModel.findById(id).populate('user');
    res.json({ childData: singlechildData });
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  getAllChildData,
  addChildData,
  deleteChildData,
  acceptChildData,
  searchByCategory,
  updateChildData,
  getSingleChildData,
  getAllChildDataUserView,
  acceptChildData,
  searchByCategoryFalse,
  searchByName
};
