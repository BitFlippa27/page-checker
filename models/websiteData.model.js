const websiteDataSchema = require("../models/websiteData.mongo.js");

const websiteData = {
  httStatus: Number,
  loadingTime: Number,
  webContent: String,
  changeDate: Date,
  url: String,
  //contentChanges: String,
};

const getAllWebsites = async () => {
  try {
    const urls = await websiteDataSchema.find({});
    return urls;
  } catch (error) {
    console.log(`Error in getAllurls: ${error.message}`);
  }
};
/*
const addUrl = async (url) => {
  try {
    const newUrl = new websiteData({ url });
    await newUrl.save();
  } catch (error) {
    console.log(`Error in addUrl: ${error.message}`);
  }

}
*/

module.exports = { 
  websiteData, 
  getAllWebsites, 
  //addUrl 
};
