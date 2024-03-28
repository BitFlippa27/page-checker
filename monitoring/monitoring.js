import cron from "node-cron";
import { getWebsiteResponses } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";
import { iterateWebsites } from "../services/servicesExport.js";
/**
 * Starts monitoring the provided websites.
 * @param {Object[]} websites - The websites to monitor.
 */

const startMonitoring = (websites) => {
  console.log("Starting monitoring...");
  cron.schedule("*/10 * * * * *", async () => {
    let responseObjects;
    let reachableWebsites;
    try {
      // Collecting only good responses
      validResponses = await getWebsiteResponses(websites);
    } catch (error) {
      console.error(`Error when fetching ${error.message}`);
    }
    if (validResponses.length !== websites.length) {
      try {
        //Remove bad responses
        reachableWebsites = filterReachableWebsites(websites, validResponses);
        iterateWebsites(reachableWebsites, websites);
      } catch (error) {
        console.error(`Error when in main iteration ${error.message}`);
      }
    } else {
      try {
        iterateWebsites(validResponses, websites);
      } catch (error) {
        console.error(`Error in main loop ${error.message}`);
      }
    }
  });
};

export { startMonitoring };
