const mongoose = require('mongoose');

const WebSiteDataSchema = new mongoose.Schema({
  url: {
    type: String,
    required: false
  },
  httpStatus: {
    type: Number,
    required: false
  },
  loadingTime: {
    type: Number,
    required: false
  },
  webContent: {
    type: String,
    required: false
  },
  changeDate: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('website', WebSiteDataSchema);