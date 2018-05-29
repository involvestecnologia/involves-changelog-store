const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema({
  correcoes: [String],
  duvidas: [String],
  inovacoes: [String],
  melhorias: [String],
  dataRelease: String,
});

const IssueSchema = new Schema({
  issue: {
    type: Schema.Types.Mixed,
  },
  module: {
    type: String,
  },
  description: {
    type: String,
  },
  cause: {
    type: String,
  },
  notes: [NoteSchema],
}, {
  createdAt: true,
  updatedAt: true,
});

const IssueModel = mongoose.model('Issue', IssueSchema);

module.exports = IssueModel;
