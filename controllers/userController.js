const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const sgelModel = require('../models/seglModel');

const getAllUsers = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const users = await userModel
      .find({ role: 'user' }).skip(skip).limit(limit)
      .sort({ createdAt: -1 })
    res.status(201).json({
      message: 'Successfully fetched all the users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllUsersAndAdminAndSup = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const users = await userModel
      .find({}).skip(skip).limit(limit)
      .sort({ createdAt: -1 })
    res.status(201).json({
      message: 'Successfully fetched all the users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsersAndAdminAndSupWithoutSkip = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .sort({ createdAt: -1 })
      .populate(['lists', 'massacres', 'child']);
    console.log(users.data);
    res.status(201).json({
      message: 'Successfully fetched all the users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const registerNewUser = async (req, res) => {
  try {
    const files = req.files;
    let selfImg = '';
    let docImg = '';

    if (files && files['selfImg'] && files['selfImg'][0]) {
      selfImg = files['selfImg'][0].filename;
    }

    if (files && files['docImg'] && files['docImg'][0]) {
      docImg = files['docImg'][0].filename;
    }

    const {
      email,
      username,
      name,
      role,
      password,
      isConfident,
      phone,
      government,
      key,
    } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json('email already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      username,
      key,
      email,
      name,
      phone,
      government,
      isConfident,
      selfImg,
      role,
      docImg,
      password: hashedPassword,
    });

    const sgelData = await sgelModel.create({
      type: `register user success`,
      data: createUser,
    });

    res.json(createUser);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter email and password' });
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'invalid email' });
  }
  let isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ msg: 'Invalid Password' });
  }
  let token = jwt.sign(
    { data: { email: user.email, id: user._id, role: user.role } },
    process.env.SECRET_KEY
  );
  if (user.role !== 'owner') {
      
  const sgelData = await sgelModel.create({
    type: `user login`,
    user: user,
    data: user,
  });
  }
  res.json({ message: 'success', token: token, user: user });
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;
  try {
    const data = await userModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.findById(userId);
    if (user.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `delete user`,
      user: data,
      data: data,
      upUser: user,
    });
    }
    res.status(200).json('User Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    let selfImg = '';
    let docImg = '';

    if (files && files['selfImg'] && files['selfImg'][0]) {
      selfImg = files['selfImg'][0].filename;
    } else {
      const existingUser = await userModel.findById(id);
      if (existingUser) {
        selfImg = existingUser.selfImg;
      }
    }
    if (files && files['docImg'] && files['docImg'][0]) {
      docImg = files['docImg'][0].filename;
    } else {
      const existingUser = await userModel.findById(id);
      if (existingUser) {
        docImg = existingUser.docImg;
      }
    }
    
    const { name, phone, government, role, username, email } = req.body;
    const oldUser = await userModel.findById(id);
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { selfImg, name, phone, government, role, username, email, docImg },
      { new: true }
    );
    if (oldUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `update user`,
      user: oldUser,
      data: updateUser,
    });
    }
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const updateUserInDashboard = async (req, res) => {
  try {
    const { id, userUpId } = req.params;
    const files = req.files;
    let selfImg = '';
    let docImg = '';

    if (files && files['selfImg'] && files['selfImg'][0]) {
      selfImg = files['selfImg'][0].filename;
    } else {
      const existingUser = await userModel.findById(id);
      if (existingUser) {
        selfImg = existingUser.selfImg;
      }
    }
    if (files && files['docImg'] && files['docImg'][0]) {
      docImg = files['docImg'][0].filename;
    } else {
      const existingUser = await userModel.findById(id);
      if (existingUser) {
        docImg = existingUser.docImg;
      }
    }
    
    const { name, phone, government, role, username, email } = req.body;

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { selfImg, name, phone, government, role, username, email, docImg },
      { new: true }
    );
    const oldUser = await userModel.findById(id);
    const upUser = await userModel.findById(userUpId);
    if (upUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `update user from dashboard`,
      user: oldUser,
      data: updateUser,
      upUser: upUser,
    });
    }
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};

const updateUserDocImg = async (req, res) => {
  try {
    const { id } = req.params;
    let docImg = '';
    if (req.file != undefined) {
      docImg = req.file.filename;
    }

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { docImg },
      { new: true }
    );
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    if (updateUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `update user docImg`,
      user: updateUser,
      data: updateUser,
    });
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};

const searchByGovernment = async (req, res) => {
  try {
    const { government } = req.query;
    const users = await userModel.find({ government: government });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const searchByName = async (req, res) => {
  try {
    const { username } = req.query;
    const found = await userModel
      .find({
        username: { $regex: username, $options: 'i' },
      })
      .sort({ createdAt: -1 });
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const forgetPassword = async (req, res) => {
  const { email, key } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    if (user.key == key) {
      res.json({ success: true, userId: user._id });
    } else {
      res.json({ message: 'key is wrong' });
    }
  } else {
    res.json({ message: 'email not found' });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (user.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `user update password`,
      user: user,
      data: user,
    });
    }
    res.status(200).json(user);
  } catch (err) {
    res.json(err);
  }
};

const isAcceptedDoc = async (req, res) => {
  try {
    const { userId, upUserId } = req.params;

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { isConfident: true, notification: 'تم توثيق حسابك' },
      { new: true }
    );
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    const upUser = await userModel.findById(upUserId);
    if (upUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `accept user doc`,
      user: updateUser,
      data: updateUser,
      upUser: upUser,
    });
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};
const upToAdmin = async (req, res) => {
  try {
    const { userId, upUserId } = req.params;
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role: 'admin', isConfident: true },

      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    const upUser = await userModel.findById(upUserId);
    if (upUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `up to admin`,
      user: updateUser,
      data: updateUser,
      upUser: upUser,
    });
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};

const upToOwner = async (req, res) => {
  try {
    const { userId, upUserId } = req.params;
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role: 'owner', isConfident: true },

      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    const upUser = await userModel.findById(upUserId);
    const sgelData = await sgelModel.create({
      type: `up to owner`,
      user: updateUser,
      data: updateUser,
      upUser: upUser,
    });
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};


const upToSupervisor = async (req, res) => {
  try {
    const { userId, upUserId } = req.params;

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role: 'supervisor', isConfident: true },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    const upUser = await userModel.findById(upUserId);
    if (upUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `up to supervisor`,
      user: updateUser,
      data: updateUser,
      upUser: upUser,
    });
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};
const downToUser = async (req, res) => {
  try {
    const { userId, upUserId } = req.params;

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    const upUser = await userModel.findById(upUserId);
    if (upUser.role !== 'owner') {
        
    const sgelData = await sgelModel.create({
      type: `down to user`,
      user: updateUser,
      data: updateUser,
      upUser: upUser,
    });
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await userModel
      .findById(id)
      .populate(['lists', 'massacres', 'child']);
    res.json(singleUser);
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  registerNewUser,
  loginUser,
  getSingleUser,
  deleteUser,
  updateUser,
  searchByGovernment,
  forgetPassword,
  updatePassword,
  isAcceptedDoc,
  upToAdmin,
  upToSupervisor,
  downToUser,

  getAllUsersAndAdminAndSup,
  updateUserDocImg,
  upToOwner,
  updateUserInDashboard,
  getAllUsersAndAdminAndSupWithoutSkip,
  searchByName
};
