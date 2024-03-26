import { websiteModel } from "../models/modelsExport.js";

const getAllWebsites = async () => {
  // to repo
  try {
    const urls = await websiteModel.find({});
    return urls;
  } catch (error) {
    console.error(`Error in getAllurls: ${error.message}`);
  }
};

const saveWebsiteData = async (websiteData) => {
  const { newWebsiteData } = websiteData;
  const { url, httpStatus, loadingTime, newWebContent, changeDate } = newWebsiteData;

  try {
    await websiteModel.findOneAndUpdate(
      { url }, // find a document with `url`
      {
        httpStatus: httpStatus,
        loadingTime: loadingTime,
        webContent: newWebContent,
        changeDate: changeDate || Date.now(),
      },
      { new: true, upsert: true } // options
    );
  } catch (error) {
    console.error(`Error in saveWebsiteData: ${error.message}`);
  }
};

/*const addUrl = async (url) => {
  try {
    const newUrl = new websiteData({ url });
    await newUrl.save();
  } catch (error) {
    console.log(`Error in addUrl: ${error.message}`);
  }

}
*/

export { getAllWebsites, saveWebsiteData };
