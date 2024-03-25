const mongoose = require('mongoose');

const WebSiteDataSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
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
  },
});

module.exports = mongoose.model('website', WebSiteDataSchema);