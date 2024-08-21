 const mongoose = require("mongoose");
const listSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String },
    content: { type: String },
    governorate: { type: String },
    images: [
      {
        imgPath: { type: String }, 
        description: { type: String },
      },
    ],
    video: { type: String },
    documents: [{ type: String }],
    notification: {
      type: String,
      default: "سيتم مراجعه منشورك وبعد ذلك سيتم قبوله من الادمن والمشرفين اذا وافق الشروط",
    },
    externalLinks: { type: String },
    isAccepted: { type: Boolean },
    visibility: {
      type: String,
      enum: ["Only Me", "For All"],
      default: "For All",
    },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
 const listModel = mongoose.model("List", listSchema);
 module.exports = listModel;