const massacresModel = require('../models/massacresModel');
const userModel = require('../models/userModel');
const sgelModel = require('../models/seglModel');
const notificationModel = require('../models/notificationModel');


const getAllMassacres = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
    const skip = (page - 1) * limit;
    let massacres = await massacresModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate('user');
    res.status(201).json({
      message: 'Successfully fetched all the massacres',
      massacres,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllMassacresUserView = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
    const skip = (page - 1) * limit;
    let massacres = await massacresModel
      .find({ isAccepted: true }).skip(skip).limit(limit)
      .sort({ createdAt: -1 }).populate('user');
    res.status(201).json({
      message: 'Successfully fetched all the massacres',
      data: massacres,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addMassacres = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = req.files;
    const documents = files['documents'].map((file) => file.filename);

    const profileImage = files['profileImage'][0].filename;
    const { title, responsibleAuthority, governorate, details, isAccepted } =
      req.body;
    const user = await userModel.findById(userId);

    const addNewMassacres = await massacresModel.create({
      documents,
      title,
      responsibleAuthority,
      governorate,
      details,
      profileImage,
      user: userId,
      isAccepted: user.role === 'admin' || user.role === 'supervisor'||
        user.role === 'owner',
    });
    if (!addNewMassacres) {
      return res.status(400).json({ error: 'Failed to add the data' });
    }

    const updateData = await userModel
      .findByIdAndUpdate(
        userId,
        { massacres: [...user.massacres, addNewMassacres] },
        { new: true }
      )
      .populate('massacres');

     if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `add massacres data post`,
        user: user,
        data: addNewMassacres,
      });
    }
        const notificationData = await notificationModel.create({
      type: `add massacres data post`,
      user: user,
      data: addNewMassacres,
    });
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteMassacres = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const data = await massacresModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.findById(userId);
       if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `delete massacres data post`,
        user: user,
        data: data,
      });
    }
    res.status(200).json('massacres Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getSingleMassacres = async (req, res) => {
  try {
    const { id } = req.params;
    const singleMassacres = await massacresModel.findById(id).populate('user');
    res.json(singleMassacres);
  } catch (error) {
    res.status(400).json({ error: 'Error in Fetching Data' });
  }
};
const searchByTitle = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const { responsibleAuthority } = req.query;
    const found = await massacresModel
      .find({
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

const searchByTitleName = async (req, res) => {
  try {
    const { title } = req.query;
    const found = await massacresModel
      .find({
        title: { $regex: title, $options: 'i' },
        isAccepted: true,
      })
      .sort({ createdAt: -1 }).populate('user');
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const searchByTitleFalse = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const { responsibleAuthority } = req.query;
    const found = await massacresModel
      .find({
        responsibleAuthority: responsibleAuthority,
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


const updateMassacres = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { responsibleAuthority, governorate, title, details } = req.body;
    let profileImage = '';
    if (req.file !== undefined) {
      profileImage = req.file.filename;
    } else {
      const existingMassacres = await massacresModel.findById(id);
      if (existingMassacres) {
        profileImage = existingMassacres.profileImage;
      }
    }
    const updateMassacres = await massacresModel.findByIdAndUpdate(
      id,
      {
        profileImage,
        responsibleAuthority,
        governorate,
        title,
        details,
      },
      { new: true }
    );

    if (!updateMassacres) {
      res.status(404).json('No Massacres with this Id found.');
    }
    const user = await userModel.findById(userId);
   if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `update massacres data post`,
        user: user,
        data: updateMassacres,
      });
    }
    res.status(200).json({ data: updateMassacres });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const acceptMassacresData = async (req, res) => {
  try {
    const { masId, userId } = req.params;

    const acceptedMas = await massacresModel.findByIdAndUpdate(
      masId,
      {
        isAccepted: true,
        notification: 'تم قبول منشورك بنجاح',
      },
      { new: true }
    );

    if (!acceptedMas) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    const user = await userModel.findById(userId);
    
 if (user.role !== 'owner') {
      const sgelData = await sgelModel.create({
        type: `accept massacres data post`,
        user: user,
        data: acceptedMas,
      });
    }
    res
      .status(200)
      .json({ success: 'data updated successfully', data: acceptedMas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMassacres,
  addMassacres,
  deleteMassacres,
  getSingleMassacres,
  searchByTitle,
  updateMassacres,
  getAllMassacresUserView,
  acceptMassacresData,
  searchByTitleFalse,
  searchByTitleName
};
