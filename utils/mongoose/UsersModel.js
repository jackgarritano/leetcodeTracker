const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
  tag: String,
  user: String,
  easy: Number,
  med: Number,
  hard: Number,
});

module.exports = mongoose.model("UsersModel", trackerSchema);