const cron = require("node-cron");
const writeToSheet = require("./googleApi.js");
const { getAllWebsites } = require("./models/websiteData.model.js");
const { 
  createTrackingData, 
  checkPageChanges, 
  getContentChanges, 
  saveToDb, 
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
          await saveToDb(trackingData);
        } else {
          continue;
        }
      } catch (error) {
        console.log(`Error in cron job: ${error.message}`);
        throw new Error("Error");
      }
    }
  });
}

module.exports = main;