const mongoose = require('mongoose');

const PageDataSchema = new mongoose.Schema({
  httpStatus: {
    type: Number,
    required: true
  },
  loadingTime: {
    type: Number,
    required: true
  },
  webContent: {
    type: String,
    required: true
  },
  changeDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PageData', PageDataSchema);