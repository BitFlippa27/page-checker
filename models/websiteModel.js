import mongoose from "mongoose";

const websiteModel = new mongoose.Schema({
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

export default mongoose.model('website', websiteModel);



