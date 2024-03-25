const cron = require("node-cron");
const writeToSheet = require("./services/sheetsApiService.js");
const { getAllWebsites } = require("./models/websiteModel.js");

const { 
  createTrackingData, 
  checkPageChanges, 
  getContentChanges, 
  savesaveWebsiteDataToDb, 
  printAllData
} = require("./utils/utils.js");

const main = async () => {
  const websites = await getAllWebsites(); 
  console.log("Running cron job")
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron job");
    
    for (const website of websites) {
      try {
        const trackingData = await createTrackingData(website);
        const result = await checkPageChanges(trackingData);
        if (result === true) {
          const contentChanges = getContentChanges(trackingData);
          writeToSheet(contentChanges);
          printAllData(trackingData, contentChanges);
          await saveWebsiteData(trackingData);
        } else {
          continue;
        }
      } catch (error) {
        console.error(`Error in cron job: ${error.message}`);
        throw new Error("Error");
      }
    }
  });
}

module.exports = main;