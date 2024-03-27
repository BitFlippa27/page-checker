import cron from "node-cron";
import { writeToGoogleSheet } from "../third-parties/sheetsApiService.js";
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
      console.error(`Error when fetching ${error}`);
    }
    
    if (responseObjects.length !== websites.length) {
      reachableWebsites = filterReachableWebsites(websites, responseObjects);
    }
    for (const responseObject of responseObjects) {
      const newWebsiteData = await createMonitoringInfos(responseObject);
      const { webContent, newWebContent } = await checkContentChanges(newWebsiteData, reachableWebsites)
      if (newWebContent) {
        const contentChanges = getContentChanges(webContent, newWebContent);
        writeToGoogleSheet(contentChanges);
        printAllData(newWebsiteData, contentChanges);
        await saveWebsiteData(newWebsiteData);
      } else {
        console.log("No content changes");
        continue;
      }
    }
  });
};

export { startMonitoring }