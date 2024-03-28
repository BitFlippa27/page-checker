import cron from "node-cron";
import { getWebsiteResponses } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";
import { iterateWebsites } from "../services/servicesExport.js";

const startMonitoring = (websites) => {
  console.log("Starting monitoring...");
  cron.schedule("*/10 * * * * *", async () => {
    let responseObjects;
    let reachableWebsites;
    try {
      responseObjects = await getWebsiteResponses(websites);
    } catch (error) {
      console.error(`Error when fetching ${error.message}`);
    }

    if (responseObjects.length !== websites.length) {
      try {
        reachableWebsites = filterReachableWebsites(websites, responseObjects);
        iterateWebsites(reachableWebsites, websites);
      } catch (error) {
        console.error(`Error when in main iteration ${error.message}`);
      }
    } else {
      try {
        iterateWebsites(responseObjects, websites);
      } catch (error) {
        console.error(`Error in main loop ${error.message}`);
      }
    }
  });
};

export { startMonitoring };
