const mongoose = require('mongoose');

const { Schema } = mongoose;

const IssueSchema = Schema({
  number: Number,
  state: String,
  title: String,
  labels: [{
    name: String,
  }],
  created_at: Date,
  updated_at: Date,
});

const NoteSchema = new Schema({
  correcoes: [String],
  duvidas: [String],
  inovacoes: [String],
  melhorias: [String],
  dataRelease: String,
});

const LogSchema = new Schema({
  issue: IssueSchema,
  module: {
    type: String,
  },
  description: {
    type: String,
  },
  cause: {
    type: String,
  },
  note: NoteSchema,
}, {
  createdAt: true,
  updatedAt: true,
});

const LogModel = mongoose.model('Log', LogSchema);

module.exports = LogModel;
