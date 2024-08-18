const mongoose = require('mongoose');

const seglSchema = new mongoose.Schema({
  type: { type: String, required: true },
  user: { type: Object },
  upUser: { type: Object },
  data: { type: Object },
},
{
    timestamps: true,
  }
);

const seglModel = mongoose.model('Segl', seglSchema);
module.exports = seglModel;

/*
type:
user:
post:
user That Make Actions on other users [admin,sup,owner]

*/
