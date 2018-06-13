const mongoose = require('mongoose');

const { Schema } = mongoose;

const IssueSchema = Schema({
  id: Number,
  number: Number,
  state: String,
  title: String,
  labels: [String],
  created_at: Date,
  updated_at: Date,
});

const LogSchema = new Schema({
  issue: IssueSchema,
  module: String,
  description: String,
  cause: String,
  note: String,
  motive: String,
  priority: String,
  quality: String,
  team: String,
  squad: String,
}, {
  createdAt: true,
  updatedAt: true,
});

const LogModel = mongoose.model('Log', LogSchema);

module.exports = LogModel;
