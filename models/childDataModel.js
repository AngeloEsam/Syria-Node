const mongoose = require("mongoose");
//const validator = require("validator");
const childDataSchema = new mongoose.Schema(
  {
    category:{type:String,required:true},
    name: { type: String, required: true },
    nickname: { type: String },
    isAccepted: { type: Boolean},
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          return value < new Date();
        },
      },
    },
    responsibleAuthority: { type: String },
    governorate: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    place: { type: String },
    notification:{type:String,default:"سيتم مراجعه منشورك وبعد ذلك سيتم قبوله من الادمن والمشرفين اذا وافق الشروط"}, //Yes or No
    documents: [{ type: String }],
    profileImage:{type:String,required:true},
    externalLinks: {
      type: String,
    },
    details: { type: String },
    user:{type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const childDataModel = mongoose.model("ChildData", childDataSchema);
module.exports = childDataModel;
