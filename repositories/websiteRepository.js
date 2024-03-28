import { WebsiteData } from "../models/modelsExport.js";

const getAllWebsites = async () => {
  try {
    const urls = await WebsiteData.find({});
    return urls;
  } catch (error) {
    console.error(`Error in getAllWebsites: ${error.message}`);
  }
};

const saveWebsiteData = async (newWebsiteData) => {
  const { url, httpStatus, loadingTime, newWebContent, changeDate } =
    newWebsiteData;

  try {
    await WebsiteData.findOneAndUpdate(
      { url },
      {
        httpStatus: httpStatus,
        loadingTime: loadingTime,
        webContent: newWebContent,
        changeDate: changeDate || Date.now(),
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error(`Error in saveWebsiteData: ${error.message}`);
  }
};

//toDo: check if website already exists
const addUrl = async (url) => {
  try {
    await WebsiteData.create({
      url: url,
      httpStatus: 0,
      loadingTime: 0,
      webContent: "test",
      changeDate: Date.now() || Date.now(),
    });
  } catch (error) {
    console.log(`Error in addUrl: ${error.message}`);
  }
};

export { getAllWebsites, saveWebsiteData, addUrl };
