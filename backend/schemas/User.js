const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  searchInterval: {
    type: Number,
    default: 5,
  },
  keywords: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
