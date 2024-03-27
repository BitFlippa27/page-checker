import cron from "node-cron";
import { writeToGoogleSheet } from "../services/third-parties/sheetsApiService.js";
import { saveWebsiteData } from "../repositories/repositoriesExport.js";
import { getWebsiteResponses } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";

import {
  createMonitoringInfos,
  checkContentChanges,
  getContentChanges,
  printAllData,
} from "../services/servicesExport.js";

const startMonitoring = (websites) => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron job");
    let responseObjects;
    let reachableWebsites;
    try {
      responseObjects = await getWebsiteResponses(websites);
    } catch (error) {
      console.error(`Error when fetching ${error.message}`);
    }
    
    if (responseObjects.length !== websites.length) {
      reachableWebsites = filterReachableWebsites(websites, responseObjects);
    }
    try {
      for (const responseObject of responseObjects) {
        const newWebsiteData = await createMonitoringInfos(responseObject);
        const { webContent, newWebContent } = await checkContentChanges(newWebsiteData, websites)
        if (newWebContent) {
          const { finalChangesSheets, finalChangesCmd }  = getContentChanges(webContent, newWebContent);
          writeToGoogleSheet(finalChangesSheets);
          printAllData(newWebsiteData, finalChangesCmd);
          await saveWebsiteData(newWebsiteData);
        } else {
          console.log("No content changes");
          continue;
        }
      }
    } catch (error) {
      console.error(`Error in main loop ${error.message}`);
    }
    
  });
};

export { startMonitoring }