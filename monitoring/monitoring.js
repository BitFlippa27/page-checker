import cron from "node-cron";
import { writeToGoogleSheet } from "../third-parties/sheetsApiService.js";
import { saveWebsiteData } from "../repositories/repositoriesExport.js";
import { getWebsiteRespones } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";

import {
  createWebsiteData,
  checkContentChanges,
  getContentChanges,
  printAllData,
} from "../services/servicesExport.js";

const startMonitoring = (websites) => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron job");

    try {
      const {validResponses, invalidRespones } = await getWebsiteRespones(websites);
       const reachableWebsites = filterReachableWebsites(validResponses, invalidRespones);
       websites = reachableWebsites;
    } catch (error) {
        console.error(`Error in cron job: ${error.message}`);
    }
    
    for (const response of validResponses) {
      const websiteData = await createWebsiteData(response, websites);

    if (await checkContentChanges(websiteData)) {
      const contentChanges = getContentChanges(websiteData);
      writeToGoogleSheet(contentChanges);
      printAllData(websiteData, contentChanges);
      await saveWebsiteData(websiteData);
    }
    else {
      continue;
    }
    }
  })
};

export { startMonitoring }