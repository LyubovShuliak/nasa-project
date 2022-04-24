const mongoose = require("mongoose");


const planetScema = new mongoose.Schema({
  keplerName:{
      type: String,
      required: true
  }
});

 module.exports = mongoose.model("Planet", planetScema);

