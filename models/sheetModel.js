const mongoose = require("mongoose");
const sheetSchema = new mongoose.Schema(
  {
   
    name: { type: String},
    nickname: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    year:{type:String},
    place:{type:String},
    governorate: { type: String },
    city:{type:String},
    elhy:{type:String},
    grom:{type:String},
    notes:{type:String} ,
    responsibleAuthority: { type: String },
    extraInfo:{type:String},
 
  },
  {
    timestamps: true,
  }
);

const sheetModel = mongoose.model("Sheet", sheetSchema);
module.exports = sheetModel;
