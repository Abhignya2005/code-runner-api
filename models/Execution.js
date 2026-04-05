const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema({
  code: String,
  language: String,
  input: String,
  output: String,
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Execution", executionSchema);