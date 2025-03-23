const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Use `new` keyword
  email: {
    type: String,
    required: true, // Fixed typo
  },
  password: {
    // Fixed typo
    type: String,
    required: true, // Fixed typo
  },
  createdOn: {
    // Renamed to follow convention
    type: Date,
    default: Date.now, // Fixed default value
  },
});

module.exports = mongoose.model("User", userSchema); // Use singular, capitalized model name
