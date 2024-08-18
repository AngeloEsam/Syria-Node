const mongoose = require('mongoose');
const backgroundSchema = new mongoose.Schema(
  {
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const backgroundModel = mongoose.model('BackgroundModel', backgroundSchema);
module.exports = backgroundModel;
