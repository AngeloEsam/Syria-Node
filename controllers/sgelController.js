const sgelModel = require('../models/seglModel');

const getAllSgelData = async (req, res) => {
  try {
      const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 6;
    const skip = (page - 1) * limit;
    let sgelData = await sgelModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    res.status(201).json({
      message: 'Successfully fetched all the history data',
      data: sgelData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteSgelItem = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await sgelModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    res.status(200).json('History Item Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};



module.exports = {
  getAllSgelData,
  deleteSgelItem
};
