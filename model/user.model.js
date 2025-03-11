const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  sessionId: {
    type: String,
    default: "",
  },

  role:{
    type: String,
    enum: ["USER", "ADMIN", "SUPERADMIN"],
    default: "USER",
  }

});

module.exports = mongoose.model("User", userSchema);