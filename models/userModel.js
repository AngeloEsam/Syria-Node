const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Invalid Email'],
      lowercase: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true, min: 11 },
    government: { type: String },
    selfImg: { type: String },
    docImg: { type: String, default: null },
    isConfident: { type: Boolean, default: false },
    notification: { type: String, default: 'رجاءارفع الوثيقه' },
    key: { type: String, required: true, max: 6 },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'supervisor', 'owner'],
    },
    child: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'ChildData' }],
    massacres: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Massacres' }],
    lists: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'List' }],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
