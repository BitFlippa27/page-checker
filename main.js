import cron from "node-cron";
import  { writeToGoogleSheet }  from "./third-parties/sheetsApiService.js";
import { getAllWebsites } from "./repositories/repositoriesExport.js";

import {
  createTrackingData,
  checkPageChanges,
  getContentChanges,
  printAllData,
} from "./services/servicesExport.js";

const main = async () => {
  const websites = await getAllWebsites();
  console.log("Running cron job");
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron job");

    for (const website of websites) {
      try {
        const trackingData = await createTrackingData(website);
        const result = await checkPageChanges(trackingData);
        if (result === true) {
          const contentChanges = getContentChanges(trackingData);
          writeToGoogleSheet(contentChanges);
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
};

export default main;
