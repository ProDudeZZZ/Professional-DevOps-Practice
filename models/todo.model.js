const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum:['pending', 'completed'], default: 'pending' },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;