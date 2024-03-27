import { WebsiteData } from "../models/modelsExport.js";

const getAllWebsites = async () => {
  // to repo
  try {
    const urls = await WebsiteData.find({});
    return urls;
  } catch (error) {
    console.error(`Error in getAllWebsites: ${error.message}`);
  }
};

const saveWebsiteData = async (newWebsiteData) => {
  const { url, httpStatus, loadingTime, newWebContent, changeDate } = newWebsiteData;

  try {
    await WebsiteData.findOneAndUpdate(
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

const addUrl = async () => {
  try {
    await WebsiteData.create(
    { 
      url: "https://bingo-game-phi.vercel.app/",
      httpStatus: 200,
      loadingTime: 8,
      webContent: "test",
      changeDate: Date.now() || Date.now(),
    }
    );
    
  } catch (error) {
    console.log(`Error in addUrl: ${error.message}`);
  }
}

export { getAllWebsites, saveWebsiteData, addUrl };
