const mongoose = require('mongoose');
const massacresSchema = new mongoose.Schema(
  {
    title: { type: String },
    details: { type: String },
    documents: [{ type: String }],
    profileImage:{type:String,required:true},
    responsibleAuthority: { type: String },
    governorate: { type: String },
    isAccepted: { type: Boolean},
    notification:{type:String,default:"سيتم مراجعه منشورك وبعد ذلك سيتم قبوله من الادمن والمشرفين اذا وافق الشروط"}, //Yes or No
    user:{type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const massacresModel = mongoose.model('Massacres', massacresSchema);
module.exports = massacresModel;
