const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  permission: { type: Boolean, default: true },
  role: { type: String, default: "Employee" },
});

module.exports = mongoose.model("User", userSchema);
